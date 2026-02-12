'use client';
import React, { useState, useEffect } from 'react';
import { Search, Mail, Linkedin, Github, ChevronRight, Edit, Trash2, Plus, LogOut, Menu, X } from 'lucide-react';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({ title: '', content: '', excerpt: '', date: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const result = await (window as any).storage.get('portfolio-blogs');
      if (result && result.value) {
        setBlogs(JSON.parse(result.value));
      }
    } catch (error) {
      setBlogs([]);
    }
  };

  const saveBlogs = async (updatedBlogs: any[]) => {
    try {
      await (window as any).storage.set('portfolio-blogs', JSON.stringify(updatedBlogs));
      setBlogs(updatedBlogs);
    } catch (error) {
      alert('Failed to save blog. Please try again.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      setIsAdmin(true);
      setShowLogin(false);
      setCredentials({ username: '', password: '' });
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setActiveSection('home');
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const newBlog = {
      id: editingBlog?.id || Date.now(),
      ...blogForm,
      date: blogForm.date || new Date().toISOString().split('T')[0]
    };

    let updatedBlogs;
    if (editingBlog) {
      updatedBlogs = blogs.map((b: any) => b.id === editingBlog.id ? newBlog : b);
    } else {
      updatedBlogs = [newBlog, ...blogs];
    }

    await saveBlogs(updatedBlogs);
    setBlogForm({ title: '', content: '', excerpt: '', date: '' });
    setEditingBlog(null);
  };

  const handleEditBlog = (blog: any) => {
    setEditingBlog(blog);
    setBlogForm(blog);
  };

  const handleDeleteBlog = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const updatedBlogs = blogs.filter((b: any) => b.id !== id);
      await saveBlogs(updatedBlogs);
    }
  };

  const experience = [
    {
      title: "Chief Administrative Officer",
      company: "Lapmis Trade Pvt. Ltd.",
      period: "Oct 2021 - Present",
      description: "Leading administrative operations, IT systems management, and cross-functional team coordination"
    },
    {
      title: "Administrative Manager",
      company: "Omega International Pvt.Ltd",
      period: "Feb 2024 - Dec 2025",
      description: "Business development, CRM implementation, and strategic partnership management"
    },
    {
      title: "Editor",
      company: "Rotary Club of Rudramati",
      period: "Jul 2022 - Jul 2025",
      description: "Publication design, content coordination, and community engagement"
    },
    {
      title: "Administrative Manager",
      company: "BIDH Lab",
      period: "Sep 2020 - Oct 2021",
      description: "LIS integration, technical coordination, and operational management"
    }
  ];

  const skills = [
    { category: "Administrative", items: ["Office Coordination", "Data Management", "Documentation", "Process Optimization"] },
    { category: "Technical", items: ["CRM Systems", "IT Systems Management", "Database Administration", "HRIS"] },
    { category: "Business", items: ["Project Leadership", "Business Development", "Strategic Planning", "Team Coordination"] },
    { category: "Tools", items: ["Microsoft Office", "Excel Power Query", "Digital Marketing", "Canva"] }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-900 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        .serif {
          font-family: 'Playfair Display', serif;
        }

        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }

        .slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        .stagger-6 { animation-delay: 0.6s; }

        .nav-link {
          position: relative;
          transition: color 0.3s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: #1e40af;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .btn-primary {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(30, 64, 175, 0.3);
        }

        .geometric-bg {
          background-image: 
            linear-gradient(45deg, rgba(30, 64, 175, 0.03) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(30, 64, 175, 0.03) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(30, 64, 175, 0.03) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(30, 64, 175, 0.03) 75%);
          background-size: 60px 60px;
          background-position: 0 0, 0 30px, 30px -30px, -30px 0px;
        }

        .blog-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }

        .blog-content h2 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .blog-content ul, .blog-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .admin-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .admin-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        textarea.admin-input {
          min-height: 200px;
          resize: vertical;
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold serif">SD</h1>
          
          <div className="hidden md:flex items-center gap-8">
            {['home', 'about', 'experience', 'skills', 'blog', 'contact'].map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`nav-link capitalize ${activeSection === section ? 'active text-blue-700 font-medium' : 'text-slate-600'}`}
              >
                {section}
              </button>
            ))}
            {isAdmin ? (
              <>
                <button
                  onClick={() => setActiveSection('admin')}
                  className={`nav-link ${activeSection === 'admin' ? 'active text-blue-700 font-medium' : 'text-slate-600'}`}
                >
                  Admin
                </button>
                <button onClick={handleLogout} className="text-slate-600 hover:text-red-600 transition">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <button onClick={() => setShowLogin(true)} className="text-slate-600 hover:text-blue-700 transition text-sm">
                Admin Login
              </button>
            )}
          </div>

          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4">
            {['home', 'about', 'experience', 'skills', 'blog', 'contact'].map(section => (
              <button
                key={section}
                onClick={() => {
                  setActiveSection(section);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left py-2 capitalize ${activeSection === section ? 'text-blue-700 font-medium' : 'text-slate-600'}`}
              >
                {section}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => {
                  setActiveSection('admin');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-slate-600"
              >
                Admin
              </button>
            )}
          </div>
        )}
      </nav>

      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl fade-in">
            <h2 className="text-2xl font-bold serif mb-6">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="admin-input"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="admin-input"
                required
              />
              <div className="flex gap-3">
                <button type="submit" className="btn-primary text-white px-6 py-3 rounded-lg flex-1">
                  Login
                </button>
                <button type="button" onClick={() => setShowLogin(false)} className="px-6 py-3 bg-slate-200 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
            <p className="text-xs text-slate-500 mt-4">Default: admin / admin123</p>
          </div>
        </div>
      )}

      <main className="pt-20">
        {activeSection === 'home' && (
          <section className="min-h-screen flex items-center geometric-bg">
            <div className="max-w-6xl mx-auto px-6 py-20">
              <div className={`${mounted ? 'fade-in' : 'opacity-0'}`}>
                <p className="text-blue-700 font-medium mb-4 slide-up stagger-1">Hello, I'm</p>
                <h1 className="text-6xl md:text-7xl font-bold serif mb-6 slide-up stagger-2">
                  Sanket Dhital
                </h1>
                <p className="text-2xl md:text-3xl text-slate-600 mb-8 slide-up stagger-3">
                  Administration & Executive Support
                </p>
                <p className="text-lg text-slate-600 max-w-2xl mb-12 leading-relaxed slide-up stagger-4">
                  Passionate about streamlining operations and ensuring organizational efficiency through 
                  effective administrative support, data management, and strategic coordination.
                </p>
                <div className="flex flex-wrap gap-4 slide-up stagger-5">
                  <button 
                    onClick={() => setActiveSection('contact')}
                    className="btn-primary text-white px-8 py-4 rounded-lg font-medium flex items-center gap-2"
                  >
                    Get In Touch
                    <ChevronRight size={20} />
                  </button>
                  <button 
                    onClick={() => setActiveSection('experience')}
                    className="px-8 py-4 bg-white rounded-lg font-medium border-2 border-slate-200 hover:border-blue-700 transition"
                  >
                    View Experience
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'about' && (
          <section className="min-h-screen py-20">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-5xl font-bold serif mb-12 fade-in">About Me</h2>
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg fade-in stagger-2">
                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                  As an administrative professional with over five years of experience, I specialize in 
                  streamlining operations and ensuring organizational efficiency through effective administrative 
                  support. My expertise spans data management within IT systems, office coordination, 
                  documentation handling, and CRM utilization.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                  I take pride in maintaining data accuracy, integrity, and accessibility while supporting 
                  teams with smooth day-to-day operations. My background includes working closely with 
                  technical, operational, and business development teams to plan, execute, and complete tasks, 
                  fostering collaboration across departments.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Currently pursuing my Bachelor's in Business Studies at Nepal Commerce Campus, I combine 
                  academic knowledge with practical experience to deliver exceptional administrative and 
                  operational support.
                </p>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'experience' && (
          <section className="min-h-screen py-20">
            <div className="max-w-5xl mx-auto px-6">
              <h2 className="text-5xl font-bold serif mb-12 fade-in">Experience</h2>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div 
                    key={index}
                    className={`bg-white rounded-2xl p-8 shadow-lg card-hover border-l-4 border-blue-700 slide-up stagger-${(index % 6) + 1}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold serif mb-2">{exp.title}</h3>
                        <p className="text-lg text-blue-700 font-medium">{exp.company}</p>
                      </div>
                      <span className="text-slate-500 mt-2 md:mt-0">{exp.period}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'skills' && (
          <section className="min-h-screen py-20 geometric-bg">
            <div className="max-w-5xl mx-auto px-6">
              <h2 className="text-5xl font-bold serif mb-12 fade-in">Skills & Expertise</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {skills.map((skillGroup, index) => (
                  <div 
                    key={index}
                    className={`bg-white rounded-2xl p-8 shadow-lg card-hover slide-up stagger-${(index % 6) + 1}`}
                  >
                    <h3 className="text-2xl font-bold serif mb-6 text-blue-700">{skillGroup.category}</h3>
                    <div className="flex flex-wrap gap-3">
                      {skillGroup.items.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'blog' && (
          <section className="min-h-screen py-20">
            <div className="max-w-5xl mx-auto px-6">
              <h2 className="text-5xl font-bold serif mb-12 fade-in">Blog</h2>
              {blogs.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
                  <p className="text-slate-500 text-lg">No blog posts yet. Check back soon!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {blogs.map((blog: any, index) => (
                    <div 
                      key={blog.id}
                      className={`bg-white rounded-2xl p-8 shadow-lg card-hover slide-up stagger-${(index % 4) + 1}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold serif mb-2">{blog.title}</h3>
                          <p className="text-slate-500 text-sm">{blog.date}</p>
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed mb-4">{blog.excerpt}</p>
                      <p className="text-slate-700 leading-relaxed blog-content whitespace-pre-wrap">{blog.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === 'admin' && isAdmin && (
          <section className="min-h-screen py-20">
            <div className="max-w-5xl mx-auto px-6">
              <h2 className="text-5xl font-bold serif mb-12 fade-in">Admin Dashboard</h2>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 fade-in">
                <h3 className="text-2xl font-bold serif mb-6">
                  {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h3>
                <form onSubmit={handleSaveBlog} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Excerpt (Short Description)</label>
                    <input
                      type="text"
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <textarea
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      value={blogForm.date}
                      onChange={(e) => setBlogForm({...blogForm, date: e.target.value})}
                      className="admin-input"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary text-white px-6 py-3 rounded-lg flex items-center gap-2">
                      <Plus size={20} />
                      {editingBlog ? 'Update Post' : 'Publish Post'}
                    </button>
                    {editingBlog && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingBlog(null);
                          setBlogForm({ title: '', content: '', excerpt: '', date: '' });
                        }}
                        className="px-6 py-3 bg-slate-200 rounded-lg"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg fade-in stagger-2">
                <h3 className="text-2xl font-bold serif mb-6">Manage Posts</h3>
                {blogs.length === 0 ? (
                  <p className="text-slate-500">No blog posts yet. Create your first post above!</p>
                ) : (
                  <div className="space-y-4">
                    {blogs.map((blog: any) => (
                      <div key={blog.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-bold">{blog.title}</h4>
                          <p className="text-sm text-slate-500">{blog.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditBlog(blog)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition"
                          >
                            <Edit size={18} className="text-blue-700" />
                          </button>
                          <button 
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition"
                          >
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'contact' && (
          <section className="min-h-screen py-20 geometric-bg">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-5xl font-bold serif mb-12 fade-in">Get In Touch</h2>
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg fade-in stagger-2">
                <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                  Let's connect to discuss how efficient administration can elevate your business operations.
                </p>
                <div className="space-y-6">
                  <a 
                    href="mailto:sankeydhital@gmail.com"
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition card-hover"
                  >
                    <Mail className="text-blue-700" size={24} />
                    <span className="text-lg">sankeydhital@gmail.com</span>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/sanketdhital"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition card-hover"
                  >
                    <Linkedin className="text-blue-700" size={24} />
                    <span className="text-lg">linkedin.com/in/sanketdhital</span>
                  </a>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="text-blue-700 font-bold text-2xl">📍</div>
                    <span className="text-lg">Kathmandu, Nepal</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-slate-400">© 2026 Sanket Dhital. All rights reserved.</p>
          <p className="text-sm text-slate-500 mt-2">Built with precision and purpose</p>
        </div>
      </footer>
    </div>
  );
}
EOFcat > src/components/Portfolio.tsx << 'EOF'
'use client';
import React, { useState, useEffect } from 'react';
import { Search, Mail, Linkedin, Github, ChevronRight, Edit, Trash2, Plus, LogOut, Menu, X } from 'lucide-react';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({ title: '', content: '', excerpt: '', date: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const result = await (window as any).storage.get('portfolio-blogs');
      if (result && result.value) {
        setBlogs(JSON.parse(result.value));
      }
    } catch (error) {
      setBlogs([]);
    }
  };

  const saveBlogs = async (updatedBlogs: any[]) => {
    try {
      await (window as any).storage.set('portfolio-blogs', JSON.stringify(updatedBlogs));
      setBlogs(updatedBlogs);
    } catch (error) {
      alert('Failed to save blog. Please try again.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      setIsAdmin(true);
      setShowLogin(false);
      setCredentials({ username: '', password: '' });
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setActiveSection('home');
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const newBlog = {
      id: editingBlog?.id || Date.now(),
      ...blogForm,
      date: blogForm.date || new Date().toISOString().split('T')[0]
    };

    let updatedBlogs;
    if (editingBlog) {
      updatedBlogs = blogs.map((b: any) => b.id === editingBlog.id ? newBlog : b);
    } else {
      updatedBlogs = [newBlog, ...blogs];
    }

    await saveBlogs(updatedBlogs);
    setBlogForm({ title: '', content: '', excerpt: '', date: '' });
    setEditingBlog(null);
  };

  const handleEditBlog = (blog: any) => {
    setEditingBlog(blog);
    setBlogForm(blog);
  };

  const handleDeleteBlog = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const updatedBlogs = blogs.filter((b: any) => b.id !== id);
      await saveBlogs(updatedBlogs);
    }
  };

  const experience = [
    {
      title: "Chief Administrative Officer",
      company: "Lapmis Trade Pvt. Ltd.",
      period: "Oct 2021 - Present",
      description: "Leading administrative operations, IT systems management, and cross-functional team coordination"
    },
    {
      title: "Administrative Manager",
      company: "Omega International Pvt.Ltd",
      period: "Feb 2024 - Dec 2025",
      description: "Business development, CRM implementation, and strategic partnership management"
    },
    {
      title: "Editor",
      company: "Rotary Club of Rudramati",
      period: "Jul 2022 - Jul 2025",
      description: "Publication design, content coordination, and community engagement"
    },
    {
      title: "Administrative Manager",
      company: "BIDH Lab",
      period: "Sep 2020 - Oct 2021",
      description: "LIS integration, technical coordination, and operational management"
    }
  ];

  const skills = [
    { category: "Administrative", items: ["Office Coordination", "Data Management", "Documentation", "Process Optimization"] },
    { category: "Technical", items: ["CRM Systems", "IT Systems Management", "Database Administration", "HRIS"] },
    { category: "Business", items: ["Project Leadership", "Business Development", "Strategic Planning", "Team Coordination"] },
    { category: "Tools", items: ["Microsoft Office", "Excel Power Query", "Digital Marketing", "Canva"] }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-900 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        .serif {
          font-family: 'Playfair Display', serif;
        }

        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }

        .slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        .stagger-6 { animation-delay: 0.6s; }

        .nav-link {
          position: relative;
          transition: color 0.3s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: #1e40af;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .btn-primary {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(30, 64, 175, 0.3);
        }

        .geometric-bg {
          background-image: 
            linear-gradient(45deg, rgba(30, 64, 175, 0.03) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(30, 64, 175, 0.03) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(30, 64, 175, 0.03) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(30, 64, 175, 0.03) 75%);
          background-size: 60px 60px;
          background-position: 0 0, 0 30px, 30px -30px, -30px 0px;
        }

        .blog-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }

        .blog-content h2 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .blog-content ul, .blog-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .admin-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .admin-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        textarea.admin-input {
          min-height: 200px;
          resize: vertical;
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold serif">SD</h1>
          
          <div className="hidden md:flex items-center gap-8">
            {['home', 'about', 'experience', 'skills', 'blog', 'contact'].map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`nav-link capitalize ${activeSection === section ? 'active text-blue-700 font-medium' : 'text-slate-600'}`}
              >
                {section}
              </button>
            ))}
            {isAdmin ? (
              <>
                <button
                  onClick={() => setActiveSection('admin')}
                  className={`nav-link ${activeSection === 'admin' ? 'active text-blue-700 font-medium' : 'text-slate-600'}`}
                >
                  Admin
                </button>
                <button onClick={handleLogout} className="text-slate-600 hover:text-red-600 transition">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <button onClick={() => setShowLogin(true)} className="text-slate-600 hover:text-blue-700 transition text-sm">
                Admin Login
              </button>
            )}
          </div>

          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4">
            {['home', 'about', 'experience', 'skills', 'blog', 'contact'].map(section => (
              <button
                key={section}
                onClick={() => {
                  setActiveSection(section);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left py-2 capitalize ${activeSection === section ? 'text-blue-700 font-medium' : 'text-slate-600'}`}
              >
                {section}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => {
                  setActiveSection('admin');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-slate-600"
              >
                Admin
              </button>
            )}
          </div>
        )}
      </nav>

      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl fade-in">
            <h2 className="text-2xl font-bold serif mb-6">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="admin-input"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="admin-input"
                required
              />
              <div className="flex gap-3">
                <button type="submit" className="btn-primary text-white px-6 py-3 rounded-lg flex-1">
                  Login
                </button>
                <button type="button" onClick={() => setShowLogin(false)} className="px-6 py-3 bg-slate-200 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
            <p className="text-xs text-slate-500 mt-4">Default: admin / admin123</p>
          </div>
        </div>
      )}

      <main className="pt-20">
        {activeSection === 'home' && (
          <section className="min-h-screen flex items-center geometric-bg">
            <div className="max-w-6xl mx-auto px-6 py-20">
              <div className={`${mounted ? 'fade-in' : 'opacity-0'}`}>
                <p className="text-blue-700 font-medium mb-4 slide-up stagger-1">Hello, I'm</p>
                <h1 className="text-6xl md:text-7xl font-bold serif mb-6 slide-up stagger-2">
                  Sanket Dhital
                </h1>
                <p className="text-2xl md:text-3xl text-slate-600 mb-8 slide-up stagger-3">
                  Administration & Executive Support
                </p>
                <p className="text-lg text-slate-600 max-w-2xl mb-12 leading-relaxed slide-up stagger-4">
                  Passionate about streamlining operations and ensuring organizational efficiency through 
                  effective administrative support, data management, and strategic coordination.
                </p>
                <div className="flex flex-wrap gap-4 slide-up stagger-5">
                  <button 
                    onClick={() => setActiveSection('contact')}
                    className="btn-primary text-white px-8 py-4 rounded-lg font-medium flex items-center gap-2"
                  >
                    Get In Touch
                    <ChevronRight size={20} />
                  </button>
                  <button 
                    onClick={() => setActiveSection('experience')}
                    className="px-8 py-4 bg-white rounded-lg font-medium border-2 border-slate-200 hover:border-blue-700 transition"
                  >
                    View Experience
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'about' && (
          <section className="min-h-screen py-20">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-5xl font-bold serif mb-12 fade-in">About Me</h2>
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg fade-in stagger-2">
                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                  As an administrative professional with over five years of experience, I specialize in 
                  streamlining operations and ensuring organizational efficiency through effective administrative 
                  support. My expertise spans data management within IT systems, office coordination, 
                  documentation handling, and CRM utilization.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                  I take pride in maintaining data accuracy, integrity, and accessibility while supporting 
                  teams with smooth day-to-day operations. My background includes working closely with 
                  technical, operational, and business development teams to plan, execute, and complete tasks, 
                  fostering collaboration across departments.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Currently pursuing my Bachelor's in Business Studies at Nepal Commerce Campus, I combine 
                  academic knowledge with practical experience to deliver exceptional administrative and 
                  operational support.
                </p>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'experience' && (
          <section className="min-h-screen py-20">
            <div className="max-w-5xl mx-auto px-6">
              <h2 className="text-5xl font-bold serif mb-12 fade-in">Experience</h2>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div 
                    key={index}
                    className={`bg-white rounded-2xl p-8 shadow-lg card-hover border-l-4 border-blue-700 slide-up stagger-${(index % 6) + 1}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold serif mb-2">{exp.title}</h3>
                        <p className="text-lg text-blue-700 font-medium">{exp.company}</p>
                      </div>
                      <span className="text-slate-500 mt-2 md:mt-0">{exp.period}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'skills' && (
          <section className="min-h-screen py-20 geometric-bg">
            <div className="max-w-5xl mx-auto px-6">
              <h2 className="text-5xl font-bold serif mb-12 fade-in">Skills & Expertise</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {skills.map((skillGroup, index) => (
                  <div 
                    key={index}
                    className={`bg-white rounded-2xl p-8 shadow-lg card-hover slide-up stagger-${(index % 6) + 1}`}
                  >
                    <h3 className="text-2xl font-bold serif mb-6 text-blue-700">{skillGroup.category}</h3>
                    <div className="flex flex-wrap gap-3">
                      {skillGroup.items.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'blog' && (
          <section className="min-h-screen py-20">
            <div className="max-w-5xl mx-auto px-6">
              <h2 className="text-5xl font-bold serif mb-12 fade-in">Blog</h2>
              {blogs.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
                  <p className="text-slate-500 text-lg">No blog posts yet. Check back soon!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {blogs.map((blog: any, index) => (
                    <div 
                      key={blog.id}
                      className={`bg-white rounded-2xl p-8 shadow-lg card-hover slide-up stagger-${(index % 4) + 1}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold serif mb-2">{blog.title}</h3>
                          <p className="text-slate-500 text-sm">{blog.date}</p>
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed mb-4">{blog.excerpt}</p>
                      <p className="text-slate-700 leading-relaxed blog-content whitespace-pre-wrap">{blog.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === 'admin' && isAdmin && (
          <section className="min-h-screen py-20">
            <div className="max-w-5xl mx-auto px-6">
              <h2 className="text-5xl font-bold serif mb-12 fade-in">Admin Dashboard</h2>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 fade-in">
                <h3 className="text-2xl font-bold serif mb-6">
                  {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h3>
                <form onSubmit={handleSaveBlog} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Excerpt (Short Description)</label>
                    <input
                      type="text"
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <textarea
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      value={blogForm.date}
                      onChange={(e) => setBlogForm({...blogForm, date: e.target.value})}
                      className="admin-input"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary text-white px-6 py-3 rounded-lg flex items-center gap-2">
                      <Plus size={20} />
                      {editingBlog ? 'Update Post' : 'Publish Post'}
                    </button>
                    {editingBlog && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingBlog(null);
                          setBlogForm({ title: '', content: '', excerpt: '', date: '' });
                        }}
                        className="px-6 py-3 bg-slate-200 rounded-lg"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg fade-in stagger-2">
                <h3 className="text-2xl font-bold serif mb-6">Manage Posts</h3>
                {blogs.length === 0 ? (
                  <p className="text-slate-500">No blog posts yet. Create your first post above!</p>
                ) : (
                  <div className="space-y-4">
                    {blogs.map((blog: any) => (
                      <div key={blog.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-bold">{blog.title}</h4>
                          <p className="text-sm text-slate-500">{blog.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditBlog(blog)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition"
                          >
                            <Edit size={18} className="text-blue-700" />
                          </button>
                          <button 
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition"
                          >
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'contact' && (
          <section className="min-h-screen py-20 geometric-bg">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-5xl font-bold serif mb-12 fade-in">Get In Touch</h2>
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg fade-in stagger-2">
                <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                  Let's connect to discuss how efficient administration can elevate your business operations.
                </p>
                <div className="space-y-6">
                  <a 
                    href="mailto:sankeydhital@gmail.com"
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition card-hover"
                  >
                    <Mail className="text-blue-700" size={24} />
                    <span className="text-lg">sankeydhital@gmail.com</span>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/sanketdhital"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition card-hover"
                  >
                    <Linkedin className="text-blue-700" size={24} />
                    <span className="text-lg">linkedin.com/in/sanketdhital</span>
                  </a>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="text-blue-700 font-bold text-2xl">📍</div>
                    <span className="text-lg">Kathmandu, Nepal</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-slate-400">© 2026 Sanket Dhital. All rights reserved.</p>
          <p className="text-sm text-slate-500 mt-2">Built with precision and purpose</p>
        </div>
      </footer>
    </div>
  );
}
