'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Search, X, ZoomIn, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface Photo {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  altText: string;
  thumbnailUrl: string | null;
  category: string;
  tags: string | null;
  featured: boolean;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    let filtered = photos;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((photo) => photo.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(
        (photo) =>
          photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          photo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          photo.tags?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          photo.altText.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPhotos(filtered);
  }, [searchQuery, selectedCategory, photos]);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/photos');
      const data = await response.json();
      setPhotos(data.photos || []);
      setFilteredPhotos(data.photos || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo);
    setSelectedIndex(filteredPhotos.findIndex((p) => p.id === photo.id));
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = '';
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    let newIndex = direction === 'prev' ? selectedIndex - 1 : selectedIndex + 1;
    
    if (newIndex < 0) newIndex = filteredPhotos.length - 1;
    if (newIndex >= filteredPhotos.length) newIndex = 0;
    
    setSelectedIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedPhoto) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigatePhoto('prev');
    if (e.key === 'ArrowRight') navigatePhoto('next');
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, selectedIndex]);

  const categories = ['all', 'portfolio', 'blog', 'events', 'design', 'general'];
  const categoryLabels: Record<string, string> = {
    all: 'All Photos',
    portfolio: 'Portfolio',
    blog: 'Blog',
    events: 'Events',
    design: 'Design',
    general: 'General'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Breadcrumb */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-primary-foreground py-4 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm hover:text-blue-100 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Header Section */}
      <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Photo Gallery
            </h1>
            <Separator className="mx-auto mb-6 w-20 bg-primary" />
            <p className="text-lg text-muted-foreground">
              Visual stories and moments showcasing work, events, and creative projects.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-4"
          >
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {categoryLabels[category]}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredPhotos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No photos found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Check back soon for new photos'}
              </p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all"
                  onClick={() => openLightbox(photo)}
                >
                  {/* Thumbnail/Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={photo.thumbnailUrl || photo.imageUrl}
                      alt={photo.altText}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-semibold text-sm line-clamp-1 mb-1">{photo.title}</h3>
                      {photo.description && (
                        <p className="text-xs text-gray-200 line-clamp-2">{photo.description}</p>
                      )}
                    </div>
                    <ZoomIn className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {photo.featured && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        Featured
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs capitalize">
                      {photo.category}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Navigation - Previous */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 text-white hover:bg-white/10 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePhoto('prev');
                }}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              {/* Navigation - Next */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 text-white hover:bg-white/10 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePhoto('next');
                }}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>

              {/* Image Container */}
              <div className="max-w-5xl max-h-[90vh] px-8" onClick={(e) => e.stopPropagation()}>
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.altText}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />

                {/* Photo Details */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 text-white text-center"
                >
                  <h2 className="text-xl font-semibold mb-2">{selectedPhoto.title}</h2>
                  {selectedPhoto.description && (
                    <p className="text-gray-300 mb-2">{selectedPhoto.description}</p>
                  )}
                  <div className="flex gap-2 justify-center">
                    <Badge variant="secondary" className="capitalize">
                      {selectedPhoto.category}
                    </Badge>
                    {selectedPhoto.featured && (
                      <Badge className="bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                {selectedIndex + 1} / {filteredPhotos.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold">
              Sanket<span className="text-primary">.</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2026 Sanket Dhital. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
