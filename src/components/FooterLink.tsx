'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FooterLink({ href, name }: { href: string; name: string }) {
  const pathname = usePathname();

  const handleClick = () => {
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Link
      href={href}
      className="font-lexend-r text-xs sm:text-sm text-brand-dark hover:underline transition-all"
      onClick={handleClick}
    >
      {name}
    </Link>
  );
}
