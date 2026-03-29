import { ensureSalesforceConnection, sendSalesforceRequest } from './client.js'

function resolveSalesforceUrl(instanceUrl, value) {
  if (!value) return ''

  try {
    return new URL(value, `${instanceUrl}/`).toString()
  } catch {
    return value
  }
}

function formatActor(actor = {}, instanceUrl) {
  const name = actor?.name || actor?.displayName || actor?.title || 'Unknown user'
  const photo =
    actor?.photo?.smallPhotoUrl ||
    actor?.photo?.mediumPhotoUrl ||
    actor?.photo?.largePhotoUrl ||
    actor?.photo?.fullEmailPhotoUrl ||
    ''

  return {
    id: actor?.id || '',
    name,
    title: actor?.title || '',
    photoUrl: resolveSalesforceUrl(instanceUrl, photo),
  }
}

function extractMessageText(body = {}) {
  if (typeof body?.text === 'string' && body.text.trim()) {
    return body.text
      .split('\n')
      .filter((line) => !/^\[Image:\s*.+\]$/.test(line.trim()))
      .join('\n')
      .trim()
  }

  if (Array.isArray(body?.messageSegments)) {
    const text = body.messageSegments
      .map((segment) => {
        if (segment?.type === 'InlineImage') {
          return ''
        }

        if (segment?.type === 'MarkupEnd' && ['Paragraph', 'ListItem'].includes(segment?.markupType)) {
          return '\n'
        }

        return segment?.text || segment?.name || ''
      })
      .join('')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    if (text) {
      return text
    }
  }

  return ''
}

function extractTrackedChangesText(item = {}) {
  const changes = item?.capabilities?.trackedChanges?.changes

  if (!Array.isArray(changes) || changes.length === 0) {
    return ''
  }

  return changes
    .map((change) => {
      const fieldName = change?.fieldName || 'Field'
      const oldValue = change?.oldValue || '-'
      const newValue = change?.newValue || '-'
      return `${fieldName}: ${oldValue} -> ${newValue}`
    })
    .join('\n')
}

function mapComment(comment = {}, instanceUrl) {
  return {
    id: comment?.id || '',
    createdDate: comment?.createdDate || null,
    text: extractMessageText(comment?.body),
    actor: formatActor(comment?.user, instanceUrl),
  }
}

