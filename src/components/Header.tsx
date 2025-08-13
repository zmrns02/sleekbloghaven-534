import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Settings, LogOut, LogIn, User } from 'lucide-react';
import { useCart } from './CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import CartPanel from './CartPanel';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const { t } = useLanguage();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/"
              onClick={() => {
                setIsMobileMenuOpen(false); // Close mobile menu if open
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
              }}
              className="z-50 relative" // Ensure logo stays clickable
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-40 h-12 flex items-center"
              >
                <img
                  src="/images/balkan-logo.svg"
                  alt="Balkan Porsgrunn - Hjem"
                  className="w-full h-full object-contain"
                  draggable="false" // Prevent image dragging
                />
                <span className="ml-2 font-bold text-lg text-balkan-red">Balkan Porsgrunn</span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors relative group px-4 py-2"
              >
                {t('nav.home')}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-balkan-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </button>
              <button
                onClick={() => scrollToSection('menu')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors relative group px-4 py-2"
              >
                {t('nav.menu')}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-balkan-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </button>
              <button
                onClick={() => scrollToSection('info')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors relative group px-4 py-2"
              >
                {t('nav.about')}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-balkan-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </button>
              <button
                onClick={() => scrollToSection('gallery')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors relative group px-4 py-2"
              >
                {t('nav.gallery')}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-balkan-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors relative group px-4 py-2"
              >
                {t('nav.contact')}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-balkan-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </button>
              <Link 
                to="/dashboard"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
              >
                {t('nav.dashboard')}
              </Link>
            </nav>

            {/* Settings, Auth and Cart Buttons */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Link 
                    to="/dashboard"
                    className="hidden md:block p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      signOut();
                      window.location.href = '/';
                    }}
                    className="hidden md:block p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                    title={t('auth.signOut')}
                  >
                    <LogOut className="h-5 w-5" />
                  </motion.button>
                </>
              ) : (
                <Link 
                  to="/auth"
                  className="hidden md:block p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                  title={t('auth.signIn')}
                >
                  <LogIn className="h-5 w-5" />
                </Link>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="relative bg-balkan-red text-white p-3 rounded-full hover:bg-balkan-red/90 transition-colors"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-balkan-yellow text-balkan-dark text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-balkan-dark dark:text-white p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700"
            >
              <nav className="container mx-auto px-4 py-4 space-y-4">
                <button
                  onClick={() => scrollToSection('hero')}
                  className="block text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors relative group px-4 py-2 w-full text-left"
                >
                  {t('nav.home')}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-balkan-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </button>
                <button
                  onClick={() => scrollToSection('menu')}
                  className="block text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors relative group px-4 py-2 w-full text-left"
                >
                  {t('nav.menu')}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-balkan-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </button>
                <button
                  onClick={() => scrollToSection('info')}
                  className="block text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors relative group px-4 py-2 w-full text-left"
                >
                  {t('nav.about')}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-balkan-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </button>
                <button
                  onClick={() => scrollToSection('gallery')}
                  className="block text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors relative group px-4 py-2 w-full text-left"
                >
                  {t('nav.gallery')}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-balkan-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="block text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors relative group px-4 py-2 w-full text-left"
                >
                  {t('nav.contact')}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-balkan-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </button>
                {user ? (
                  <>
                    <Link 
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors px-4 py-2"
                    >
                      {t('nav.dashboard')}
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signOut();
                        window.location.href = '/';
                      }}
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors px-4 py-2 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('auth.signOut')}
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/auth"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors px-4 py-2"
                  >
                    <LogIn className="h-4 w-4" />
                    {t('auth.signIn')}
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CartPanel />
    </>
  );
};

export default Header;