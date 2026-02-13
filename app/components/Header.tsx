import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-xs group-hover:rotate-12 transition-transform">
            AH
          </div>
          <span className="font-black tracking-tighter text-lg">ARTIFACT HAVEN</span>
        </Link>

        {/* NAVIGASI TENGAH */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
          <Link href="/" className="hover:text-black transition-colors">HOME</Link>
          <Link href="/about" className="hover:text-black transition-colors">ABOUT US</Link>
          <Link href="/collection" className="hover:text-black transition-colors">COLLECTION</Link>
        </nav>

        {/* TOMBOL REQUEST (Ganti tombol Admin jadi Request supaya lebih berguna) */}
        <Link href="/#request" className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition-colors">
          REQUEST FINDER
        </Link>
      </div>
    </header>
  );
}