function normalizeDataPath(pathname = '') {
  return String(pathname || '').replace(/^https?:\/\/[^/]+/i, '').replace(/^\/services\/data\/v[0-9]+\.[0-9]+\//, '')
}

function mapAttachment(attachment = {}, instanceUrl) {
  const imageUrl =
    attachment?.renditionUrl ||
    attachment?.url ||
    attachment?.smallPhotoUrl ||
    attachment?.mediumPhotoUrl ||
    attachment?.largePhotoUrl ||
    ''

  if (!imageUrl) {
    return null
  }

  return {
    id: attachment?.id || attachment?.attachmentId || imageUrl,
    title: attachment?.title || attachment?.filename || 'Attachment',
    imageUrl: resolveSalesforceUrl(instanceUrl, imageUrl),
  }
}

function extractAttachments(item = {}, instanceUrl) {
  const attachmentItems = item?.capabilities?.content?.items

  if (Array.isArray(attachmentItems) && attachmentItems.length > 0) {
    return attachmentItems.map((attachment) => mapAttachment(attachment, instanceUrl)).filter(Boolean)
  }

  const singleAttachment = item?.capabilities?.content?.attachment
  if (singleAttachment) {
    return [mapAttachment(singleAttachment, instanceUrl)].filter(Boolean)
  }

  const inlineImages = Array.isArray(item?.body?.messageSegments)
    ? item.body.messageSegments
        .filter((segment) => segment?.type === 'InlineImage')
        .map((segment) => {
          const previews = Array.isArray(segment?.thumbnails?.previews)
            ? segment.thumbnails.previews
            : []
          const preferredPreview =
            previews.find(
              (preview) =>
                preview?.format === 'ThumbnailBig' &&
                Array.isArray(preview?.previewUrls) &&
                preview.previewUrls[0]?.previewUrl
            ) ||
            previews.find(
              (preview) =>
                preview?.format === 'Thumbnail' &&
                Array.isArray(preview?.previewUrls) &&
                preview.previewUrls[0]?.previewUrl
            ) ||
            previews.find(
              (preview) =>
                preview?.format === 'ThumbnailTiny' &&
                Array.isArray(preview?.previewUrls) &&
                preview.previewUrls[0]?.previewUrl
            ) ||
            previews.find(
              (preview) =>
                Array.isArray(preview?.previewUrls) &&
                preview.previewUrls[0]?.previewUrl
            )
          const previewUrl = preferredPreview?.previewUrls?.[0]?.previewUrl || ''
          const fullImageUrl = segment?.url || ''

          return {
            id: segment?.thumbnails?.fileId || fullImageUrl || previewUrl,
            title: segment?.altText || 'Inline image',
            imageUrl: resolveSalesforceUrl(instanceUrl, previewUrl || fullImageUrl),
            fullImageUrl: resolveSalesforceUrl(instanceUrl, fullImageUrl || previewUrl),
          }
        })
        .filter((attachment) => attachment.imageUrl)
    : []

  if (inlineImages.length > 0) {
    return inlineImages
  }

  return []
}

function mapFeedElement(item = {}, instanceUrl) {
  const likesCount =
    item?.capabilities?.chatterLikes?.likesCount ??
    item?.capabilities?.likes?.likesCount ??
    item?.capabilities?.chatterLikes?.page?.total ??
    0
  const commentsCount =
    item?.capabilities?.comments?.page?.total ??
    item?.capabilities?.comments?.commentsCount ??
    item?.commentCount ??
    0
  const commentItems = Array.isArray(item?.capabilities?.comments?.page?.items)
    ? item.capabilities.comments.page.items
    : []

  return {
    id: item?.id || '',
    createdDate: item?.createdDate || null,
    text: extractMessageText(item?.body) || extractTrackedChangesText(item),
    actor: formatActor(item?.actor, instanceUrl),
    attachments: extractAttachments(item, instanceUrl),
    likesCount: Number(likesCount) || 0,
    commentsCount: Number(commentsCount) || 0,
    commentsUrl: item?.capabilities?.comments?.page?.currentPageUrl || '',
    comments: commentItems.map((comment) => mapComment(comment, instanceUrl)),
    raw: item,
  }
}

export async function fetchRecordFeedElements(recordId) {
  const session = await ensureSalesforceConnection()
  const payload = await sendSalesforceRequest(`chatter/feeds/record/${recordId}/feed-elements`)
  const items = Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload?.elements)
      ? payload.elements
      : []

  return {
    items: items.map((item) => mapFeedElement(item, session.instanceUrl)),
    currentPageUrl: payload?.currentPageUrl || '',
    nextPageUrl: payload?.nextPageUrl || '',
  }
}

export async function createRecordFeedElement(recordId, text) {
  const trimmedText = typeof text === 'string' ? text.trim() : ''

  if (!trimmedText) {
    throw new Error('Isi post tidak boleh kosong.')
  }

  const payload = await sendSalesforceRequest('chatter/feed-elements', {
    method: 'POST',
    data: {
      feedElementType: 'FeedItem',
      subjectId: recordId,
      body: {
        messageSegments: [
          {
            type: 'Text',
            text: trimmedText,
          },
        ],
      },
    },
  })

  const session = await ensureSalesforceConnection()
  return mapFeedElement(payload, session.instanceUrl)
}

