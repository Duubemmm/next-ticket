"use client";

import Link from "next/link";

const Header = () => {

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between py-5">
          <Link href="/" className="group">
            <h1 className="text-2xl font-bold tracking-tight text-white transition group-hover:text-orange-400">
              Ticz
            </h1>
          </Link>

          <div className="flex items-center gap-3 ml-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-white/90 transition hover:text-orange-400"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 text-sm font-medium text-white/90 bg-orange-400 rounded-full transition hover:bg-white/20 hover:text-orange-400"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;