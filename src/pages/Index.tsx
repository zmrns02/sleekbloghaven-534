
import React from 'react';
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import RestaurantInfo from "@/components/RestaurantInfo";
import RestaurantGallery from "@/components/RestaurantGallery";
import SocialLinks from "@/components/SocialLinks";
import Header from "@/components/Header";

const Index = () => {
  return (
    <main className="min-h-screen bg-balkan-cream dark:bg-gray-900">
      <Header />
      <HeroSection />
      <MenuSection />
      <RestaurantGallery />
      <RestaurantInfo />
      <SocialLinks />
    </main>
  );
};

export default Index;
