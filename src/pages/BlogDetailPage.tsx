import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Clock, User, ArrowLeft } from 'lucide-react';
import { blogPosts } from '../data/blog';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-[#FAF8F5]">
        <h2 className="font-editorial text-2xl font-bold text-stone-900">Article Not Found</h2>
        <Link
          to="/blog"
          className="mt-4 px-4 py-2 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a]"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/blog" className="hover:text-stone-900 transition-colors">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-stone-900 truncate max-w-[200px]">{post.title}</span>
        </nav>

        <article className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-10 mb-12">
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className="font-bold uppercase tracking-wider text-[#601A24]">{post.category}</span>
              <span>·</span>
              <span>{post.readTime}</span>
              <span>·</span>
              <span>Published {post.date}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-bold text-stone-900 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <User className="w-3.5 h-3.5 text-stone-400" />
              <span>By {post.author}</span>
            </div>
          </div>

          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-stone-100 mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed max-w-none">
            {post.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="pt-8 mt-8 border-t border-stone-100 flex items-center justify-between">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#601A24] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all articles</span>
            </Link>

            <Link
              to="/services"
              className="px-4 py-2 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors"
            >
              Browse Salon Packages
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};
