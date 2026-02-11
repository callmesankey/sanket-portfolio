'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowDown, 
  ArrowUp, 
  Linkedin, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  Github, 
  Twitter, 
  Instagram, 
  Facebook, 
  ExternalLink,
  FileText,
  Briefcase,
  Award,
  Code,
  Users,
  Building2,
  Target,
  Zap,
  CheckCircle,
  Star,
  ArrowRight,
  Download,
  FileEdit,
  Calendar,
  Map
} from 'lucide-react';

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeExperience, setActiveExperience] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setShowScrollTop(scrollPosition > 500);

    const sections = ['hero', 'about', 'experience', 'contact'];
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) {
          setActiveSection(section);
          break;
        }
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setIsMounted(true);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const experiences = [
    {
      year: '2021 - Present',
      title: 'Senior Administrative Officer',
      company: 'Tech Solutions Inc.',
      description: 'Leading administrative operations, managing office coordination, and optimizing team workflows. Overseeing daily operations and ensuring seamless communication across departments.',
      skills: ['CRM Management', 'Team Leadership', 'Process Optimization'],
    },
    {
      year: '2019 - 2021',
      title: 'Administrative Assistant',
      company: 'Global Operations Ltd.',
      description: 'Supported senior management in daily operations, handled data entry and documentation, and maintained accurate records across multiple projects.',
      skills: ['Data Management', 'Office Administration', 'Communication'],
    },
    {
      year: '2017 - 2019',
      title: 'Office Coordinator',
      company: 'Prime Business Solutions',
      description: 'Implemented new filing systems that improved efficiency by 30%.',
      skills: ['Project Coordination', 'Resource Management', 'Inventory Control'],
    },
  ];

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-md"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link href="/" className="flex items-center gap-3">
                <motion.img
                  src="/logo.png"
                  alt="Sanket Logo"
                  className="h-10 w-10 cursor-pointer"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                />
                <span className="text-2xl font-bold text-slate-900">
                  Sanket<span className="text-blue-600">.</span>
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {[
                { name: 'About', href: '#about', icon: Users },
                { name: 'Experience', href: '#experience', icon: Briefcase },
                { name: 'Blog', href: '/blog', icon: FileText },
                { name: 'Contact', href: '#contact', icon: Mail },
              ].map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 relative flex items-center gap-2 ${
                    activeSection === item.name.toLowerCase() ? 'text-blue-600' : 'text-slate-700'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                  {activeSection === item.name.toLowerCase() && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    />
                  )}
                </motion.a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="text-sm font-medium">Menu</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-200"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-2">
              {[
                { name: 'About', href: '#about', icon: Users },
                { name: 'Experience', href: '#experience', icon: Briefcase },
                { name: 'Blog', href: '/blog', icon: FileText },
                { name: 'Contact', href: '#contact', icon: Mail },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium flex items-center gap-3"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full"
                style={{
                  width: Math.random() * 300 + 100,
                  height: Math.random() * 300 + 100,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, 20, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}

        <div className="text-center px-4 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Administration & Business Operations
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl sm:text-6xl font-bold text-slate-900 mb-4"
          >
            <span className="inline-block hover:text-blue-600 transition-colors cursor-default">
              Sanket
            </span>
            <span className="inline-block hover:text-purple-600 transition-colors cursor-default">
              {' '}Dhital
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl text-slate-600 mb-8"
          >
            Streamlining Business Operations & Ensuring{' '}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Organizational Efficiency
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              >
              <Link href="#about" className="inline-block">
                <motion.span
                  className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold border-2 border-blue-600 hover:border-purple-600 shadow-lg hover:shadow-xl transition-all"
                >
                  Explore More About Me{' '}
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowDown className="w-5 h-5" />
                  </motion.div>
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          {/* View Blog Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/blog" className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                <FileText className="h-5 w-5" />
                <span>View My Blog</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center justify-center gap-4 mt-12"
          >
            {[
              { icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-blue-600' },
              { icon: Github, label: 'GitHub', color: 'hover:bg-slate-800' },
              { icon: Twitter, label: 'Twitter', color: 'hover:bg-sky-500' },
              { icon: Instagram, label: 'Instagram', color: 'hover:bg-pink-600' },
              { icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-700' },
            ].map((social, index) => (
              <motion.div
                key={social.label}
                className="p-4 bg-slate-100 hover:bg-white rounded-2xl transition-all shadow-lg hover:shadow-2xl group"
                whileHover={{ y: -5 }}
                transition={{ delay: index * 0.1 }}
              >
                <social.icon className="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-slate-300 rounded-full flex items-start justify-center pt-2"
          >
            <div className="w-1 h-2 bg-blue-600 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl font-bold text-slate-900 mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Who I Am
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-slate-600 mb-12 leading-relaxed"
            >
              I am an administrative professional with over{' '}
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                5 years of experience
              </span>
              {' '} passionate about streamlining operations and ensuring organizational efficiency. My expertise lies in data management, office coordination, and CRM utilization. I take pride in maintaining data accuracy, integrity, and accessibility while supporting teams with smooth day-to-day operations.
            </motion.p>

            {/* Skills Cards with Icons */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  title: 'Data Management', 
                  icon: <Building2 className="h-8 w-8 text-blue-600" />, 
                  color: 'from-blue-500/10 to-blue-600/20',
                  description: 'Advanced database & CRM skills'
                },
                { 
                  title: 'Office Coordination', 
                  icon: <Users className="h-8 w-8 text-green-600" />, 
                  color: 'from-green-500/10 to-green-600/20',
                  description: 'Efficient workflow management'
                },
                { 
                  title: 'CRM Utilization', 
                  icon: <Target className="h-8 w-8 text-purple-600" />, 
                  color: 'from-purple-500/10 to-purple-600/20',
                  description: 'Salesforce & HubSpot certified'
                },
                { 
                  title: 'Process Optimization', 
                  icon: <Zap className="h-8 w-8 text-orange-600" />, 
                  color: 'from-orange-500/10 to-orange-600/20',
                  description: 'Streamlined operations'
                },
                { 
                  title: 'Team Support', 
                  icon: <CheckCircle className="h-8 w-8 text-teal-600" />, 
                  color: 'from-teal-500/10 to-teal-600/20',
                  description: 'Cross-functional collaboration'
                },
                { 
                  title: 'Quality Assurance', 
                  icon: <Star className="h-8 w-8 text-yellow-600" />, 
                  color: 'from-yellow-500/10 to-yellow-600/20',
                  description: 'Attention to detail'
                },
              ].map((skill, index) => (
                <motion.div
                  key={skill.title}
                  initial={{ opacity: 0, y: 30, rotate: -5 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.1, y: -10, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-gradient-to-br ${skill.color} p-8 rounded-3xl border-2 border-slate-100 hover:border-blue-500 hover:shadow-2xl transition-all cursor-default`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {skill.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3 mt-4">
                    {skill.title}
                  </h3>
                  <p className="text-slate-600">
                    {skill.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="#contact" className="inline-flex items-center gap-3">
                  <span className="text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Let's Connect
                  </span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Mail className="h-5 w-5 text-blue-600" />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section - NEW! */}
      <section id="experience" className="min-h-screen flex items-center bg-gradient-to-br from-slate-50 to-white relative">
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden opacity-30">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-blue-500/5 rounded-full blur-3xl"
                style={{
                  width: Math.random() * 400 + 200,
                  height: Math.random() * 400 + 200,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: Math.random() * 6 + 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
            >
              <motion.h2
                className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                My Professional Journey
              </motion.h2>
              <p className="text-xl text-slate-600">
                5+ years of excellence in administration & operations
              </p>
            </motion.div>

            {/* Experience Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-purple-600 to-blue-600"></div>

              <div className="space-y-12 ml-4 md:ml-16 pl-12">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    className="relative"
                  >
                    {/* Timeline Dot */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.3 }}
                      className={`absolute left-0 top-6 w-4 h-4 rounded-full ${
                        activeExperience === index ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-slate-300'
                      } transition-colors cursor-pointer`}
                      onClick={() => setActiveExperience(index)}
                    >
                      <Calendar className="h-4 w-4 text-white" />
                    </motion.div>

                    {/* Experience Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 + 0.2, duration: 0.5 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="ml-12 bg-white rounded-2xl p-8 border-2 border-slate-100 hover:border-blue-500 hover:shadow-2xl transition-all"
                    >
                      <div className="mb-3">
                        <motion.span
                          className="inline-block px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full"
                          whileHover={{ scale: 1.05 }}
                        >
                          {exp.year}
                        </motion.span>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-800 mb-2 hover:text-blue-600 transition-colors">
                        {exp.title}
                      </h3>
                      <p className="text-slate-600 mb-2">
                        {exp.company}
                      </p>
                      <p className="text-slate-600 leading-relaxed">
                        {exp.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {exp.skills.map((skill) => (
                          <motion.span
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* View CV Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-center mt-16"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all"
                >
                  <Download className="h-5 w-5" />
                  Download My CV
                  <ArrowRight className="h-5 w-5 ml-2" />
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center bg-gradient-to-br from-slate-50 to-white relative py-20">
        {/* Background Pattern */}
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden opacity-30">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-blue-500/5 rounded-full"
                style={{
                  width: Math.random() * 200 + 50,
                  height: Math.random() * 200 + 50,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: Math.random() * 4 + 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl w-full"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Contact Info */}
              <div className="w-full">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="space-y-8"
                >
                  <motion.h2
                    className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Let's Connect
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-lg text-slate-600 mb-12"
                  >
                    Open for opportunities in Administration and Operations
                  </motion.p>

                  <div className="space-y-4">
                    {[
                      { icon: MapPin, text: 'Kathmandu, Nepal' },
                      { icon: Mail, text: 'sankeydhital@gmail.com' },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:shadow-lg transition-all group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="p-3 bg-gradient-to-br from-slate-100 to-blue-100 rounded-lg group-hover:from-blue-600 group-hover:to-purple-600 transition-colors"
                        >
                          <item.icon className="h-6 w-6 text-slate-600 group-hover:text-white transition-colors" />
                        </motion.div>
                        <span className="font-medium text-slate-700 group-hover:text-slate-900">
                          {item.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Social Media Showcase */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="hidden lg:block"
              >
                <motion.div
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative max-w-md mx-auto"
                >
                  {/* Decorative Frame */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl"
                    animate={{
                      rotate: [0, 1, 0, -1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  {/* Glow Effect */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-3xl blur-xl opacity-30"></div>

                  <motion.div
                    initial={{ y: 20, scale: 0.9 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="relative z-10 bg-white/90 backdrop-blur-sm rounded-3xl p-8"
                  >
                    {/* Professional Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="w-32 h-32 mx-auto mb-6 relative"
                    >
                      {/* Floating Ring */}
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 180, 360],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full border-4 border-dashed border-blue-600/30"
                      />

                      {/* User Icon */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="relative z-10 w-full h-full flex items-center justify-center"
                      >
                        <motion.div
                          className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <span className="text-4xl font-bold text-white">SD</span>
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    {/* Name Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="text-center"
                    >
                      <motion.h3
                        className="text-3xl font-bold text-white mb-2"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        Sanket Dhital
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="text-white/90 font-medium"
                      >
                        Administrative Professional
                      </motion.p>
                    </motion.div>

                    {/* Social Media Logos */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                      className="flex items-center justify-center gap-3 mt-6"
                    >
                      {[
                        { icon: Linkedin, color: 'hover:bg-blue-600' },
                        { icon: Github, color: 'hover:bg-slate-800' },
                        { icon: Twitter, color: 'hover:bg-sky-500' },
                        { icon: Instagram, color: 'hover:bg-pink-600' },
                        { icon: Facebook, color: 'hover:bg-blue-700' },
                      ].map((social, index) => (
                        <motion.div
                          key={index}
                          className={`p-3 bg-slate-100 hover:bg-white rounded-xl transition-all shadow-md hover:shadow-lg group ${social.color}`}
                          whileHover={{ y: -3, scale: 1.1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <social.icon className="h-5 w-5 text-slate-600 group-hover:text-white transition-colors" />
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-purple-600 font-medium transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
                style={{
                  width: Math.random() * 400 + 200,
                  height: Math.random() * 400 + 200,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -50, 0],
                  x: [0, 50, 0],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: Math.random() * 6 + 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <motion.img
                  src="/logo.png"
                  alt="Sanket Logo"
                  className="h-12 w-12 cursor-pointer"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                />
                <h3 className="text-2xl font-bold">
                  Sanket<span className="text-blue-600">.</span>
                </h3>
                <p className="text-slate-400 text-sm">
                  Administration & Business Operations Professional
                </p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-slate-400 text-sm text-center md:text-right"
            >
              © 2026 Sanket Dhital. All rights reserved.
            </motion.p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all"
          >
            <ArrowUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Contact Button */}
      <motion.div
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        className="fixed bottom-8 left-8 z-50"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="#contact"
            className="flex items-center gap-3 bg-white text-slate-900 hover:text-blue-600 px-6 py-3 rounded-xl border-2 border-blue-600 hover:border-purple-600 shadow-2xl hover:shadow-3xl transition-all"
          >
            <Mail className="h-5 w-5" />
            <span className="font-medium">Contact Me</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
