import React from 'react';
import { CityHeroModule } from '../components/sections/CityHeroModule';
import { TrendingServicesSection } from '../components/sections/TrendingServicesSection';
import { CustomPackageBuilder } from '../components/sections/CustomPackageBuilder';
import { TransparencyCalculator } from '../components/sections/TransparencyCalculator';
import { HowItWorksSection } from '../components/sections/HowItWorksSection';
import { BrandShowcase } from '../components/sections/BrandShowcase';
import { WhySalonline } from '../components/sections/WhySalonline';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { InteractiveFaqSection } from '../components/sections/InteractiveFaqSection';
import { BeautySchoolBanner } from '../components/sections/BeautySchoolBanner';
import { SEO } from '../components/common/SEO';

export const HomePage: React.FC = () => {
  return (
    <main className="space-y-0">
      <SEO
        title="Premium Salon & Beauty Services at Home"
        description="Beautiva offers doorstep salon, luxury facial, skincare, hair styling, bridal makeup, and certified beauty school courses across Lucknow, Patna, and beyond."
        canonical="https://beautiva.in/"
        keywords="salon at home, parlour services at home, doorstep beauty services, bridal makeup home service, waxing at home, facial at home, salon in Lucknow, salon in Patna"
      />
      {/* 1. City, Locality, Search & Quick Icon Grid */}
      <CityHeroModule />

      {/* 2. Trending Treatments Near You with Steppers */}
      <TrendingServicesSection />

      {/* 3. Interactive Custom Package Builder (Roll Your Own Package) */}
      <CustomPackageBuilder />

      {/* 4. Beautiva Signature "Freedom of Products" Per-Minute Transparency Calculator */}
      <TransparencyCalculator />

      {/* 5. How It Works in 3 Simple Steps */}
      <HowItWorksSection />

      {/* 6. Partner Brand Houses */}
      <BrandShowcase />

      {/* 7. Clinical Hygiene & Trust Standard */}
      <WhySalonline />

      {/* 8. Verified Local Customer Reviews */}
      <TestimonialsSection />

      {/* 9. Interactive FAQ Accordion */}
      <InteractiveFaqSection />

      {/* 10. Beauty School Mission Banner */}
      <BeautySchoolBanner />
    </main>
  );
};
