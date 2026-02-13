'use client';

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Placeholder */}
        <div className="text-2xl font-black tracking-tighter text-gray-900 hover:text-cyan-500 transition-colors cursor-pointer">
          ARTIFACT <span className="text-magenta-500 text-pink-500">HAVEN</span>
        </div>

        {/* Menu dengan Neon Hover */}
        <div className="hidden md:flex space-x-8 font-medium text-gray-600">
          {['Home', 'Products', 'The Scout', 'About'].map((item) => (
            <a 
              key={item} 
              href="#" 
              className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-300"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}