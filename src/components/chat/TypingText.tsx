import React, { useState, useEffect, useRef } from 'react';
import { FastForward } from 'lucide-react';

interface TypingTextProps {
  content: string;
  isStreaming?: boolean;
  speed?: number; // ms per tick
  chunkSize?: number; // chars per tick
  onComplete?: () => void;
}

export const TypingText: React.FC<TypingTextProps> = ({
  content,
  isStreaming = false,
  speed = 14,
  chunkSize = 3,
  onComplete,
}) => {
  const [displayedLength, setDisplayedLength] = useState<number>(() =>
    isStreaming ? 0 : content.length
  );
  const [isTyping, setIsTyping] = useState<boolean>(isStreaming);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedLength(content.length);
      setIsTyping(false);
      return;
    }

    setDisplayedLength(0);
    setIsTyping(true);

    const timer = setInterval(() => {
      setDisplayedLength((prev) => {
        const next = prev + chunkSize;
        if (next >= content.length) {
          clearInterval(timer);
          setIsTyping(false);
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
          return content.length;
        }
        return next;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [content, isStreaming, speed, chunkSize]);

  const handleSkip = () => {
    setDisplayedLength(content.length);
    setIsTyping(false);
    if (onCompleteRef.current) {
      onCompleteRef.current();
    }
  };

  const visibleText = content.slice(0, displayedLength);

  // Render markdown-like formatting simply and cleanly
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');

    return lines.map((line, lineIdx) => {
      // Header 3
      if (line.startsWith('### ')) {
        const headerContent = line.replace('### ', '');
        return (
          <h4
            key={lineIdx}
            className="font-playfair text-base font-bold text-stone-900 mt-2 mb-1.5 flex items-center gap-1.5"
          >
            {renderInline(headerContent)}
          </h4>
        );
      }

      // Bullet item
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const bulletContent = line.slice(2);
        return (
          <div key={lineIdx} className="flex items-start gap-2 text-stone-700 text-xs sm:text-sm my-0.5 leading-relaxed">
            <span className="text-[#601A24] font-bold mt-1 text-xs">•</span>
            <span className="flex-1">{renderInline(bulletContent)}</span>
          </div>
        );
      }

      // Numbered item (e.g. "1. ")
      const numMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <div key={lineIdx} className="flex items-start gap-2 text-stone-700 text-xs sm:text-sm my-1 leading-relaxed">
            <span className="text-[#601A24] font-bold text-xs bg-[#601A24]/10 rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
              {numMatch[1]}
            </span>
            <span className="flex-1">{renderInline(numMatch[2])}</span>
          </div>
        );
      }

      // Empty line spacer
      if (!line.trim()) {
        return <div key={lineIdx} className="h-1.5" />;
      }

      // Standard paragraph
      return (
        <p key={lineIdx} className="text-stone-800 text-xs sm:text-sm leading-relaxed mb-1">
          {renderInline(line)}
        </p>
      );
    });
  };

  // Inline formatting: **bold**, `code/batch`, *italic*
  const renderInline = (str: string) => {
    // Split by **bold** and `code`
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-stone-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 bg-stone-100 text-[#601A24] font-mono text-xs rounded border border-stone-200"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="relative group/typing">
      <div className="prose prose-sm max-w-none text-stone-800">
        {renderFormattedText(visibleText)}
        {isTyping && (
          <span className="inline-block w-1.5 h-3.5 bg-[#601A24] ml-0.5 animate-pulse align-middle" />
        )}
      </div>

      {isTyping && (
        <button
          onClick={handleSkip}
          type="button"
          className="mt-1 text-[10px] text-stone-500 hover:text-[#601A24] flex items-center gap-1 font-medium transition-colors"
          title="Instant output"
        >
          <FastForward className="w-3 h-3" />
          <span>Skip typing</span>
        </button>
      )}
    </div>
  );
};
