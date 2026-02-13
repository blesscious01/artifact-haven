'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import Image from 'next/image';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  // State Form Produk
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('MISB');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Available');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // --- STATE BARU: PENGATURAN KONTAK ---
  const [configMessenger, setConfigMessenger] = useState('');
  const [configEmail, setConfigEmail] = useState('');
  const [loadingConfig, setLoadingConfig] = useState(false);

  const handleLogin = () => {
    if (password === 'artifact2025') {
      setIsAuthenticated(true);
      fetchProducts();
      fetchSettings(); // <-- Ambil settingan juga pas login
    } else {
      alert('Password salah!');
    }
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  // --- FUNGSI BARU: AMBIL & UPDATE SETTINGS ---
  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*');
    if (data) {
      const msg = data.find((s: any) => s.key === 'messenger_username')?.value;
      const email = data.find((s: any) => s.key === 'admin_email')?.value;
      setConfigMessenger(msg || '');
      setConfigEmail(email || '');
    }
  };

  const handleUpdateSettings = async () => {
    setLoadingConfig(true);
    try {
      // Update Username Messenger
      await supabase.from('site_settings').upsert({ key: 'messenger_username', value: configMessenger });
      // Update Email Admin
      await supabase.from('site_settings').upsert({ key: 'admin_email', value: configEmail });
      
      alert('KONTAK BERHASIL DIUPDATE! Semua tombol di website sekarang mengarah ke sini.');
    } catch (error: any) {
      alert('Gagal update: ' + error.message);
    } finally {
      setLoadingConfig(false);
    }
  };

  // --- FUNGSI PRODUK (SAMA SEPERTI SEBELUMNYA) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }

      const productData: any = { name, brand, price: parseInt(price), condition, description, status };
      if (imageUrl) productData.image_url = imageUrl;

      if (editId) {
        await supabase.from('products').update(productData).eq('id', editId);
        alert('Produk diperbarui!');
      } else {
        await supabase.from('products').insert([{ ...productData, image_url: imageUrl || '/logo-ah.png' }]);
        alert('Produk ditambahkan!');
      }
      resetForm();
      fetchProducts();
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin hapus?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  const startEdit = (product: any) => {
    setEditId(product.id);
    setName(product.name);
    setBrand(product.brand);
    setPrice(product.price.toString());
    setCondition(product.condition);
    setDescription(product.description);
    setStatus(product.status);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditId(null);
    setName('');
    setBrand('');
    setPrice('');
    setDescription('');
    setImageFile(null);
    setStatus('Available');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h2 className="text-2xl font-black text-center mb-6 tracking-tighter">ARTIFACT ADMIN</h2>
          <input type="password" placeholder="Enter Admin PIN" className="w-full border-2 p-4 rounded-xl mb-4 text-center text-2xl font-bold tracking-[0.5em] outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin} className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-cyan-600 transition-all uppercase tracking-widest">Unlock Access</button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 pb-20">
      <div className="bg-black text-white p-6 shadow-xl sticky top-0 z-50 flex justify-between items-center">
        <h1 className="font-black tracking-tighter text-xl">COMMAND CENTER</h1>
        <button onClick={() => window.location.reload()} className="text-xs font-bold border border-white/30 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all">LOGOUT</button>
      </div>

      <div className="container mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* KOLOM KIRI: FORM + SETTINGS */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Form Produk */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
            <h2 className="font-black text-xl mb-6 uppercase tracking-tight">{editId ? 'Edit Artifact' : 'Add New Artifact'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* (Isi form produk sama seperti sebelumnya) */}
              <div><label className="text-[10px] font-bold text-gray-400 uppercase">Image</label><input type="file" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} className="w-full text-xs mt-1" /></div>
              <input required type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-gray-50 rounded-lg border outline-none" />
              <input required type="text" placeholder="Brand" value={brand} onChange={e => setBrand(e.target.value)} className="w-full p-3 bg-gray-50 rounded-lg border outline-none" />
              <input required type="number" placeholder="Price (IDR)" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-3 bg-gray-50 rounded-lg border outline-none" />
              <div className="grid grid-cols-2 gap-2">
                <select value={condition} onChange={e => setCondition(e.target.value)} className="p-3 bg-gray-50 rounded-lg border outline-none text-sm"><option value="MISB">MISB</option><option value="BIB">BIB</option><option value="LOOSE">LOOSE</option></select>
                <select value={status} onChange={e => setStatus(e.target.value)} className="p-3 bg-gray-50 rounded-lg border outline-none text-sm font-bold text-cyan-600"><option value="Available">Available</option><option value="Sold Out">Sold Out</option><option value="Hidden">Hidden</option></select>
              </div>
              <textarea placeholder="Description" rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-gray-50 rounded-lg border outline-none text-sm"></textarea>
              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="flex-1 bg-black text-white font-bold py-4 rounded-xl hover:bg-cyan-600 transition-all uppercase text-xs tracking-widest">{loading ? 'Processing...' : editId ? 'Update' : 'Publish'}</button>
                {editId && <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-600 font-bold px-4 rounded-xl hover:bg-gray-300">X</button>}
              </div>
            </form>
          </div>

          {/* --- SETTING KONTAK (BARU) --- */}
          <div className="bg-cyan-50 p-6 rounded-3xl border border-cyan-100">
            <h3 className="font-black text-sm mb-4 text-cyan-800 uppercase tracking-widest flex items-center gap-2">
              ⚙️ Global Store Settings
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-cyan-600 uppercase">FB Messenger Username</label>
                <input 
                  type="text" 
                  placeholder="e.g. ArtifactHavenFigure" 
                  value={configMessenger} 
                  onChange={e => setConfigMessenger(e.target.value)} 
                  className="w-full p-2 text-sm rounded border border-cyan-200 focus:border-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-cyan-600 uppercase">Admin Email Address</label>
                <input 
                  type="email" 
                  placeholder="e.g. contact@artifacthaven.com" 
                  value={configEmail} 
                  onChange={e => setConfigEmail(e.target.value)} 
                  className="w-full p-2 text-sm rounded border border-cyan-200 focus:border-cyan-500 outline-none"
                />
              </div>
              <button 
                onClick={handleUpdateSettings}
                disabled={loadingConfig}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold py-3 rounded-lg uppercase tracking-widest transition-all shadow-sm"
              >
                {loadingConfig ? 'Saving...' : 'Save Contact Info'}
              </button>
              <p className="text-[10px] text-cyan-600/60 text-center italic">
                *Mengubah ini akan mengupdate tombol kontak di seluruh produk.
              </p>
            </div>
          </div>

        </div>

        {/* KOLOM KANAN: TABEL (SAMA) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr><th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th><th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th><th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th><th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-12 h-12 relative bg-gray-100 rounded-lg overflow-hidden border border-gray-100"><Image src={p.image_url || '/logo-ah.png'} alt="" fill className="object-cover" /></div>
                      <div><p className="font-bold text-sm text-gray-900 leading-none mb-1">{p.name}</p><p className="text-[10px] text-gray-400 uppercase tracking-tighter">{p.brand} • {p.condition}</p></div>
                    </td>
                    <td className="p-4 font-black text-sm">Rp {p.price?.toLocaleString('id-ID')}</td>
                    <td className="p-4"><span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${p.status === 'Available' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{p.status}</span></td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => startEdit(p)} className="text-[10px] font-bold text-cyan-600 hover:underline">EDIT</button>
                      <button onClick={() => handleDelete(p.id)} className="text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors">DELETE</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}