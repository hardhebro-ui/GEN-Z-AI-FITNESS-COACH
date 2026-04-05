import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Activity, 
  LayoutGrid, 
  Home, 
  Zap,
  ChevronRight,
  User,
  Info,
  ShieldCheck,
  HelpCircle,
  MessageSquare,
  Coffee
} from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User as FirebaseUser, signOut } from 'firebase/auth';
import { Link, NavLink, useLocation } from 'react-router-dom';

interface NavbarProps {
  onNavigate: (path: string) => void;
  currentState: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentState }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const primaryLinks = [
    { path: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { path: '/explore-plans', label: 'Explore', icon: <LayoutGrid className="w-4 h-4" /> },
    { path: '/blog', label: 'Guides', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const secondaryLinks = [
    { path: '/how-it-works', label: 'Process', icon: <Info className="w-4 h-4" /> },
    { path: '/ai-fitness-benefits', label: 'Why AI?', icon: <ShieldCheck className="w-4 h-4" /> },
    { path: '/faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
    { path: '/reviews', label: 'Reviews', icon: <UsersIcon className="w-4 h-4" /> },
    { path: '/about', label: 'About Us', icon: <User className="w-4 h-4" /> },
    { path: '/contact', label: 'Contact', icon: <MessageSquare className="w-4 h-4" /> },
    { path: '/support', label: 'Support', icon: <Coffee className="w-4 h-4" /> },
  ];

  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-neon rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.3)] group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-black" />
            </div>
            <span className="font-black uppercase italic tracking-tighter text-xl hidden sm:block">
              Fitin60ai<span className="text-neon">.in</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-xl border border-white/5">
              {primaryLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => `
                    flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                    ${isActive 
                      ? 'bg-neon text-black shadow-[0_0_15px_rgba(204,255,0,0.2)]' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  {link.label}
                </NavLink>
              ))}

              {/* More Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsMoreOpen(true)}
                onMouseLeave={() => setIsMoreOpen(false)}
              >
                <button
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                    ${isMoreOpen || secondaryLinks.some(l => location.pathname === l.path)
                      ? 'text-white bg-white/5' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  More
                  <ChevronRight className={`w-3 h-3 transition-transform ${isMoreOpen ? 'rotate-90' : ''}`} />
                </button>

                <AnimatePresence>
                  {isMoreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-zinc-950 border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl"
                    >
                      <div className="grid gap-1">
                        {secondaryLinks.map((link) => (
                          <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => `
                              flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                              ${isActive 
                                ? 'bg-neon/10 text-neon' 
                                : 'text-zinc-400 hover:text-white hover:bg-white/5'}
                            `}
                          >
                            <div className={`p-1.5 rounded-lg ${location.pathname === link.path ? 'bg-neon text-black' : 'bg-zinc-900'}`}>
                              {React.cloneElement(link.icon as React.ReactElement<{ className?: string }>, { className: 'w-3.5 h-3.5' })}
                            </div>
                            {link.label}
                          </NavLink>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <Link
              to="/generate"
              className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4" />
              Start Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-3 bg-zinc-900/50 rounded-xl border border-white/5 text-zinc-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-80 bg-zinc-950 border-l border-white/5 p-8 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <Activity className="w-8 h-8 text-neon" />
                  <span className="font-black uppercase italic tracking-tighter text-lg">Menu</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {[...primaryLinks, ...secondaryLinks].map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => `
                      w-full flex items-center justify-between p-4 rounded-2xl border transition-all
                      ${isActive 
                        ? 'bg-neon/10 border-neon/30 text-neon' 
                        : 'bg-zinc-900/30 border-white/5 text-zinc-400'}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl ${location.pathname === link.path ? 'bg-neon text-black' : 'bg-zinc-800'}`}>
                        {link.icon}
                      </div>
                      <span className="font-black uppercase italic tracking-tight text-sm">{link.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${location.pathname === link.path ? 'text-neon' : 'text-zinc-700'}`} />
                  </NavLink>
                ))}
              </div>

              <div className="space-y-4 mt-auto pt-8 border-t border-white/5">
                <Link
                  to="/generate"
                  className="w-full flex items-center justify-center gap-3 py-5 bg-neon text-black rounded-3xl font-black uppercase italic tracking-widest shadow-[0_0_30px_rgba(204,255,0,0.2)]"
                >
                  <Zap className="w-5 h-5" />
                  Start Now
                </Link>
                
                <div className="flex items-center gap-3 p-4 bg-zinc-900/30 rounded-2xl border border-white/5">
                  {user ? (
                    <>
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 overflow-hidden">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Logged in as</p>
                        <p className="text-xs font-bold text-zinc-300 truncate">{user.displayName || user.email}</p>
                      </div>
                      <button 
                        onClick={handleSignOut}
                        className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={handleSignIn}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      <User className="w-4 h-4" />
                      Sign In to Save Plans
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const UsersIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default Navbar;
