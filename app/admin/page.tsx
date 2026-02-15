'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import AdminSidebar from '@/app/components/AdminSidebar';

// Placeholder Component untuk Konten yang belum jadi
const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl m-10">
    <div className="text-6xl mb-4">🚧</div>
    <h2 className="text-2xl font-bold text-gray-300">MODULE: {title}</h2>
    <p className="text-sm">Under Construction</p>
  </div>
);

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // Default Tab
  const router = useRouter();

  // --- LOGIN SYSTEM ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === 'artifact2025') {
      setIsAuthenticated(true);
      // Simpan sesi login sementara (opsional, biar refresh gak logout)
      sessionStorage.setItem('admin_auth', 'true');
    } else {
      alert('ACCESS DENIED: PIN Salah!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    setPin('');
  };

  // Cek sesi login saat halaman dibuka
  useEffect(() => {
    const session = sessionStorage.getItem('admin_auth');
    if (session === 'true') setIsAuthenticated(true);
  }, []);

  // --- RENDER LOGIN PAGE (JIKA BELUM LOGIN) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <form onSubmit={handleLogin} className="bg-black p-10 rounded-3xl shadow-2xl w-full max-w-sm border border-gray-800 text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-widest text-cyan-400 mb-2">ARTIFACT HAVEN</h1>
            <p className="text-xs text-gray-500 font-mono">SECURE ADMIN TERMINAL</p>
          </div>
          <input 
            type="password" placeholder="ENTER PIN CODE" 
            className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl mb-6 text-center text-white text-lg tracking-[1em] focus:outline-none focus:border-cyan-500 transition-colors"
            value={pin} onChange={(e) => setPin(e.target.value)}
            maxLength={12}
          />
          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white p-4 rounded-xl font-bold tracking-widest transition-transform active:scale-95">
            UNLOCK
          </button>
        </form>
      </div>
    );
  }

  // --- RENDER DASHBOARD UTAMA (JIKA SUDAH LOGIN) ---
  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* 1. SIDEBAR KIRI */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

      {/* 2. KONTEN KANAN (MAIN AREA) */}
      <main className="flex-1 ml-64 p-10 overflow-y-auto h-screen">
        
        {/* Header Konten */}
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-black uppercase">{activeTab} MODULE</h2>
            <p className="text-gray-400 text-sm">Control Panel / {activeTab}</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-gray-400">LOGGED IN AS</p>
            <p className="font-mono text-sm text-black">SUPER ADMIN</p>
          </div>
        </header>

        {/* Isi Konten Berubah Sesuai Tab */}
        <div className="bg-white rounded-[2rem] shadow-sm min-h-[500px] border border-gray-100 overflow-hidden relative">
          
          {/* LOGIC SWITCH TAB */}
          {activeTab === 'dashboard' && (
            <div className="p-10">
              <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-cyan-200">
                  <h3 className="text-xs font-bold opacity-70 mb-1">TOTAL REVENUE</h3>
                  <p className="text-3xl font-black">Rp 0</p>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-2xl text-black">
                   <h3 className="text-xs font-bold text-gray-400 mb-1">PENDING ORDERS</h3>
                   <p className="text-3xl font-black">0</p>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-2xl text-black">
                   <h3 className="text-xs font-bold text-gray-400 mb-1">NEW REQUESTS</h3>
                   <p className="text-3xl font-black">0</p>
                </div>
              </div>
              <ComingSoon title="STATISTICS & OVERVIEW" />
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="p-10">
               {/* Nanti kita pindahkan kodingan tabel produk lama ke sini */}
               <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl mb-6 text-sm">
                 ⚠️ <b>Modul Inventory sedang direnovasi.</b> <br/>
                 Fitur Upload Banyak Foto & Kategori akan dipasang di sini pada update berikutnya.
               </div>
               <ComingSoon title="INVENTORY MANAGEMENT V2" />
            </div>
          )}

          {activeTab === 'orders' && <ComingSoon title="SALES & INVOICING" />}
          
          {activeTab === 'requests' && <ComingSoon title="KANBAN BOARD" />}
          
          {activeTab === 'cms' && <ComingSoon title="WEBSITE EDITOR" />}
          
          {activeTab === 'settings' && <ComingSoon title="GLOBAL CONFIG" />}

        </div>
      </main>
    </div>
  );
}