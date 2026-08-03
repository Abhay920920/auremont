"use client";

import { useState } from "react";
import { Gift } from "lucide-react";

export default function GiftOptions({
  onSave
}: {
  onSave: (message: string, includeReceipt: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [noReceipt, setNoReceipt] = useState(false);

  const handleSave = () => {
    onSave(message, !noReceipt);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-xs uppercase tracking-widest text-luxuryGold hover:text-goldHover transition-colors mt-6 py-2"
      >
        <Gift size={16} />
        <span>Add Gift Options</span>
      </button>
    );
  }

  return (
    <div className="mt-6 p-4 border border-divider bg-secondaryBg space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <Gift size={16} className="text-luxuryGold" />
        <h4 className="font-serif text-lg text-primaryText">Gift Message</h4>
      </div>
      
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter a personal message (max 200 characters)"
        maxLength={200}
        rows={3}
        className="w-full bg-background border border-divider rounded-input px-4 py-3 text-sm focus:outline-none focus:border-luxuryGold transition-colors resize-none"
      />
      
      <label className="flex items-center gap-3 cursor-pointer group py-2">
        <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${noReceipt ? 'border-luxuryGold bg-luxuryGold' : 'border-divider group-hover:border-luxuryGold'}`}>
          {noReceipt && <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
        </div>
        <input 
          type="checkbox" 
          className="hidden" 
          checked={noReceipt} 
          onChange={(e) => setNoReceipt(e.target.checked)} 
        />
        <span className="text-sm font-light text-secondaryText group-hover:text-primaryText transition-colors">Hide prices on receipt</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button 
          onClick={handleSave}
          className="bg-luxuryGold text-background px-6 py-3 md:py-2 text-xs uppercase tracking-widest hover:bg-goldHover transition-colors rounded-sm"
        >
          Save
        </button>
        <button 
          onClick={() => setIsOpen(false)}
          className="px-6 py-3 md:py-2 text-xs uppercase tracking-widest text-secondaryText hover:text-primaryText transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
