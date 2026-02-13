import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-20 mt-20 rounded-t-[3rem]">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Kolom 1: Brand & Copyright */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="font-black text-2xl mb-4 tracking-tighter">ARTIFACT HAVEN</h2>
          <p className="text-gray-400 max-w-sm mb-6 leading-relaxed">
            Your trusted gateway to rare anime figures directly from Japan & Philippines markets. 
            Authentic. Curated. delivered with care.
          </p>
          <p className="text-xs text-gray-600 font-mono">
            © {new Date().getFullYear()} Artifact Haven. All rights reserved.
          </p>
        </div>

        {/* Kolom 2: Quick Links (Navigasi Cepat) */}
        <div>
          <h3 className="font-bold text-gray-500 mb-6 uppercase text-xs tracking-widest">Explore</h3>
          <ul className="space-y-4 text-sm font-bold">
            <li>
              <Link href="/" className="hover:text-cyan-400 transition-colors">
                Home Base
              </Link>
            </li>
            <li>
              <Link href="/#collection" className="hover:text-cyan-400 transition-colors">
                Latest Drops
              </Link>
            </li>
            <li>
              <Link href="/#request" className="hover:text-cyan-400 transition-colors">
                Request Finder
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-cyan-400 transition-colors">
                Admin Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 3: Connect (Sosmed & Kontak) */}
        <div>
          <h3 className="font-bold text-gray-500 mb-6 uppercase text-xs tracking-widest">Connect</h3>
          <ul className="space-y-4 text-sm font-bold">
            <li>
              <a 
                href="https://facebook.com/ArtifactHavenFigure" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors flex items-center gap-2"
              >
                Facebook Page ↗
              </a>
            </li>
            <li>
              <a 
                href="mailto:contact@artifacthaven.com" 
                className="hover:text-yellow-400 transition-colors flex items-center gap-2"
              >
                Email Support ↗
              </a>
            </li>
            <li>
              <span className="text-gray-600 cursor-not-allowed flex items-center gap-2">
                Instagram (Coming Soon)
              </span>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}