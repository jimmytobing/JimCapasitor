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
    return body.text.trim()
  }

  if (Array.isArray(body?.messageSegments)) {
    const text = body.messageSegments
      .map((segment) => segment?.text || segment?.name || '')
      .join('')
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
