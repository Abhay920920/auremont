"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useWishlistStore } from "@/store/wishlistStore";

import AccountSidebar, { Tab } from "@/components/account/AccountSidebar";
import OrderHistoryTab from "@/components/account/OrderHistoryTab";
import ProfileTab from "@/components/account/ProfileTab";
import AddressesTab from "@/components/account/AddressesTab";
import WishlistTab from "@/components/account/WishlistTab";
import ReserveTierCard from "@/components/account/ReserveTierCard";

export default function AccountDashboard() {
  const { user, setUser, logout } = useAuthStore();
  const { items: wishlistItems, loading: loadingWishlist } = useWishlistStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India', isDefault: false
  });
  const [addressMsg, setAddressMsg] = useState("");
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push("/login");
    } else if (mounted && user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || ''
      });
    }
  }, [mounted, user, router]);

  useEffect(() => {
    if (!mounted || !user) return;
    
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/me');
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    
    const fetchAddresses = async () => {
      try {
        const res = await api.get('/users/me/addresses');
        setAddresses(res.data);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchOrders();
    fetchAddresses();
  }, [mounted, user]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-32">
        <div className="text-center space-y-6">
          <div className="w-12 h-12 border border-luxuryGold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-primaryText font-serif tracking-widest uppercase">Loading Profile</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    logout();
    router.push("/login");
  };

  // Profile Methods
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileMsg("");
    try {
      const res = await api.patch('/users/me', profileForm);
      setUser(res.data);
      setProfileMsg("Profile updated successfully.");
    } catch (err: any) {
      setProfileMsg(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Address Methods
  const fetchAddresses = async () => {
    try {
      const res = await api.get('/users/me/addresses');
      setAddresses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    setAddressMsg("");
    try {
      if (editingAddressId) {
        await api.patch(`/users/me/addresses/${editingAddressId}`, addressForm);
      } else {
        await api.post('/users/me/addresses', addressForm);
      }
      setShowAddressForm(false);
      fetchAddresses();
    } catch (err: any) {
      setAddressMsg(err.response?.data?.message || "Failed to save address.");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleEditAddress = (addr: any) => {
    setAddressForm({
      fullName: addr.fullName, phone: addr.phone, addressLine1: addr.addressLine1, addressLine2: addr.addressLine2 || '',
      city: addr.city, state: addr.state, postalCode: addr.postalCode, country: addr.country, isDefault: addr.isDefault
    });
    setEditingAddressId(addr.id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await api.delete(`/users/me/addresses/${id}`);
      setAddressMsg("Address removed.");
      fetchAddresses();
    } catch (err: any) {
      setAddressMsg(err.response?.data?.message || "Failed to delete address");
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await api.patch(`/users/me/addresses/${id}/default`);
      setAddressMsg("Default address updated.");
      fetchAddresses();
    } catch (err: any) {
      setAddressMsg(err.response?.data?.message || "Failed to set default address");
    }
  };

  return (
    <div className="w-full min-h-screen bg-background pt-32 pb-24 md:pb-super">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-divider pb-8 gap-4">
          <div>
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-luxuryGold/30 bg-luxuryGold/10 mb-3">
               <span className="w-1.5 h-1.5 rounded-full bg-luxuryGold animate-ping" />
               <span className="text-[9px] uppercase tracking-ultra text-luxuryGold font-medium">Auremont Reserve Member</span>
             </div>
             <h1 className="text-3xl sm:text-5xl font-serif text-primaryText tracking-tight">Welcome, {user.firstName}</h1>
             <p className="text-secondaryText mt-2 uppercase tracking-ultra text-[10px]">Your private concierge membership portal, order vault, and saved privileges.</p>
          </div>
          <button onClick={handleLogout} className="text-[10px] uppercase tracking-ultra text-secondaryText hover:text-luxuryGold transition-colors py-2 md:py-0 md:pb-1">
            Sign Out Concierge
          </button>
        </div>

        {/* Reserve Tier Loyalty Card */}
        <ReserveTierCard orderCount={orders.length} />

        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
           {/* Sidebar */}
           <AccountSidebar activeTab={activeTab} setActiveTab={setActiveTab} wishlistCount={wishlistItems.length} />

           {/* Main Content Area */}
           <div className="flex-grow max-w-4xl min-h-[60vh]">
              {activeTab === 'orders' && (
                <OrderHistoryTab orders={orders} loadingOrders={loadingOrders} />
              )}

              {activeTab === 'profile' && (
                <ProfileTab 
                  user={user} 
                  profileForm={profileForm} 
                  setProfileForm={setProfileForm} 
                  handleUpdateProfile={handleUpdateProfile}
                  updatingProfile={updatingProfile}
                  profileMsg={profileMsg}
                />
              )}

              {activeTab === 'addresses' && (
                <AddressesTab 
                  addresses={addresses}
                  loadingAddresses={loadingAddresses}
                  showAddressForm={showAddressForm}
                  setShowAddressForm={setShowAddressForm}
                  editingAddressId={editingAddressId}
                  setEditingAddressId={setEditingAddressId}
                  addressForm={addressForm}
                  setAddressForm={setAddressForm}
                  handleSaveAddress={handleSaveAddress}
                  handleEditAddress={handleEditAddress}
                  handleDeleteAddress={handleDeleteAddress}
                  handleSetDefaultAddress={handleSetDefaultAddress}
                  addressMsg={addressMsg}
                  savingAddress={savingAddress}
                />
              )}

              {activeTab === 'wishlist' && (
                <WishlistTab wishlistItems={wishlistItems} loadingWishlist={loadingWishlist} />
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
