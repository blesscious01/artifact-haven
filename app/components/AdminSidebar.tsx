'use client';

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
};

export default function AdminSidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', desc: 'Overview & Stats' },
    { id: 'inventory', label: '📦 Inventory', desc: 'Manage Products' },
    { id: 'orders',    label: '🧾 Orders',    desc: 'Sales & Invoices' },
    { id: 'requests',  label: '🎯 Requests',  desc: 'Hunting Board' },
    { id: 'cms',       label: '🎨 Website',   desc: 'Content & Design' },
    { id: 'settings',  label: '⚙️ Settings',  desc: 'Global Config' },
  ];

  return (
    <aside className="w-64 bg-black text-white h-screen fixed left-0 top-0 overflow-y-auto flex flex-col shadow-2xl z-50">
      {/* 1. Header Sidebar */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-black tracking-tighter text-cyan-400">ARTIFACT <br/> HAVEN</h1>
        <p className="text-[10px] text-gray-500 font-mono mt-1">OPERATING SYSTEM v2.0</p>
      </div>

      {/* 2. Menu Navigasi */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
              activeTab === item.id 
                ? 'bg-white text-black font-bold shadow-lg transform scale-105' 
                : 'text-gray-400 hover:bg-gray-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3 relative z-10">
              <span className="text-lg">{item.label.split(' ')[0]}</span>
              <div>
                <span className="block text-sm">{item.label.split(' ').slice(1).join(' ')}</span>
                <span className={`text-[9px] block ${activeTab === item.id ? 'text-gray-500' : 'text-gray-600 group-hover:text-gray-400'}`}>
                  {item.desc}
                </span>
              </div>
            </div>
          </button>
        ))}
      </nav>

      {/* 3. Footer Sidebar (Logout) */}
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={onLogout}
          className="w-full py-3 px-4 bg-red-900/20 text-red-400 hover:bg-red-900/50 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
        >
          🔒 LOCK SYSTEM
        </button>
      </div>
    </aside>
  );
}