'use client';
import Link from 'next/link';
import Image from 'next/image';

interface ProductProps {
  id: string;
  name: string;
  brand: string;
  price: number;      // Harga IDR
  pricePhp?: number;  // Harga PHP (Opsional)
  condition: string;
  imageUrl: string;
  status: string;
}

export default function ProductCard({ id, name, brand, price, pricePhp, condition, imageUrl, status }: ProductProps) {
  return (
    <Link href={`/products/${id}`} className="group block">
      <div className="relative aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden mb-4">
        {status !== 'Available' && (
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full z-10 backdrop-blur-md">
            {status}
          </div>
        )}
        
        <Image 
          src={imageUrl} 
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="space-y-1">
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{brand}</p>
        <h3 className="font-bold text-lg leading-tight group-hover:text-cyan-600 transition-colors line-clamp-1">{name}</h3>
        
        {/* TAMPILAN DUAL CURRENCY */}
        <div className="flex flex-col">
          <span className="text-black font-black">
            Rp {price.toLocaleString('id-ID')}
          </span>
          {/* Kalau ada harga PHP, tampilkan di bawahnya */}
          {pricePhp && (
            <span className="text-xs text-gray-500 font-medium">
              ₱ {pricePhp.toLocaleString('en-PH')}
            </span>
          )}
        </div>

        <div className="flex gap-2 mt-2">
           <span className="text-[10px] border border-gray-200 px-2 py-1 rounded-md text-gray-600">
             {condition}
           </span>
        </div>
      </div>
    </Link>
  );
}