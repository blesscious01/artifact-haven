'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react'; // Butuh install lucide-react kalo belum
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Collection', href: '/collection' }, // Pastikan ada page ini, atau arahkan ke /#collection
    { name: 'How to Buy', href: '/how-to-buy' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="text-xl font-black tracking-widest flex items-center gap-2">
          ARTIFACT<span className="text-cyan-600">HAVEN</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-sm font-bold uppercase tracking-wider hover:text-cyan-600 transition-colors ${pathname === link.href ? 'text-black' : 'text-gray-400'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-black">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE NAV OVERLAY */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl p-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-bold text-gray-800 py-2 border-b border-gray-50"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}