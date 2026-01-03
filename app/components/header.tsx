"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navLinks = [
  { name: "All Events", href: "/events" },
  { name: "Festival", href: "/festivals" },
  { name: "Concert Week", href: "/concert-week" },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between px-6 md:px-16 py-6 border-b border-white/10">
      <h2 className="text-2xl font-bold tracking-wide">Consartz</h2>

      <nav>
        <ul className="flex gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={clsx(
                  "transition",
                  pathname === link.href
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                )}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
