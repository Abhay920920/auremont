/* eslint-disable max-lines-per-function, complexity */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    sku: "",
    categoryId: "",
    shortDescription: "",
    description: "",
    weightGrams: 250,
    price: 0,
    salePrice: 0,
    stockQty: 0,
    isFeatured: false,
    status: true,
    isIndexable: true,
    thumbnailUrl: "/images/california-almonds-250g.png",
    seoTitle: "",
    seoDescription: "",
    canonicalUrl: "",
    ogImageUrl: "",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/products/${id}`)
        ]);
        
        setCategories(catRes.data);
        
        const p = prodRes.data;
        setForm({
          name: p.name || "",
          slug: p.slug || "",
          sku: p.sku || "",
          categoryId: p.categoryId || (catRes.data.length > 0 ? catRes.data[0].id : ""),
          shortDescription: p.shortDescription || "",
          description: p.description || "",
          weightGrams: p.weightGrams || 250,
          price: p.price || 0,
          salePrice: p.salePrice || 0,
          stockQty: p.stockQty || 0,
          isFeatured: p.isFeatured || false,
          status: p.status !== false,
          isIndexable: p.isIndexable !== false,
          thumbnailUrl: p.thumbnailUrl || "/images/california-almonds-250g.png",
          seoTitle: p.seoTitle || "",
          seoDescription: p.seoDescription || "",
          canonicalUrl: p.canonicalUrl || "",
          ogImageUrl: p.ogImageUrl || "",
        });
      } catch (err) {
        console.error("Failed to fetch initial data");
        setError("Could not load product data. It may not exist.");
      } finally {
        setPageLoading(false);
      }
    };
    if (id) fetchInitialData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: type === 'number' ? Number(value) : value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.patch(`/products/${id}`, form);
      router.push('/admin/products');
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update product.");
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="text-secondaryText animate-pulse p-8">Loading Product Data...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 rounded-xl bg-surface border border-divider hover:bg-secondaryBg transition-colors">
          <ArrowLeft className="w-5 h-5 text-primaryText" />
        </Link>
        <h2 className="text-3xl font-serif text-luxuryGold">Edit Product</h2>
      </div>

      {error && <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-secondaryBg border border-divider rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-serif text-primaryText border-b border-divider pb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Slug</label>
              <input type="text" name="slug" value={form.slug} onChange={handleChange} required className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">SKU</label>
              <input type="text" name="sku" value={form.sku} onChange={handleChange} required className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Category</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} required className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors">
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm uppercase tracking-widest text-secondaryText">Short Description</label>
            <input type="text" name="shortDescription" value={form.shortDescription} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-widest text-secondaryText">Detailed Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors"></textarea>
          </div>
        </div>

        <div className="bg-secondaryBg border border-divider rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-serif text-primaryText border-b border-divider pb-4">Pricing & Inventory</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Price (₹)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Sale Price (₹)</label>
              <input type="number" name="salePrice" value={form.salePrice} onChange={handleChange} min="0" className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Stock Quantity</label>
              <input type="number" name="stockQty" value={form.stockQty} onChange={handleChange} required min="0" className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Weight (Grams)</label>
              <input type="number" name="weightGrams" value={form.weightGrams} onChange={handleChange} required min="1" className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors" />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Thumbnail URL</label>
              <input type="text" name="thumbnailUrl" value={form.thumbnailUrl} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors" />
            </div>
          </div>
        </div>

        <div className="bg-secondaryBg border border-divider rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-serif text-primaryText border-b border-divider pb-4">Options</h3>
          
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-5 h-5 accent-luxuryGold bg-transparent" />
              <span className="text-primaryText font-medium">Featured Product</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="status" checked={form.status} onChange={handleChange} className="w-5 h-5 accent-luxuryGold bg-transparent" />
              <span className="text-primaryText font-medium">Active Status</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="isIndexable" checked={form.isIndexable} onChange={handleChange} className="w-5 h-5 accent-luxuryGold bg-transparent" />
              <span className="text-primaryText font-medium">Allow Indexing</span>
            </label>
          </div>
        </div>

        <div className="bg-secondaryBg border border-divider rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-serif text-primaryText border-b border-divider pb-4">SEO & Search</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">SEO Title</label>
              <input type="text" name="seoTitle" value={form.seoTitle} onChange={handleChange} placeholder="Overrides default title" className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Canonical URL</label>
              <input type="text" name="canonicalUrl" value={form.canonicalUrl} onChange={handleChange} placeholder="https://auremont.com/shop/..." className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-widest text-secondaryText">SEO Description</label>
            <textarea name="seoDescription" value={form.seoDescription} onChange={handleChange} rows={2} placeholder="Optimized meta description" className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors"></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-widest text-secondaryText">OpenGraph Image URL</label>
            <input type="text" name="ogImageUrl" value={form.ogImageUrl} onChange={handleChange} placeholder="Leave blank to use thumbnail" className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors" />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="bg-luxuryGold text-background px-8 py-4 rounded-xl font-medium shadow hover:bg-goldHover transition-colors flex items-center gap-2">
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
