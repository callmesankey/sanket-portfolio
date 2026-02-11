'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    altText: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    published: false,
    featured: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate slug from title if not provided
      const slugToUse = formData.slug.trim() || 
        formData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '-').replace(/\s+/g, '-');

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          slug: slugToUse,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Post created successfully!', {
          description: 'Your post has been published.',
        });
        router.push('/admin/posts');
      } else {
        toast.error('Failed to create post', {
          description: data.error || 'Please try again.',
        });
      }
    } catch (error) {
      console.error('Create post failed:', error);
      toast.error('An error occurred', {
        description: 'Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Navigation Breadcrumb */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm hover:underline hover:text-blue-100 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="py-8 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Create New Post
              </h1>
              <p className="text-slate-600 mt-1">
                Fill in the details below to create a new blog post
              </p>
            </div>
            <Button 
              asChild
              variant="outline"
              className="border-slate-300 hover:bg-slate-100"
            >
              <Link href="/admin/posts" className="flex items-center">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="max-w-4xl mx-auto border-2 border-slate-200">
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
                <CardDescription>
                  Create a new blog post with rich content and SEO metadata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-medium">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter post title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="border-2 border-slate-200 focus:border-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-base font-medium">
                      Slug (URL-friendly identifier)
                    </Label>
                    <Input
                      id="slug"
                      type="text"
                      placeholder="post-url-slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="border-2 border-slate-200 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-2">
                    <Label htmlFor="excerpt" className="text-base font-medium">
                      Excerpt (Brief description)
                    </Label>
                    <Input
                      id="excerpt"
                      type="text"
                      placeholder="A short summary of the post..."
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="border-2 border-slate-200 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-base font-medium">
                      Content <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Write your post content here..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="min-h-[300px] border-2 border-slate-200 focus:border-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Cover Image */}
                  <div className="space-y-2">
                    <Label htmlFor="coverImage" className="text-base font-medium">
                      Cover Image URL
                    </Label>
                    <Input
                      id="coverImage"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      className="border-2 border-slate-200 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>

                  {/* Alt Text */}
                  <div className="space-y-2">
                    <Label htmlFor="altText" className="text-base font-medium">
                      Alt Text (for SEO and accessibility)
                    </Label>
                    <Input
                      id="altText"
                      type="text"
                      placeholder="Brief description of the image..."
                      value={formData.altText}
                      onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                      className="border-2 border-slate-200 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>

                  {/* SEO Section */}
                  <div className="pt-6 border-t border-slate-200">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800">SEO Settings</h3>
                    
                    {/* Meta Title */}
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle" className="text-base font-medium">
                        Meta Title
                      </Label>
                      <Input
                        id="metaTitle"
                        type="text"
                        placeholder="SEO-optimized title (max 60 chars)"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                        className="border-2 border-slate-200 focus:border-blue-500"
                        disabled={loading}
                      />
                    </div>

                    {/* Meta Description */}
                    <div className="space-y-2">
                      <Label htmlFor="metaDescription" className="text-base font-medium">
                        Meta Description
                      </Label>
                      <Input
                        id="metaDescription"
                        type="text"
                        placeholder="SEO description (max 160 chars)"
                        value={formData.metaDescription}
                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                        className="border-2 border-slate-200 focus:border-blue-500"
                        disabled={loading}
                      />
                    </div>

                    {/* Meta Keywords */}
                    <div className="space-y-2">
                      <Label htmlFor="metaKeywords" className="text-base font-medium">
                        Meta Keywords
                      </Label>
                      <Input
                        id="metaKeywords"
                        type="text"
                        placeholder="tag1, tag2, tag3..."
                        value={formData.metaKeywords}
                        onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                        className="border-2 border-slate-200 focus:border-blue-500"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Publish Options */}
                  <div className="pt-6 border-t border-slate-200">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800">Publish Options</h3>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <Switch
                          id="published"
                          checked={formData.published}
                          onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                          disabled={loading}
                        />
                        <Label htmlFor="published" className="cursor-pointer font-medium">
                          Published
                        </Label>
                      </div>

                      <div className="flex items-center gap-3">
                        <Switch
                          id="featured"
                          checked={formData.featured}
                          onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                          disabled={loading}
                        />
                        <Label htmlFor="featured" className="cursor-pointer font-medium">
                          Featured Post
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-slate-200">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold hover:scale-105 transition-all shadow-lg"
                      disabled={loading || !formData.title || !formData.content}
                    >
                      {loading ? 'Creating...' : (
                        <>
                          <Save className="mr-2 h-5 w-5" />
                          Create Post
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
