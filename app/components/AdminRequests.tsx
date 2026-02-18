'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Trash2, CheckCircle, Search, Clock, CheckSquare } from 'lucide-react';

interface Request {
  id: string;
  created_at: string;
  name: string;
  contact: string;
  item_name: string;
  series: string;
  notes: string;
  status: 'Pending' | 'Found' | 'Completed';
}

export default function AdminRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('requests').update({ status: newStatus }).eq('id', id);
    fetchRequests();
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Delete this request?')) return;
    await supabase.from('requests').delete().eq('id', id);
    fetchRequests();
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-100">
        <h2 className="text-2xl font-black text-black">REQUEST HUNTER</h2>
        <p className="text-gray-400 text-sm">List of items customers are looking for.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-wider">
            <tr>
              <th className="p-6">Date</th>
              <th className="p-6">Customer</th>
              <th className="p-6">Target Item</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">Loading requests...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">No active requests.</td></tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 text-xs text-gray-400 font-mono">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-6">
                    <div className="font-bold text-black">{req.name}</div>
                    <div className="text-xs text-blue-600 cursor-pointer hover:underline" onClick={() => navigator.clipboard.writeText(req.contact).then(()=>alert('Copied!'))}>
                      {req.contact}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="font-bold text-lg text-black">{req.item_name}</div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{req.series || '-'}</div>
                    {req.notes && <div className="text-xs text-gray-400 italic bg-yellow-50 p-2 rounded border border-yellow-100 inline-block">"{req.notes}"</div>}
                  </td>
                  <td className="p-6">
                     <select 
                       value={req.status}
                       onChange={(e) => updateStatus(req.id, e.target.value)}
                       className={`text-xs font-bold px-3 py-1 rounded-full border-none outline-none cursor-pointer ${
                         req.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                         req.status === 'Found' ? 'bg-blue-100 text-blue-600' :
                         'bg-green-100 text-green-600'
                       }`}
                     >
                       <option value="Pending">⏳ Pending</option>
                       <option value="Found">🎯 Found</option>
                       <option value="Completed">✅ Completed</option>
                     </select>
                  </td>
                  <td className="p-6 text-right">
                    <button onClick={() => handleDelete(req.id)} className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
  );
}