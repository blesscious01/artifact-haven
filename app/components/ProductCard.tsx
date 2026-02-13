'use client';
import Link from 'next/link';
import Image from 'next/image';

interface ProductProps {
  id: string;
  name: string;
  brand: string;
  price: string;
  condition: string;
  imageUrl: string;
  status: string; // <-- Tambah ini
}

export default function ProductCard({ id, name, brand, price, condition, imageUrl, status }: ProductProps) {
  const isSold = status === 'Sold Out';

  return (
    <Link href={`/products/${id}`} className={`group cursor-pointer block ${isSold ? 'opacity-75' : ''}`}>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative">
        
        {/* STEMPEL SOLD OUT */}
        {isSold && (
          <div className="absolute top-4 right-4 z-20 bg-red-600 text-white text-xs font-black px-3 py-1 rounded shadow-lg transform rotate-12 border-2 border-white">
            SOLD OUT
          </div>
        )}

        {/* Gambar */}
        <div className="relative h-64 w-full bg-gray-50">
          <Image 
            src={imageUrl} 
            alt={name} 
            fill 
            className={`object-contain p-4 transition-transform duration-500 ${isSold ? 'grayscale' : 'group-hover:scale-110'}`}
          />
          <div className="absolute top-3 left-3">
            <span className="bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
              {condition}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter mb-1">{brand}</p>
          <h3 className="text-lg font-black text-gray-900 leading-tight mb-2 group-hover:text-cyan-600 transition-colors">
            {name}
          </h3>
          <div className="flex justify-between items-center">
            <span className={`text-xl font-black ${isSold ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
              {price}
            </span>
            {!isSold && (
              <span className="text-[10px] font-bold text-cyan-600 border border-cyan-600 px-2 py-1 rounded hover:bg-cyan-600 hover:text-white transition-all">
                VIEW DETAIL
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}