import { useEffect, useState } from 'react';
import Hero from '@/components/home/Hero';
import ImmediateShop from '@/components/home/ImmediateShop';
import InteractiveStudioBanner from '@/components/home/InteractiveStudioBanner';
import JuteShowcase from '@/components/home/JuteShowcase';
import StoryTimeline from '@/components/home/StoryTimeline';
import ReviewsShowcase from '@/components/home/ReviewsShowcase';
import TuftingEssentialsSection from '@/components/home/TuftingEssentialsSection';
import { fetchProducts } from '@/lib/api';
import type { Product } from '@/lib/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <div className="bg-linen min-h-screen">
      {/* 2. Cinematic Hero with Parallax, Woven Grain & Dual CTAs */}
      <Hero />

      {/* 3. Immediate Shopping — Split Collection Showcase (Tufted Rugs vs Natural Jute) */}
      <ImmediateShop products={products} />

      {/* 4. Interactive Custom Rug Studio Banner with Live Area & Metric/Imperial Math */}
      <InteractiveStudioBanner />

      {/* 5. Jute Handicrafts Capsule with 100% Golden Fiber & Eco Certification */}
      <JuteShowcase products={products} />

      {/* 6. Tufting Essentials for Every Artist — Bulk Deals Banner & 12 Category Grid */}
      <TuftingEssentialsSection />

      {/* 7. Heritage & Transparency Interactive Timeline (6-Stage Craft Lifecycle) */}
      <StoryTimeline />

      {/* 7. Curated Reviews & Global Customer Showcase with Placement Photography */}
      <ReviewsShowcase />
    </div>
  );
}
