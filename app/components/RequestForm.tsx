'use client';
import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';

export default function RequestForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    figure: '',
    budget: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('scouting_requests').insert([
      {
        name: formData.name,
        contact_info: formData.contact,
        figure_name: formData.figure,
        budget: formData.budget
      }
    ]);

    if (error) {
      alert('Gagal mengirim request: ' + error.message);
    } else {
      alert('Request berhasil dikirim! Kami akan segera mencarikan artifact untukmu.');
      setFormData({ name: '', contact: '', figure: '', budget: '' }); // Reset form
    }
    setLoading(false);
  };

  return (
    <section id="request" className="bg-gray-900 py-20 px-6 mt-20 rounded-[3rem] mx-4 overflow-hidden relative">
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-4">CAN'T FIND YOUR ARTIFACT?</h2>
          <p className="text-gray-400">Let us scout the Japan markets for you. Tell us what you're looking for.</p>
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
            placeholder="Contact (WA / Email)" 
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
          <input 
            type="text" 
            placeholder="Estimated Budget (Optional)" 
            className="bg-white/10 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-cyan-500 md:col-span-2"
            value={formData.budget}
            onChange={(e) => setFormData({...formData, budget: e.target.value})}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="md:col-span-2 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 rounded-xl transition-all uppercase tracking-widest disabled:bg-gray-700"
          >
            {loading ? 'SENDING REQUEST...' : 'ACTIVATE SCOUTING'}
          </button>
        </form>
      </div>
    </section>
  );
}