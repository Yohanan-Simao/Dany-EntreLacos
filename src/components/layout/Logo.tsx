export default function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/images/logo.svg"
      alt="Dany EntreLaços"
      width={80}
      height={80}
      className={`w-20 h-20 shrink-0 ${className ?? ""}`}
    />
  )
}
