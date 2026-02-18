'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Save, Loader2, Globe, Facebook, Mail, Phone, DollarSign } from 'lucide-react';

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    exchange_rate: 280,
    contact_email: '',
    contact_wa: '',
    facebook_link: '',
    instagram_link: ''
  });

  // 1. FETCH DATA SAAT DIBUKA
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      // Ambil data ID 1
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (data) {
        setFormData({
          exchange_rate: data.exchange_rate || 280,
          contact_email: data.contact_email || '',
          contact_wa: data.contact_wa || '',
          facebook_link: data.facebook_link || '',
          instagram_link: data.instagram_link || ''
        });
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  // 2. SIMPAN PERUBAHAN
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('settings')
      .upsert({ id: 1, ...formData }); // Selalu update ID 1

    if (error) {
      alert('Failed to save settings: ' + error.message);
    } else {
      alert('Settings Updated Successfully! ✅');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-center">Loading Configuration...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-2xl font-black text-black mb-2">GLOBAL CONFIGURATION</h2>
        <p className="text-gray-400 text-sm">Manage currency rates and social links from one place.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* PANEL 1: CURRENCY */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <DollarSign className="text-green-600" /> Currency / Kurs
          </h3>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
            This rate will be used to auto-calculate IDR prices when you input new products.
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">1 PHP = ... IDR</label>
            <input 
              type="number" 
              className="w-full p-4 border border-gray-200 rounded-xl font-mono text-xl font-bold focus:border-black outline-none"
              value={formData.exchange_rate}
              onChange={e => setFormData({...formData, exchange_rate: Number(e.target.value)})}
            />
          </div>
        </div>

        {/* PANEL 2: CONTACT & SOCIALS */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Globe className="text-blue-600" /> Contacts & Links
          </h3>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase flex items-center gap-2"><Mail size={12}/> Email Address</label>
            <input type="text" className="w-full p-3 border rounded-xl"
              value={formData.contact_email} onChange={e => setFormData({...formData, contact_email: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase flex items-center gap-2"><Phone size={12}/> WhatsApp (Start with 62)</label>
            <input type="text" className="w-full p-3 border rounded-xl" placeholder="62812345678"
              value={formData.contact_wa} onChange={e => setFormData({...formData, contact_wa: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase flex items-center gap-2"><Facebook size={12}/> Facebook Link</label>
            <input type="text" className="w-full p-3 border rounded-xl" placeholder="https://facebook.com/..."
              value={formData.facebook_link} onChange={e => setFormData({...formData, facebook_link: e.target.value})} />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="md:col-span-2">
          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-black text-white py-4 rounded-xl font-black text-lg hover:bg-gray-800 transition-all flex justify-center items-center gap-2 shadow-lg"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save />} 
            {saving ? 'UPDATING SYSTEM...' : 'SAVE CONFIGURATION'}
          </button>
        </div>

      </form>
    </div>
  );
}