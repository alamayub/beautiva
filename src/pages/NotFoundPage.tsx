import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200 p-8 text-center shadow-xs space-y-4">
        <span className="font-editorial text-5xl font-bold text-[#601A24]">404</span>
        <h1 className="text-xl font-editorial font-bold text-stone-900">Page Not Found</h1>
        <p className="text-xs text-stone-500 leading-relaxed">
          The page or package you are looking for may have been moved or is currently unavailable.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Salonline Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
