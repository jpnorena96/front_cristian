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
import AuthPromptModal from './components/AuthPromptModal';
import UserProfile from './components/UserProfile';

let messageCounter = 0;

function createMessage(role, content) {
  return {
    id: `msg-${++messageCounter}`,
    role,
    content,
    suggestedActions: [],
    timestamp: new Date(),
  };
}

export default function App() {
  const dispatch = useDispatch();
  const { currentUser, isAuthenticated } = useSelector((state) => state.user);

  // Initialize page based on auth state
  const [currentPage, setCurrentPage] = useState('splash');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [loginMode, setLoginMode] = useState('login'); // 'login' or 'register'

  // Effect to redirect to chat if already authenticated (persistence)
  useEffect(() => {
    if (isAuthenticated && currentPage === 'landing') {
      // Check if admin
      if (currentUser?.is_admin || currentUser?.isAdmin) {
        setCurrentPage('admin');
      } else {
        setCurrentPage('chat');
      }
      setShowAuthPrompt(false);
    }
  }, [isAuthenticated, currentPage, currentUser]);

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState('analyzing');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation Handlers
  // Navigation Handlers
  const navigateToChat = useCallback((user) => {
    const targetUser = user || currentUser;
    // If admin logs in, go to admin page
    if (targetUser?.is_admin || targetUser?.isAdmin) {
      setCurrentPage('admin');
    } else {
      setCurrentPage('chat');
    }
    setShowAuthPrompt(false);
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
      const API_URL = import.meta.env.VITE_API_URL || 'https://n8n-bot-back-cristian.gnuu1e.easypanel.host';
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
      const API_URL = import.meta.env.VITE_API_URL || 'https://n8n-bot-back-cristian.gnuu1e.easypanel.host';
      fetch(`${API_URL}/api/conversations/${currentUser.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.conversations) setConversations(data.conversations);
        })
    }
  }, [currentPage, currentUser]);

  const handleSendMessage = useCallback(async (text, file) => {
    // If user is not logged in, show auth prompt
    if (!currentUser) {
      setShowAuthPrompt(true);
      return;
    }

    // If on landing, switch to chat first
    if (currentPage === 'landing') {
      setCurrentPage('chat');
    }

    // Build display text with document indicator
    const displayText = file ? `📎 ${file.name}\n${text}` : text;
    const userMsg = createMessage('user', displayText);
    if (file) userMsg.hasDocument = true;

    // Optimistic update
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://n8n-bot-back-cristian.gnuu1e.easypanel.host';

      // Step 1: Upload file if present
      let documentContext = null;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.error) {
          const errorMsg = createMessage('assistant', `⚠️ Error al procesar el archivo: ${uploadData.error}`);
          setMessages(prev => [...prev, errorMsg]);
          setIsLoading(false);
          return;
        }
        documentContext = {
          filename: uploadData.filename,
          text: uploadData.text
        };
      }

      // Step 2: Send message with optional document context
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser ? currentUser.id : null,
          conversationId: activeConvId,
          message: text,
          documentContext: documentContext
        })
      });

      const data = await response.json();

      if (!activeConvId && data.conversationId) {
        setActiveConvId(data.conversationId);
        // Refresh conversations list to show new title
        if (currentUser) {
          const API_URL = import.meta.env.VITE_API_URL || 'https://n8n-bot-back-cristian.gnuu1e.easypanel.host';
          fetch(`${API_URL}/api/conversations/${currentUser.id}`)
            .then(res => res.json())
            .then(d => d.conversations && setConversations(d.conversations));
        }
      }

      setAiStatus(data.status || 'analyzing');
      const aiMsg = createMessage('assistant', data.response || "Error: Sin respuesta");
      aiMsg.suggestedActions = data.suggestedActions || []; // Store suggestions
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
    setLoginMode('login');
    setCurrentPage('login');
  }, []);

  const handlePromptLogin = () => {
    setShowAuthPrompt(false);
    setLoginMode('login');
    setCurrentPage('login');
  };

  const handlePromptRegister = () => {
    setShowAuthPrompt(false);
    setLoginMode('register');
    setCurrentPage('login');
  };

  if (currentPage === 'splash') {
    return <SplashScreen onComplete={() => setCurrentPage('landing')} />;
  }

  if (currentPage === 'landing') {
    return (
      <>
        <LandingPage onNavigateToChat={navigateToChat} onNavigateToLogin={navigateToLogin} />
        {whatsappBtn}
        {showAuthPrompt && (
          <AuthPromptModal
            onClose={() => setShowAuthPrompt(false)}
            onLogin={handlePromptLogin}
            onRegister={handlePromptRegister}
          />
        )}
      </>
    );
  }

  // Also include prompt in chat view (when user is guest but viewing chat UI?)
  // Currently app logic forces login for chat page if persistence works, but 
  // if handleSendMessage is called from LandingPage, it triggers prompt there.
  // If we are on 'chat' page but not logged in (guest mode?), we might need it there too.
  // But logic above: navigateToChat checks for currentUser. 
  // Let's assume handleSendMessage is primarily triggered from LandingPage or Guest Chat if implemented.

  if (currentPage === 'login') {
    return (
      <Login
        initialMode={loginMode}
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

  if (currentPage === 'profile') {
    return (
      <UserProfile
        onBack={() => setCurrentPage('chat')}
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
        currentUser={currentUser}
        onNavigateToLanding={navigateToLanding}
      />
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        aiStatus={aiStatus}
        onSendMessage={handleSendMessage}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        currentUser={currentUser}
        onLogin={navigateToLogin}
        onLogout={handleLogout}
        onProfile={() => setCurrentPage('profile')}
      />
      {showAuthPrompt && (
        <AuthPromptModal
          onClose={() => setShowAuthPrompt(false)}
          onLogin={handlePromptLogin}
          onRegister={handlePromptRegister}
        />
      )}
    </div>
  );
}
