'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Plus, Trash2, Edit, CheckCircle, Clock, Truck, Package, MessageCircle, Facebook, Mail } from 'lucide-react';

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  contact_info: string;
  platform: 'WhatsApp' | 'Facebook' | 'Email' | 'Other'; // Tambahan: Asal Transaksi
  items_summary: string;
  total_price_php: number;
  total_price_idr: number;
  status: 'Pending' | 'Paid' | 'Shipped' | 'Done';
  notes: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // State Form Input
  const [formData, setFormData] = useState({
    customer_name: '',
    contact_info: '',
    platform: 'Facebook', // Default FB karena target market sana
    items_summary: '',
    total_price_php: 0,
    total_price_idr: 0,
    status: 'Pending',
    notes: ''
  });

  // 1. FETCH ORDERS
  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. SUBMIT ORDER BARU
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Insert data ke Supabase
    const { error } = await supabase.from('orders').insert([formData]);
    
    if (error) {
      alert('Error recording transaction: ' + error.message);
    } else {
      alert('Transaction Recorded Successfully! 🚀');
      setIsFormOpen(false);
      // Reset Form
      setFormData({ 
        customer_name: '', contact_info: '', platform: 'Facebook',
        items_summary: '', total_price_php: 0, total_price_idr: 0, 
        status: 'Pending', notes: ''
      });
      fetchOrders();
    }
  };

  // 3. DELETE ORDER
  const handleDelete = async (id: string) => {
    if(!confirm('Delete this transaction record?')) return;
    await supabase.from('orders').delete().eq('id', id);
    fetchOrders();
  };

  // 4. UPDATE STATUS
  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    fetchOrders();
  };

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-black">TRANSACTION LOG</h2>
          <p className="text-gray-400 text-sm">Manual entry for Chat-to-Buy orders.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all"
        >
          <Plus size={18} /> NEW TRANSACTION
        </button>
      </div>

      {/* FORM INPUT MODAL */}
      {isFormOpen && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-black animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            📝 Record New Sale
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Baris 1: Customer & Platform */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Platform</label>
                <select 
                  className="w-full p-3 border rounded-xl bg-gray-50"
                  value={formData.platform} 
                  onChange={e => setFormData({...formData, platform: e.target.value})}
                >
                  <option value="Facebook">Facebook</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Customer Name</label>
                <input type="text" required placeholder="e.g. John Doe" className="w-full p-3 border rounded-xl"
                  value={formData.customer_name} onChange={e => setFormData({...formData, customer_name: e.target.value})} />
              </div>
            </div>

            {/* Baris 2: Contact Info */}
            <div>
               <label className="text-xs font-bold text-gray-500 uppercase">Contact / Username</label>
               <input type="text" placeholder="e.g. @johndoe_collection or +62812..." className="w-full p-3 border rounded-xl"
                  value={formData.contact_info} onChange={e => setFormData({...formData, contact_info: e.target.value})} />
            </div>
            
            {/* Baris 3: Items */}
            <div>
               <label className="text-xs font-bold text-gray-500 uppercase">Items Purchased</label>
               <textarea required placeholder="e.g. 1x Nendoroid Miku, 1x Scale Albedo (Loose)" className="w-full p-3 border rounded-xl" rows={3}
                  value={formData.items_summary} onChange={e => setFormData({...formData, items_summary: e.target.value})} />
            </div>

            {/* Baris 4: Harga */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
               <div>
                 <label className="text-xs font-bold text-blue-600">Total Deal (PHP)</label>
                 <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 font-bold">₱</span>
                   <input type="number" className="w-full p-2 pl-8 border border-blue-200 rounded-lg font-mono font-bold text-blue-700"
                     value={formData.total_price_php || ''} 
                     onChange={e => {
                       const php = Number(e.target.value);
                       setFormData({...formData, total_price_php: php, total_price_idr: php * 280}); // Auto calc IDR
                     }} />
                 </div>
               </div>
               <div>
                 <label className="text-xs font-bold text-gray-500">Total Deal (IDR)</label>
                 <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                   <input type="number" className="w-full p-2 pl-10 border border-gray-300 rounded-lg font-mono"
                     value={formData.total_price_idr || ''} onChange={e => setFormData({...formData, total_price_idr: Number(e.target.value)})} />
                 </div>
               </div>
            </div>

            <div className="flex gap-4 pt-4">
               <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">CANCEL</button>
               <button type="submit" className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-200">SAVE RECORD</button>
            </div>
          </form>
        </div>
      )}

      {/* TABEL DATA */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-6">Date</th>
                <th className="p-6">Customer</th>
                <th className="p-6">Artifacts</th>
                <th className="p-6">Value</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                 <tr><td colSpan={6} className="p-8 text-center text-gray-400">No transactions recorded yet.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 text-xs text-gray-400 font-mono">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-black flex items-center gap-2">
                        {order.platform === 'Facebook' && <Facebook size={14} className="text-blue-600" />}
                        {order.platform === 'WhatsApp' && <MessageCircle size={14} className="text-green-500" />}
                        {order.platform === 'Email' && <Mail size={14} className="text-gray-500" />}
                        {order.customer_name}
                      </div>
                      <div className="text-xs text-gray-400 ml-5">{order.contact_info}</div>
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-medium text-gray-700 whitespace-pre-wrap">{order.items_summary}</p>
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-blue-600 font-mono">₱ {order.total_price_php?.toLocaleString()}</div>
                      <div className="text-xs text-gray-400 font-mono">Rp {order.total_price_idr?.toLocaleString()}</div>
                    </td>
                    <td className="p-6">
                       <select 
                         value={order.status}
                         onChange={(e) => updateStatus(order.id, e.target.value)}
                         className={`text-xs font-bold px-3 py-1 rounded-full border-none outline-none cursor-pointer ${
                           order.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                           order.status === 'Paid' ? 'bg-blue-100 text-blue-600' :
                           order.status === 'Shipped' ? 'bg-purple-100 text-purple-600' :
                           'bg-green-100 text-green-600'
                         }`}
                       >
                         <option value="Pending">⏳ Pending</option>
                         <option value="Paid">💰 Paid</option>
                         <option value="Shipped">🚚 Shipped</option>
                         <option value="Done">✅ Done</option>
                       </select>
                    </td>
                    <td className="p-6 text-right">
                      <button onClick={() => handleDelete(order.id)} className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}