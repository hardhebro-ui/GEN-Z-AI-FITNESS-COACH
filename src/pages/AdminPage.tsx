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

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "hardhebro@gmail.com";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaDescription: string;
  category: string;
  tags: string[];
  published: boolean;
  image: string;
  readingTime: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'blogPosts');
    });

    // Listen to Contact Submissions
    const contactQuery = query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc'));
    const unsubContact = onSnapshot(contactQuery, (snapshot) => {
      setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactSubmission)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'contactSubmissions');
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s/g).length;
    const minutes = noOfWords / wordsPerMinute;
    return Math.ceil(minutes);
  };

  const savePost = async () => {
    if (!currentPost.title || !currentPost.content) {
      alert("Title and Content are required.");
      return;
    }
    
    const slug = currentPost.slug || generateSlug(currentPost.title);
    const readingTime = calculateReadingTime(currentPost.content);
    
    const postData = {
      ...currentPost,
      slug,
      readingTime,
      updatedAt: serverTimestamp(),
      published: currentPost.published ?? false,
      tags: currentPost.tags || [],
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
      handleFirestoreError(error, currentPost.id ? OperationType.UPDATE : OperationType.CREATE, 'blogPosts');
    }
  };

  const deletePost = async (id: string) => {
    if (window.confirm("Delete this post?")) {
      try {
        await deleteDoc(doc(db, 'blogPosts', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `blogPosts/${id}`);
      }
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'contactSubmissions', id), { status: 'read' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `contactSubmissions/${id}`);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (window.confirm("Delete this submission?")) {
      try {
        await deleteDoc(doc(db, 'contactSubmissions', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `contactSubmissions/${id}`);
      }
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-neon selection:text-black">
      <Helmet>
        <title>Admin Dashboard | Fitin60ai.in</title>
      </Helmet>

      {/* Minimalist Header */}
      <header className="border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
              <div className="w-8 h-8 bg-neon rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-black" />
              </div>
              <span className="font-black uppercase italic tracking-tighter text-lg">Admin</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              <button 
                onClick={() => setActiveTab('blog')}
                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'blog' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
              >
                Articles
              </button>
              <button 
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'contact' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
              >
                Submissions
                {submissions.filter(s => s.status === 'new').length > 0 && (
                  <span className="ml-2 text-neon">•</span>
                )}
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3">
              <img src={user.photoURL || ''} className="w-8 h-8 rounded-full border border-white/10" alt="Admin" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{user.displayName}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
              {activeTab === 'blog' ? 'Knowledge' : 'User'}{' '}
              <span className="text-neon">{activeTab === 'blog' ? 'Base' : 'Inquiries'}</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
              {activeTab === 'blog' ? 'Manage your articles and guides' : 'Review and respond to contact forms'}
            </p>
          </div>

          {activeTab === 'blog' && (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  setCurrentPost({ published: true });
                  setIsEditingPost(true);
                }}
                className="px-8 py-4 bg-neon text-black text-xs font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(204,255,0,0.2)]"
              >
                <Plus className="w-4 h-4" />
                New Article
              </button>
            </div>
          )}
        </div>

        {activeTab === 'blog' ? (
          <div className="space-y-4">
            {posts.map(post => (
              <motion.div 
                key={post.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-zinc-900/20 border border-white/5 p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${post.published ? 'bg-neon/10 text-neon' : 'bg-zinc-800 text-zinc-500'}`}>
                      {post.published ? 'Live' : 'Draft'}
                    </span>
                    <span className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">
                      {post.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">• {post.category}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight group-hover:text-neon transition-colors">{post.title}</h3>
                  <p className="text-zinc-500 font-medium text-sm line-clamp-1 max-w-2xl">{post.excerpt}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setCurrentPost(post);
                      setIsEditingPost(true);
                    }}
                    className="flex-1 md:flex-none px-6 py-3 bg-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                  <button 
                    onClick={() => deletePost(post.id)}
                    className="p-3 bg-zinc-900 rounded-xl text-zinc-600 hover:text-red-500 hover:bg-red-500/5 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
            {posts.length === 0 && (
              <div className="text-center py-32 bg-zinc-900/10 rounded-[3rem] border border-dashed border-white/5">
                <FileText className="w-12 h-12 text-zinc-800 mx-auto mb-6" />
                <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">No articles found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map(sub => (
              <motion.div 
                key={sub.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-zinc-900/20 border border-white/5 p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${sub.status === 'new' ? 'bg-red-500/10 text-red-500' : 'bg-neon/10 text-neon'}`}>
                      {sub.status}
                    </span>
                    <span className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">
                      {sub.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight">{sub.subject}</h3>
                  <p className="text-zinc-500 font-bold text-sm">{sub.name} <span className="text-zinc-700 font-medium ml-2">{sub.email}</span></p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setViewingSubmission(sub);
                      if (sub.status === 'new') markAsRead(sub.id);
                    }}
                    className="flex-1 md:flex-none px-8 py-3 bg-neon text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                  <button 
                    onClick={() => deleteSubmission(sub.id)}
                    className="p-3 bg-zinc-900 rounded-xl text-zinc-600 hover:text-red-500 hover:bg-red-500/5 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
            {submissions.length === 0 && (
              <div className="text-center py-32 bg-zinc-900/10 rounded-[3rem] border border-dashed border-white/5">
                <Mail className="w-12 h-12 text-zinc-800 mx-auto mb-6" />
                <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">No submissions found</p>
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
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-5xl bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
            >
              <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                  <h2 className="text-xl font-black uppercase italic tracking-tight">
                    {currentPost.id ? 'Edit' : 'Create'} <span className="text-neon">Article</span>
                  </h2>
                </div>
                <button onClick={() => setIsEditingPost(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 space-y-10">
                <div className="grid md:grid-cols-3 gap-10">
                  <div className="md:col-span-2 space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Title</label>
                      <input 
                        value={currentPost.title || ''}
                        onChange={e => {
                          const title = e.target.value;
                          const updates: Partial<BlogPost> = { title };
                          if (!currentPost.slug || currentPost.slug === generateSlug(currentPost.title || '')) {
                            updates.slug = generateSlug(title);
                          }
                          setCurrentPost({...currentPost, ...updates});
                        }}
                        placeholder="Enter a compelling title..."
                        className="w-full bg-transparent border-b border-white/10 py-4 text-2xl md:text-3xl font-black uppercase italic tracking-tight text-white focus:border-neon outline-none transition-colors placeholder:text-zinc-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">URL Slug</label>
                      <input 
                        value={currentPost.slug || ''}
                        onChange={e => setCurrentPost({...currentPost, slug: e.target.value})}
                        placeholder="url-friendly-slug"
                        className="w-full bg-transparent border-b border-white/10 py-2 text-sm font-mono text-zinc-500 focus:border-neon outline-none transition-colors placeholder:text-zinc-800"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Category</label>
                      <select 
                        value={currentPost.category || ''}
                        onChange={e => setCurrentPost({...currentPost, category: e.target.value})}
                        className="w-full bg-zinc-950 border border-white/5 rounded-xl p-4 text-xs font-black uppercase tracking-widest text-white focus:border-neon outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Select Category</option>
                        <option value="Workout">Workout</option>
                        <option value="Nutrition">Nutrition</option>
                        <option value="AI Fitness">AI Fitness</option>
                        <option value="Success Stories">Success Stories</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Tags (Comma separated)</label>
                      <input 
                        value={currentPost.tags?.join(', ') || ''}
                        onChange={e => setCurrentPost({...currentPost, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t !== '')})}
                        placeholder="fitness, ai, health"
                        className="w-full bg-zinc-950 border border-white/5 rounded-xl p-4 text-xs font-bold text-white focus:border-neon outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Excerpt (Card Summary)</label>
                      <span className="text-[8px] text-zinc-500 font-bold">{(currentPost.excerpt?.length || 0)}/150</span>
                    </div>
                    <textarea 
                      value={currentPost.excerpt || ''}
                      onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value.slice(0, 150)})}
                      rows={3}
                      placeholder="Brief summary for scannability..."
                      className="w-full bg-zinc-950/50 border border-white/5 rounded-xl p-6 text-zinc-400 font-medium text-sm focus:border-neon outline-none transition-colors resize-none leading-relaxed"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Meta Description (SEO)</label>
                      <span className={`text-[8px] font-bold ${(currentPost.metaDescription?.length || 0) > 160 ? 'text-red-500' : 'text-zinc-500'}`}>
                        {(currentPost.metaDescription?.length || 0)}/160
                      </span>
                    </div>
                    <textarea 
                      value={currentPost.metaDescription || ''}
                      onChange={e => setCurrentPost({...currentPost, metaDescription: e.target.value})}
                      rows={3}
                      placeholder="SEO meta description for search results..."
                      className="w-full bg-zinc-950/50 border border-white/5 rounded-xl p-6 text-zinc-400 font-medium text-sm focus:border-neon outline-none transition-colors resize-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Featured Image URL</label>
                  <input 
                    value={currentPost.image || ''}
                    onChange={e => setCurrentPost({...currentPost, image: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-zinc-950/50 border border-white/5 rounded-xl p-4 text-xs font-medium text-zinc-400 focus:border-neon outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2 editor-container">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Content (Rich Text)</label>
                  <div className="bg-zinc-950/50 border border-white/5 rounded-xl overflow-hidden min-h-[400px]">
                    <ReactQuill 
                      theme="snow"
                      value={currentPost.content || ''}
                      onChange={content => setCurrentPost({...currentPost, content})}
                      className="text-zinc-300"
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['link', 'image', 'code-block'],
                          ['clean']
                        ],
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-zinc-950/30 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentPost.published ? 'bg-neon/10 text-neon' : 'bg-zinc-800 text-zinc-500'}`}>
                      {currentPost.published ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">Visibility</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{currentPost.published ? 'Publicly Visible' : 'Private Draft'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setCurrentPost({...currentPost, published: !currentPost.published})}
                    className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${currentPost.published ? 'bg-neon text-black' : 'bg-zinc-800 text-zinc-400'}`}
                  >
                    {currentPost.published ? 'Switch to Draft' : 'Make Public'}
                  </button>
                </div>
              </div>

              <div className="px-10 py-8 border-t border-white/5 bg-zinc-900/50 backdrop-blur-md flex justify-end gap-4">
                <button 
                  onClick={() => setIsEditingPost(false)}
                  className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  Discard
                </button>
                <button 
                  onClick={savePost}
                  className="px-12 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-3 hover:bg-neon transition-all shadow-xl"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
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
