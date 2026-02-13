import { supabase } from '@/app/lib/supabase';
import Header from '@/app/components/Header';
import Image from 'next/image';
import Link from 'next/link';

// Perbaikan untuk Next.js 15: params harus dianggap sebagai Promise
export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  
  const { id } = await params; 

  // 1. Ambil DATA PRODUK
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  // 2. Ambil DATA SETTINGS (KONTAK)
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*');

  // Jika produk tidak ditemukan
  if (!product) {
    return (
      <main className="min-h-screen bg-white"><Header /><div className="container mx-auto p-20 text-center"><h1 className="text-2xl font-bold">Produk Tidak Ditemukan</h1><Link href="/" className="text-cyan-600 underline mt-4 block">Kembali ke Home</Link></div></main>
    );
  }

  // --- LOGIKA KONTAK DINAMIS ---
  // Cari settingan di database, kalau belum ada pakai default
  const messengerUsername = settings?.find(s => s.key === 'messenger_username')?.value || 'ArtifactHavenFigure';
  const adminEmail = settings?.find(s => s.key === 'admin_email')?.value || 'contact@artifacthaven.com';

  const messengerLink = `https://m.me/${messengerUsername}`;

  const emailSubject = encodeURIComponent(`Inquiry: ${product.name}`);
  const emailBody = encodeURIComponent(
    `Hello Artifact Haven,\n\nI am interested in the following item:\n\nName: ${product.name}\nPrice: Rp ${product.price.toLocaleString('id-ID')}\nCondition: ${product.condition}\n\nIs this artifact still available?`
  );
  const emailLink = `mailto:${adminEmail}?subject=${emailSubject}&body=${emailBody}`;

  const isSoldOut = product.status === 'Sold Out';

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-6 py-12">
        <Link href="/" className="text-sm font-bold text-gray-400 hover:text-black transition-colors mb-8 inline-block">← BACK TO COLLECTION</Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">
          {/* Gambar */}
          <div className="relative h-[500px] bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-inner">
            <Image 
              src={product.image_url || '/logo-ah.png'} 
              alt={product.name} 
              fill 
              className={`object-contain p-8 ${isSoldOut ? 'grayscale opacity-75' : ''}`}
            />
            {isSoldOut && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                 <span className="bg-red-600/90 text-white text-4xl font-black px-8 py-4 rounded-xl rotate-[-12deg] border-4 border-white shadow-2xl tracking-widest">SOLD OUT</span>
              </div>
            )}
          </div>

          {/* Detail */}
          <div className="flex flex-col justify-center">
            <span className="text-cyan-600 font-black tracking-[0.2em] text-sm mb-2 uppercase">{product.brand}</span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <span className={`text-3xl font-black ${isSoldOut ? 'text-gray-400 line-through' : 'text-gray-900'}`}>Rp {product.price.toLocaleString('id-ID')}</span>
              <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{product.condition}</span>
            </div>

            <div className="border-t border-b border-gray-100 py-8 mb-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Description</h3>
              <p className="text-gray-600 leading-relaxed italic">{product.description || "No description provided."}</p>
            </div>

            {/* Tombol Aksi */}
            {isSoldOut ? (
              <div className="w-full bg-gray-100 text-gray-400 text-center font-black py-6 rounded-2xl cursor-not-allowed flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                <span className="text-xl">🚫</span><span>SORRY, THIS ARTIFACT IS GONE.</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <a 
                  href={messengerLink}
                  target="_blank"
                  className="w-full bg-[#0084FF] text-white text-center font-black py-5 rounded-2xl hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <span>SEND MESSAGE VIA MESSENGER</span>
                </a>
                
                <a 
                  href={emailLink}
                  className="w-full bg-gray-900 text-white text-center font-black py-5 rounded-2xl hover:bg-cyan-600 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <span>INQUIRY VIA EMAIL</span>
                </a>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </main>
  );
}