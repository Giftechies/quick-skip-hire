"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname?.split("/").filter(Boolean);

  const crumbs = segments?.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    return { label, href };
  });

  return (
    <nav
      aria-label="breadcrumb"
      className="relative z-30 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:text-base"
    >
      {/* Home Link */}
      <Link
        href="https://www.quickskiphire.com/"
        className="text-white hover:text-gray-400  cursor-pointer whitespace-nowrap"
      >
        Home
      </Link>

      {/* Crumbs */}
      {crumbs?.map((crumb, index) => (
        <div key={index} className="flex text-white items-center space-x-1">
          <ChevronRight className="w-3.5 h-3.5" />
          {index === crumbs.length - 1 ? (
            <span className=" font-medium truncate max-w-full sm:max-w-md">
              {crumb.label}
            </span>
          ) : (
            // Use real href so Next.js can handle the navigation natively
            <Link
              href={crumb.href}
              className="text-white hover:text-gray-400 transition-colors cursor-pointer whitespace-nowrap"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
