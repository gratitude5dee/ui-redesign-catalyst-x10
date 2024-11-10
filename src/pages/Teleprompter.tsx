import { useLocation, useNavigate } from 'react-router-dom';
import { useTeleprompter } from '@/hooks/useTeleprompter';
import { TeleprompterControls } from '@/components/TeleprompterControls';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TeleprompterState {
  script: string;
  fontSize: number;
  fontFamily: string;
  textColor: string;
}

const Teleprompter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const { script, fontSize, fontFamily, textColor } = (location.state as TeleprompterState) || {};
  const highlightRef = useRef<HTMLSpanElement>(null);
  
  const {
    isPlaying,
    speed,
    containerRef,
    togglePlay,
    updateSpeed,
    reset,
    updateScrollPosition
  } = useTeleprompter(2);

  useEffect(() => {
    if (!script) {
      navigate('/');
      return;
    }
    setWords(script.split(/\s+/).filter(word => word.length > 0));
    setEditedText(script);
  }, [script, navigate]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentWordIndex(prev => {
          if (prev >= words.length - 1) {
            clearInterval(interval);
            togglePlay();
            return prev;
          }
          return prev + 1;
        });
      }, 60000 / (speed * 200));
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, speed, words.length, togglePlay]);

  useEffect(() => {
    if (highlightRef.current) {
      updateScrollPosition(highlightRef.current);
    }
  }, [currentWordIndex, updateScrollPosition]);

  const handleExit = useCallback(() => {
    reset();
    setCurrentWordIndex(0);
    navigate('/');
  }, [reset, navigate]);

  const handleWordClick = useCallback((index: number) => {
    setCurrentWordIndex(index);
  }, []);

  const handleEditToggle = () => {
    if (isEditing && editedText.trim()) {
      setWords(editedText.split(/\s+/).filter(word => word.length > 0));
      setCurrentWordIndex(0);
      toast.success('Text updated successfully');
    }
    setIsEditing(!isEditing);
  };

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white overflow-hidden relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        className="absolute top-6 left-6 z-50 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleEditToggle}
        className="absolute top-6 right-6 z-50 rounded-full w-12 h-12 bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
      >
        <Edit2 className="h-6 w-6" />
      </Button>

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 to-transparent pointer-events-none" />
      
      <div
        ref={containerRef}
        className="h-screen overflow-hidden relative z-10 smooth-scroll"
      >
        {isEditing ? (
          <div className="max-w-4xl mx-auto pt-24 px-6">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-[60vh] w-full bg-black/30 border-white/20 text-white resize-none p-6"
              style={{
                fontFamily: fontFamily === 'inter' ? 'Inter' : 
                         fontFamily === 'cal-sans' ? 'Cal Sans' : fontFamily,
                fontSize: `${fontSize / 16}rem`,
              }}
            />
          </div>
        ) : (
          <div 
            className={cn(
              "teleprompter-text",
              "transition-opacity duration-500",
              isPlaying ? "opacity-100" : "opacity-80"
            )}
          >
            {words.map((word, index) => (
              <span
                key={index}
                ref={index === currentWordIndex ? highlightRef : null}
                onClick={() => handleWordClick(index)}
                className={cn(
                  "inline-block mx-1 px-1 py-0.5 rounded cursor-pointer transition-all duration-300",
                  "hover:bg-white/10",
                  index === currentWordIndex && "animate-glow-word scale-110 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-semibold",
                  index < currentWordIndex ? "opacity-60" : "opacity-40"
                )}
              >
                {word}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent pointer-events-none z-20" />
      <div className="fixed inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none z-20" />
      
      {!isEditing && (
        <TeleprompterControls
          isPlaying={isPlaying}
          speed={speed}
          onTogglePlay={togglePlay}
          onSpeedChange={updateSpeed}
          onExit={handleExit}
        />
      )}
    </div>
  );
};

export default Teleprompter;