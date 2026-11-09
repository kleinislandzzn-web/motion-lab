import { ParallaxHeroImages } from "@/components/ui/parallax-hero-images";
import { parallaxImages } from "@/app/parallax-assets";

export default function ParallaxDemoPage() {
  return (
    <main className="relative flex min-h-svh overflow-hidden bg-[#070807] text-[#f5f7f2]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(174,255,88,0.08),transparent_34%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:64px_64px]" />

      <ParallaxHeroImages
        images={parallaxImages}
        variant="default"
        imageClassName="rounded-xl border border-white/10 shadow-2xl shadow-black/60 saturate-[.85]"
      />

      <nav className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 font-mono text-[10px] tracking-[0.24em] text-white/55 md:px-10">
        <span className="text-[#b7ff3c]">MOTION / 01</span>
        <span>PARALLAX FIELD</span>
      </nav>

      <section className="relative z-10 m-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <p className="mb-5 font-mono text-[10px] tracking-[0.35em] text-[#b7ff3c] uppercase">
          Interactive visual system
        </p>
        <h1 className="text-5xl leading-[0.94] font-semibold tracking-[-0.06em] sm:text-7xl md:text-8xl">
          Ideas move
          <br />
          <span className="font-light text-white/45 italic">with you.</span>
        </h1>
        <p className="mt-7 max-w-md text-sm leading-7 text-white/48 md:text-base">
          移动鼠标，观察六张图像以不同的深度和速度回应你的动作。
        </p>
        <a
          href="#details"
          className="pointer-events-auto mt-9 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-mono text-[10px] tracking-[0.2em] text-white/75 backdrop-blur-md transition hover:border-[#b7ff3c]/70 hover:bg-[#b7ff3c] hover:text-black"
        >
          MOVE TO EXPLORE ↗
        </a>
      </section>

      <div
        id="details"
        className="absolute inset-x-6 bottom-6 z-20 flex items-end justify-between border-t border-white/10 pt-4 font-mono text-[9px] tracking-[0.18em] text-white/35 md:inset-x-10"
      >
        <span>6 LAYERS<br />SPRING PHYSICS</span>
        <span className="text-right">ACETERNITY UI<br />MOTION / REACT</span>
      </div>
    </main>
  );
}
