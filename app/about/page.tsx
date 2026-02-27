import Link from 'next/link';
import { supabase } from '@/app/lib/supabase'; // Import Supabase
import Header from '../components/Header';
import Footer from '../components/Footer';

export const revalidate = 0; // Selalu update kalau ada perubahan

export default async function AboutPage() {
  // QUERY CONTENT 🔥
  const { data: content } = await supabase
    .from('website_content')
    .select('*')
    .single();

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* 1. HERO SECTION: MAIN TITLE */}
      <section className="pt-40 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="text-cyan-600 font-bold tracking-widest text-xs uppercase mb-4 block">
            OUR STORY
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight text-black">
            MORE THAN TOYS. <br />
            THEY ARE <span className="text-gray-400">ARTIFACTS.</span>
          </h1>
          
          {/* TEKS DARI DATABASE */}
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto whitespace-pre-wrap">
            {content?.about_us_text || "Artifact Haven was born from the thrill of the hunt. We are the bridge for collectors, sourcing authentic figures directly from the vibrant markets of Japan & the Philippines."}
          </p>
        </div>
      </section>

      {/* 2. IMAGE PLACEHOLDER */}
      <section className="px-6 mb-20">
        <div className="container mx-auto max-w-5xl">
          <div className="aspect-video bg-gray-100 rounded-[2rem] overflow-hidden relative flex items-center justify-center border border-gray-200">
             <div className="text-center">
               <span className="text-4xl mb-2 block">🇯🇵 ✈️ 🇮🇩</span>
               <p className="text-gray-400 font-bold text-sm">WAREHOUSE / COLLECTION SNAPSHOT</p>
             </div>
          </div>
        </div>
      </section>

      {/* 3. VALUE PROPOSITION */}
      <section className="bg-black text-white py-24 rounded-[3rem] mx-4 mb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center text-2xl mb-4 mx-auto md:mx-0">🔍</div>
              <h3 className="text-xl font-bold">The Hunter's Eye</h3>
              <p className="text-gray-400 leading-relaxed">
                We don't just stock inventory; we hunt. We actively scout hidden hobby shops to ensure every figure's condition (MISB/BIB) is rigorously checked.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center text-2xl mb-4 mx-auto md:mx-0">💎</div>
              <h3 className="text-xl font-bold">100% Authentic</h3>
              <p className="text-gray-400 leading-relaxed">
                No bootlegs. At Artifact Haven, authenticity is non-negotiable. Sourced from trusted networks in Japan.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-2xl mb-4 mx-auto md:mx-0">🤝</div>
              <h3 className="text-xl font-bold">Personal Request</h3>
              <p className="text-gray-400 leading-relaxed">
                Still looking for your "Holy Grail"? Tell us the character and your budget. We will deploy our scouts to find it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEAM / QUOTE */}
      <section className="container mx-auto px-6 py-10 mb-20">
        <div className="flex flex-col md:flex-row items-center gap-10 bg-gray-50 p-10 rounded-3xl border border-gray-100">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center">
             <span className="text-2xl font-black text-gray-400">AH</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-xl font-medium italic text-gray-800 mb-4">
              "We believe every figure holds a story. Our mission isn't just selling toys; it's ensuring that story reaches your hands safely and authentically."
            </p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              — Founder, Artifact Haven
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}