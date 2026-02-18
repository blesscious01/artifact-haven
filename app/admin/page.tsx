'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase'; // Pastikan path ini benar
// Import Komponen
import AdminSidebar from '@/app/components/AdminSidebar';
import AdminInventory from '@/app/components/AdminInventory';
import AdminOrders from '@/app/components/AdminOrders';
import AdminRequests from '@/app/components/AdminRequests';
import AdminSettings from '../components/AdminSettings';

// Placeholder Component
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  // STATE UNTUK DASHBOARD STATS (DATA REAL)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingOrders: 0,
    newRequests: 0
  });

  // --- LOGIN SYSTEM ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === 'artifact2025') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      fetchDashboardStats(); // Ambil data pas login
    } else {
      alert('ACCESS DENIED: PIN Salah!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    setPin('');
  };

  // --- FUNGSI MENGHITUNG STATISTIK ---
  const fetchDashboardStats = async () => {
    try {
      // 1. Hitung Revenue (Hanya yang statusnya Paid, Shipped, atau Done)
      const { data: paidOrders } = await supabase
        .from('orders')
        .select('total_price_idr')
        .in('status', ['Paid', 'Shipped', 'Done']);
      
      const revenue = paidOrders?.reduce((sum, order) => sum + (order.total_price_idr || 0), 0) || 0;

      // 2. Hitung Pending Orders
      const { count: pendingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');

      // 3. Hitung New Requests (Pending)
      const { count: requestCount } = await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');

      setStats({
        totalRevenue: revenue,
        pendingOrders: pendingCount || 0,
        newRequests: requestCount || 0
      });

    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    const session = sessionStorage.getItem('admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
      fetchDashboardStats(); // Ambil data saat refresh
    }
  }, []);

  // --- RENDER LOGIN PAGE ---
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

  // --- RENDER DASHBOARD UTAMA ---
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
          
          {/* TAB: DASHBOARD (SEKARANG SUDAH HIDUP! ⚡) */}
          {activeTab === 'dashboard' && (
            <div className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                
                {/* KARTU 1: TOTAL REVENUE */}
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-cyan-200 transform hover:scale-105 transition-transform duration-300">
                  <h3 className="text-xs font-bold opacity-70 mb-1">TOTAL REVENUE (IDR)</h3>
                  <p className="text-3xl font-black tracking-tight">
                    Rp {stats.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-[10px] opacity-60 mt-2">*Paid & Shipped Orders</p>
                </div>

                {/* KARTU 2: PENDING ORDERS */}
                <div 
                  onClick={() => setActiveTab('orders')}
                  className="bg-white border border-gray-200 p-6 rounded-2xl text-black cursor-pointer hover:bg-gray-50 transition-colors group"
                >
                   <div className="flex justify-between items-start">
                     <div>
                        <h3 className="text-xs font-bold text-gray-400 mb-1 group-hover:text-blue-600">PENDING ORDERS</h3>
                        <p className="text-3xl font-black">{stats.pendingOrders}</p>
                     </div>
                     <span className="bg-orange-100 text-orange-600 p-2 rounded-lg">⏳</span>
                   </div>
                   <p className="text-[10px] text-gray-400 mt-2">Needs attention</p>
                </div>

                {/* KARTU 3: NEW REQUESTS */}
                <div 
                  onClick={() => setActiveTab('requests')}
                  className="bg-white border border-gray-200 p-6 rounded-2xl text-black cursor-pointer hover:bg-gray-50 transition-colors group"
                >
                   <div className="flex justify-between items-start">
                     <div>
                        <h3 className="text-xs font-bold text-gray-400 mb-1 group-hover:text-cyan-600">NEW REQUESTS</h3>
                        <p className="text-3xl font-black">{stats.newRequests}</p>
                     </div>
                     <span className="bg-purple-100 text-purple-600 p-2 rounded-lg">📩</span>
                   </div>
                   <p className="text-[10px] text-gray-400 mt-2">From website form</p>
                </div>

              </div>
              
              {/* Quick Actions / Shortcut */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                    <h3 className="font-bold text-lg mb-2">Quick Actions</h3>
                    <div className="flex gap-4">
                       <button onClick={() => setActiveTab('inventory')} className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800">Add Product</button>
                       <button onClick={() => setActiveTab('orders')} className="px-4 py-2 bg-white border border-gray-300 text-black rounded-lg text-sm font-bold hover:bg-gray-100">Record Sale</button>
                    </div>
                 </div>
                 <ComingSoon title="SALES ANALYTICS GRAPH" />
              </div>

            </div>
          )}

          {activeTab === 'inventory' && <div className="p-10"><AdminInventory /></div>}
          {activeTab === 'orders' && <div className="p-10"><AdminOrders /></div>}
          {activeTab === 'requests' && <div className="p-10"><AdminRequests /></div>}
          
          {activeTab === 'cms' && <ComingSoon title="WEBSITE EDITOR" />}
          {activeTab === 'settings' && (
            <div className="p-10">
              <AdminSettings />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}