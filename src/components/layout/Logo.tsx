export default function Logo({ className, alt = "" }: { className?: string; alt?: string }) {
  return (
    <img
      src="/images/logo.svg"
      alt={alt}
      width={80}
      height={80}
      className={`w-20 h-20 shrink-0 ${className ?? ""}`}
    />
  )
}
