import  Link  from "next/link"
import Button from "@/app/components/ui/button"
export default function Home() {
  return (
    <main
      className="relative screen bg-cover"
      style={{ backgroundImage: "url('/image.png')" }}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur" />

      {/* Content */}
      <section className="relative z-10 mt-24 max-w-2xl px-6 text-white">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Consartz connects you to the world of live events
        </h1>

        <p className="mt-4 text-gray-300">
          Discover concerts, shows and events happening near you
        </p>

        <Link href="/login" className="inline-block mt-8">
          <Button text="Get Started" variant="primary"/>
          <Button text="Log In" variant="secondary"/>
        </Link>
      </section>
    </main>
  );
}