'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Send, Loader2, CheckCircle } from 'lucide-react';

export default function RequestForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    contact: '', // Email or WA
    item_name: '',
    series: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('requests')
      .insert([
        {
          name: formData.name,
          contact: formData.contact,
          item_name: formData.item_name, // Pastikan ini match dengan database
          series: formData.series,
          notes: formData.notes,
          status: 'Pending'
        }
      ]);

    if (error) {
      // TAMPILKAN PESAN ERROR ASLI DARI SUPABASE
      alert(`Gagal kirim: ${error.message || error.details || JSON.stringify(error)}`);
      console.error("Supabase Error Detail:", error); 
    } else {
      setSuccess(true);
      setFormData({ name: '', contact: '', item_name: '', series: '', notes: '' });
      setTimeout(() => setSuccess(false), 5000);
    }
    setLoading(false);
  };

  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-cyan-400 font-bold tracking-widest text-xs uppercase mb-2 block">Can't find what you're looking for?</span>
          <h2 className="text-4xl font-black tracking-tighter">REQUEST AN ARTIFACT</h2>
          <p className="text-gray-400 mt-4">We act as your personal hunter in Japan. Tell us what you need.</p>
        </div>

        {success ? (
          <div className="bg-green-900/50 border border-green-500 p-8 rounded-2xl text-center animate-pulse">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-2xl font-bold text-green-400">Request Received!</h3>
            <p className="text-gray-300">We will hunt for this item and contact you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Your Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-colors"
                  placeholder="Collector Name"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Contact (WA / Email)</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-colors"
                  placeholder="+62... or email@..."
                  value={formData.contact}
                  onChange={e => setFormData({...formData, contact: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Item Name / Character</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-colors"
                  placeholder="e.g. Nendoroid Mikasa Ackerman"
                  value={formData.item_name}
                  onChange={e => setFormData({...formData, item_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Series (Optional)</label>
                <input 
                  type="text" 
                  className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-colors"
                  placeholder="e.g. Attack on Titan"
                  value={formData.series}
                  onChange={e => setFormData({...formData, series: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Additional Notes (Budget, Condition, etc.)</label>
              <textarea 
                rows={3}
                className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-colors"
                placeholder="I prefer MISB condition, budget around IDR 800k..."
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-black py-4 rounded-xl text-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              {loading ? 'SENDING...' : 'SEND REQUEST'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}