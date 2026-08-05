"use client";

import { useEffect, useState } from "react";
import { Search, Download, Plus, AlertCircle, History } from "lucide-react";
import api from "@/lib/axios";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Modal state
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("RESTOCK");

  const [search, setSearch] = useState("");

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/inventory', { params: { search, limit: 50 } });
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchInventory();
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleAdjustClick = (product: any) => {
    setSelectedProduct(product);
    setAdjustQty("");
    setAdjustReason("RESTOCK");
    setIsModalOpen(true);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = parseInt(adjustQty, 10);
    if (isNaN(qtyNum)) return;
    
    try {
      await api.post(`/admin/inventory/${selectedProduct.id}/adjust`, {
        changeQty: qtyNum,
        reason: adjustReason
      });
      
      // Optimistic update
      setProducts(products.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, stockQty: p.stockQty + qtyNum } 
          : p
      ));
      
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to adjust stock", err);
      alert("Failed to adjust stock. Please try again.");
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif text-luxuryGold">Inventory Ledger</h2>
        <button className="flex items-center gap-2 bg-secondaryBg text-primaryText border border-divider px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-surface transition-colors">
          <Download size={16} />
          Export Stock Report
        </button>
      </div>

      <div className="bg-secondaryBg rounded-2xl shadow-sm border border-divider overflow-hidden">
        <div className="p-6 border-b border-divider flex flex-col md:flex-row gap-4 bg-secondaryBg justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3.5 text-secondaryText" size={18} />
            <input 
              type="text" 
              placeholder="Search by SKU or Product Name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-divider text-primaryText rounded-xl focus:outline-none focus:ring-1 focus:ring-luxuryGold focus:border-luxuryGold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-secondaryText">
            <thead className="bg-surface text-primaryText uppercase font-medium tracking-wider">
              <tr>
                <th className="px-6 py-5">Product Name</th>
                <th className="px-6 py-5">SKU</th>
                <th className="px-6 py-5">Stock Level</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider bg-secondaryBg">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-secondaryText">Loading inventory data...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-secondaryText">No products found.</td>
                </tr>
              ) : (
                products.map((p: any) => (
                  <tr key={p.id} className="hover:bg-surface transition-colors group">
                    <td className="px-6 py-5 font-medium text-primaryText">{p.name}</td>
                    <td className="px-6 py-5 font-mono text-xs">{p.sku}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${p.stockQty <= 10 ? (p.stockQty === 0 ? 'text-red-400' : 'text-yellow-400') : 'text-emerald-400'}`}>
                          {p.stockQty} units
                        </span>
                        {p.stockQty <= 10 && <AlertCircle size={14} className={p.stockQty === 0 ? 'text-red-400' : 'text-yellow-400'} />}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {p.status ? (
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-medium">Active</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded-md text-xs font-medium">Draft</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => handleAdjustClick(p)}
                          className="flex items-center gap-1.5 text-luxuryGold hover:text-goldHover font-medium transition-colors border border-luxuryGold px-3 py-1.5 rounded-lg"
                        >
                          <Plus size={14} /> Adjust
                        </button>
                        <button className="flex items-center gap-1.5 text-secondaryText hover:text-primaryText font-medium transition-colors border border-divider px-3 py-1.5 rounded-lg">
                          <History size={14} /> Logs
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-secondaryBg border border-divider rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-divider flex justify-between items-center">
              <h3 className="text-xl font-serif text-primaryText">Adjust Stock</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-secondaryText hover:text-primaryText transition-colors">&times;</button>
            </div>
            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-5">
              <div>
                <p className="text-sm text-secondaryText mb-1">Product</p>
                <p className="font-medium text-primaryText">{selectedProduct.name} ({selectedProduct.sku})</p>
                <p className="text-sm text-secondaryText mt-1">Current Stock: <span className="text-primaryText font-medium">{selectedProduct.stockQty} units</span></p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primaryText mb-1.5">Adjustment Quantity</label>
                <input 
                  type="number" 
                  required
                  placeholder="+/- number (e.g. 5, -2)"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-divider text-primaryText rounded-xl focus:outline-none focus:ring-1 focus:ring-luxuryGold focus:border-luxuryGold"
                />
                <p className="text-xs text-secondaryText mt-1.5">Use negative numbers to deduct stock.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primaryText mb-1.5">Reason</label>
                <select 
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-divider text-primaryText rounded-xl focus:outline-none focus:ring-1 focus:ring-luxuryGold focus:border-luxuryGold appearance-none"
                >
                  <option value="RESTOCK">Supplier Restock</option>
                  <option value="DAMAGE">Damaged Goods</option>
                  <option value="RETURN">Customer Return (Restockable)</option>
                  <option value="MANUAL_CORRECTION">Manual Audit Correction</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-primaryText bg-surface border border-divider rounded-xl hover:bg-divider transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-luxuryGold text-background rounded-xl font-medium shadow-sm hover:bg-goldHover transition-colors">
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
