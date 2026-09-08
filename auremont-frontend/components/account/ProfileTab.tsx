import { User, Mail } from "lucide-react";
import CustomInput from "@/components/checkout/CustomInput";

interface ProfileTabProps {
  user: any;
  profileForm: { firstName: string; lastName: string; phone: string };
  setProfileForm: (form: any) => void;
  handleUpdateProfile: (e: React.FormEvent) => void;
  updatingProfile: boolean;
  profileMsg: string;
  onOpenDeleteModal?: () => void;
}

export default function ProfileTab({
  user,
  profileForm,
  setProfileForm,
  handleUpdateProfile,
  updatingProfile,
  profileMsg,
  onOpenDeleteModal,
}: ProfileTabProps) {
  return (
    <div className="space-y-8 animate-fade-in w-full max-w-3xl">
      <h2 className="font-serif text-3xl text-primaryText border-b border-divider pb-6 flex items-center gap-3">
        <User className="text-luxuryGold" size={24} strokeWidth={1.5} />
        My Profile
      </h2>

      {profileMsg && (
        <div className={`p-4 border rounded-card text-sm ${profileMsg.includes('success') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-error/10 border-error/20 text-error'}`}>
          {profileMsg}
        </div>
      )}

      <form onSubmit={handleUpdateProfile} className="space-y-8 sm:space-y-10 bg-secondaryBg p-5 sm:p-8 border border-divider rounded-card">
        <div className="space-y-8">
          <div className="flex items-center gap-4 p-4 border border-divider bg-background text-mutedText">
            <Mail size={18} />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-secondaryText mb-1">Account Email</p>
              <p className="text-primaryText">{user.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 pt-4">
            <CustomInput 
              label="First Name" 
              value={profileForm.firstName} 
              onChange={e => setProfileForm({...profileForm, firstName: e.target.value})} 
              required 
            />
            <CustomInput 
              label="Last Name" 
              value={profileForm.lastName} 
              onChange={e => setProfileForm({...profileForm, lastName: e.target.value})} 
              required 
            />
            <div className="md:col-span-2">
              <CustomInput 
                label="Phone Number" 
                value={profileForm.phone} 
                onChange={e => setProfileForm({...profileForm, phone: e.target.value})} 
                type="tel"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={updatingProfile} 
          className="w-full luxury-button h-14"
        >
          {updatingProfile ? 'Saving Details...' : 'Save Changes'}
        </button>
      </form>

      {/* Danger Zone: Account Deletion */}
      <div className="p-6 border border-red-500/20 bg-red-950/10 rounded-card space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-primaryText flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Account Privacy & Deletion
            </h3>
            <p className="text-xs text-secondaryText mt-1 max-w-lg">
              Permanently revoke account credentials and anonymize personal customer data in accordance with our data privacy policy.
            </p>
          </div>
          {onOpenDeleteModal && (
            <button
              type="button"
              onClick={onOpenDeleteModal}
              className="px-4 py-2.5 border border-red-500/30 hover:border-red-500/60 bg-red-900/10 hover:bg-red-900/20 text-red-300 text-[11px] uppercase tracking-wider rounded-sm transition-colors flex-shrink-0 self-start sm:self-center"
            >
              Delete My Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
