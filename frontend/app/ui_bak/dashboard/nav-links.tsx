'use client'
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Navbar {
  name: string;
  href: string;
}

const links: Navbar[] = [
  { name: 'Home', href: '/dashboard'},
  { name: 'Dank Bank', href: '/dashboard/items'},
  { name: 'T-Planet', href: '/dashboard/items/dining'},
];

export default function ResponsiveNavbar() {
  const [visibleLinks, setVisibleLinks] = useState<Navbar[]>(links);
  const [hiddenLinks, setHiddenLinks] = useState<Navbar[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateLinks = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const linkWidths = Array.from(containerRef.current.children).map(child => (child as HTMLElement).offsetWidth);
      let totalWidth = 0;
      let visible: Navbar[] = [];
      let hidden: Navbar[] = [];

      for (let i = 0; i < links.length; i++) {
        totalWidth += linkWidths[i] || 0;
        if (totalWidth + 100 < containerWidth) {
          visible.push(links[i]);
        } else {
          hidden.push(links[i]);
        }
      }

      setVisibleLinks(visible);
      setHiddenLinks(hidden);
    };

    const observer = new ResizeObserver(updateLinks);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="flex justify-between items-center">
        {/* Logo / Brand */}
        <div className="text-2xl font-bold">Brand</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4" ref={containerRef}>
          {visibleLinks.map((link) => (
            <a key={link.name} href={link.href} className="hover:text-blue-300">
              {link.name}
            </a>
          ))}
          {hiddenLinks.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  More <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {hiddenLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <a href={link.href}>{link.name}</a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 space-y-2">
          {links.map((link) => (
            <a key={link.name} href={link.href} className="block p-2 text-white bg-gray-800 rounded-md">
              {link.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
