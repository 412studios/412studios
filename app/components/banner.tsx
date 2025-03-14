import { Logo } from "@/public/icons/logo";

export function Banner() {
  return (
    <section
      id="home"
      className="block top-0 w-full h-screen flex flex-col justify-center items-center text-center overflow-hidden transition-transform duration-500 ease-in-out"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/412-vid.mp4" type="video/mp4" />
      </video>
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/05"></div>
      <div className="relative z-10">
        <Logo className="h-12 rounded-full bg-stone-50 bg-opacity-5 text-primary hover:text-secondary hover:fill-secondary transition duration-700 ease-in-out cursor-pointer" />
      </div>
    </section>
  );
}
