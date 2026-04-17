import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Instagram, MessageSquare, ShieldCheck, Mail, Zap } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Home", path: "/" },
        { label: "Process", path: "/#process" },
        { label: "Explore Plans", path: "/explore" },
        { label: "Knowledge Base", path: "/guides" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", path: "/#about" },
        { label: "Reviews", path: "/#reviews" },
        { label: "Why AI?", path: "/#benefits" },
        { label: "Contact Us", path: "/#contact" },
      ]
    },
    {
      title: "Support",
      links: [
        { label: "FAQ", path: "/#faq" },
        { label: "Terms of Service", path: "/terms-conditions" },
        { label: "Privacy Policy", path: "/privacy-policy" },
        { label: "Disclaimer", path: "/disclaimer" },
      ]
    }
  ];

  return (
    <footer className="w-full bg-zinc-950 border-t border-white/5 pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-neon rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.3)] group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-black" />
              </div>
              <span className="font-black uppercase italic tracking-tighter text-xl">
                Fitin60ai<span className="text-neon">.in</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xs">
              AI-powered personalized workout and diet plan generator. Get your elite fitness protocol in 60 seconds.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:text-neon transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="/contact-us" className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:text-neon transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="text-zinc-500 hover:text-neon text-sm font-bold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600">
            <span>© {currentYear} Fitin60ai.in</span>
            <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
            <span>All Rights Reserved</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-white/5">
              <ShieldCheck className="w-3 h-3 text-neon" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Secure AI Protocol</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-white/5">
              <Zap className="w-3 h-3 text-neon" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Instant PDF Engine</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
