'use client';
import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';

export default function RequestForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    figure: '',
    budget: '',
    currency: 'IDR' // Default currency
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('scouting_requests').insert([
      {
        name: formData.name,
        contact_info: formData.contact,
        figure_name: formData.figure,
        budget: formData.budget,
        currency: formData.currency // Kirim data mata uang
      }
    ]);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Request sent! We will find it for you.');
      setFormData({ name: '', contact: '', figure: '', budget: '', currency: 'IDR' });
    }
    setLoading(false);
  };

  return (
    <section id="request" className="bg-gray-900 py-20 px-6 mt-20 rounded-[3rem] mx-4 overflow-hidden relative mb-20">
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-4">CAN'T FIND YOUR ARTIFACT?</h2>
          <p className="text-gray-400">Let us scout the Japan & PH markets for you.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10">
          <input 
            required
            type="text" 
            placeholder="Your Name" 
            className="bg-white/10 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-cyan-500"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            required
            type="text" 
            placeholder="Contact (WA / Messenger)" 
            className="bg-white/10 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-cyan-500"
            value={formData.contact}
            onChange={(e) => setFormData({...formData, contact: e.target.value})}
          />
          <input 
            required
            type="text" 
            placeholder="Figure Name / Series" 
            className="bg-white/10 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-cyan-500 md:col-span-2"
            value={formData.figure}
            onChange={(e) => setFormData({...formData, figure: e.target.value})}
          />
          
          {/* INPUT BUDGET DENGAN PILIHAN MATA UANG */}
          <div className="md:col-span-2 flex gap-2">
            <select 
              className="bg-white/10 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-cyan-500 font-bold w-24"
              value={formData.currency}
              onChange={(e) => setFormData({...formData, currency: e.target.value})}
            >
              <option value="IDR" className="text-black">IDR</option>
              <option value="PHP" className="text-black">PHP</option>
            </select>
            <input 
              type="text" 
              placeholder="Estimated Budget (Optional)" 
              className="bg-white/10 border border-white/10 p-4 rounded-xl text-white w-full outline-none focus:border-cyan-500"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="md:col-span-2 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 rounded-xl transition-all uppercase tracking-widest disabled:bg-gray-700"
          >
            {loading ? 'SENDING...' : 'ACTIVATE SCOUTING'}
          </button>
        </form>
      </div>
    </section>
  );
}