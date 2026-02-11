'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, X, Upload, Star, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function UploadPhotoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    thumbnailUrl: '',
    altText: '',
    category: '',
    tags: '',
    featured: false,
    displayOrder: 0,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file', {
        description: 'Please upload an image file.',
      });
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Please upload an image smaller than 10MB.',
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);

    try {
      const fileInput = document.getElementById('imageFile') as HTMLInputElement;
      const file = fileInput.files?.[0];

      if (!file && !formData.imageUrl) {
        toast.error('No image provided', {
          description: 'Please upload an image or provide an image URL.',
        });
        setLoading(false);
        return;
      }

      // Simulate upload progress
      setUploadProgress(50);

      const response = await fetch('/api/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setUploadProgress(90);

      const data = await response.json();

      if (response.ok) {
        setUploadProgress(100);
        toast.success('Photo uploaded successfully!', {
          description: 'Your photo has been added to the gallery.',
        });
        setTimeout(() => {
          router.push('/admin/photos');
        }, 500);
      } else {
        toast.error('Failed to upload photo', {
          description: data.error || 'Please try again.',
        });
      }
    } catch (error) {
      console.error('Upload photo failed:', error);
      toast.error('An error occurred', {
        description: 'Please try again.',
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
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
                Upload Photo
              </h1>
              <p className="text-slate-600 mt-1">
                Add a new photo to your gallery
              </p>
            </div>
            <Button 
              asChild
              variant="outline"
              className="border-slate-300 hover:bg-slate-100"
            >
              <Link href="/admin/photos" className="flex items-center">
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
                <CardTitle>Photo Details</CardTitle>
                <CardDescription>
                  Upload a photo with metadata for better organization and SEO
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="imageFile" className="text-base font-medium">
                      Upload Image <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex-1"
                      >
                        <Input
                          id="imageFile"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="cursor-pointer border-2 border-slate-200 focus:border-blue-500"
                          disabled={loading}
                        />
                      </motion.div>
                      <div className="flex items-center gap-3">
                        <ImageIcon className="h-5 w-5 text-slate-400" />
                        <span className="text-sm text-slate-500">
                          or provide URL below
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  {previewUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 border-2 border-slate-200 rounded-lg overflow-hidden"
                    >
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full max-h-[300px] object-contain"
                      />
                    </motion.div>
                  )}

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-medium">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter photo title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="border-2 border-slate-200 focus:border-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe this photo..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="min-h-[100px] border-2 border-slate-200 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>

                  {/* Image URL (optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-base font-medium">
                      Image URL (Optional)
                    </Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="border-2 border-slate-200 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>

                  {/* Alt Text */}
                  <div className="space-y-2">
                    <Label htmlFor="altText" className="text-base font-medium">
                      Alt Text <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="altText"
                      type="text"
                      placeholder="Brief description for screen readers..."
                      value={formData.altText}
                      onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                      className="border-2 border-slate-200 focus:border-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-base font-medium">
                      Category
                    </Label>
                    <Input
                      id="category"
                      type="text"
                      placeholder="e.g., Nature, Events, People..."
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="border-2 border-slate-200 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-base font-medium">
                      Tags (comma-separated)
                    </Label>
                    <Input
                      id="tags"
                      type="text"
                      placeholder="sunset, beach, mountains..."
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="border-2 border-slate-200 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>

                  {/* Display Order */}
                  <div className="space-y-2">
                    <Label htmlFor="displayOrder" className="text-base font-medium">
                      Display Order (Lower number = First)
                    </Label>
                    <Input
                      id="displayOrder"
                      type="number"
                      placeholder="0"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                      className="border-2 border-slate-200 focus:border-blue-500"
                      min="0"
                      disabled={loading}
                    />
                  </div>

                  {/* Publish Options */}
                  <div className="pt-6 border-t border-slate-200">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800">Display Options</h3>
                    
                    <div className="flex items-center gap-3">
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                        disabled={loading}
                      />
                      <Label htmlFor="featured" className="cursor-pointer font-medium flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Featured Photo
                      </Label>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {uploadProgress > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-6 border-t border-slate-200"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">
                            Uploading...
                          </span>
                          <span className="text-blue-600 font-semibold">
                            {uploadProgress}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-slate-200">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold hover:scale-105 transition-all shadow-lg"
                      disabled={loading || !formData.title || !formData.altText}
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <Upload className="h-5 w-5" />
                          </motion.div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-5 w-5" />
                          Upload Photo
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
