"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-blue-900 text-white">
      <div className="container mx-auto">
        <div className="flex">
          <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
            Home
          </Link>
          <Link href="/about" className={`nav-link ${pathname === "/about" ? "active" : ""}`}>
            About
          </Link>
          <Link href="/publications" className={`nav-link ${pathname === "/publications" ? "active" : ""}`}>
            Publications
          </Link>
        </div>
      </div>
    </nav>
  )
}
