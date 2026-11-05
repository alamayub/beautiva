import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blog';

export const BlogPage: React.FC = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-stone-900">Beauty & Skincare Editorial</span>
        </nav>

        <div className="max-w-2xl mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#601A24]">
            Beautiva Editorial
          </span>
          <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-stone-900 mt-1">
            Skin, Hair & Bridal Artistry Insights
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
            Expert beauty recommendations, post-facial care, and seasonal regimens authored by certified cosmetologists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] bg-stone-100 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-2">
                    <span className="font-semibold text-[#601A24]">{post.category}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-base font-bold text-stone-900 group-hover:text-[#601A24] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
                <span>{post.date}</span>
                <span className="font-semibold text-[#601A24] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Read Article <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
