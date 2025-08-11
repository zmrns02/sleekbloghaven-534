import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import restaurantInterior from '@/assets/restaurant-interior.jpg';
import chefCooking from '@/assets/chef-cooking.jpg';
import foodHero from '@/assets/food-hero.jpg';

const RestaurantGallery = () => {
  const { t } = useLanguage();
  
  const images = [
    {
      src: restaurantInterior,
      alt: "Balkan Porsgrunn Restaurant Interior",
      title: t('gallery.images.atmosphere'),
      description: t('gallery.images.atmosphereDesc')
    },
    {
      src: chefCooking,
      alt: "Chef preparing traditional food",
      title: t('gallery.images.traditional'),
      description: t('gallery.images.traditionalDesc')
    },
    {
      src: foodHero,
      alt: "Delicious Turkish and Balkan cuisine",
      title: t('gallery.images.delicious'),
      description: t('gallery.images.deliciousDesc')
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-balkan-dark to-balkan-dark/90">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-black text-balkan-light mb-6">
            {t('gallery.title')}
          </h2>
          <p className="text-xl text-balkan-light/80 max-w-3xl mx-auto">
            {t('gallery.subtitle').replace('{{count}}', '')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="group relative overflow-hidden bg-white border-4 border-balkan-yellow"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-balkan-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold text-balkan-yellow mb-2">
                    {image.title}
                  </h3>
                  <p className="text-balkan-light/90">
                    {image.description}
                  </p>
                </div>
              </div>

              {/* Geometric accent */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-balkan-red transform rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-balkan-yellow text-balkan-dark px-8 py-4 font-bold uppercase tracking-wider hover:bg-balkan-yellow/90 transition-colors"
          >
            {t('gallery.viewMenu').replace('{{count}}', '')}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default RestaurantGallery;