import React from 'react';
import {
  X,
  MessageCircle,
  Send
} from 'lucide-react';

export default function ChatView({ currentUser, users, role, messages, setMessages, initialActiveChat, activeChatContext, projects, setActiveChatContext, isChatOpen, onClose }) {
  const [activeChat, setActiveChat] = React.useState(initialActiveChat);
  const [messageText, setMessageText] = React.useState('');
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    if (initialActiveChat) {
      setActiveChat(initialActiveChat);
    }
  }, [initialActiveChat]);

  if (!isChatOpen) return null;

  const getPartnerId = (chatId) => {
    if (!chatId) return null;
    const parts = chatId.split('_');
    return parts[1] === currentUser.id ? parts[2] : parts[1];
  };

  const getProjectId = (chatId) => {
    if (!chatId) return null;
    const parts = chatId.split('_');
    return parts[3] || null;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChat) return;
    const projectId = getProjectId(activeChat);
    const newMsg = {
      id: 'm_' + Date.now(),
      chatId: activeChat,
      senderId: currentUser.id,
      text: messageText,
      timestamp: new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}),
      projectId: projectId || undefined
    };
    setMessages(prev => [...prev, newMsg]);
    setMessageText('');
  };

  const activePartner = activeChat ? users.find(u => u.id === getPartnerId(activeChat)) : null;
  const activeProject = activeChatContext ? projects.find(p => p.id === activeChatContext) : null;
  
  // Array of safe messages
  const safeMessages = Array.isArray(messages) ? messages : [];
  const activeMessages = safeMessages.filter(m => m.chatId === activeChat);

  // Build distinct chat list based on messages and activeChat
  const chatIds = new Set();
  safeMessages.forEach(m => {
    if (m.chatId && m.chatId.includes(currentUser.id)) {
      chatIds.add(m.chatId);
    }
  });
  if (activeChat) chatIds.add(activeChat);
  
  const chatList = Array.from(chatIds).sort((a, b) => {
    const msgA = safeMessages.filter(m => m.chatId === a).pop();
    const msgB = safeMessages.filter(m => m.chatId === b).pop();
    if (!msgA) return -1;
    if (!msgB) return 1;
    return msgB.id.localeCompare(msgA.id);
  });

  return (
    <div className={`fixed z-[150] bg-white shadow-2xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row ${
      isFullscreen 
        ? 'inset-0 w-full h-[100dvh] rounded-none' 
        : 'bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-[420px] h-[75vh] md:h-[600px] md:max-h-[80vh] rounded-t-3xl md:rounded-3xl border-t md:border border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]'
    }`}>
      {/* Header for Mobile or Fullscreen */}
      <div className={`${activeChat ? 'hidden' : 'flex'} md:hidden p-4 border-b border-slate-200 bg-white justify-between items-center shrink-0`}>
        <h2 className="font-extrabold text-slate-800">Pesan</h2>
        <div className="flex gap-2">
           {isFullscreen ? (
                    <button type="button" onClick={() => setIsFullscreen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg flex items-center gap-1">
                      <span className="text-sm font-bold hidden md:inline">Kecilkan</span><span className="text-sm font-bold md:hidden">↓</span>
                    </button>
                 ) : (
                    <button type="button" onClick={() => setIsFullscreen(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                      <span className="text-xs font-bold hidden md:inline">Perbesar</span><span className="text-xs font-bold md:hidden">⤢</span>
                    </button>
                 )}
           <button type="button" onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><X size={20}/></button>
        </div>
      </div>

      <div className={`${activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 border-r border-slate-200 flex-col bg-slate-50`}>
        <div className="hidden md:flex p-4 border-b border-slate-200 bg-white justify-between items-center shrink-0">
          <h2 className="font-extrabold text-slate-800">Pesan</h2>
          <div className="flex gap-1">
             {isFullscreen ? (
                    <button type="button" onClick={() => setIsFullscreen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg flex items-center gap-1">
                      <span className="text-sm font-bold hidden md:inline">Kecilkan</span><span className="text-sm font-bold md:hidden">↓</span>
                    </button>
                 ) : (
                    <button type="button" onClick={() => setIsFullscreen(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                      <span className="text-xs font-bold hidden md:inline">Perbesar</span><span className="text-xs font-bold md:hidden">⤢</span>
                    </button>
                 )}
             <button type="button" onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><X size={20}/></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatList.map(chatId => {
            const partner = users.find(u => u.id === getPartnerId(chatId));
            if (!partner) return null;
            const project = projects.find(p => p.id === getProjectId(chatId));
            const lastMsg = safeMessages.filter(m => m.chatId === chatId).pop();
            return (
              <div 
                key={chatId}
                onClick={() => { setActiveChat(chatId); setActiveChatContext(getProjectId(chatId)); }}
                className={`p-4 border-b border-slate-100 cursor-pointer transition-colors ${activeChat === chatId ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-slate-100 border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{partner.name}</h4>
                  {lastMsg && <span className="text-[10px] text-slate-400 shrink-0 ml-2">{lastMsg.timestamp}</span>}
                </div>
                {project && <p className="text-[10px] font-bold text-blue-600 mb-1 line-clamp-1">{project.title}</p>}
                <p className="text-xs text-slate-500 line-clamp-1">{lastMsg ? lastMsg.text : 'Mulai percakapan'}</p>
              </div>
            );
          })}
          {chatList.length === 0 && (
             <div className="p-6 text-center text-slate-400 text-sm">Belum ada percakapan.</div>
          )}
        </div>
      </div>
      
      <div className={`${!activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-2/3 flex-col bg-slate-50 relative`}>
        {activeChat && activePartner ? (
          <>
            <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm z-20 shrink-0">
              <div className="flex items-center gap-3">
                <button type="button" className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg" onClick={() => setActiveChat(null)}>
                  <span className="text-sm font-bold">←</span>
                </button>
                <div>
                  <h3 className="font-extrabold text-slate-900 truncate">{activePartner.name}</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{activePartner.role}</p>
                </div>
              </div>
              <div className="flex gap-1">
                 {isFullscreen ? (
                    <button type="button" onClick={() => setIsFullscreen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg flex items-center gap-1">
                      <span className="text-sm font-bold hidden md:inline">Kecilkan</span><span className="text-sm font-bold md:hidden">↓</span>
                    </button>
                 ) : (
                    <button type="button" onClick={() => setIsFullscreen(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                      <span className="text-xs font-bold hidden md:inline">Perbesar</span><span className="text-xs font-bold md:hidden">⤢</span>
                    </button>
                 )}
                 <button type="button" onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><X size={20}/></button>
              </div>
            </div>
            
            {activeChatContext && activeProject && (
              <div className="bg-white border-b border-slate-200 p-3 flex justify-between items-center shadow-sm z-10 shrink-0">
                <div className="truncate pr-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Konteks Project</p>
                  <p className="text-sm font-bold text-blue-700 leading-tight truncate">{activeProject.title}</p>
                  <div className="flex gap-2 text-[10px] text-slate-600 mt-1 font-bold">
                    <span>Rp {Number(activeProject.budget).toLocaleString('id-ID')}</span>
                    <span>•</span>
                    <span className="capitalize">{activeProject.status}</span>
                  </div>
                </div>
                <button type="button" onClick={() => setActiveChatContext(null)} 
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <MessageCircle size={48} className="text-slate-200" />
                  <p className="text-sm">Belum ada pesan.</p>
                </div>
              ) : (
                activeMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm text-sm ${msg.senderId === currentUser.id ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      <p className={`text-[10px] mt-1 text-right ${msg.senderId === currentUser.id ? 'text-blue-200' : 'text-slate-400'}`}>{msg.timestamp}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 bg-white border-t border-slate-200 shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Ketik pesan..." 
                  className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                />
                <button type="submit" className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
              <MessageCircle size={32} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium">Pilih percakapan untuk mulai chat</p>
          </div>
        )}
      </div>
    </div>
  );
}
