import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate, useParams } from "react-router-dom";
import { Home } from "./components/Home";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { Intro } from "./components/Intro";
import { QuickAnswers } from "./components/QuickAnswers";
import Teleprompter from "./components/Teleprompter";
import { EmotionalReflectionDashboard } from "./components/EmotionalReflectionDashboard";
import { LoadingAnimation } from "./components/LoadingAnimation";
import { createContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "@/hooks/useTheme";
import "./styles/animations.css";

const queryClient = new QueryClient();

export const ActiveCallContext = createContext<{
  activeCall: string | null;
  setActiveCall: (personality: string | null) => void;
}>({
  activeCall: null,
  setActiveCall: () => {},
});

function ChatWrapper() {
  const { personality } = useParams();
  return <Chat personality={personality || "Assistant"} />;
}

function AffirmationsWrapper() {
  const navigate = useNavigate();
  const affirmationsText = `I am worthy of love, respect, and happiness. Each day I grow stronger and more confident in my abilities and my worth. I trust in my journey and embrace each moment with gratitude and grace. My potential is limitless, and I have the power to achieve anything I set my mind to. I radiate positivity and attract success naturally. I am grateful for all the abundance in my life, both big and small. I choose happiness and spread joy to others through my actions and words. I am exactly where I need to be at this moment in my journey. My future is bright and full of endless possibilities. I deserve all the good things life has to offer. I am resilient and can overcome any challenge that comes my way. My thoughts and feelings are valid and deserving of expression. I attract positive energy and release what no longer serves me. Every day in every way, I am getting better and better. I am surrounded by love and support in all aspects of my life. My presence makes a positive difference in the world. I embrace change as an opportunity for growth and learning. I am at peace with my past and excited about my future. My creativity flows freely and inspires others. I trust my intuition and inner wisdom to guide me.`;

  return (
    <ProtectedRoute>
      <motion.div 
        className="fixed inset-0 min-h-screen w-full bg-[#FFF8F6] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      >
        <Teleprompter 
          initialScript={affirmationsText}
          fontSize={44}
          fontFamily="cal-sans"
          textColor="#785340"
          autoStart={true}
          onExit={() => navigate('/home')}
        />
      </motion.div>
    </ProtectedRoute>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [showInitialLoading, setShowInitialLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthenticated(!!session);
      if (event === 'SIGNED_IN') {
        setShowInitialLoading(true);
        setTimeout(() => setShowInitialLoading(false), 5000);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <LoadingAnimation />;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (showInitialLoading) {
    return <LoadingAnimation onComplete={() => setShowInitialLoading(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ActiveCallContext.Provider value={{ activeCall, setActiveCall }}>
          <TooltipProvider>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                  >
                    <Intro />
                  </motion.div>
                } />
                <Route path="/login" element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                  >
                    <Login />
                  </motion.div>
                } />
                <Route path="/home" element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9, ease: "easeInOut" }}
                    >
                      <Home />
                    </motion.div>
                  </ProtectedRoute>
                } />
                <Route path="/quick-answers" element={
                  <ProtectedRoute>
                    <QuickAnswers />
                  </ProtectedRoute>
                } />
                <Route path="/chat/:personality" element={
                  <ProtectedRoute>
                    <ChatWrapper />
                  </ProtectedRoute>
                } />
                <Route path="/emotional-reflection" element={
                  <ProtectedRoute>
                    <EmotionalReflectionDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/teleprompter" element={
                  <ProtectedRoute>
                    <Teleprompter />
                  </ProtectedRoute>
                } />
                <Route path="/affirmations" element={<AffirmationsWrapper />} />
              </Routes>
            </AnimatePresence>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </ActiveCallContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
