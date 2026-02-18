import { supabase } from './lib/supabase';
import Link from 'next/link';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import RequestForm from './components/RequestForm';

export const revalidate = 0; // Biar data selalu fresh tiap refresh

export default async function Home() {
  // 1. QUERY NEW ARRIVALS
  const { data: newArrivals } = await supabase
    .from('products')
    .select('*')
    .neq('status', 'Hidden') // Jangan tampilkan yang Hidden
    .order('created_at', { ascending: false })
    .limit(3);

  // 2. QUERY FEATURED
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .neq('status', 'Hidden')
    .eq('is_featured', true)
    .limit(8);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />

      {/* --- SECTION 1: NEW ARRIVALS --- */}
      <section id="collection" className="container mx-auto px-6 py-16 scroll-mt-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-cyan-600 font-bold tracking-widest text-xs uppercase mb-2 block">Fresh From Japan</span>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">NEW ARRIVALS</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {newArrivals?.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              series={product.series} // 🔥 PENTING: Pass Series Data
              brand={product.brand || 'Unknown'} 
              price={product.price}
              pricePhp={product.price_php} // Pass harga PHP
              condition={product.condition}
              imageUrl={product.image_url || '/logo.png'} // Fallback kalau gak ada gambar
              status={product.status}
              is_negotiable={product.is_negotiable} // Pass status Nego
            />
          ))}
        </div>
      </section>

      {/* --- SECTION 2: FEATURED ARTIFACTS --- */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="bg-gray-50 py-20 border-y border-gray-100">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <span className="text-pink-500 font-bold tracking-widest text-xs uppercase mb-2 block">Curator's Choice</span>
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter">FEATURED COLLECTION</h2>
                <p className="text-gray-500 mt-2">Rare finds and highly requested artifacts.</p>
              </div>
              
              <Link href="/collection" className="group flex items-center gap-2 font-bold text-black border-b-2 border-black pb-1 hover:text-cyan-600 hover:border-cyan-600 transition-all">
                BROWSE ALL ARTIFACTS
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  series={product.series} // 🔥 PENTING
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
          </div>
        </section>
      )}

      <RequestForm />
    </main>
  );
}