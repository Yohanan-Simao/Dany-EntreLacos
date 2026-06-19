export default function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/images/logo.svg"
      alt="Dany EntreLaços"
      className={`w-20 h-20 shrink-0 ${className ?? ""}`}
    />
  )
}
