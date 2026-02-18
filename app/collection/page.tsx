'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import Header from '@/app/components/Header';
import ProductCard from '@/app/components/ProductCard';

// UPDATE TIPE DATA (Tambah Series & Nego)
interface Product {
  id: string;
  name: string;
  series: string; // Baru
  brand: string;
  price: number;
  price_php: number;
  condition: string;
  image_url: string;
  status: string;
  is_negotiable: boolean; // Baru
  created_at: string;
}

export default function CollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [brands, setBrands] = useState<string[]>([]);

  // 1. FETCH DATA
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .neq('status', 'Hidden')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setProducts(data || []);
      // Ambil list brand unik
      const uniqueBrands = Array.from(new Set(data?.map(item => item.brand) || [])).filter(Boolean);
      setBrands(uniqueBrands as string[]);
    }
    setLoading(false);
  };

  // 2. LOGIKA FILTER CANGGIH (Updated)
  const filteredProducts = products.filter((product) => {
    // Filter Search: Sekarang cari di Nama, Brand, DAN Series
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      product.name?.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query) ||
      product.series?.toLowerCase().includes(query); // Fitur Baru

    // Filter Dropdown
    const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;

    return matchesSearch && matchesBrand;
  });

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* HEADER */}
      <div className="bg-black text-white pt-32 pb-16 rounded-b-[3rem]">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">THE VAULT</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Explore our complete archive of authentic artifacts. 
            Use the search bar to uncover specific treasures.
          </p>
        </div>
      </div>

      {/* SEARCH BAR & FILTER */}
      <section className="container mx-auto px-6 -mt-8 mb-12 relative z-10">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
          
          {/* Input Search */}
          <div className="flex-1 w-full relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search by name, series (e.g. Naruto), or brand..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all text-black placeholder-gray-400 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Dropdown Brand */}
          <div className="w-full md:w-48">
            <select 
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-cyan-500 text-black font-bold cursor-pointer"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="All">All Brands</option>
              {brands.map((brand, index) => (
                <option key={index} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

        </div>
      </section>

      {/* HASIL PRODUK */}
      <section className="container mx-auto px-6 pb-20 min-h-[400px]">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400 font-bold">Scanning Archive...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div>
            <p className="mb-6 text-gray-400 text-sm font-bold uppercase tracking-widest">
              Showing {filteredProducts.length} artifacts
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  series={product.series} // 🔥 Updated: Pass Series
                  brand={product.brand || 'Unknown'} 
                  price={product.price}
                  pricePhp={product.price_php}
                  condition={product.condition}
                  imageUrl={product.image_url || '/logo.png'}
                  status={product.status}
                  is_negotiable={product.is_negotiable} // 🔥 Updated: Pass Nego Status
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
            <p className="text-xl font-bold text-gray-400 mb-2">No artifacts found.</p>
            <p className="text-gray-400 mb-6">Try searching for a different series or character.</p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedBrand('All');}}
              className="text-cyan-600 font-bold hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

    </main>
  );
}