export async function createRichTextFeedItem(recordId, html) {
  const trimmedHtml = typeof html === 'string' ? html.trim() : ''

  if (!trimmedHtml) {
    throw new Error('Isi rich text post tidak boleh kosong.')
  }

  const createResult = await sendSalesforceRequest('sobjects/FeedItem', {
    method: 'POST',
    data: {
      ParentId: recordId,
      IsRichText: true,
      Body: trimmedHtml,
    },
  })

  const feedItemId = createResult?.id || ''

  if (!feedItemId) {
    throw new Error('Salesforce berhasil menerima FeedItem, tapi tidak mengembalikan Id.')
  }

  const session = await ensureSalesforceConnection()
  const payload = await sendSalesforceRequest(`chatter/feed-elements/${feedItemId}`)
  return mapFeedElement(payload, session.instanceUrl)
}

export async function createRecordFeedElementWithSegments(recordId, messageSegments = []) {
  if (!Array.isArray(messageSegments) || messageSegments.length === 0) {
    throw new Error('Message segments tidak boleh kosong.')
  }

  const payload = await sendSalesforceRequest('chatter/feed-elements', {
    method: 'POST',
    data: {
      feedElementType: 'FeedItem',
      subjectId: recordId,
      body: {
        messageSegments,
      },
    },
  })

  const session = await ensureSalesforceConnection()
  return mapFeedElement(payload, session.instanceUrl)
}

export async function createFeedElementComment(feedElementId, text) {
  const trimmedText = typeof text === 'string' ? text.trim() : ''

  if (!trimmedText) {
    throw new Error('Isi komentar tidak boleh kosong.')
  }

  const payload = await sendSalesforceRequest(
    `chatter/feed-elements/${feedElementId}/capabilities/comments/items`,
    {
      method: 'POST',
      data: {
        body: {
          messageSegments: [
            {
              type: 'Text',
              text: trimmedText,
            },
          ],
        },
      },
    }
  )

  const session = await ensureSalesforceConnection()
  return mapComment(payload, session.instanceUrl)
}

export async function fetchFeedElementComments(feedElementId, commentsUrl = '') {
  const session = await ensureSalesforceConnection()
  const pathname = commentsUrl
    ? normalizeDataPath(commentsUrl)
    : `chatter/feed-elements/${feedElementId}/capabilities/comments/items`
  const payload = await sendSalesforceRequest(pathname)
  const items = Array.isArray(payload?.items) ? payload.items : []

  return {
    items: items.map((comment) => mapComment(comment, session.instanceUrl)),
    total: Number(payload?.total) || items.length,
  }
}

export async function uploadFileToRecord(recordId, filePayload) {
  const fileName = String(filePayload?.fileName || '').trim()
  const base64Data = String(filePayload?.base64Data || '').trim()
  const title = String(filePayload?.title || fileName || 'Upload').trim()
  const description = String(filePayload?.description || '').trim()

  if (!fileName || !base64Data) {
    throw new Error('File upload tidak valid.')
  }

  return sendSalesforceRequest('sobjects/ContentVersion', {
    method: 'POST',
    data: {
      Title: title,
      PathOnClient: fileName,
      VersionData: base64Data,
      FirstPublishLocationId: recordId,
      Description: description || null,
    },
  })
}

export async function fetchContentVersion(versionId) {
  return sendSalesforceRequest(`sobjects/ContentVersion/${versionId}`)
}

export async function uploadInlineImageToRecord(recordId, filePayload) {
  const createResult = await uploadFileToRecord(recordId, filePayload)
  const versionId = createResult?.id || ''

  if (!versionId) {
    throw new Error('Salesforce tidak mengembalikan ContentVersion Id.')
  }

  const versionRecord = await fetchContentVersion(versionId)
  const fileId = versionRecord?.ContentDocumentId || ''

  if (!fileId) {
    throw new Error('ContentDocumentId untuk gambar tidak ditemukan.')
  }

  return {
    fileId,
    versionId,
    title: versionRecord?.Title || filePayload?.title || filePayload?.fileName || 'Image',
  }
}
