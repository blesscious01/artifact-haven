'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { Product } from '@/app/types';
import { ArrowLeft, Share2, MessageCircle, Copy, Check } from 'lucide-react'; 
import Header from '@/app/components/Header'; // Pastikan path ini benar
import Footer from '@/app/components/Footer'; // Opsional, biar ada footer juga

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // States
  const [activeImage, setActiveImage] = useState<string>('');
  const [currency, setCurrency] = useState<'PHP' | 'IDR'>('PHP'); 
  const [copied, setCopied] = useState(false);

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

  // --- LOGIC SHARE BUTTON ---
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || 'Artifact Haven',
          text: `Check out this figure: ${product?.name}`,
          url: url,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // --- LOGIC CONTACT (HANYA MESSENGER) ---
  const handleContact = async () => {
    if (!product) return;
    
    // Ambil link FB dari settings (opsional, kalau mau dinamis)
    const { data } = await supabase.from('settings').select('facebook_link').single();
    const fbLink = data?.facebook_link || 'https://m.me/yourpage'; // Ganti default dengan link messenger kamu
    
    // Format Pesan
    const text = `Hi, I'm interested in this item: ${product.name} (ID: ${product.id})`;
    
    // Kalau link FB berupa m.me atau facebook.com, kita arahkan user
    // Cara paling aman buka link FB baru:
    window.open(fbLink, '_blank');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div>
    </div>
  );

  if (!product) return <div className="p-20 text-center">Artifact Not Found</div>;

  const uniqueImages = Array.from(new Set([product.image_url, ...(product.gallery_urls || [])])).filter(Boolean);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* 1. HEADER (Biar gak dead end) */}
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Navigasi Kecil */}
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors">
          <ArrowLeft size={16} /> BACK TO COLLECTION
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT: GALLERY */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 relative shadow-inner group">
               <img src={activeImage} alt={product.name} className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500" />
               
               {/* SOLD OUT OVERLAY */}
               {product.status === 'Sold Out' && (
                 <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                   <span className="bg-white text-black px-8 py-3 rounded-full font-black text-2xl shadow-2xl">SOLD OUT</span>
                 </div>
               )}
            </div>

            {/* Thumbnails */}
            {uniqueImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide">
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
            <div className="flex justify-between items-start">
               {/* Badges (Tanpa Nego) */}
               <div className="flex flex-wrap gap-2 mb-6">
                 <span className="px-3 py-1 bg-cyan-600 text-white rounded-full text-[10px] font-black uppercase tracking-tighter">
                   {product.series || 'Original'}
                 </span>
                 <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase">
                   {product.category}
                 </span>
                 <span className="px-3 py-1 border border-gray-200 text-gray-400 rounded-full text-[10px] font-bold uppercase">
                   {product.condition}
                 </span>
               </div>

               {/* Share Button (Fixed) */}
               <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-full transition-colors relative group">
                 {copied ? <Check size={20} className="text-green-600" /> : <Share2 size={20} />}
                 <span className="absolute right-0 -top-8 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {copied ? 'Copied!' : 'Share Artifact'}
                 </span>
               </button>
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-none mb-2 tracking-tight">{product.name}</h1>
            <p className="text-xl text-gray-400 font-medium mb-8 italic">{product.brand}</p>

            {/* PRICE */}
            <div className="mb-10 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estimated Value</span>
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
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Curator's Note</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                {product.description || "No specific details provided for this artifact yet."}
              </p>
            </div>

            {/* ACTION BUTTON (Cuma Chat) */}
            <button 
              onClick={handleContact}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
            >
              <MessageCircle size={24} />
              CHAT TO BUY / DEAL
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest">
              Direct Transaction via Messenger
            </p>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}