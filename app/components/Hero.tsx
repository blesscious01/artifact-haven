import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-24 lg:pb-32">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center">
        {/* Teks Promosi */}
        <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
            ELEVATE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
              COLLECTION
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
            Artifact Haven is your sanctuary for authentic, factory-sealed masterpieces. 
            Directly sourced and curated for collectors in the Philippines & Indonesia.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-cyan-500 transition-all shadow-xl">
              Shop New Arrivals
            </button>
            <button className="px-8 py-4 border-2 border-gray-200 text-gray-900 font-bold rounded-full hover:border-pink-400 transition-all">
              Request a Figure
            </button>
          </div>
        </div>

        {/* Logo / Gambar Figure Utama */}
        <div className="w-full lg:w-1/2 mt-16 lg:mt-0 relative flex justify-center">
          <div className="relative w-72 h-72 lg:w-[450px] lg:h-[450px] animate-pulse-slow">
             {/* Logo kamu sebagai elemen hero */}
            <Image 
              src="/logo.png" 
              alt="logo"
              fill
              className="object-contain drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}