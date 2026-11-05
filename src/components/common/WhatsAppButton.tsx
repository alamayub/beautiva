import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const DEFAULT_WHATSAPP_NUMBER = '917236851999';

export const getWhatsAppUrl = (
  number: string = DEFAULT_WHATSAPP_NUMBER,
  message: string = 'Hello Beautiva! I would like to book a doorstep salon service.'
) => {
  const cleanNumber = number.replace(/[^\d]/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
};

interface WhatsAppButtonProps {
  variant?: 'floating' | 'inline' | 'compact' | 'header';
  phoneNumber?: string;
  message?: string;
  label?: string;
  className?: string;
  showStatusIndicator?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  variant = 'floating',
  phoneNumber = DEFAULT_WHATSAPP_NUMBER,
  message = 'Hello Beautiva! I would like to inquire about booking doorstep salon services in Lucknow/Patna/Kanpur.',
  label = 'Chat on WhatsApp',
  className = '',
  showStatusIndicator = true,
}) => {
  const isCartDrawerOpen = useAppSelector((state) => state.cart.isDrawerOpen);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

  const redirectUrl = getWhatsAppUrl(phoneNumber, message);

  // Floating variant (sits at bottom-left, responsive, hides when cart drawer is active)
  if (variant === 'floating') {
    // If in admin dashboard, keep screen clear unless requested
    if (isAdminPath) return null;

    return (
      <div
        className={`fixed bottom-6 left-6 z-40 transition-all duration-300 ${
          isCartDrawerOpen ? 'opacity-0 pointer-events-none invisible scale-90' : 'opacity-100 scale-100'
        } ${className}`}
      >
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Direct WhatsApp Concierge"
          className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-[0_4px_16px_rgba(37,211,102,0.35)] hover:shadow-[0_6px_22px_rgba(37,211,102,0.5)] transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer border border-[#25D366]/60"
        >
          <div className="relative flex items-center justify-center">
            <WhatsAppIcon className="w-6 h-6 fill-white" />
            {showStatusIndicator && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-white ring-2 ring-[#25D366]" />
            )}
          </div>

          {/* Micro status tooltip on hover */}
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-900/95 text-white text-[11px] whitespace-nowrap shadow-md pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] shrink-0" />
            <span>Chat on WhatsApp</span>
          </div>
        </a>
      </div>
    );
  }

  // Header quick link variant
  if (variant === 'header') {
    return (
      <a
        href={redirectUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={`inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-emerald-700 hover:bg-emerald-50/80 px-2.5 py-1.5 rounded-lg border border-stone-200/90 transition-colors cursor-pointer ${className}`}
        title="Direct WhatsApp Support: +91 7236851999"
      >
        <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
        <span className="hidden md:inline font-sans">WhatsApp</span>
      </a>
    );
  }

  // Compact badge variant (for cards, headers, tables)
  if (variant === 'compact') {
    return (
      <a
        href={redirectUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#128C7E] bg-[#E8F8F5] hover:bg-[#D4F4ED] px-2.5 py-1 rounded-md transition-colors cursor-pointer border border-[#25D366]/30 ${className}`}
      >
        <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
        <span>{label}</span>
      </a>
    );
  }

  // Full Inline Button variant (for Product Detail, Contact Us, Checkout)
  return (
    <a
      href={redirectUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer border border-[#20ba59] ${className}`}
    >
      <WhatsAppIcon className="w-4 h-4 fill-white" />
      <span>{label}</span>
    </a>
  );
};
