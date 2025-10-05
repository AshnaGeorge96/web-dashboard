"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";

type NavItem = {
  name: string;
  path: string;
};

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/" },
  { name: "Returns", path: "/returns" },
  { name: "Reports", path: "/reports" },
  { name: "Settings", path: "/settings" },
];

interface SidebarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function Sidebar({ theme, toggleTheme }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 flex-shrink-0 shadow-xl rounded-r-2xl">
      <h2 className="text-2xl font-bold mb-8">KNWO 2.0</h2>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block py-2 px-3 rounded-lg transition-transform ${
              pathname === item.path ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <button
        onClick={toggleTheme}
        className="mt-8 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow hover:scale-105 transition-transform"
      >
        {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </button>
    </aside>
  );
}
