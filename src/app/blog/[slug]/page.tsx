'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  altText: string | null;
  publishedAt: string | null;
  createdAt: string;
  featured: boolean;
  author: {
    name: string;
    email: string;
  };
  metaTitle: string | null;
  metaDescription: string | null;
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      const { slug } = await params;
      try {
        const response = await fetch(`/api/posts/slug/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
          
          // Update page meta title
          if (data.metaTitle) {
            document.title = `${data.metaTitle} | Sanket Dhital`;
          } else {
            document.title = `${data.title} | Sanket Dhital`;
          }
          
          // Update meta description
          if (data.metaDescription) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
              metaDesc.setAttribute('content', data.metaDescription);
            }
          }
        } else if (response.status === 404) {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params]);

  const sharePost = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Button onClick={() => router.push('/blog')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Breadcrumb */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-primary-foreground py-4 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-sm hover:text-blue-100 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm hover:text-blue-100 transition-colors">
              <ArrowLeft className="h-4 w-4 rotate-180" />
              All Posts
            </Link>
          </div>
        </div>
      </div>

      <article className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                {post.featured && (
                  <Badge className="bg-primary text-primary-foreground">
                    Featured
                  </Badge>
                )}
                <Badge variant="outline">Blog Post</Badge>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                {post.title}
              </h1>

              <Separator className="mb-6" />

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <span className="font-medium">{post.author.name}</span>
                </div>
                {post.publishedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <time dateTime={post.publishedAt}>
                      {formatDate(new Date(post.publishedAt))}
                    </time>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>{Math.ceil(post.content.length / 500)} min read</span>
                </div>
              </div>

              {post.coverImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8 -mx-4 sm:mx-0"
                >
                  <img
                    src={post.coverImage}
                    alt={post.altText || post.title}
                    className="w-full h-auto rounded-xl shadow-2xl"
                  />
                  {post.altText && (
                    <p className="text-sm text-muted-foreground mt-2 text-center italic">
                      {post.altText}
                    </p>
                  )}
                </motion.div>
              )}
            </motion.header>

            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="prose prose-lg max-w-none dark:prose-invert"
            >
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                  a: ({ node, ...props }) => (
                    <a className="text-primary hover:underline" {...props} />
                  ),
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </motion.div>

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 pt-8 border-t"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="text-sm text-muted-foreground">
                  Found this article helpful? Share it with others.
                </div>
                <Button onClick={sharePost} variant="outline" className="border-2 border-blue-600 hover:border-blue-700 hover:text-blue-700 hover:scale-105 transition-all">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Article
                </Button>
              </div>
            </motion.div>

            {/* Author Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 pt-8 border-t bg-slate-50 rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">About the Author</h3>
                  <p className="text-muted-foreground">
                    {post.author.name} is an administrative professional with over 
                    five years of experience in streamlining operations and ensuring 
                    organizational efficiency. This post reflects their expertise 
                    in administration and business operations.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </article>

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
