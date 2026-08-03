"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function AdminEditBlogPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [blogId, setBlogId] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    coverImage: "",
    published: false,
    isIndexable: true,
    seoTitle: "",
    seoDescription: "",
    canonicalUrl: "",
    ogImageUrl: "",
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/blogs/${params.slug}`);
        setBlogId(data.id);
        setForm({
          title: data.title,
          slug: data.slug,
          content: data.content,
          coverImage: data.coverImage || "",
          published: data.published || false,
          isIndexable: data.isIndexable !== false,
          seoTitle: data.seoTitle || "",
          seoDescription: data.seoDescription || "",
          canonicalUrl: data.canonicalUrl || "",
          ogImageUrl: data.ogImageUrl || "",
        });
      } catch (err) {
        console.error("Failed to load blog", err);
        setError("Blog post not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [params.slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleContentChange = (content: string) => {
    setForm({ ...form, content });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.patch(`/blogs/${blogId}`, form);
      router.push('/admin/blogs');
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update blog post.");
      setSaving(false);
    }
  };

  if (loading) return <div className="text-secondaryText p-8">Loading post data...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blogs" className="p-2 rounded-xl bg-surface border border-divider hover:bg-secondaryBg transition-colors">
          <ArrowLeft className="w-5 h-5 text-primaryText" />
        </Link>
        <h2 className="text-3xl font-serif text-luxuryGold">Edit Post</h2>
      </div>

      {error && <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-secondaryBg border border-divider rounded-2xl p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-widest text-secondaryText">Post Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Slug</label>
              <input type="text" name="slug" value={form.slug} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
            </div>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-widest text-secondaryText">Cover Image URL</label>
              <input type="text" name="coverImage" value={form.coverImage} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
            </div>
          </div>
        </div>

        <div className="bg-secondaryBg border border-divider rounded-2xl p-8 space-y-6">
          <label className="text-sm uppercase tracking-widest text-secondaryText block">Post Content</label>
          <div className="bg-background border border-divider rounded-xl overflow-hidden">
            <textarea 
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={15}
              className="w-full bg-transparent p-6 text-primaryText outline-none resize-y"
              placeholder="Write your journal post here (Markdown supported)..."
            />
          </div>
        </div>

        <div className="bg-secondaryBg border border-divider rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="w-5 h-5 accent-luxuryGold bg-transparent" />
              <span className="text-primaryText font-medium">Publish Immediately</span>
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
              <input type="text" name="canonicalUrl" value={form.canonicalUrl} onChange={handleChange} placeholder="https://auremont.com/journal/..." className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-widest text-secondaryText">SEO Description</label>
            <textarea name="seoDescription" value={form.seoDescription} onChange={handleChange} rows={2} placeholder="Optimized meta description" className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors"></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-widest text-secondaryText">OpenGraph Image URL</label>
            <input type="text" name="ogImageUrl" value={form.ogImageUrl} onChange={handleChange} placeholder="Leave blank to use cover image" className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors" />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={saving} className="bg-luxuryGold text-background px-8 py-4 rounded-xl font-medium shadow hover:bg-goldHover transition-colors flex items-center gap-2">
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
