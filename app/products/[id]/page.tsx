'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { Product } from '@/app/types';
import { ArrowLeft, Mail, Share2, ShieldCheck, Info } from 'lucide-react'; 
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // States
  const [activeImage, setActiveImage] = useState<string>('');
  const [currency, setCurrency] = useState<'PHP' | 'IDR'>('PHP'); 

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setProduct(data);
        setActiveImage(data.image_url || ''); 
      }
      setLoading(false);
    };
    if (id) fetchProduct();
  }, [id]);

  const handleContact = () => {
    if (!product) return;
    const subject = `Inquiry: ${product.name} (${product.series})`;
    const body = `Hi Artifact Haven, I'm interested in buying/bargaining for this item. Item ID: ${product.id}`;
    window.location.href = `mailto:your-email@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    // Note: You can also use window.open('https://m.me/your-fb-username') for Messenger
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div>
    </div>
  );

  if (!product) return <div className="p-20 text-center">Artifact Not Found</div>;

  const uniqueImages = Array.from(new Set([product.image_url, ...(product.gallery_urls || [])])).filter(Boolean);

  return (
    <div className="min-h-screen bg-white text-black pb-20">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        <div className="font-bold text-xs tracking-[0.2em] uppercase text-gray-400">Artifact Details</div>
        <button className="p-2 hover:bg-gray-100 rounded-full"><Share2 size={20} /></button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT: INTERACTIVE GALLERY */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 relative shadow-inner">
               <img src={activeImage} alt={product.name} className="w-full h-full object-contain p-8" />
               {product.status === 'Sold Out' && (
                 <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                   <span className="bg-white text-black px-8 py-3 rounded-full font-black text-2xl shadow-2xl">SOLD OUT</span>
                 </div>
               )}
            </div>

            {uniqueImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 px-1">
                {uniqueImages.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-black scale-105' : 'border-transparent opacity-50'}`}>
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: INFO */}
          <div className="flex flex-col">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-tighter italic">
                {product.series || 'Original'}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase">
                {product.category}
              </span>
              <span className="px-3 py-1 border border-gray-200 text-gray-400 rounded-full text-[10px] font-bold uppercase">
                {product.condition}
              </span>
              {product.is_negotiable && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                  <ShieldCheck size={10} /> Negotiable
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-none mb-2 tracking-tight">{product.name}</h1>
            <p className="text-xl text-gray-400 font-medium mb-8 italic">{product.brand}</p>

            {/* CURRENCY TOGGLE PRICE */}
            <div className="mb-10 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Investment Value</span>
                 <div className="flex bg-white rounded-full p-1 border shadow-sm">
                    <button onClick={() => setCurrency('PHP')} className={`px-4 py-1 rounded-full text-[10px] font-bold transition-all ${currency === 'PHP' ? 'bg-black text-white' : 'text-gray-400'}`}>PHP</button>
                    <button onClick={() => setCurrency('IDR')} className={`px-4 py-1 rounded-full text-[10px] font-bold transition-all ${currency === 'IDR' ? 'bg-black text-white' : 'text-gray-400'}`}>IDR</button>
                 </div>
              </div>
              <div className="text-5xl font-mono font-black text-black tracking-tighter">
                {currency === 'PHP' ? `₱${product.price_php?.toLocaleString()}` : `Rp${product.price.toLocaleString()}`}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mb-10">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Info size={14} /> Curator's Note
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                {product.description || "No specific details provided for this artifact yet."}
              </p>
            </div>

            {/* ACTION BUTTON */}
            <button 
              onClick={handleContact}
              className="w-full bg-black text-white py-6 rounded-2xl font-black text-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/20 active:scale-95"
            >
              <Mail size={24} />
              {product.is_negotiable ? 'CHAT TO BUY OR BARGAIN' : 'CONTACT TO PURCHASE'}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest">
              Secure Transaction via Inquiry
            </p>

          </div>
        </div>
      </main>
    </div>
  );
}