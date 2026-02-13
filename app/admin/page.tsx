'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Tipe data produk sesuai database
interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  price_php?: number;
  condition: string;
  description: string;
  image_url: string;
  status: string;
  is_featured?: boolean;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  
  // STATE FORM (Sekarang menyimpan imageUrl lama)
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    pricePhp: '',
    condition: 'MISB',
    description: '',
    status: 'Available',
    imageUrl: '', // <-- INI PENYELAMATNYA
    isFeatured: false
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null); 

  const router = useRouter();

  // 1. Cek Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === 'artifact2025') {
      setIsAuthenticated(true);
      fetchProducts();
    } else {
      alert('PIN Salah!');
    }
  };

  // 2. Ambil Data Produk
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error:', error);
    else setProducts(data || []);
  };

  // 3. Handle Edit Button (Klik Tombol Edit)
  const handleEdit = (product: Product) => {
    setEditMode(product.id);
    // Isi form dengan data lama, TERMASUK LINK GAMBARNYA
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      pricePhp: product.price_php ? product.price_php.toString() : '',
      condition: product.condition,
      description: product.description || '',
      status: product.status,
      imageUrl: product.image_url || '', // Simpan link gambar lama di sini
      isFeatured: product.is_featured || false
    });
    // Scroll ke atas biar enak editnya
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Handle Submit (Simpan / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // LOGIKA GAMBAR:
    // Mulai dengan asumsi kita pakai gambar lama
    let finalImageUrl = formData.imageUrl;

    // TAPI, kalau user upload file baru, kita ganti linknya
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        alert('Gagal upload gambar: ' + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      finalImageUrl = urlData.publicUrl;
    }

    // Siapkan data untuk dikirim ke database
    const productData = {
      name: formData.name,
      brand: formData.brand,
      price: parseFloat(formData.price),
      price_php: formData.pricePhp ? parseFloat(formData.pricePhp) : null,
      condition: formData.condition,
      description: formData.description,
      status: formData.status,
      image_url: finalImageUrl, // Pakai link yang sudah diputuskan di atas
      is_featured: formData.isFeatured
    };

    if (editMode) {
      // UPDATE DATA LAMA
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editMode);

      if (!error) {
        alert('Produk berhasil diupdate!');
        setEditMode(null);
      } else {
        alert('Gagal update: ' + error.message);
      }
    } else {
      // TAMBAH DATA BARU
      const { error } = await supabase.from('products').insert([productData]);
      if (!error) alert('Produk berhasil ditambahkan!');
      else alert('Gagal tambah: ' + error.message);
    }

    // Reset Form (Kosongkan lagi)
    setFormData({
      name: '', brand: '', price: '', pricePhp: '', condition: 'MISB', description: '', status: 'Available', imageUrl: '', isFeatured: false
    });
    setImageFile(null); // Reset file uploader
    fetchProducts();    // Refresh list barang
    setLoading(false);
  };

  // 5. Handle Delete
  const handleDelete = async (id: string) => {
    if (confirm('Yakin mau hapus artifact ini?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) fetchProducts();
    }
  };

  // --- TAMPILAN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
          <h1 className="text-2xl font-black mb-6 text-center text-black">ADMIN ACCESS</h1>
          <input 
            type="password" placeholder="Enter PIN" 
            className="w-full p-4 border rounded-xl mb-4 text-black bg-white"
            value={pin} onChange={(e) => setPin(e.target.value)}
          />
          <button type="submit" className="w-full bg-black text-white p-4 rounded-xl font-bold">UNLOCK</button>
        </form>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header Admin */}
      <div className="bg-black text-white py-8 px-6 mb-8">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black">COMMAND CENTER</h1>
          <button onClick={() => router.push('/')} className="text-sm font-bold bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200">
            ← BACK TO STORE
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORM INPUT */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
            <h2 className="text-xl font-bold mb-6 text-black border-b pb-2">
              {editMode ? 'EDIT ARTIFACT' : 'ADD NEW ARTIFACT'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Preview Gambar (Biar tau gambar apa yang sedang aktif) */}
              {(imageFile || formData.imageUrl) && (
                <div className="mb-4 text-center">
                  <p className="text-[10px] text-gray-400 font-bold mb-2">CURRENT IMAGE PREVIEW</p>
                  <div className="w-32 h-32 mx-auto relative rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Input Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  {editMode ? 'CHANGE IMAGE (Optional)' : 'UPLOAD IMAGE'}
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                />
              </div>

              <input 
                required type="text" placeholder="Artifact Name" 
                className="w-full p-3 border rounded-xl bg-white text-black"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input 
                  required type="text" placeholder="Brand" 
                  className="w-full p-3 border rounded-xl bg-white text-black"
                  value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})}
                />
                <select 
                  className="w-full p-3 border rounded-xl bg-white text-black"
                  value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})}
                >
                  <option value="MISB">MISB</option>
                  <option value="BIB">BIB</option>
                  <option value="Loose">Loose</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input 
                  required type="number" placeholder="Rp Price" 
                  className="w-full p-3 border rounded-xl bg-white text-black font-bold"
                  value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
                <input 
                  type="number" placeholder="₱ Price (Optional)" 
                  className="w-full p-3 border rounded-xl bg-white text-black font-bold"
                  value={formData.pricePhp} onChange={(e) => setFormData({...formData, pricePhp: e.target.value})}
                />
              </div>

              <textarea 
                placeholder="Description..." 
                className="w-full p-3 border rounded-xl bg-white text-black h-24"
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
              />

              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="w-full p-3 border rounded-xl bg-white text-black font-bold"
                  value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Available">Available</option>
                  <option value="Sold Out">Sold Out</option>
                  <option value="Hidden">Hidden</option>
                </select>

                <div className="flex items-center justify-center border rounded-xl bg-yellow-50 border-yellow-200">
                  <label className="flex items-center gap-2 cursor-pointer p-3 w-full justify-center">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                    />
                    <span className="text-sm font-bold text-yellow-800">Featured?</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-xl shadow-lg transition-transform active:scale-95"
              >
                {loading ? 'SAVING...' : (editMode ? 'UPDATE ARTIFACT' : 'PUBLISH ARTIFACT')}
              </button>
              
              {editMode && (
                <button 
                  type="button"
                  onClick={() => {
                    setEditMode(null); 
                    setFormData({name: '', brand: '', price: '', pricePhp: '', condition: 'MISB', description: '', status: 'Available', imageUrl: '', isFeatured: false});
                    setImageFile(null);
                  }}
                  className="w-full bg-gray-200 text-gray-600 font-bold py-3 rounded-xl"
                >
                  CANCEL EDIT
                </button>
              )}
            </form>
          </div>
        </div>

        {/* LIST BARANG */}
        <div className="lg:col-span-2 space-y-4">
           {products.map((product) => (
             <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center group hover:border-cyan-200 transition-colors">
                <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden relative flex-shrink-0">
                  {product.image_url ? (
                    <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-black group-hover:text-cyan-600">{product.name}</h3>
                      <p className="text-xs text-gray-500">{product.brand} • {product.condition}</p>
                    </div>
                    <div className="flex gap-2">
                       {product.is_featured && <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-full">★ FEATURED</span>}
                       <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                         product.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                       }`}>
                         {product.status}
                       </span>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-4 text-sm font-mono text-gray-700">
                    <span>Rp {product.price.toLocaleString()}</span>
                    {product.price_php && <span className="text-gray-400">| ₱ {product.price_php.toLocaleString()}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button onClick={() => handleEdit(product)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg text-xs font-bold">EDIT</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg text-xs font-bold">DEL</button>
                </div>
             </div>
           ))}
        </div>

      </div>
    </main>
  );
}