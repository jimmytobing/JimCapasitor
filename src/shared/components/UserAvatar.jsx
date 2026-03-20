export default function UserAvatar({
  name,
  image,
  initial,
  tone = 'from-slate-300 to-slate-500',
  className = '',
}) {
  if (image) {
    return (
      <img
        src={image}
        alt={`${name} avatar`}
        className={`h-full w-full object-cover ${className}`.trim()}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    )
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${tone} font-semibold text-white ${className}`.trim()}
    >
      {initial}
    </div>
  )
}
