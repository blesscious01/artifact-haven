import { supabase } from './lib/supabase';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import RequestForm from './components/RequestForm';

export const revalidate = 0;

export default async function Home() {
  // 1. Ambil SEMUA data produk (kecuali Hidden)
  const { data: allProducts, error } = await supabase
    .from('products')
    .select('*')
    .neq('status', 'Hidden')
    .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

  if (error) {
    console.error("Error mengambil data:", error);
  }

  // 2. Potong Data (Logika Baru)
  // Ambil 3 data pertama untuk New Arrivals
  const newArrivals = allProducts ? allProducts.slice(0, 3) : [];
  
  // Ambil sisanya (mulai dari data ke-4 sampai habis)
  const restOfCollection = allProducts ? allProducts.slice(3) : [];

  return (
    <main className="min-h-screen bg-white pb-20">
      <Header />
      <Hero />

      {/* --- SECTION 1: NEW ARRIVALS (Cuma 3 Teratas) --- */}
      <section className="container mx-auto px-6 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">NEW ARRIVALS</h2>
            <p className="text-gray-500">Fresh from the hunt. Only the newest artifacts.</p>
          </div>
        </div>

        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {newArrivals.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand || 'Unknown Brand'} 
                price={`Rp ${product.price?.toLocaleString('id-ID')}`}
                condition={product.condition}
                imageUrl={product.image_url || '/logo-ah.png'}
                status={product.status}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400">Belum ada artifact baru.</p>
          </div>
        )}
      </section>

      {/* --- SECTION 2: THE VAULT (Sisa Produk) --- */}
      {/* Hanya muncul jika ada produk sisa (lebih dari 3) */}
      {restOfCollection.length > 0 && (
        <section className="container mx-auto px-6 py-10 border-t border-gray-100">
          <div className="mb-8">
            <h2 className="text-xl font-black text-gray-400 tracking-widest uppercase">The Vault Archive</h2>
            <p className="text-sm text-gray-400">Previous collections still looking for a master.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {restOfCollection.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand || 'Unknown Brand'} 
                price={`Rp ${product.price?.toLocaleString('id-ID')}`}
                condition={product.condition}
                imageUrl={product.image_url || '/logo-ah.png'}
                status={product.status}
              />
            ))}
          </div>
        </section>
      )}

      <RequestForm />
    </main>
  );
}