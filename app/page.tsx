import Link from "next/link";
import Button from "@/app/components/ui/button";
import Header from "@/app/components/ui/header";

export default function Home() {
  return (
    <section className="min-h-screen w-full">
      <Header />
      <main
        className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/image.png')" }}
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/60 backdrop-blur-sm" />

        {/* Content - Centered */}
        <section className="relative z-10 max-w-4xl px-6 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
           Ticz connects you to the world of {" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-400">
              live events
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Discover concerts, shows and events happening near you. 
            Experience unforgettable moments.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button text="Get Started" variant="primary" />
            </Link>

            <Link href="/login">
              <Button text="Log In" variant="secondary" />
            </Link>
          </div>          
        </section>
      </main>
    </section>
  );
}