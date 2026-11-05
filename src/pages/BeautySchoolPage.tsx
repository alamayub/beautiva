import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Award, 
  Send 
} from 'lucide-react';
import { useToast } from '../components/common/ToastProvider';
import { SEO } from '../components/common/SEO';

export const BeautySchoolPage: React.FC = () => {
  const { showToast } = useToast();
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryCourse, setInquiryCourse] = useState('cosmetology');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const courses = [
    {
      id: 'cosmetology',
      title: 'Diploma in Cosmetology & Skin Science',
      duration: '6 Months (Full-Time / Part-Time)',
      eligibility: '10th / 12th Standard Pass',
      highlights: [
        'Dermatological skin anatomy & types',
        'Facial techniques: fruit, gold, diamond & chemical peels',
        'Electrotherapy: High-frequency & Galvanic machines',
        '100% Hands-on client apprenticeships'
      ],
      certification: 'Certified Cosmetologist by Beautiva Academy'
    },
    {
      id: 'makeup-artistry',
      title: 'Advanced Bridal & HD Makeup Artistry',
      duration: '3 Months (Weekend & Fast-Track Available)',
      eligibility: 'Passionate about makeup & aesthetics',
      highlights: [
        'Airbrush & 3D HD silicone bases',
        'Bridal contouring, cut-crease eye art & lashes',
        'Contemporary dupatta & saree draping techniques',
        'Portfolio photo shoot session included'
      ],
      certification: 'Master Bridal Artist Diploma'
    },
    {
      id: 'hair-tech',
      title: 'Professional Hair Technology & Styling',
      duration: '4 Months',
      eligibility: 'Open to all aspiring stylists',
      highlights: [
        'Advanced hair cutting & texture mapping',
        'Chemical smoothing, keratin treatments & rebonding',
        'Balayage, ombré & gray blending formulas',
        'Updos, blowdrys, tongs & heat ergonomics'
      ],
      certification: 'Hair Technology Specialist'
    },
    {
      id: 'nail-spa',
      title: 'Nail Art, Extensions & Reflexology',
      duration: '2 Months',
      eligibility: 'Beginners welcome',
      highlights: [
        'Gel & acrylic extension techniques',
        '3D nail embellishments & Ombre nails',
        'Hygienic foot reflexology & therapeutic spa mani-pedi',
        'Sanitization protocols & tool safety'
      ],
      certification: 'Certified Nail Technician'
    }
  ];

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) {
      showToast('Please enter your name and phone number', 'error');
      return;
    }
    setIsSubmitted(true);
    showToast('Inquiry submitted! Our academy counselor will call you within 24 hours.');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 border-b border-stone-200">
      <SEO
        title="Beautiva Academy - Professional Cosmetology & Beautician Courses"
        description="Launch your career in cosmetology, skin science, and bridal makeup with Beautiva Academy in Lucknow. Government-aligned certifications and 100% placement support."
        canonical="https://beautiva.in/beauty-school"
        keywords="cosmetology courses Lucknow, beautician diploma, beauty academy, makeup course, hair styling certification, skin science course"
        schema={{
          '@type': 'EducationalOrganization',
          name: 'Beautiva Beauty Academy',
          url: 'https://beautiva.in/beauty-school',
          description: 'Professional cosmetology, beauty therapy, and bridal makeup academy.',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Lucknow',
            addressRegion: 'Uttar Pradesh',
            addressCountry: 'IN',
          },
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-stone-900">Beautiva Beauty School</span>
        </nav>

        {/* Hero */}
        <div className="bg-gradient-to-br from-[#401218] to-[#250A0E] text-white rounded-2xl p-6 sm:p-12 mb-12 shadow-lg">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs text-rose-200">
              <GraduationCap className="w-4 h-4 text-[#D47A83]" />
              <span>Government-Aligned Vocational Training</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-white leading-tight">
              Build a High-Earning Career with Beautiva Beauty School
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
              Beautiva Beauty School trains ambitious women in modern aesthetics, scientific cosmetology, and wedding artistry with 100% practical studio training and direct induction into our doorstep salon platform.
            </p>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="mb-14">
          <div className="mb-8">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#601A24]">
              Professional Certifications
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900 mt-1">
              Accredited Diploma Programs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#601A24] font-semibold mb-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <h3 className="text-xl font-editorial font-bold text-stone-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    <strong>Eligibility:</strong> {course.eligibility}
                  </p>

                  <div className="space-y-2 mb-6">
                    {course.highlights.map((hl, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700">{course.certification}</span>
                  <a
                    href="#inquiry-form"
                    onClick={() => setInquiryCourse(course.id)}
                    className="font-bold text-[#601A24] hover:underline"
                  >
                    Apply Now →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inquiry Form */}
        <div id="inquiry-form" className="bg-white rounded-2xl border border-stone-200 shadow-md p-6 sm:p-10 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-editorial font-bold text-stone-900">
              Request Course Syllabus & Fee Structure
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Speak with our student counselors in Lucknow or Patna for enrollment and installment options.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-900 text-sm">Thank You for Your Interest!</h4>
              <p className="text-xs text-emerald-800">
                We have received your details. Our academic coordinator will contact you at {inquiryPhone}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitInquiry} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="e.g. Anjali Tiwari"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">Select Course of Interest</label>
                <select
                  value={inquiryCourse}
                  onChange={(e) => setInquiryCourse(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#601A24]"
                >
                  <option value="cosmetology">Diploma in Cosmetology & Skin Science</option>
                  <option value="makeup-artistry">Advanced Bridal & HD Makeup Artistry</option>
                  <option value="hair-tech">Professional Hair Technology & Styling</option>
                  <option value="nail-spa">Nail Art, Extensions & Reflexology</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#601A24] text-white text-xs font-semibold rounded-lg hover:bg-[#4a121a] transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Course Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
