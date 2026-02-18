import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/userSlice';
import './App.css';
import SplashScreen from './components/SplashScreen';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Login from './components/Login';
import AdminPage from './components/admin/AdminPage';

let messageCounter = 0;

function createMessage(role, content) {
  return {
    id: `msg-${++messageCounter}`,
    role,
    content,
    timestamp: new Date(),
  };
}

export default function App() {
  const dispatch = useDispatch();
  const { currentUser, isAuthenticated } = useSelector((state) => state.user);

  // Initialize page based on auth state
  const [currentPage, setCurrentPage] = useState('splash');

  // Effect to redirect to chat if already authenticated (persistence)
  useEffect(() => {
    if (isAuthenticated && currentPage === 'landing') {
      // Check if admin
      if (currentUser?.is_admin || currentUser?.isAdmin) {
        setCurrentPage('admin');
      } else {
        setCurrentPage('chat');
      }
    }
  }, [isAuthenticated, currentPage, currentUser]);

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState('analyzing');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation Handlers
  const navigateToChat = useCallback(() => {
    // If admin logs in, go to admin page
    if (currentUser?.is_admin || currentUser?.isAdmin) {
      setCurrentPage('admin');
    } else {
      setCurrentPage('chat');
    }
  }, [currentUser]);

  const navigateToLanding = useCallback(() => {
    setCurrentPage('landing');
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    setCurrentPage('landing');
    setMessages([]);
    setActiveConvId(null);
    setSidebarOpen(false);
  }, [dispatch]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setActiveConvId(null);
    setSidebarOpen(false);
  }, []);

  const handleSelectChat = useCallback(async (id) => {
    setActiveConvId(id);
    setSidebarOpen(false);

    // Fetch messages for this conversation
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/conversations/${id}/messages`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages.map(m => ({
          id: `msg-${m.id}`,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.timestamp)
        })));
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  }, []);

  // Fetch history when entering chat
  useEffect(() => {
    if (currentPage === 'chat' && currentUser && currentUser.id) {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      fetch(`${API_URL}/api/conversations/${currentUser.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.conversations) setConversations(data.conversations);
        })
    }
  }, [currentPage, currentUser]);

  const handleSendMessage = useCallback(async (text) => {
    // If on landing, switch to chat first
    if (currentPage === 'landing') {
      setCurrentPage('chat');
    }

    const userMsg = createMessage('user', text);
    // Optimistic update
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser ? currentUser.id : null,
          conversationId: activeConvId,
          message: text
        })
      });

      const data = await response.json();

      if (!activeConvId && data.conversationId) {
        setActiveConvId(data.conversationId);
        // Refresh conversations list to show new title
        if (currentUser) {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          fetch(`${API_URL}/api/conversations/${currentUser.id}`)
            .then(res => res.json())
            .then(d => d.conversations && setConversations(d.conversations));
        }
      }

      setAiStatus(data.status || 'analyzing');
      const aiMsg = createMessage('assistant', data.response || "Error: Sin respuesta");
      setMessages(prev => [...prev, aiMsg]);

    } catch (err) {
      const errorMsg = createMessage('assistant', 'Error de conexión con el servidor.');
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [activeConvId, currentPage, currentUser]);

  // WhatsApp floating button (shared across pages)
  const whatsappBtn = (
    <a
      href="https://wa.me/573000000000?text=Hola%2C%20quiero%20una%20consulta%20legal"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contactar por WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.132 6.746 3.054 9.378L1.056 31.2l6.06-1.94A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.014-3.168 2.28-.844.18-1.946.324-5.66-1.216-4.752-1.97-7.81-6.8-8.044-7.116-.226-.316-1.9-2.53-1.9-4.826s1.202-3.426 1.63-3.892c.39-.426.916-.606 1.218-.606.148 0 .282.008.402.014.428.018.642.044.924.716.354.84 1.218 2.962 1.324 3.178.108.216.216.508.068.792-.14.29-.266.468-.484.718-.216.25-.426.44-.642.712-.2.236-.424.49-.18.916.242.426 1.08 1.782 2.32 2.888 1.592 1.422 2.934 1.862 3.35 2.066.416.204.66.172.904-.1.25-.278 1.064-1.236 1.348-1.662.28-.426.562-.354.946-.212.388.14 2.452 1.156 2.872 1.368.416.212.696.316.796.49.1.174.1 1.012-.29 2.112z" />
      </svg>
    </a>
  );

  const navigateToLogin = useCallback(() => {
    setCurrentPage('login');
  }, []);

  if (currentPage === 'splash') {
    return <SplashScreen onComplete={() => setCurrentPage('landing')} />;
  }

  if (currentPage === 'landing') {
    return (
      <>
        <LandingPage onNavigateToChat={navigateToChat} onNavigateToLogin={navigateToLogin} />
        {whatsappBtn}
      </>
    );
  }

  if (currentPage === 'login') {
    return (
      <Login
        onLogin={navigateToChat}
        onBack={navigateToLanding}
      />
    );
  }

  if (currentPage === 'admin') {
    return (
      <AdminPage
        onLogout={handleLogout}
        onBack={navigateToLanding}
      />
    );
  }

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        activeId={activeConvId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(prev => !prev)}
        onBackToLanding={handleLogout}
      />
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        aiStatus={aiStatus}
        onSendMessage={handleSendMessage}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
      />

    </div>
  );
}
