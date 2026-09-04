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
    <div className="w-full flex lg:flex-col overflow-x-auto scrollbar-hide gap-2 p-1.5 bg-secondaryBg/60 border border-divider/70 rounded-xl lg:rounded-card lg:p-3 lg:bg-secondaryBg lg:border-divider">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex-shrink-0 whitespace-nowrap flex items-center gap-3 text-left px-4 lg:px-5 py-2.5 lg:py-3.5 rounded-lg transition-all duration-200 group text-xs sm:text-sm font-medium
              ${isActive 
                ? 'bg-luxuryGold/15 border border-luxuryGold/50 text-luxuryGold shadow-[0_0_20px_rgba(212,175,55,0.12)]' 
                : 'border border-transparent text-secondaryText hover:bg-background/80 hover:text-primaryText'
              }`}
          >
            <span className={`${isActive ? 'text-luxuryGold' : 'text-mutedText group-hover:text-luxuryGold'} transition-colors`}>
              {tab.icon}
            </span>
            <span className="tracking-wide">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
