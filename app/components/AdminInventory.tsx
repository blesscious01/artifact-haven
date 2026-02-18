'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Product } from '../types'; 
import { Trash2, Edit, Plus, Search, X, Image as ImageIcon } from 'lucide-react';

const CATEGORIES = ['Anime Figure', 'Game Character', 'Original Character', 'Mecha/Robot', 'Other'];
const BRANDS = ['Good Smile Company', 'Alter', 'Kotobukiya', 'Max Factory', 'Bandai', 'Sega', 'Taito', 'FuRyu', 'Other'];
const CONDITIONS = ['MISB', 'BIB', 'Loose', 'Back in Box'];

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 🔥 TAMBAHAN BARU: State untuk Kurs
  const [exchangeRate, setExchangeRate] = useState(280); 

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', series: '', brand: 'Good Smile Company', category: 'Anime Figure',
    price: 0, price_php: 0, cost_price: 0, 
    condition: 'MISB', status: 'Available', 
    description: '', image_url: '', gallery_urls: [], 
    is_negotiable: false, is_featured: false
  });

  // 1. FETCH DATA PRODUK
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error) setProducts(data || []);
    setLoading(false);
  };

  // 🔥 TAMBAHAN BARU: Fetch Kurs dari Settings
  const fetchRate = async () => {
    const { data } = await supabase.from('settings').select('exchange_rate').single();
    if (data?.exchange_rate) {
      setExchangeRate(data.exchange_rate);
    }
  };

  useEffect(() => { 
    fetchProducts(); 
    fetchRate(); // Panggil fungsi ambil kurs
  }, []);

  // --- THE SUPER SEARCH LOGIC ---
  const filteredProducts = products.filter(p => {
    const search = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(search) ||
      p.series?.toLowerCase().includes(search) ||
      p.brand?.toLowerCase().includes(search) ||
      p.category?.toLowerCase().includes(search)
    );
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const files = Array.from(e.target.files);
    const newUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
      if (!uploadError) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        newUrls.push(data.publicUrl);
      }
    }

    if (isGallery) {
      const updatedGallery = [...(formData.gallery_urls || []), ...newUrls];
      setFormData(prev => ({ ...prev, gallery_urls: updatedGallery, image_url: prev.image_url ? prev.image_url : newUrls[0] }));
    } else {
      setFormData(prev => ({ ...prev, image_url: newUrls[0] }));
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const { error } = await supabase.from('products').upsert(formData as any);
      if (error) throw error;
      alert('Success! Saved.');
      setIsFormOpen(false);
      fetchProducts(); 
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product: Product) => { setFormData(product); setIsFormOpen(true); };
  const handleAddNew = () => {
    setFormData({
      name: '', series: '', brand: 'Good Smile Company', category: 'Anime Figure',
      price: 0, price_php: 0, cost_price: 0,
      condition: 'MISB', status: 'Available',
      description: '', image_url: '', gallery_urls: [],
      is_negotiable: false, is_featured: false
    });
    setIsFormOpen(true);
  };

  if (isFormOpen) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="text-2xl font-black">{formData.id ? 'EDIT ARTIFACT' : 'NEW ARTIFACT'}</h2>
          <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Artifact Name</label>
              <input type="text" required className="w-full p-3 border rounded-xl"
                placeholder="e.g. Hatsune Miku 1/7 Scale"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-blue-600">Series / Title (Very important for search!)</label>
              <input type="text" className="w-full p-3 border border-blue-200 rounded-xl bg-blue-50"
                placeholder="e.g. Naruto, One Piece, Genshin Impact"
                value={formData.series} onChange={e => setFormData({...formData, series: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Category</label>
              <select className="w-full p-3 border rounded-xl" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Brand</label>
              <select className="w-full p-3 border rounded-xl" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})}>
                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Condition</label>
              <select className="w-full p-3 border rounded-xl" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea rows={3} className="w-full p-3 border rounded-xl" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Selling Price (PHP)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 text-xs font-bold">₱</span>
                <input type="number" className="w-full p-2 pl-8 border border-blue-200 bg-blue-50 rounded-lg font-mono font-bold"
                  value={formData.price_php || ''} 
                  onChange={e => {
                    const valPHP = Number(e.target.value);
                    const autoIDR = valPHP * exchangeRate; // 🔥 SKRG SUDAH AMAN
                    
                    setFormData({
                      ...formData, 
                      price_php: valPHP,
                      price: autoIDR 
                    });
                  }} 
                />
              </div>
              <p className="text-[9px] text-blue-500 mt-1">*Auto-IDR rate: x{exchangeRate}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Selling Price (IDR)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">Rp</span>
                <input type="number" className="w-full p-2 pl-10 border border-gray-300 rounded-lg font-mono font-bold"
                  value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-red-500 mb-1">Cost Price (PHP)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-300 text-xs font-bold">₱</span>
                <input type="number" className="w-full p-2 pl-8 border border-red-200 bg-red-50 rounded-lg font-mono text-red-600"
                  value={formData.cost_price || ''} onChange={e => setFormData({...formData, cost_price: Number(e.target.value)})} />
              </div>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
            <h3 className="font-bold mb-4">Gallery & Cover (Click photo to set Cover)</h3>
            <div className="flex flex-wrap gap-4">
              {formData.gallery_urls?.map((url, idx) => (
                <div key={idx} onClick={() => setFormData({...formData, image_url: url})} className={`relative cursor-pointer transition-all ${formData.image_url === url ? 'ring-4 ring-black scale-105 z-10' : 'opacity-60'}`}>
                  <img src={url} className="h-20 w-20 object-cover rounded-lg bg-white" />
                  {formData.image_url === url && <span className="absolute -top-2 -left-2 bg-black text-white text-[8px] font-bold px-2 py-1 rounded-full">COVER</span>}
                </div>
              ))}
              <label className="h-20 w-20 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
                <ImageImageIcon className="text-gray-400" />
                <input type="file" multiple onChange={(e) => handleImageUpload(e, true)} className="hidden"/>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl">
             <div>
               <label className="block text-sm font-bold mb-2">Visibility Status</label>
               <select className="w-full p-3 border border-gray-300 rounded-xl font-bold" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} >
                 <option value="Available">🟢 Available</option>
                 <option value="Sold Out">🔴 Sold Out</option>
                 <option value="Hidden">👻 Hidden</option>
               </select>
             </div>
             <div className="flex flex-col gap-2 justify-center">
                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded-lg">
                  <input type="checkbox" checked={formData.is_negotiable} onChange={e => setFormData({...formData, is_negotiable: e.target.checked})} className="w-5 h-5 accent-green-600" /> 
                  <span className="font-medium text-gray-700">Negotiable?</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded-lg">
                  <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="w-5 h-5 accent-yellow-500" /> 
                  <span className="font-medium text-gray-700">Featured?</span>
                </label>
             </div>
          </div>

          <button type="submit" disabled={uploading} className="w-full bg-black text-white py-4 rounded-xl font-black text-lg hover:bg-gray-800 transition-all">
            {uploading ? 'SAVING...' : 'SAVE ARTIFACT'}
          </button>
        </form>
      </div>
    );
  }

  // --- TABEL DATA ---
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-2xl font-black">INVENTORY LOG</h2>
        <button onClick={handleAddNew} className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Plus size={18} /> ADD NEW</button>
      </div>

      <div className="px-8 py-4 bg-gray-50 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search by name, series, brand, or category..." className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-wider">
            <tr>
              <th className="p-6">Name & Series</th>
              <th className="p-6">Cat / Brand</th>
              <th className="p-6">Price (PHP)</th>
              <th className="p-6">Price (IDR)</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-6">
                  <div className="font-bold text-black">{p.name}</div>
                  <div className="text-xs text-blue-500 font-bold uppercase">{p.series || 'No Series'}</div>
                  {p.is_featured && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full mr-1">Featured</span>}
                  {p.is_negotiable && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Nego</span>}
                </td>
                <td className="p-6">
                  <span className="block text-sm">{p.category}</span>
                  <span className="text-[10px] text-gray-400 uppercase">{p.brand}</span>
                </td>
                <td className="p-6 font-mono font-bold text-blue-600">₱ {p.price_php?.toLocaleString()}</td>
                <td className="p-6 font-mono text-gray-500">Rp {p.price.toLocaleString()}</td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${p.status === 'Available' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{p.status}</span>
                </td>
                <td className="p-6 text-right space-x-2">
                  <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                  <button onClick={() => {if(confirm('Delete?')) supabase.from('products').delete().eq('id', p.id).then(() => fetchProducts())}} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper untuk icon image
function ImageImageIcon({ className }: { className?: string }) {
  return <ImageIcon className={className} />;
}