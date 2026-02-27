'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/ProductCard';
import { Filter, X, Search, AlertCircle } from 'lucide-react';

export default function CollectionPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(''); // State buat nangkep error
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setErrorMsg('');
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .neq('status', 'Hidden')
          .order('created_at', { ascending: false });

        if (error) throw error; // Kalau database error, lempar ke catch

        setProducts(data || []);
      } catch (err: any) {
        console.error('Error fetching collection:', err);
        setErrorMsg(err.message || 'Failed to load artifacts.');
      } finally {
        setLoading(false); // 🔥 PENTING: Apapun yang terjadi, stop loading
      }
    }
    fetchProducts();
  }, []);

  // --- LOGIKA FILTERING (ANTI CRASH) ---
  const filteredProducts = products.filter(p => {
    // Pakai tanda tanya (?) dan || '' biar gak crash kalau data null
    const productName = (p.name || '').toLowerCase();
    const productSeries = (p.series || '').toLowerCase();
    const searchTerm = search.toLowerCase();

    const matchesSearch = productName.includes(searchTerm) || productSeries.includes(searchTerm);
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesCondition = selectedCondition === 'All' || p.condition === selectedCondition;
    
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const categories = ['All', 'Anime Figure', 'Game Character', 'Mecha/Robot', 'Other'];
  const conditions = ['All', 'MISB', 'BIB', 'Loose'];

  return (
    <main className="min-h-screen bg-white text-black">
      <Header />

      <div className="pt-32 pb-20 container mx-auto px-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">THE VAULT</h1>
            <p className="text-gray-500">Browsing {filteredProducts.length} artifacts</p>
          </div>

          <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search series or name..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-black transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-2xl border transition-all flex items-center gap-2 font-bold text-sm ${showFilters ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
              {showFilters ? <X size={20}/> : <Filter size={20}/>}
              <span className="hidden md:block">{showFilters ? 'CLOSE' : 'FILTER'}</span>
            </button>
          </div>
        </div>

        {/* FILTER PANEL */}
        {showFilters && (
          <div className="mb-12 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-black text-white' : 'bg-white text-gray-500 border border-gray-100'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Condition</label>
              <div className="flex flex-wrap gap-2">
                {conditions.map(cond => (
                  <button 
                    key={cond}
                    onClick={() => setSelectedCondition(cond)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedCondition === cond ? 'bg-black text-white' : 'bg-white text-gray-500 border border-gray-100'}`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCT GRID / LOADING / ERROR */}
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400 font-bold animate-pulse gap-2">
            <LoaderIcon />
            <span>Scanning the vault...</span>
          </div>
        ) : errorMsg ? (
          <div className="p-8 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center">
            <AlertCircle className="mx-auto mb-2" />
            <p className="font-bold">Error loading artifacts</p>
            <p className="text-sm">{errorMsg}</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                series={product.series}
                brand={product.brand || 'Unknown'} 
                price={product.price}
                pricePhp={product.price_php}
                condition={product.condition}
                imageUrl={product.image_url || '/logo.png'}
                status={product.status}
                is_negotiable={product.is_negotiable}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold text-xl">No artifacts match your filters.</p>
            <button onClick={() => {setSearch(''); setSelectedCategory('All'); setSelectedCondition('All');}} className="mt-4 text-cyan-600 font-bold hover:underline">Clear all filters</button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

// Helper icon spinner
function LoaderIcon() {
  return (
    <svg className="animate-spin h-8 w-8 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}