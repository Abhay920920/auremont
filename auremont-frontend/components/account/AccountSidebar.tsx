import { Package, User, MapPin, Heart } from "lucide-react";

export type Tab = 'orders' | 'wishlist' | 'profile' | 'addresses';

interface AccountSidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  wishlistCount: number;
}

export default function AccountSidebar({ activeTab, setActiveTab, wishlistCount }: AccountSidebarProps) {
  const tabs = [
    { id: 'orders', label: 'Order History', icon: <Package size={18} strokeWidth={1.5} /> },
    { id: 'profile', label: 'My Profile', icon: <User size={18} strokeWidth={1.5} /> },
    { id: 'addresses', label: 'Saved Addresses', icon: <MapPin size={18} strokeWidth={1.5} /> },
    { id: 'wishlist', label: `My Wishlist (${wishlistCount})`, icon: <Heart size={18} strokeWidth={1.5} /> },
  ];

  return (
    <div className="w-full md:w-80 flex-shrink-0 flex md:flex-col overflow-x-auto scrollbar-hide gap-2 pb-2 md:pb-0">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as Tab)}
          className={`flex-shrink-0 whitespace-nowrap flex items-center gap-3 text-left px-4 md:px-6 py-3 md:py-4 rounded-sm transition-all duration-300 group text-xs md:text-sm
            ${activeTab === tab.id 
              ? 'bg-secondaryBg border border-luxuryGold text-primaryText shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
              : 'border border-divider text-secondaryText hover:bg-secondaryBg hover:text-primaryText hover:border-divider'
            }`}
        >
          <span className={`${activeTab === tab.id ? 'text-luxuryGold' : 'text-mutedText group-hover:text-luxuryGold'} transition-colors`}>
            {tab.icon}
          </span>
          <span className="font-medium tracking-wide">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
