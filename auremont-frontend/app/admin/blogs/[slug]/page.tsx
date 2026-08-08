/* jscpd:ignore-start */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function AdminEditBlogPage() {
  const router = useRouter();
  const rawParams = useParams();
  const slug = rawParams?.slug as string;

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
    if (!slug) return;
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/blogs/${slug}`);
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
      } catch (err: any) {
        setError("Failed to load blog post details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogId) return;
    setSaving(true);
    setError("");

    try {
      await api.patch(`/blogs/${blogId}`, form);
      router.push("/admin/blogs");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update article.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-secondaryText font-serif">
        <div className="w-8 h-8 border-2 border-luxuryGold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        Loading Article...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/admin/blogs" className="flex items-center gap-2 text-xs uppercase tracking-widest text-secondaryText hover:text-luxuryGold transition-colors">
          <ArrowLeft size={16} /> Back to Journal
        </Link>
        <h1 className="text-3xl font-serif text-primaryText">Edit Article</h1>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-secondaryBg/40 border border-divider p-8 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-secondaryText">Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-secondaryText">Slug</label>
            <input type="text" name="slug" value={form.slug} onChange={handleChange} required className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-secondaryText">Cover Image URL</label>
          <input type="text" name="coverImage" value={form.coverImage} onChange={handleChange} className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText" placeholder="/images/story.png or https://..." />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-secondaryText">Article Content</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={12} required className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors text-primaryText resize-y" placeholder="Write your journal post here (Markdown supported)..." />
        </div>

        <div className="flex gap-8 border-t border-divider pt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 accent-luxuryGold" />
            <span className="text-sm text-primaryText font-medium">Publish Article</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="isIndexable" checked={form.isIndexable} onChange={handleChange} className="w-4 h-4 accent-luxuryGold" />
            <span className="text-sm text-primaryText font-medium">Indexable by Search Engines</span>
          </label>
        </div>

        {/* SEO Section */}
        <div className="border-t border-divider pt-8 space-y-6">
          <h3 className="text-sm uppercase tracking-widest text-luxuryGold font-medium">SEO & OpenGraph Overrides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-secondaryText">SEO Title</label>
              <input type="text" name="seoTitle" value={form.seoTitle} onChange={handleChange} placeholder="Overrides default title" className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-secondaryText">Canonical URL</label>
              <input type="text" name="canonicalUrl" value={form.canonicalUrl} onChange={handleChange} placeholder="https://rarenuts.com/journal/..." className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-secondaryText">SEO Meta Description</label>
            <textarea name="seoDescription" value={form.seoDescription} onChange={handleChange} rows={2} placeholder="Optimized meta description" className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors"></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-secondaryText">OpenGraph Image URL</label>
            <input type="text" name="ogImageUrl" value={form.ogImageUrl} onChange={handleChange} placeholder="Leave blank to use cover image" className="w-full bg-background border border-divider px-4 py-3 rounded-xl focus:border-luxuryGold outline-none transition-colors" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full bg-luxuryGold text-background py-4 rounded-xl font-medium uppercase tracking-widest shadow-lg hover:bg-goldHover transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
          <Save size={18} />
          {saving ? "Saving Changes..." : "Update Article"}
        </button>
      </form>
    </div>
  );
}
