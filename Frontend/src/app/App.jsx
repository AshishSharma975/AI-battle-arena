import React, { useState, useEffect, useRef } from 'react';
import { Send, Layout, Plus, Clock, Archive, Share2, FileCode, Trash2, User, Settings, HelpCircle, Layers, BookOpen, Bookmark, Activity, BarChart2, Zap, Award, Menu, X } from 'lucide-react';
import { MessageBubble, ComparisonView } from '../components/ChatInterface';
import axios from 'axios';

const templatePrompts = {
  'React Architecture': 'Design a scalable React application architecture using Redux Toolkit and Vite. Provide the folder structure and explain your choices.',
  'Python Debugging': 'I have a memory leak in my Python script processing large CSV files with Pandas. How can I identify and fix it? Provide best practices.',
  'Database Schema': 'Design a normalized PostgreSQL database schema for an e-commerce platform including products, orders, users, and reviews.',
  'Security Audit': 'What are the top 5 OWASP security vulnerabilities in Node.js applications and how can I prevent them? Provide code examples.'
};
const App = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [archivedChats, setArchivedChats] = useState([]);
  const [trashedChats, setTrashedChats] = useState([]);
  const [activeTab, setActiveTab] = useState('recent'); // 'recent', 'archived', 'trash'
  const [activeTopTab, setActiveTopTab] = useState('sessions'); // 'sessions', 'library', 'benchmarking'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Live benchmarking state simulation
  const [totalBattles, setTotalBattles] = useState(1248);
  const [leaderboard, setLeaderboard] = useState([
    { id: '1', name: 'GPT-4-Turbo', win: 78.2, elo: 1250, time: 1.2 },
    { id: '2', name: 'Claude 3 Opus', win: 74.1, elo: 1210, time: 2.1 },
    { id: '3', name: 'Gemini 1.5 Pro', win: 69.5, elo: 1180, time: 1.8 },
    { id: '4', name: 'Llama 3 70B', win: 52.4, elo: 1050, time: 0.8 }
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (activeTopTab === 'benchmarking') {
      const interval = setInterval(() => {
        const newBattles = Math.floor(Math.random() * 3); // 0 to 2 new battles
        if (newBattles > 0) {
          setTotalBattles(prev => prev + newBattles);
          setLeaderboard(prev => {
            let updated = prev.map(model => {
               const eloChange = Math.floor(Math.random() * 6) - 2; 
               const winChange = (Math.random() * 0.4 - 0.2);
               const timeChange = (Math.random() * 0.06 - 0.03);
               return {
                 ...model,
                 elo: Math.max(1000, model.elo + eloChange),
                 win: Math.min(100, Math.max(0, model.win + winChange)),
                 time: Math.max(0.5, model.time + timeChange)
               };
            });
            updated.sort((a, b) => b.elo - a.elo);
            return updated;
          });
        }
      }, 2000); // update every 2 seconds
      return () => clearInterval(interval);
    }
  }, [activeTopTab]);

  useEffect(() => {
    if (activeTab === 'recent') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, activeTab]);

  const handleNewComparison = () => {
    if (history.length > 0) {
      setArchivedChats([{ id: Date.now(), messages: history }, ...archivedChats]);
      setHistory([]);
    }
    setActiveTab('recent');
    setActiveTopTab('sessions');
    setIsMobileSidebarOpen(false);
  };

  const navTo = (tab, topTab) => {
    setActiveTab(tab);
    setActiveTopTab(topTab);
    setIsMobileSidebarOpen(false);
  };

  const handleTrashChat = (id) => {
    const chatToTrash = archivedChats.find(chat => chat.id === id);
    if (chatToTrash) {
      setTrashedChats([chatToTrash, ...trashedChats]);
      setArchivedChats(archivedChats.filter(chat => chat.id !== id));
    }
  };

  const executePrompt = async (promptText) => {
    if (!promptText.trim() || isLoading) return;

    setActiveTopTab('sessions');
    setActiveTab('recent');
    setInput('');
    setIsLoading(true);

    const tempId = Date.now();
    const pendingMessage = {
      id: tempId,
      problem: promptText,
      loading: true
    };
    
    setHistory(prev => [...prev, pendingMessage]);

    try {
     const apiUrl = "https://ai-battle-arena-8zno.onrender.com";

const response = await axios.post(`${apiUrl}/invoke`, {
  problem: promptText
});

      const data = response.data.data;

      setHistory(prev => prev.map(msg => {
        if (msg.id === tempId) {
          return {
            ...msg,
            loading: false,
            solution_1: data.solution_1,
            solution_2: data.solution_2,
            judge: {
              solution_1: data.judge.solution_1,
              solution_2: data.judge.solution_2,
              solution_1_reasoning: data.judge.solution_1_reasoning,
              solution_2_reasoning: data.judge.solution_2_reasoning,
              winner: data.judge.winner
            }
          };
        }
        return msg;
      }));
    } catch (err) {
      console.error(err);
      setHistory(prev => prev.filter(msg => msg.id !== tempId)); // remove the loading message on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    executePrompt(input);
  };

  return (
    <div className="min-h-screen font-sans flex text-gray-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-slate-50 to-white overflow-x-hidden">
      
      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* Left Sidebar */}
      <aside className={`w-[280px] border-r border-gray-200/50 flex flex-col h-screen fixed md:sticky top-0 bg-white/95 md:bg-white/60 backdrop-blur-xl z-50 transition-transform duration-300 md:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 relative">
          <button className="absolute top-6 right-6 md:hidden p-1.5 text-gray-500 hover:bg-gray-100 rounded-md" onClick={() => setIsMobileSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center text-white font-bold shadow-md">A</div>
            <div>
              <div className="font-semibold text-sm">Global Workspace</div>
              <div className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">Standard Edition</div>
            </div>
          </div>
          <button 
            onClick={handleNewComparison}
            className="w-full bg-gray-900 text-white rounded-xl py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-md hover:shadow-lg mb-8"
          >
            <Plus className="w-4 h-4" /> New Comparison
          </button>

          <nav className="space-y-1">
            <button 
              onClick={() => navTo('recent', 'sessions')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition ${activeTab === 'recent' ? 'bg-white/80 text-gray-900 border border-gray-200/60 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`}
            >
              <Clock className={`w-4 h-4 ${activeTab === 'recent' ? 'text-gray-600' : ''}`} /> Recent Chats
            </button>
            <button 
              onClick={() => navTo('archived', 'sessions')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition ${activeTab === 'archived' ? 'bg-white/80 text-gray-900 border border-gray-200/60 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`}
            >
              <Archive className="w-4 h-4" /> Archived
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition">
              <Share2 className="w-4 h-4" /> Shared Items
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition">
              <FileCode className="w-4 h-4" /> Templates
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-1">
          <button 
            onClick={() => navTo('trash', 'sessions')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition ${activeTab === 'trash' ? 'bg-white/80 text-gray-900 border border-gray-200/60 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`}
          >
            <Trash2 className="w-4 h-4" /> Trash
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition">
            <User className="w-4 h-4" /> Account
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen relative z-10 border-l border-white/40 w-full overflow-hidden">
        
        {/* Top Navbar */}
        <header className="min-h-[64px] md:h-[72px] border-b border-gray-200/50 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between sticky top-0 bg-white/40 backdrop-blur-xl z-20 pb-2 md:pb-0">
          
          <div className="w-full flex items-center justify-between h-[56px] md:h-[72px]">
            <div className="font-bold text-gray-900 text-lg tracking-tight flex items-center gap-2">
              <button className="md:hidden p-1.5 -ml-1 text-gray-600 hover:text-gray-900" onClick={() => setIsMobileSidebarOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <Layers className="w-5 h-5 text-indigo-500 hidden sm:block" /> 
              <span>AI Battle Arena</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-500">
              <Settings className="w-5 h-5 cursor-pointer hover:text-gray-900 hidden md:block" />
              <HelpCircle className="w-5 h-5 cursor-pointer hover:text-gray-900 hidden sm:block" />
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-300"></div>
            </div>
          </div>

          <div className="w-full flex items-center justify-start sm:justify-center gap-6 overflow-x-auto scrollbar-hide md:absolute md:left-1/2 md:-translate-x-1/2">
            <button 
              onClick={() => setActiveTopTab('sessions')}
              className={`text-sm font-semibold py-2 md:py-[25px] whitespace-nowrap transition-colors border-b-2 ${activeTopTab === 'sessions' ? 'text-gray-900 border-gray-900' : 'text-gray-500 border-transparent hover:text-gray-900'}`}
            >
              Sessions
            </button>
            <button 
              onClick={() => setActiveTopTab('library')}
              className={`text-sm font-semibold py-2 md:py-[25px] whitespace-nowrap transition-colors border-b-2 ${activeTopTab === 'library' ? 'text-gray-900 border-gray-900' : 'text-gray-500 border-transparent hover:text-gray-900'}`}
            >
              Library
            </button>
            <button 
              onClick={() => setActiveTopTab('benchmarking')}
              className={`text-sm font-semibold py-2 md:py-[25px] whitespace-nowrap transition-colors border-b-2 ${activeTopTab === 'benchmarking' ? 'text-gray-900 border-gray-900' : 'text-gray-500 border-transparent hover:text-gray-900'}`}
            >
              Benchmarking
            </button>
          </div>
        </header>




        {/* Scrollable Main Views Area */}
        <main className="flex-1 overflow-y-auto px-4 py-12 relative w-full flex flex-col items-center">
          
          {activeTopTab === 'sessions' && (
            <>
              {activeTab === 'recent' && (
                history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center mt-32">
                    <Layers className="w-12 h-12 text-gray-300 mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">New Comparison Session</h2>
                    <p className="text-gray-500 max-w-sm text-sm">Submit an architectural prompt or coding problem to compare outputs from Models A and B instantaneously.</p>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center pb-32">
                    {history.map((msg, idx) => (
                      <div key={msg.id || idx} className="w-full">
                        <MessageBubble problem={msg.problem} />
                        <ComparisonView 
                          loading={msg.loading}
                          solution_1={msg.solution_1} 
                          solution_2={msg.solution_2} 
                          judge={msg.judge} 
                        />
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </div>
                )
              )}

              {activeTab === 'archived' && (
                <div className="w-full flex flex-col items-center max-w-2xl px-4">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8 self-start flex items-center gap-2"><Archive className="w-6 h-6"/> Archived Sessions</h2>
                  {archivedChats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center mt-20">
                      <Archive className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-sm">No archived chats yet.</p>
                    </div>
                  ) : (
                    archivedChats.map((chat) => (
                      <div key={chat.id} className="w-full bg-white rounded-xl p-5 mb-4 border border-gray-200 shadow-sm flex flex-col group transition hover:border-gray-300">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold text-gray-900 text-lg">{chat.messages[0]?.problem || "Empty Session"}</div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleTrashChat(chat.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                              title="Move to Trash"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{chat.messages.length} messages • Chat archived</div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'trash' && (
                <div className="w-full flex flex-col items-center max-w-2xl px-4">
                  <div className="self-start mb-8 flex items-center justify-between w-full">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Trash2 className="w-6 h-6"/> Trash</h2>
                    {trashedChats.length > 0 && (
                      <button onClick={() => setTrashedChats([])} className="text-sm text-red-500 hover:text-red-600 font-medium bg-red-50 px-3 py-1.5 rounded-lg transition">Empty Trash</button>
                    )}
                  </div>
                  {trashedChats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center mt-20">
                      <Trash2 className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-sm">Trash is empty.</p>
                    </div>
                  ) : (
                    trashedChats.map((chat) => (
                      <div key={chat.id} className="w-full bg-gray-50 rounded-xl p-5 mb-4 border border-gray-200 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold text-gray-500 text-lg line-through">{chat.messages[0]?.problem || "Empty Session"}</div>
                        </div>
                        <div className="text-sm text-gray-400">{chat.messages.length} messages • Deleted</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {activeTopTab === 'library' && (
            <div className="w-full flex flex-col items-center max-w-5xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-full flex flex-col items-start mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Prompt Library</h1>
                <p className="text-gray-500">Access pre-saved templates, context files, and AI model catalogs.</p>
              </div>
              
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                   <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-500" /> Featured Templates</h2>
                   <div className="grid grid-cols-2 gap-4">
                      {Object.keys(templatePrompts).map(t => (
                        <div 
                          key={t} 
                          onClick={() => {
                            if (history.length > 0) {
                              setArchivedChats(prev => [{ id: Date.now(), messages: history }, ...prev]);
                              setHistory([]);
                            }
                            executePrompt(templatePrompts[t]);
                          }}
                          className="p-5 border border-gray-200 rounded-2xl bg-white hover:border-indigo-200 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
                        >
                          <div className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{t}</div>
                          <div className="text-xs text-gray-500 leading-relaxed italic line-clamp-2">"{templatePrompts[t]}"</div>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="space-y-6">
                   <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><Bookmark className="w-5 h-5 text-orange-500" /> Saved Snippets</h2>
                   <div className="p-2 border border-gray-200 rounded-2xl bg-white shadow-sm flex flex-col">
                      <div className="p-4 hover:bg-gray-50 rounded-xl transition cursor-pointer border-b border-gray-100 last:border-b-0">
                        <div className="text-sm font-semibold text-gray-800">Auth Controller Setup</div>
                        <div className="text-xs text-gray-400 mt-1">Saved 2 days ago</div>
                      </div>
                      <div className="p-4 hover:bg-gray-50 rounded-xl transition cursor-pointer border-b border-gray-100 last:border-b-0">
                        <div className="text-sm font-semibold text-gray-800">Stripe Payment Gateway</div>
                        <div className="text-xs text-gray-400 mt-1">Saved yesterday</div>
                      </div>
                      <div className="p-4 hover:bg-gray-50 rounded-xl transition cursor-pointer border-b border-gray-100 last:border-b-0">
                        <div className="text-sm font-semibold text-gray-800">Docker Compose Postgres</div>
                        <div className="text-xs text-gray-400 mt-1">Saved 4 hours ago</div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTopTab === 'benchmarking' && (
            <div className="w-full flex flex-col items-center max-w-5xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="w-full flex flex-col items-start mb-10">
                 <h1 className="text-3xl font-bold text-gray-900 mb-2">Benchmarking & Analytics</h1>
                 <p className="text-gray-500">Analyze AI model performance and win rates based on your historical comparisons.</p>
               </div>

               <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="bg-gray-900 text-white p-6 rounded-2xl flex flex-col justify-between shadow-xl shadow-gray-900/10 transition-all duration-300 transform">
                    <div className="text-gray-400 text-sm font-medium">Total Battles Evaluated</div>
                    <div className="text-4xl md:text-5xl font-bold mt-4 text-white flex items-center gap-2">
                       {totalBattles.toLocaleString()}
                       <span className="flex h-3 w-3 relative ml-1">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                       </span>
                    </div>
                 </div>
                 <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition">
                    <div className="text-gray-500 text-sm font-medium mb-2">Top Rated Model</div>
                    <div className="text-xl md:text-2xl font-bold mt-2 text-gray-900 flex items-center gap-3"><Award className="w-6 h-6 md:w-8 md:h-8 text-yellow-500"/> {leaderboard[0].name}</div>
                 </div>
                 <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition">
                    <div className="text-gray-500 text-sm font-medium mb-2">Fastest Model</div>
                    <div className="text-xl md:text-2xl font-bold mt-2 text-gray-900 flex items-center gap-3"><Zap className="w-6 h-6 md:w-8 md:h-8 text-blue-500"/> Claude 3 Haiku</div>
                 </div>
               </div>

               <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 md:p-8 shadow-sm">
                 <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3"><BarChart2 className="w-6 h-6 text-indigo-500"/> Global Leaderboard</h2>
                 <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
                   <div className="min-w-[600px]">
                     <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">
                       <div className="col-span-1">Rank</div>
                       <div className="col-span-4">Model Name</div>
                       <div className="col-span-3">Win Rate</div>
                       <div className="col-span-2">Elo Rating</div>
                       <div className="col-span-2">Avg Speed</div>
                     </div>
                     <div className="flex flex-col gap-3">
                       {leaderboard.map((m, index) => (
                         <div key={m.id} className="grid grid-cols-12 gap-4 items-center bg-gray-50 hover:bg-gray-100 transition-all duration-500 px-5 py-4 rounded-xl text-sm border border-gray-100">
                           <div className="col-span-1 font-bold text-gray-900 text-lg">#{index + 1}</div>
                           <div className="col-span-4 font-semibold text-gray-900 text-base">{m.name}</div>
                           <div className="col-span-3 flex items-center gap-3">
                             <div className="w-full max-w-[80px] h-2.5 bg-gray-200 rounded-full overflow-hidden">
                               <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${m.win}%` }}></div>
                             </div>
                             <span className="text-gray-700 font-bold">{m.win.toFixed(1)}%</span>
                           </div>
                           <div className="col-span-2 font-bold text-gray-900 transition-all duration-500">{m.elo}</div>
                           <div className="col-span-2 text-gray-500 font-medium transition-all duration-500">{m.time.toFixed(2)}s / req</div>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          )}
        </main>


        

        {/* Floating Input Over Main */}
        {activeTopTab === 'sessions' && activeTab === 'recent' && (
          <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 md:px-4 z-20">
            <form 
              onSubmit={handleSend}
              className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-200 flex items-center pr-2 pl-4 py-2 md:pr-3 md:pl-6 md:py-3 transition-all focus-within:ring-2 ring-gray-900/10 focus-within:border-gray-300"
            >
              <Layers className="w-4 h-4 text-gray-400 mr-2 md:mr-3 hidden sm:block" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a follow-up comparison..."
                className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 text-sm md:text-sm font-medium"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 flex items-center justify-center bg-gray-900 rounded-full text-white hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed ml-2 shadow-sm shrink-0"
              >
                <Send className="w-4 h-4 -ml-0.5" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;