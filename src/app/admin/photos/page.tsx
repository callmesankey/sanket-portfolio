'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Image as ImageIcon,
  ArrowLeft,
  Filter,
  Grid,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

interface Photo {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  altText?: string;
  category?: string;
  featured: boolean;
  createdAt: string;
  displayOrder: number;
}

export default function AdminPhotos() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photos');
        const data = await response.json();
        if (isMounted) {
          setPhotos(data || []);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch photos:', error);
        if (isMounted) {
          toast.error('Failed to load photos');
          setLoading(false);
        }
      }
    };
    fetchPhotos();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Photo deleted successfully');
        fetchPhotos();
      } else {
        toast.error('Failed to delete photo');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete photo');
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !currentStatus }),
      });

      if (response.ok) {
        toast.success(!currentStatus ? 'Photo marked as featured' : 'Photo unmarked as featured');
        fetchPhotos();
      } else {
        toast.error('Failed to update photo');
      }
    } catch (error) {
      console.error('Toggle featured failed:', error);
      toast.error('Failed to update photo');
    }
  };

  const categories = ['all', ...Array.from(new Set(photos.map(p => p.category).filter(Boolean)))];

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         photo.altText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         photo.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || photo.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-blue-600 to-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh]"
            >
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.altText || selectedPhoto.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white"
              >
                ✕
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Manage Photos
              </h1>
              <p className="text-slate-600">
                {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
              </p>
            </div>
            <Button 
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold hover:scale-105 transition-all shadow-lg"
            >
              <Link href="/admin/photos/upload" className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Upload Photo
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 border-slate-200 focus:border-blue-500 transition-all hover:border-blue-300"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filterCategory === category ? 'default' : 'outline'}
                  onClick={() => setFilterCategory(category)}
                  className={
                    filterCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      : ''
                  }
                  size="sm"
                >
                  {category === 'all' ? 'All' : category}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Photos Grid */}
      <section className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {filteredPhotos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <ImageIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No photos found</h3>
                <p className="text-slate-500">
                  {searchQuery ? 'Try a different search term' : 'Upload your first photo to get started'}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredPhotos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card className="overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-slate-100 hover:border-blue-500 group cursor-pointer">
                      <div
                        className="relative aspect-square overflow-hidden bg-slate-100"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <motion.img
                          src={photo.thumbnailUrl || photo.imageUrl}
                          alt={photo.altText || photo.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-white text-sm font-medium truncate">
                              {photo.title}
                            </p>
                          </div>
                        </div>
                        {photo.featured && (
                          <div className="absolute top-2 right-2">
                            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="flex-1 border-green-600 hover:bg-green-50 hover:text-green-700 transition-all"
                          >
                            <Link href={`/admin/photos/${photo.id}/edit`}>
                              <Edit2 className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleFeatured(photo.id, photo.featured)}
                            className={`flex-1 ${
                              photo.featured
                                ? 'bg-yellow-100 text-yellow-700 border-yellow-400'
                                : 'border-slate-300 hover:bg-slate-50'
                            } transition-all`}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            {photo.featured ? 'Unstar' : 'Star'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(photo.id, photo.title)}
                            className="border-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
