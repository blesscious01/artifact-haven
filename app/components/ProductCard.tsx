'use client';

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  series?: string; // Tambahan Baru
  brand: string;
  price: number;
  pricePhp?: number | null; // Tambahan Baru
  condition: string;
  imageUrl: string;
  status: string;
  is_negotiable?: boolean;
}

export default function ProductCard({ 
  id, name, series, brand, price, pricePhp, condition, imageUrl, status, is_negotiable 
}: ProductCardProps) {
  
  return (
    <Link href={`/products/${id}`} className="group block bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* AREA GAMBAR */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {/* Gambar Produk */}
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge Sold Out (Overlay) */}
        {status === 'Sold Out' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
             <span className="bg-red-600 text-white px-4 py-1 rounded-full font-black text-sm uppercase -rotate-6 border-2 border-white">
               SOLD OUT
             </span>
          </div>
        )}

        {/* Badge Kondisi (Pojok Kiri Atas) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
           <span className="bg-white/90 backdrop-blur text-black text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase">
             {condition}
           </span>
           {/* Badge Nego */}
           {is_negotiable && (
             <span className="bg-green-100/90 backdrop-blur text-green-700 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase flex items-center gap-1">
               <ShieldCheck size={10} /> Nego
             </span>
           )}
        </div>
      </div>

      {/* AREA INFO */}
      <div className="p-5">
        {/* Series Badge (Baru!) */}
        <div className="mb-2">
           <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md">
             {series || 'ORIGINAL'}
           </span>
        </div>

        {/* Nama & Brand */}
        <h3 className="font-bold text-lg leading-tight text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        <p className="text-xs text-gray-400 font-bold uppercase mb-4">{brand}</p>

        {/* Harga (PHP Besar, IDR Kecil) */}
        <div className="flex items-end justify-between border-t border-gray-50 pt-4">
          <div>
            <p className="text-xs text-gray-400 font-bold mb-0.5">PRICE</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black font-mono text-black">
                ₱{pricePhp?.toLocaleString() || '0'}
              </span>
              <span className="text-xs text-gray-400 font-mono line-through opacity-50 hidden sm:inline-block">
                {/* IDR disembunyikan dikit biar gak penuh, atau bisa ditampilkan */}
              </span>
            </div>
            {/* IDR ditampilkan kecil di bawahnya */}
            <p className="text-[10px] text-gray-400 font-mono">
               ≈ Rp {price.toLocaleString()}
            </p>
          </div>
          
          <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}