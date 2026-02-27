'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Send, Loader2, CheckCircle, ShieldAlert } from 'lucide-react';

export default function RequestForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    item_name: '',
    series: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- VALIDASI MANUAL ---
    // 1. Cek panjang input (Security dasar biar ga dispam text panjang)
    if (formData.name.length < 2) return alert("Name is too short!");
    if (formData.item_name.length < 3) return alert("Please clarify the item name.");
    
    // 2. Cek apakah contact mengandung angka/email (Basic check)
    const isPhone = /^[0-9+ \-]+$/.test(formData.contact);
    const isEmail = formData.contact.includes('@');
    if (!isPhone && !isEmail && formData.contact.length < 5) {
        return alert("Please enter a valid Phone Number or Email.");
    }

    setLoading(true);

    const { error } = await supabase
      .from('requests')
      .insert([{
        name: formData.name,
        contact: formData.contact,
        item_name: formData.item_name,
        series: formData.series,
        notes: formData.notes,
        status: 'Pending'
      }]);

    if (error) {
      alert(`Failed: ${error.message}`);
    } else {
      setSuccess(true);
      setFormData({ name: '', contact: '', item_name: '', series: '', notes: '' });
      setTimeout(() => setSuccess(false), 5000);
    }
    setLoading(false);
  };

  return (
    <section id="request" className="py-20 bg-black text-white scroll-mt-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-cyan-400 font-bold tracking-widest text-xs uppercase mb-2 block">Can't find what you're looking for?</span>
          <h2 className="text-4xl font-black tracking-tighter">REQUEST AN ARTIFACT</h2>
          <p className="text-gray-400 mt-4">We act as your personal hunter. Tell us what you need.</p>
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
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Your Name <span className="text-red-500">*</span></label>
                <input 
                  required
                  minLength={2}
                  maxLength={50}
                  type="text" 
                  className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-colors"
                  placeholder="Collector Name"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Contact (WA / Email) <span className="text-red-500">*</span></label>
                <input 
                  required
                  minLength={5}
                  maxLength={100}
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
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Item Name <span className="text-red-500">*</span></label>
                <input 
                  required
                  minLength={3}
                  maxLength={100}
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
                  maxLength={100}
                  type="text" 
                  className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-colors"
                  placeholder="e.g. Attack on Titan"
                  value={formData.series}
                  onChange={e => setFormData({...formData, series: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Additional Notes</label>
              <textarea 
                rows={3}
                maxLength={500}
                className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-colors"
                placeholder="Specific condition (MISB/BIB), budget range, etc."
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
              {loading ? 'SEND SECURE REQUEST' : 'SEND REQUEST'}
            </button>
            <p className="text-center text-[10px] text-gray-500 flex items-center justify-center gap-1">
               <ShieldAlert size={10}/> Your data is securely sent to our hunting team only.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}