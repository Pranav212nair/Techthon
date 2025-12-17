import { FormEvent, useState, useEffect, useRef } from "react";
import { ConversationTurn } from "../types";
import AIWaveform from "./AIWaveform";
import { Mic, Send, Loader } from "lucide-react";

interface Props {
  conversation: ConversationTurn[];
  onSend: (prompt: string) => Promise<void> | void;
}

function VoiceConversationPanel({ conversation, onSend }: Props) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const currentMood = conversation[conversation.length - 1]?.sentiment || "calm";

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please enable microphone permissions in your browser.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim() || sending) return;
    
    const userInput = input.trim();
    setInput("");
    setSending(true);
    
    try {
      await onSend(userInput);
    } catch (error) {
      console.error("Error sending prompt:", error);
    } finally {
      setSending(false);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to start recording:', error);
        setIsRecording(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <AIWaveform mood={currentMood} />
      <div ref={scrollRef} className="glass-panel h-72 overflow-y-auto rounded-2xl border border-white/5 p-4">
        <div className="flex flex-col gap-3">
          {conversation.map((turn, idx) => (
            <div key={idx} className="flex">
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-glow ${
                  turn.role === "assistant"
                    ? "self-start bg-panel/80 border border-accent-400/40 text-slate-100"
                    : "self-end bg-accent-500 text-surface font-medium"
                }`}
              >
                {turn.text}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex">
              <div className="rounded-2xl px-4 py-3 text-sm bg-panel/60 border border-accent-300/30 text-slate-300 animate-pulse flex items-center gap-2">
                <Loader className="h-3 w-3 animate-spin" /> VIGIL is listening...
              </div>
            </div>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="glass-panel flex items-center gap-2 rounded-full border border-white/10 px-4 py-3">
        <button
          type="button"
          onClick={toggleRecording}
          disabled={sending}
          className={`rounded-full p-2 transition flex-shrink-0 ${
            isRecording
              ? 'bg-danger text-white animate-pulse'
              : 'text-accent-200 hover:bg-accent-500/10'
          }`}
          title={isRecording ? 'Stop recording' : 'Start voice input'}
        >
          <Mic className="h-4 w-4" />
        </button>
        <input
          className="h-10 flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          placeholder={isRecording ? "Listening..." : "Ask for a diagnosis, booking, or an explanation"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending || isRecording}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="rounded-full bg-gradient-to-r from-accent-500 to-glow px-3 py-2 text-surface shadow-neon disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {sending ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}

export default VoiceConversationPanel;
