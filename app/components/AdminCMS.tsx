'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Save, Loader2, LayoutTemplate } from 'lucide-react';

export default function AdminCMS() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [content, setContent] = useState({
    hero_title: '',
    hero_subtitle: '',
    about_us_text: ''
  });

  // Fetch Data Saat Load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data } = await supabase.from('website_content').select('*').single();
      if (data) {
        setContent({
          hero_title: data.hero_title || '',
          hero_subtitle: data.hero_subtitle || '',
          about_us_text: data.about_us_text || ''
        });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Simpan Data
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('website_content').upsert({ id: 1, ...content });
    
    if (error) alert('Error: ' + error.message);
    else alert('Website Content Updated! 🎨');
    
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-center">Loading Editor...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-black mb-2 flex items-center gap-2">
           <LayoutTemplate /> WEBSITE EDITOR
        </h2>
        <p className="text-gray-400 text-sm">Edit text and content visible on your homepage.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 gap-6">
        {/* HERO SECTION */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4 text-black border-b pb-2">Hero Section (Banner Depan)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Main Title</label>
              <input type="text" className="w-full p-4 border border-gray-200 rounded-xl font-black text-xl"
                value={content.hero_title} onChange={e => setContent({...content, hero_title: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Subtitle</label>
              <input type="text" className="w-full p-3 border border-gray-200 rounded-xl"
                value={content.hero_subtitle} onChange={e => setContent({...content, hero_subtitle: e.target.value})} />
            </div>
          </div>
        </div>

        {/* ABOUT US SECTION */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4 text-black border-b pb-2">About Us Content</h3>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Story / Description</label>
            <textarea rows={6} className="w-full p-4 border border-gray-200 rounded-xl leading-relaxed"
              value={content.about_us_text} onChange={e => setContent({...content, about_us_text: e.target.value})} />
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full bg-black text-white py-4 rounded-xl font-black text-lg hover:bg-gray-800 transition-all flex justify-center items-center gap-2">
          {saving ? <Loader2 className="animate-spin" /> : <Save />} 
          {saving ? 'PUBLISHING...' : 'PUBLISH CHANGES'}
        </button>
      </form>
    </div>
  );
}