
import { motion } from "framer-motion";
import { Phone, MapPin, Clock, ArrowDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import foodHero from "@/assets/food-hero.jpg";

const HeroSection = () => {
  const { t } = useLanguage();
  
  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen bg-balkan-dark overflow-hidden flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={foodHero}
          alt="Delicious food"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-balkan-dark/90 to-balkan-dark/70" />
      </div>

      {/* Geometric Shapes with enhanced animations */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 0, rotate: 0, x: -100, y: -100 }}
          animate={{ 
            scale: 1, 
            rotate: 360,
            x: 0,
            y: 0
          }}
          transition={{ 
            duration: 2, 
            ease: "easeOut",
            rotate: {
              repeat: Infinity,
              duration: 20,
              ease: "linear"
            }
          }}
          className="geometric-circle w-80 h-80 bg-balkan-red opacity-90 -top-20 -left-20"
        />
        <motion.div
          initial={{ scale: 0, rotate: 45, x: 100, y: -50 }}
          animate={{ 
            scale: 1, 
            rotate: 90,
            x: 0,
            y: 0
          }}
          transition={{ 
            duration: 2, 
            delay: 0.3, 
            ease: "easeOut",
            rotate: {
              repeat: Infinity,
              duration: 15,
              ease: "linear",
              delay: 0.3
            }
          }}
          className="geometric-diamond w-60 h-60 bg-balkan-blue opacity-90 top-20 right-10"
        />
        <motion.div
          initial={{ scale: 0, rotate: 45, x: 100, y: 100 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
            x: 0,
            y: 0
          }}
          transition={{ 
            duration: 2, 
            delay: 0.6, 
            ease: "easeOut",
            rotate: {
              repeat: Infinity,
              duration: 25,
              ease: "linear",
              delay: 0.6
            }
          }}
          className="geometric-diamond w-80 h-80 bg-balkan-yellow opacity-80 bottom-10 right-20"
        />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-balkan-light opacity-30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{
              y: [null, -20, 0],
              scale: [0, 1, 0],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          {/* Welcome Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <span className="bg-balkan-yellow text-balkan-dark px-6 py-2 text-sm font-bold uppercase tracking-wider">
              {t('hero.welcome')}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black text-balkan-light mb-8 leading-none"
          >
            BALKAN
            <br />
            <span className="text-balkan-blue">PORSGRUNN</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-xl md:text-2xl text-balkan-light/90 mb-12 max-w-3xl leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 text-balkan-light"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-balkan-red flex items-center justify-center">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-sm opacity-75">Ring oss</p>
                <p className="font-bold">35 51 04 20</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-balkan-yellow flex items-center justify-center">
                <MapPin size={20} className="text-balkan-dark" />
              </div>
              <div>
                <p className="text-sm opacity-75">Adresse</p>
                <p className="font-bold">Storgata 101, Porsgrunn</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-balkan-blue flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-sm opacity-75">Åpningstider</p>
                <p className="font-bold">10:00 - 22:00</p>
              </div>
            </div>
          </motion.div>

          {/* Scroll Down Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            onClick={scrollToMenu}
            className="mt-12 flex items-center gap-2 text-balkan-light hover:text-balkan-yellow transition-colors group"
          >
            <span className="text-sm uppercase tracking-wider">{t('hero.exploreMenu').replace('{{count}}', '')}</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowDown size={20} className="group-hover:text-balkan-yellow" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-balkan-dark to-transparent" />
    </section>
  );
};

export default HeroSection;
