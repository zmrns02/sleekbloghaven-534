import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage, Language as LanguageType } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Language = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const languages = [
    { code: 'no' as LanguageType, name: t('language.norwegian'), flag: '🇳🇴' },
    { code: 'en' as LanguageType, name: t('language.english'), flag: '🇬🇧' },
    { code: 'tr' as LanguageType, name: t('language.turkish'), flag: '🇹🇷' },
  ];

  const handleLanguageChange = (lang: LanguageType) => {
    setLanguage(lang);
  };

  const handleSave = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-balkan-cream dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-8 w-8 text-balkan-red" />
            <h1 className="text-4xl font-bold text-balkan-dark dark:text-white">
              {t('language.title')}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {t('language.description')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white dark:bg-gray-800 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-balkan-dark dark:text-white">
                {t('language.available')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {languages.map((lang, index) => (
                <motion.div
                  key={lang.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                    language === lang.code
                      ? 'border-balkan-red bg-balkan-red/5 dark:bg-balkan-red/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-balkan-red/50'
                  }`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="font-medium text-balkan-dark dark:text-white">
                        {lang.name}
                      </span>
                    </div>
                    {language === lang.code && (
                      <Check className="h-5 w-5 text-balkan-red" />
                    )}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex gap-4"
        >
          <Button
            onClick={handleSave}
            className="bauhaus-button bg-balkan-red text-white hover:bg-balkan-red/90 flex-1"
          >
            {t('language.save')}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1"
          >
            {t('language.cancel')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Language;