import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  Mail, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Search,
  Filter,
  Eye,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { auth, db, googleProvider } from '../firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import { guides } from '../data/guides';

const ADMIN_EMAIL = "hardhebro@gmail.com";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  published: boolean;
  createdAt: Timestamp;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Timestamp;
}

const AdminPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'blog' | 'contact'>('blog');
  const [isMigrating, setIsMigrating] = useState(false);
  
  // Blog State
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
  
  // Contact State
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [viewingSubmission, setViewingSubmission] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u && u.email === ADMIN_EMAIL) {
        setUser(u);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Listen to Blog Posts
    const blogQuery = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
    const unsubBlog = onSnapshot(blogQuery, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
    });

    // Listen to Contact Submissions
    const contactQuery = query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc'));
    const unsubContact = onSnapshot(contactQuery, (snapshot) => {
      setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactSubmission)));
    });

    return () => {
      unsubBlog();
      unsubContact();
    };
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const migrateGuides = async () => {
    if (posts.length > 0) {
      alert("Firestore already has posts. Migration skipped to avoid duplicates.");
      return;
    }
    
    if (!window.confirm("This will upload all static guides from guides.ts to Firestore. Continue?")) return;
    
    setIsMigrating(true);
    try {
      for (const guide of guides) {
        await addDoc(collection(db, 'blogPosts'), {
          title: guide.title,
          content: guide.content,
          excerpt: guide.description,
          category: guide.category,
          published: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          author: "Admin",
          image: ""
        });
      }
      alert("Migration successful!");
    } catch (error) {
      console.error("Migration failed", error);
      alert("Migration failed. Check console.");
    } finally {
      setIsMigrating(false);
    }
  };

  const savePost = async () => {
    if (!currentPost.title || !currentPost.content) return;
    
    const postData = {
      ...currentPost,
      updatedAt: serverTimestamp(),
      published: currentPost.published ?? false,
    };

    try {
      if (currentPost.id) {
        await updateDoc(doc(db, 'blogPosts', currentPost.id), postData);
      } else {
        await addDoc(collection(db, 'blogPosts'), {
          ...postData,
          createdAt: serverTimestamp(),
        });
      }
      setIsEditingPost(false);
      setCurrentPost({});
    } catch (error) {
      console.error("Error saving post", error);
    }
  };

  const deletePost = async (id: string) => {
    if (window.confirm("Delete this post?")) {
      await deleteDoc(doc(db, 'blogPosts', id));
    }
  };

  const markAsRead = async (id: string) => {
    await updateDoc(doc(db, 'contactSubmissions', id), { status: 'read' });
  };

  const deleteSubmission = async (id: string) => {
    if (window.confirm("Delete this submission?")) {
      await deleteDoc(doc(db, 'contactSubmissions', id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-neon animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <Helmet>
          <title>Admin Login | Fitin60ai.in</title>
        </Helmet>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-zinc-900/50 border border-white/5 p-12 rounded-[3rem] text-center space-y-8"
        >
          <div className="w-20 h-20 bg-neon/10 rounded-3xl flex items-center justify-center mx-auto">
            <LayoutDashboard className="w-10 h-10 text-neon" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black uppercase italic tracking-tight">Admin Portal</h1>
            <p className="text-zinc-500 font-medium">Please sign in with your authorized Google account to continue.</p>
          </div>
          <button 
            onClick={handleLogin}
            className="w-full py-5 bg-white text-black font-black uppercase italic tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      <Helmet>
        <title>Admin Dashboard | Fitin60ai.in</title>
      </Helmet>

      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col p-8 fixed h-full bg-zinc-950 z-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-neon rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-black" />
          </div>
          <span className="font-black uppercase italic tracking-tighter text-xl">Admin</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('blog')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'blog' ? 'bg-neon text-black' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}
          >
            <FileText className="w-5 h-5" />
            Blog Posts
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'contact' ? 'bg-neon text-black' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}
          >
            <Mail className="w-5 h-5" />
            Submissions
            {submissions.filter(s => s.status === 'new').length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-1 rounded-full">
                {submissions.filter(s => s.status === 'new').length}
              </span>
            )}
          </button>
        </nav>

        <div className="pt-8 border-t border-white/5">
          <div className="flex items-center gap-4 mb-6 px-2">
            <img src={user.photoURL || ''} className="w-10 h-10 rounded-full border border-white/10" alt="Admin" />
            <div className="overflow-hidden">
              <p className="text-sm font-black truncate">{user.displayName}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-12">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tight">
              {activeTab === 'blog' ? 'Blog Articles' : 'Contact Submissions'}
            </h1>
            <p className="text-zinc-500 font-medium">Manage your site content and user inquiries.</p>
          </div>
          {activeTab === 'blog' && (
            <div className="flex gap-4">
              {posts.length === 0 && (
                <button 
                  onClick={migrateGuides}
                  disabled={isMigrating}
                  className="px-8 py-4 bg-zinc-800 text-white font-black uppercase italic tracking-widest rounded-2xl flex items-center gap-3 hover:bg-zinc-700 transition-all disabled:opacity-50"
                >
                  {isMigrating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  Migrate Static Guides
                </button>
              )}
              <button 
                onClick={() => {
                  setCurrentPost({ published: true });
                  setIsEditingPost(true);
                }}
                className="px-8 py-4 bg-neon text-black font-black uppercase italic tracking-widest rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(204,255,0,0.2)]"
              >
                <Plus className="w-5 h-5" />
                New Article
              </button>
            </div>
          )}
        </header>

        {activeTab === 'blog' ? (
          <div className="grid grid-cols-1 gap-6">
            {posts.map(post => (
              <div key={post.id} className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2rem] flex items-center justify-between group hover:border-neon/30 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${post.published ? 'bg-neon/10 text-neon' : 'bg-zinc-800 text-zinc-500'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {post.createdAt?.toDate().toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight">{post.title}</h3>
                  <p className="text-zinc-500 text-sm line-clamp-1 max-w-2xl">{post.excerpt}</p>
                </div>
                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setCurrentPost(post);
                      setIsEditingPost(true);
                    }}
                    className="p-4 bg-zinc-900 rounded-2xl text-zinc-400 hover:text-neon transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => deletePost(post.id)}
                    className="p-4 bg-zinc-900 rounded-2xl text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <div className="text-center py-20 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/5">
                <FileText className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-500 font-bold">No articles yet. Start writing!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {submissions.map(sub => (
              <div key={sub.id} className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2rem] flex items-center justify-between group hover:border-neon/30 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${sub.status === 'new' ? 'bg-red-500/10 text-red-500' : 'bg-neon/10 text-neon'}`}>
                      {sub.status}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {sub.createdAt?.toDate().toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight">{sub.subject}</h3>
                  <p className="text-zinc-400 font-bold">{sub.name} <span className="text-zinc-600 font-medium ml-2">{sub.email}</span></p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      setViewingSubmission(sub);
                      if (sub.status === 'new') markAsRead(sub.id);
                    }}
                    className="p-4 bg-neon text-black rounded-2xl hover:scale-110 transition-transform"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => deleteSubmission(sub.id)}
                    className="p-4 bg-zinc-900 rounded-2xl text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {submissions.length === 0 && (
              <div className="text-center py-20 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/5">
                <Mail className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-500 font-bold">No submissions yet.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Blog Editor Modal */}
      <AnimatePresence>
        {isEditingPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingPost(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-zinc-900 border border-white/10 rounded-[3rem] overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                <h2 className="text-2xl font-black uppercase italic tracking-tight">
                  {currentPost.id ? 'Edit Article' : 'New Article'}
                </h2>
                <button onClick={() => setIsEditingPost(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-12 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Title</label>
                    <input 
                      value={currentPost.title || ''}
                      onChange={e => setCurrentPost({...currentPost, title: e.target.value})}
                      placeholder="Article title"
                      className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 text-white focus:border-neon outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Category</label>
                    <select 
                      value={currentPost.category || ''}
                      onChange={e => setCurrentPost({...currentPost, category: e.target.value})}
                      className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 text-white focus:border-neon outline-none transition-colors"
                    >
                      <option value="">Select Category</option>
                      <option value="Workout">Workout</option>
                      <option value="Nutrition">Nutrition</option>
                      <option value="AI Fitness">AI Fitness</option>
                      <option value="Success Stories">Success Stories</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Excerpt</label>
                  <textarea 
                    value={currentPost.excerpt || ''}
                    onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})}
                    rows={2}
                    placeholder="Brief summary for the list view..."
                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 text-white focus:border-neon outline-none transition-colors resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Content (Markdown Supported)</label>
                  <textarea 
                    value={currentPost.content || ''}
                    onChange={e => setCurrentPost({...currentPost, content: e.target.value})}
                    rows={12}
                    placeholder="Write your article here..."
                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 text-white font-mono text-sm focus:border-neon outline-none transition-colors resize-none"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div 
                      onClick={() => setCurrentPost({...currentPost, published: !currentPost.published})}
                      className={`w-12 h-6 rounded-full transition-colors relative ${currentPost.published ? 'bg-neon' : 'bg-zinc-800'}`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${currentPost.published ? 'translate-x-6' : ''}`} />
                    </div>
                    <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">Published</span>
                  </label>
                </div>
              </div>

              <div className="p-8 border-t border-white/5 bg-zinc-900/50 flex justify-end gap-4">
                <button 
                  onClick={() => setIsEditingPost(false)}
                  className="px-8 py-4 bg-zinc-800 text-white font-black uppercase italic tracking-widest rounded-2xl hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={savePost}
                  className="px-12 py-4 bg-neon text-black font-black uppercase italic tracking-widest rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(204,255,0,0.2)]"
                >
                  <Save className="w-5 h-5" />
                  Save Article
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Submission Viewer Modal */}
      <AnimatePresence>
        {viewingSubmission && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingSubmission(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[3rem] overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-neon" />
                  <h2 className="text-xl font-black uppercase italic tracking-tight">Submission Details</h2>
                </div>
                <button onClick={() => setViewingSubmission(null)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-12 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">From</p>
                    <p className="text-lg font-black">{viewingSubmission.name}</p>
                    <p className="text-zinc-400 font-medium">{viewingSubmission.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Date</p>
                    <p className="text-lg font-black">{viewingSubmission.createdAt?.toDate().toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Subject</p>
                  <p className="text-xl font-black italic text-neon">"{viewingSubmission.subject}"</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Message</p>
                  <div className="bg-zinc-950 border border-white/5 p-8 rounded-3xl text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {viewingSubmission.message}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-white/5 bg-zinc-900/50 flex justify-center">
                <a 
                  href={`mailto:${viewingSubmission.email}?subject=Re: ${viewingSubmission.subject}`}
                  className="px-12 py-4 bg-neon text-black font-black uppercase italic tracking-widest rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(204,255,0,0.2)]"
                >
                  <Mail className="w-5 h-5" />
                  Reply via Email
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;
