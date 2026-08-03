import { MapPin, Plus, Trash2, Edit2, CheckCircle2 } from "lucide-react";
import CustomInput from "@/components/checkout/CustomInput";

interface AddressesTabProps {
  addresses: any[];
  loadingAddresses: boolean;
  showAddressForm: boolean;
  setShowAddressForm: (show: boolean) => void;
  editingAddressId: string | null;
  setEditingAddressId: (id: string | null) => void;
  addressForm: any;
  setAddressForm: (form: any) => void;
  handleSaveAddress: (e: React.FormEvent) => void;
  handleEditAddress: (addr: any) => void;
  handleDeleteAddress: (id: string) => void;
  handleSetDefaultAddress: (id: string) => void;
  addressMsg: string;
  savingAddress: boolean;
}

export default function AddressesTab({
  addresses, loadingAddresses, showAddressForm, setShowAddressForm,
  editingAddressId, setEditingAddressId, addressForm, setAddressForm,
  handleSaveAddress, handleEditAddress, handleDeleteAddress, handleSetDefaultAddress,
  addressMsg, savingAddress
}: AddressesTabProps) {

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-divider pb-6 gap-4">
        <h2 className="font-serif text-3xl text-primaryText flex items-center gap-3">
          <MapPin className="text-luxuryGold" size={24} strokeWidth={1.5} />
          Saved Addresses
        </h2>
        {!showAddressForm && (
          <button 
            onClick={() => { 
              setEditingAddressId(null); 
              setAddressForm({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India', isDefault: false }); 
              setShowAddressForm(true); 
            }} 
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-primaryText hover:text-luxuryGold transition-colors"
          >
            <Plus size={16} /> Add New Address
          </button>
        )}
      </div>

      {showAddressForm ? (
        <div className="bg-secondaryBg p-8 border border-divider animate-fade-in max-w-3xl">
          <h3 className="font-serif text-2xl mb-8">{editingAddressId ? 'Edit Address' : 'New Address'}</h3>
          {addressMsg && <p className="text-error text-sm mb-6 p-4 bg-error/10 border border-error/20">{addressMsg}</p>}
          
          <form onSubmit={handleSaveAddress} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              <CustomInput label="Full Name" value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} required />
              <CustomInput label="Phone Number" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} required type="tel" />
              <div className="md:col-span-2">
                <CustomInput label="Address Line 1" value={addressForm.addressLine1} onChange={e => setAddressForm({...addressForm, addressLine1: e.target.value})} required />
              </div>
              <div className="md:col-span-2">
                <CustomInput label="Address Line 2 (Optional)" value={addressForm.addressLine2} onChange={e => setAddressForm({...addressForm, addressLine2: e.target.value})} />
              </div>
              <CustomInput label="City" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} required />
              <CustomInput label="State / Province" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} required />
              <CustomInput label="Postal Code" value={addressForm.postalCode} onChange={e => setAddressForm({...addressForm, postalCode: e.target.value})} required />
              <CustomInput label="Country" value={addressForm.country} onChange={e => setAddressForm({...addressForm, country: e.target.value})} required />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-divider">
              <input 
                type="checkbox" 
                id="defaultAddr" 
                checked={addressForm.isDefault} 
                onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})} 
                className="w-4 h-4 accent-luxuryGold bg-transparent border-divider"
              />
              <label htmlFor="defaultAddr" className="text-xs uppercase tracking-widest text-secondaryText cursor-pointer hover:text-primaryText transition-colors">
                Set as default address
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={savingAddress} className="luxury-button flex-1 h-14">
                {savingAddress ? 'Saving...' : 'Save Address'}
              </button>
              <button type="button" onClick={() => setShowAddressForm(false)} className="luxury-button-outline flex-1 h-14">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : loadingAddresses ? (
        <div className="py-12 space-y-6">
          {[1, 2].map(i => <div key={i} className="w-full h-40 bg-secondaryBg rounded-sm animate-pulse border border-divider"></div>)}
        </div>
      ) : addresses.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-divider bg-secondaryBg rounded-sm flex flex-col items-center justify-center">
          <MapPin className="text-mutedText mb-4" size={40} strokeWidth={1} />
          <p className="text-secondaryText text-lg mb-6">You haven't saved any addresses yet.</p>
          <button 
            onClick={() => { setEditingAddressId(null); setShowAddressForm(true); }}
            className="luxury-button-outline"
          >
            Add an Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map(addr => (
            <div key={addr.id} className="border border-divider rounded-sm p-8 bg-secondaryBg relative group hover:border-luxuryGold/50 transition-colors">
              {addr.isDefault && (
                <div className="absolute top-6 right-6 flex items-center gap-1 text-luxuryGold bg-luxuryGold/10 px-2 py-1 text-[10px] uppercase tracking-widest rounded-sm">
                  <CheckCircle2 size={12} /> Default
                </div>
              )}
              
              <div className="space-y-1 mb-8 pr-16">
                <p className="font-serif text-xl text-primaryText mb-4">{addr.fullName}</p>
                <p className="text-sm text-secondaryText leading-relaxed">
                  {addr.addressLine1}
                  {addr.addressLine2 && <><br />{addr.addressLine2}</>}
                  <br />{addr.city}, {addr.state} {addr.postalCode}
                  <br />{addr.country}
                </p>
                <p className="text-sm text-secondaryText pt-2">T: {addr.phone}</p>
              </div>
              
              <div className="flex gap-4 md:gap-6 text-[11px] uppercase tracking-widest pt-4 border-t border-divider flex-wrap">
                <button onClick={() => handleEditAddress(addr)} className="flex items-center gap-1 text-primaryText hover:text-luxuryGold transition-colors py-2">
                  <Edit2 size={14} /> Edit
                </button>
                <button onClick={() => handleDeleteAddress(addr.id)} className="flex items-center gap-1 text-mutedText hover:text-error transition-colors py-2">
                  <Trash2 size={14} /> Remove
                </button>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefaultAddress(addr.id)} className="ml-auto text-secondaryText hover:text-luxuryGold transition-colors py-2">
                    Set Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
