"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data.data || data);
    } catch (err) {
      console.error("Failed to fetch catalog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif text-luxuryGold">Products</h2>
        <Link 
          href="/admin/products/new"
          className="bg-luxuryGold text-background px-6 py-2 rounded-xl font-medium shadow hover:bg-goldHover transition-colors"
        >
          Add Product
        </Link>
      </div>

      <div className="bg-secondaryBg rounded-2xl shadow-sm border border-divider overflow-hidden">
        <div className="p-6 border-b border-divider flex gap-4 bg-secondaryBg">
          <input 
            type="text" 
            placeholder="Search products by name or SKU..." 
            className="flex-1 px-4 py-3 bg-surface border border-divider text-primaryText rounded-xl focus:outline-none focus:ring-1 focus:ring-luxuryGold focus:border-luxuryGold"
          />
          <button className="px-6 py-3 border border-divider text-primaryText rounded-xl hover:bg-surface transition-colors font-medium">
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-secondaryText">
            <thead className="bg-surface text-primaryText uppercase font-medium tracking-wider">
              <tr>
                <th className="px-6 py-5">Product Name</th>
                <th className="px-6 py-5">SKU</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5">Stock</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider bg-secondaryBg">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-secondaryText">Loading catalog...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-secondaryText">No products found.</td>
                </tr>
              ) : (
                products.map((p: any) => (
                  <tr key={p.id} className="hover:bg-surface transition-colors group">
                    <td className="px-6 py-5 font-medium text-primaryText">{p.name}</td>
                    <td className="px-6 py-5">{p.sku || p.slug}</td>
                    <td className="px-6 py-5">
                      <span className="bg-surface border border-divider text-primaryText px-3 py-1 rounded-lg text-xs">{p.category?.name || 'Uncategorized'}</span>
                    </td>
                    <td className="px-6 py-5 text-primaryText">₹{Number(p.price).toFixed(2)}</td>
                    <td className="px-6 py-5">
                      {p.stockQty < 10 ? (
                        <span className="text-red-400 font-medium">{p.stockQty} (Low)</span>
                      ) : (
                        <span className="text-emerald-400 font-medium">{p.stockQty}</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      {p.status !== false ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block mr-2 shadow shadow-emerald-500/50"></span>
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-500 inline-block mr-2"></span>
                      )}
                      {p.status !== false ? 'Active' : 'Draft'}
                    </td>
                    <td className="px-6 py-5 text-right space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/products/${p.id}`} className="text-luxuryGold hover:text-goldHover font-medium transition-colors">Edit</Link>
                      <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 font-medium transition-colors">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-divider flex items-center justify-between text-sm text-secondaryText bg-secondaryBg">
          <span>Showing 1 to {products.length} of {products.length} entries</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-divider rounded-lg hover:bg-surface disabled:opacity-50 transition-colors">Prev</button>
            <button className="px-4 py-2 border border-divider rounded-lg hover:bg-surface disabled:opacity-50 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
