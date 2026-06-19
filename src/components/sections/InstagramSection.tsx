import { Camera, ArrowUpRight } from "lucide-react"

export default function InstagramSection() {
  return (
    <section className="py-16 bg-accent-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <a
          href="https://instagram.com/danyentrelacos"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-8 md:p-12 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 text-white">
                <Camera size={32} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Acompanhe no Instagram
                </h2>
                <p className="text-white/80 text-sm md:text-base mt-1">
                  Veja nossos trabalhos e novidades em tempo real
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-full bg-white px-6 py-3 text-primary font-semibold transition-all group-hover:bg-white/90 group-hover:gap-4 shrink-0">
              <span>@danyentrelacos</span>
              <ArrowUpRight size={18} />
            </div>
          </div>
        </a>
      </div>
    </section>
  )
}
