import Link from 'next/link';
import Image from 'next/image';

// Kita buat interface untuk tipe data yang diterima
interface HeroProps {
  title?: string;
  subtitle?: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
  // Fallback text (Jaga-jaga kalau database kosong)
  const defaultTitle = <>ELEVATE YOUR <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">COLLECTION</span></>;
  const defaultSubtitle = "Artifact Haven is your sanctuary for authentic, factory-sealed masterpieces. Directly sourced and curated for collectors in the Philippines & Indonesia.";

  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-24 lg:pb-32">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center">
        {/* Teks Promosi */}
        <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
            {/* Kalau ada Title dari DB, tampilkan. Kalau gak, pakai default */}
            {title ? (
              <span dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br/>') }} />
            ) : defaultTitle}
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
            {subtitle || defaultSubtitle}
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link 
              href="/#collection"
              className="px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-cyan-500 transition-all shadow-xl flex items-center justify-center"
            >
              Shop New Arrivals
            </Link>

            <Link 
              href="/#request"
              className="px-8 py-4 border-2 border-gray-200 text-gray-900 font-bold rounded-full hover:border-pink-400 transition-all flex items-center justify-center"
            >
              Request a Figure
            </Link>
          </div>
        </div>

        {/* Logo / Gambar Figure Utama */}
        <div className="w-full lg:w-1/2 mt-16 lg:mt-0 relative flex justify-center">
          <div className="relative w-72 h-72 lg:w-[450px] lg:h-[450px] animate-pulse-slow">
             <Image 
               src="/logo.png" 
               alt="Artifact Haven Logo"
               fill
               className="object-contain drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]"
               priority
             />
          </div>
        </div>
      </div>
    </section>
  );
}