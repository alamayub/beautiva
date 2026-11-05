import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  RotateCcw,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Compass,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import {
  ChatMessage,
  BEAUTIVA_SYSTEM_PROMPT,
  QUICK_PROMPTS_WEBSITE,
  QUICK_PROMPTS_DASHBOARD,
  generateSmartLocalResponse,
} from '../../data/chatbotKnowledge';
import { TypingText } from './TypingText';
import { useAppSelector } from '../../store/hooks';
import { WhatsAppIcon, getWhatsAppUrl } from '../common/WhatsAppButton';

export const ChatWidget: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isCartDrawerOpen = useAppSelector((state) => state.cart.isDrawerOpen);
  const isAdminPath = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [contextMode, setContextMode] = useState<'website' | 'dashboard'>(
    isAdminPath ? 'dashboard' : 'website'
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync mode when pathname changes, unless user manually chose one
  useEffect(() => {
    if (isAdminPath) {
      setContextMode('dashboard');
    } else {
      setContextMode('website');
    }
  }, [isAdminPath]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage: ChatMessage = {
        id: 'welcome-msg',
        sender: 'assistant',
        text:
          contextMode === 'dashboard'
            ? `### ⚡ Beautiva Operations Copilot\n\nI am connected to the Beautiva dispatch engine, fleet records, and inventory data. Ask me about **live bookings (SL-94821)**, **low inventory alerts**, **stylist availability**, or **academy enrollments**.`
            : `### ✨ Welcome to Beautiva Luxury Concierge!\n\nI can recommend personalized skincare & hair treatments, explain our **sealed mono-dose kits**, check city coverage (Lucknow, Patna & more), or guide you through bridal artistry packages.\n\nHow may I pamper you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: false,
        actions:
          contextMode === 'dashboard'
            ? [
                { label: 'Check SL-94821 Status', onClickPrompt: 'What is the status of booking SL-94821?' },
                { label: 'Inventory Stock Alerts', onClickPrompt: 'Show critical inventory stock alerts' },
                { label: 'Stylist Fleet On-Duty', onClickPrompt: 'List available stylists in Lucknow hub' },
              ]
            : [
                { label: 'Glow Facial for Sensitive Skin', onClickPrompt: 'Recommend a glow facial for sensitive skin' },
                { label: 'Painless Rica Waxing Details', onClickPrompt: 'What sealed kits do you use for waxing?' },
                { label: 'Check Lucknow & Patna Hubs', onClickPrompt: 'Which cities do you provide doorstep salon in?' },
              ],
      };
      setMessages([initialMessage]);
    }
  }, [contextMode, messages.length]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!speechEnabled) return;

    // Clean markdown before speaking
    const cleanText = text
      .replace(/###/g, '')
      .replace(/\*\*/g, '')
      .replace(/`/g, '')
      .replace(/[-*•]/g, ' ')
      .slice(0, 200);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const query = (customPrompt || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Use comprehensive on-device client-side knowledge engine (zero network/API dependency)
    await new Promise((resolve) => setTimeout(resolve, 300));
    const response = generateSmartLocalResponse(query, contextMode);
    const assistantResponseText = response.text;
    const responseActions = response.actions;

    setIsLoading(false);

    const assistantMessage: ChatMessage = {
      id: `asst-${Date.now()}`,
      sender: 'assistant',
      text: assistantResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
      actions: responseActions,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    if (!isOpen) {
      setHasUnread(true);
    }

    if (speechEnabled) {
      handleSpeak(assistantResponseText);
    }
  };

  const handleClearChat = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setMessages([]);
  };

  const activeQuickPrompts =
    contextMode === 'dashboard' ? QUICK_PROMPTS_DASHBOARD : QUICK_PROMPTS_WEBSITE;

  return (
    <>
      {/* Floating Launcher Button (hidden when cart drawer is open) */}
      <div
        className={`fixed bottom-6 right-6 z-40 flex flex-col items-end transition-all duration-200 ${
          isCartDrawerOpen ? 'opacity-0 pointer-events-none invisible scale-90' : 'opacity-100 scale-100'
        }`}
      >
        {!isOpen && (
          <div className="mb-2 hidden sm:flex items-center gap-2 bg-stone-900/90 text-stone-100 backdrop-blur-md px-3 py-1.5 rounded-full text-xs shadow-lg border border-stone-800 animate-bounce duration-1000">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-medium">
              {isAdminPath ? 'Operations Copilot Active' : 'Need beauty advice? Ask Beautiva AI'}
            </span>
          </div>
        )}

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Open Beautiva AI Chatbot"
          className={`relative flex items-center justify-center p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            isOpen
              ? 'bg-stone-900 text-stone-200 ring-2 ring-stone-700'
              : 'bg-gradient-to-r from-[#601A24] via-[#7B222E] to-[#4A141C] text-white ring-4 ring-[#C59B27]/25 shadow-[#601A24]/40'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
              <Sparkles className="w-3.5 h-3.5 text-[#E6CA65] absolute -top-1 -right-1" />
              {hasUnread && (
                <span className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </div>
          )}
        </button>
      </div>

      {/* Chat Window Modal (z-40 so CartDrawer with z-[100] is completely above it; hidden if cart drawer is open) */}
      {isOpen && !isCartDrawerOpen && (
        <div
          className={`fixed z-40 transition-all duration-300 flex flex-col bg-white border border-stone-200/80 shadow-2xl overflow-hidden rounded-2xl ${
            isExpanded
              ? 'bottom-4 right-4 top-4 left-4 sm:left-auto sm:w-[680px] sm:h-[85vh]'
              : 'bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[440px] h-[580px] max-h-[82vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#601A24] via-[#6F1D29] to-[#4A141C] text-white px-4 py-3.5 flex items-center justify-between border-b border-[#7B222E] shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] p-0.5 shadow-sm">
                <div className="w-full h-full rounded-full bg-[#601A24] flex items-center justify-center text-[#E6CA65]">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-playfair font-semibold text-sm sm:text-base tracking-wide text-white">
                    Beautiva AI
                  </h3>
                  <span className="text-[10px] bg-[#D4AF37]/20 text-[#F3E5AB] px-1.5 py-0.5 rounded font-mono font-medium border border-[#D4AF37]/30">
                    Concierge
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 flex items-center gap-1 font-sans">
                  <span>Grounded in Services & Dashboard</span>
                </p>
              </div>
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-1 text-stone-300">
              <a
                href={getWhatsAppUrl('917236851999', 'Hello Beautiva! I was using the AI assistant and would like to speak directly with an agent on WhatsApp.')}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-emerald-400 hover:text-emerald-300 cursor-pointer"
                title="Direct WhatsApp Concierge (+91 7236851999)"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current" />
              </a>

              <button
                onClick={() => setSpeechEnabled((prev) => !prev)}
                className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer ${
                  speechEnabled ? 'text-[#E6CA65]' : 'text-stone-300'
                }`}
                title={speechEnabled ? 'Mute speech' : 'Enable voice read'}
              >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-stone-300 hover:text-white cursor-pointer"
                title="Clear conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className="hidden sm:inline-flex p-1.5 rounded-lg hover:bg-white/10 transition-colors text-stone-300 hover:text-white cursor-pointer"
                title={isExpanded ? 'Restore size' : 'Expand window'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-stone-300 hover:text-white cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Perspective Context Switcher Pill */}
          <div className="bg-stone-50 border-b border-stone-200 px-3 py-2 flex items-center justify-between text-xs shrink-0">
            <span className="text-stone-500 font-medium text-[11px] flex items-center gap-1">
              Perspective:
            </span>
            <div className="flex items-center bg-stone-200/70 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setContextMode('website')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                  contextMode === 'website'
                    ? 'bg-white text-[#601A24] shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Compass className="w-3 h-3" />
                <span>Storefront Concierge</span>
              </button>
              <button
                type="button"
                onClick={() => setContextMode('dashboard')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                  contextMode === 'dashboard'
                    ? 'bg-white text-[#601A24] shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <LayoutDashboard className="w-3 h-3" />
                <span>Admin Copilot</span>
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FCFBF9]">
            {messages.map((message) => {
              const isUser = message.sender === 'user';
              return (
                <div
                  key={message.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm shadow-sm transition-all ${
                      isUser
                        ? 'bg-[#601A24] text-white rounded-br-none'
                        : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none'
                    }`}
                  >
                    {!isUser ? (
                      <TypingText
                        content={message.text}
                        isStreaming={message.isStreaming}
                        onComplete={() => {
                          // mark streaming as completed
                          setMessages((prev) =>
                            prev.map((m) =>
                              m.id === message.id ? { ...m, isStreaming: false } : m
                            )
                          );
                        }}
                      />
                    ) : (
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    )}

                    {/* Action buttons if provided */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-wrap gap-1.5">
                        {message.actions.map((act, actIdx) => (
                          <button
                            key={actIdx}
                            type="button"
                            onClick={() => {
                              if (act.url) {
                                navigate(act.url);
                                setIsOpen(false);
                              } else if (act.onClickPrompt) {
                                handleSendMessage(act.onClickPrompt);
                              }
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-[#601A24]/10 text-[#601A24] border border-[#601A24]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <span>{act.label}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-stone-400 mt-1 px-1">
                    {message.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-stone-500 text-xs bg-white px-3.5 py-2.5 rounded-2xl rounded-bl-none border border-stone-200 w-fit shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#601A24] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-[#601A24] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-[#601A24] rounded-full animate-bounce" />
                </div>
                <span className="text-[11px] font-medium text-stone-500">
                  {contextMode === 'dashboard'
                    ? 'Retrieving fleet & booking telemetry...'
                    : 'Consulting beauty repertoire...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestion Chips */}
          <div className="px-3 py-2 bg-stone-50 border-t border-stone-200/80 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" /> Suggestions:
            </span>
            {activeQuickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap shrink-0 text-[11px] bg-white hover:bg-[#601A24] text-stone-700 hover:text-white px-2.5 py-1 rounded-full border border-stone-200 hover:border-[#601A24] transition-all duration-150 shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  contextMode === 'dashboard'
                    ? 'Ask about bookings (SL-94821), stock, fleet...'
                    : 'Ask about facials, waxing, prices, bridal...'
                }
                disabled={isLoading}
                className="w-full bg-stone-50 text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm pl-3.5 pr-8 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#601A24]/20 focus:border-[#601A24] transition-all"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => setInputValue('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={`p-2.5 rounded-xl font-medium text-white transition-all duration-200 shrink-0 ${
                inputValue.trim() && !isLoading
                  ? 'bg-[#601A24] hover:bg-[#7B222E] shadow-sm hover:scale-105 active:scale-95'
                  : 'bg-stone-300 text-stone-400 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Footer note */}
          <div className="bg-stone-50 px-3 py-1 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              100% Sealed Mono-Dose Standard
            </span>
            <span>Beautiva Smart Concierge</span>
          </div>
        </div>
      )}
    </>
  );
};
