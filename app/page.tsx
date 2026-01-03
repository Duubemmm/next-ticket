import Link from "next/link";

export default function Home() {
  return (
    <section className="mt-24 max-w-2xl">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        Consartz connects you to the world of live events
      </h1>

      <p className="mt-4 text-gray-300">
        Discover concerts, shows and events happening near you
      </p>

      <Link
        href="/login"
        className="inline-block mt-8 rounded-md bg-orange-500 px-6 py-3 font-semibold hover:bg-orange-600 transition"
      >
        Get Started
      </Link>
    </section>
  );
}
