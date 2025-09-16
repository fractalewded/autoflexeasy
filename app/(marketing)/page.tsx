import Testimonials from '@/components/landing-page/testimonials-default';
import FAQSection from '@/components/landing-page/faq';
import Hero from '@/components/landing-page/hero';
import LogoCloud from '@/components/landing-page/logo-cloud-svg';
import FeaturesHover from '@/components/landing-page/features-hover';
import Pricing from '@/components/pricing/pricing-primary';

export default async function IndexPage() {
  return (
    <div className="flex-col gap-10 mb-5">
      <Hero />
      <LogoCloud />
      <FeaturesHover />
      <Pricing />
      <Testimonials />
      <FAQSection />
    </div>
  );
}