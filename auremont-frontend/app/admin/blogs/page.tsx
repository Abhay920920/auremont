"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = () => {
    api.get('/blogs/admin').then(res => {
      setBlogs(res.data);
      return null;
    }).catch(console.error).finally(() => setLoading(false)).catch(console.error);
  };

  const togglePublish = async (id: string, published: boolean) => {
    try {
      await api.patch(`/blogs/${id}`, { published: !published });
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-luxuryGold">Journal Blogs</h1>
        <button onClick={() => router.push('/admin/blogs/new')} className="px-4 py-2 bg-luxuryGold text-background rounded-lg font-medium hover:bg-goldHover transition-colors">
          + New Post
        </button>
      </div>
      
      <div className="bg-secondaryBg rounded-2xl shadow-sm border border-divider overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface text-secondaryText text-xs uppercase tracking-wider border-b border-divider">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Created Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8 text-mutedText">Loading blogs...</td></tr>
              ) : blogs.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-mutedText">No blog posts found.</td></tr>
              ) : (
                blogs.map(blog => (
                  <tr key={blog.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-primaryText">{blog.title}</td>
                    <td className="px-6 py-4 text-secondaryText">
                      {blog.publishedAt 
                        ? format(new Date(blog.publishedAt), 'MMM d, yyyy')
                        : 'Not Published'}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => togglePublish(blog.id, blog.published)}
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium tracking-wide transition-colors border
                          ${blog.published ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-surface text-secondaryText border-divider hover:bg-surface/80'}`}
                      >
                        {blog.published ? 'PUBLISHED' : 'DRAFT'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => router.push(`/admin/blogs/${blog.slug}`)} className="text-luxuryGold hover:text-goldHover font-medium text-sm">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
