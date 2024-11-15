import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { GradientShader } from "./GradientShader";
import { motion } from "framer-motion";
import "../styles/text-effects.css";

export function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/home");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        navigate("/home");
      }
      if (event === "USER_UPDATED" && session) {
        navigate("/home");
      }
      if (event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Gradient Shader Background */}
      <div className="absolute inset-0">
        <GradientShader />
      </div>

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 backdrop-blur-[100px] bg-white/10" />

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-8 left-8 z-10"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105 backdrop-blur-lg border border-white/20 blur-glow"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </motion.div>
      
      <motion.div 
        className="relative z-10 w-full max-w-md space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-center">
          <motion.div 
            className="flex justify-center mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="w-16 h-16 p-2 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 hover-lift blur-glow">
              <img src="/wzrd-logo.png" alt="WZRD" className="w-full h-full" />
            </div>
          </motion.div>
          <motion.h2 
            className="text-4xl font-bold noise-text glow-text animated-gradient-text text-glow-strong"
            data-text="Welcome to WZRD.tech"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Welcome to WZRD.tech
          </motion.h2>
          <motion.p 
            className="mt-2 text-lg text-white/80 glow-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Sign in or create an account to continue
          </motion.p>
          <motion.p 
            className="mt-2 text-sm text-red-300/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Note: During development, you need to use an authorized email domain.
          </motion.p>
        </div>

        <motion.div 
          className="glassmorphism p-8 rounded-2xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover-lift blur-glow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(255, 255, 255)',
                    brandAccent: 'rgba(255, 255, 255, 0.8)',
                    inputBackground: 'rgba(255, 255, 255, 0.1)',
                    inputText: 'white',
                    inputPlaceholder: 'rgba(255, 255, 255, 0.5)',
                  },
                },
              },
              className: {
                message: 'text-red-300/90 text-sm',
                label: 'text-white/90 font-medium glow-text',
                button: 'bg-white/20 hover:bg-white/30 backdrop-blur-lg border border-white/20 transition-all duration-300 hover-lift blur-glow',
                container: 'space-y-4',
                anchor: 'text-white/80 hover:text-white transition-colors duration-300 glow-text',
                divider: 'bg-white/20',
                input: 'bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-lg hover-lift blur-glow',
              },
            }}
            theme="dark"
            providers={[]}
            redirectTo={`${window.location.origin}/home`}
            magicLink={false}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password (minimum 6 characters)',
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Your password',
                  button_label: 'Sign in',
                  loading_button_label: 'Signing in ...',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Password (minimum 6 characters)',
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Your password',
                  button_label: 'Sign up',
                  loading_button_label: 'Signing up ...',
                }
              }
            }}
          />
        </motion.div>
        
        <motion.p 
          className="text-center text-sm text-white/60 glow-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          © 2024 wzrd.tech
        </motion.p>
      </motion.div>
    </div>
  );
}