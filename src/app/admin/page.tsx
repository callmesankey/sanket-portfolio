'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Image as ImageIcon, 
  MessageSquare, 
  Users,
  TrendingUp,
  ArrowLeft,
  Plus,
  BarChart3,
  LogOut,
  Settings,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Facebook,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

interface Admin {
  id: string;
  email: string;
  name: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [stats, setStats] = useState({
    posts: 0,
    photos: 0,
    contacts: 0,
    unreadContacts: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [postsRes, photosRes, contactsRes] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/photos'),
        fetch('/api/contact')
      ]);

      const postsData = await postsRes.json();
      const photosData = await photosRes.json();
      const contactsData = await contactsRes.json();

      setStats({
        posts: postsData.length || 0,
        photos: photosData.length || 0,
        contacts: contactsData.length || 0,
        unreadContacts: contactsData.filter((c: any) => !c.read).length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/me');
      const data = await response.json();

      console.log('Auth check response:', data);

      if (response.ok && data.success) {
        setAdmin(data.admin);
      } else if (response.status === 401) {
        console.log('Not authenticated, redirecting to login');
        router.push('/admin/login');
      } else {
        console.error('Auth check failed with status:', response.status);
        // Don't redirect on non-401 errors to prevent infinite loops
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/admin/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed', {
        description: 'An error occurred during logout',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-blue-600 to-purple-600"></div>
      </div>
    );
  }

  const socialLinks = [
    { icon: Linkedin, href: 'https://www.linkedin.com/in/sanketdhital', label: 'LinkedIn', color: 'bg-blue-600 hover:bg-blue-700' },
    { icon: Github, href: '#', label: 'GitHub', color: 'bg-slate-800 hover:bg-slate-900' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'bg-sky-500 hover:bg-sky-600' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600' },
    { icon: Facebook, href: '#', label: 'Facebook', color: 'bg-blue-700 hover:bg-blue-800' },
    { icon: Globe, href: '/', label: 'Website', color: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' },
  ];

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.posts,
      description: 'Published and draft posts',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      href: '/admin/posts',
    },
    {
      title: 'Total Photos',
      value: stats.photos,
      description: 'Uploaded images',
      icon: ImageIcon,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      href: '/admin/photos',
    },
    {
      title: 'Contact Messages',
      value: stats.contacts,
      description: 'Total submissions',
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      href: '#contacts',
    },
    {
      title: 'Unread Messages',
      value: stats.unreadContacts,
      description: 'New submissions',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      href: '#contacts',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Navigation Breadcrumb */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline hover:text-blue-100 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
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
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Sanket Logo" className="h-12 w-12" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Admin Dashboard
                </h1>
                <p className="text-slate-600">
                  Welcome back, <span className="font-semibold text-blue-600">{admin?.name || 'Admin'}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                asChild 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-transparent hover:scale-105 transition-all shadow-lg"
              >
                <Link href="/admin/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 border-slate-300 hover:border-red-500 hover:text-red-600 transition-all hover:scale-105"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              <Button 
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold hover:scale-105 transition-all shadow-lg"
              >
                <Link href="/admin/posts/new" className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  New Post
                </Link>
              </Button>
              <Button 
                variant="outline"
                asChild
                className="border-2 border-blue-600 hover:border-blue-700 hover:text-blue-700 hover:scale-105 transition-all"
              >
                <Link href="/admin/photos/upload" className="flex items-center">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Upload Photo
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Separator />

      {/* Stats Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="h-32">
                  <div className="animate-pulse h-full bg-muted rounded-lg" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                >
                  <Link href={stat.href}>
                    <Card className="h-full hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer border-2 border-slate-100 hover:border-transparent group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            <stat.icon className="h-6 w-6 text-white" />
                          </div>
                          <TrendingUp className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardTitle className="text-3xl font-bold mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                          {stat.value}
                        </CardTitle>
                        <CardDescription className="text-base">{stat.title}</CardDescription>
                        <p className="text-sm text-slate-500 mt-2">
                          {stat.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Separator />

      {/* Quick Actions */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Manage Posts', desc: 'Create and edit blog posts', icon: FileText, href: '/admin/posts' },
              { title: 'Manage Photos', desc: 'Upload and organize images', icon: ImageIcon, href: '/admin/photos' },
              { title: 'Manage Galleries', desc: 'Create photo collections', icon: BarChart3, href: '/admin/galleries' },
              { title: 'View Website', desc: 'See live site', icon: Globe, href: '/' },
            ].map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring" }}
              >
                <Link href={action.href}>
                  <Card className="hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer border-2 border-slate-100 hover:border-transparent group">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                            {action.title}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {action.desc}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Social Media Links */}
      <section className="py-8 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-100"
          >
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Connect Your Social Media
            </h2>
            <p className="text-slate-600 mb-6">
              Add your social media links to let visitors connect with you on different platforms.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full aspect-square rounded-2xl ${social.color} flex items-center justify-center text-white shadow-lg hover:shadow-2xl transition-all cursor-pointer`}
                >
                  <social.icon className="h-8 w-8" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 to-slate-950 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left flex items-center gap-3">
              <img src="/logo.png" alt="Sanket Logo" className="h-10 w-10" />
              <div>
                <div className="text-2xl font-bold">
                  Sanket<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">.</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Admin Dashboard
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-sm text-center md:text-right">
              © 2026 Sanket Dhital. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
