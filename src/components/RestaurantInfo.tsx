import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const RestaurantInfo = () => {
  const { t } = useLanguage();
  
  const openingHours = [
    { day: t('restaurant.hours.monday'), hours: "10:00 – 22:00" },
    { day: t('restaurant.hours.friday'), hours: "10:00 – 23:00" },
    { day: t('restaurant.hours.saturday'), hours: "13:00 – 23:00" },
    { day: t('restaurant.hours.sunday'), hours: "13:00 – 22:00" }
  ];

  return (
    <section id="info" className="py-20 bg-balkan-dark">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Restaurant Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl font-black text-white mb-6">
                {t('restaurant.name')}
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                {t('restaurant.description')}
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-balkan-red flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">{t('restaurant.addressLabel')}</h3>
                  <p className="text-white/80">
                    {t('restaurant.address').replace('{{count}}', '')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-balkan-yellow flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-balkan-dark" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">WhatsApp</h3>
                  <a 
                    href="https://wa.me/4792518238" 
                    className="text-white/80 hover:text-balkan-yellow transition-colors text-xl font-semibold"
                  >
                    {t('restaurant.phone').replace('{{count}}', '')}
                  </a>
                  <div className="mt-2">
                    <span className="text-sm text-white/60">E-post: </span>
                    <a href="mailto:02veli0201@gmail.com" className="text-white/80 hover:text-balkan-yellow transition-colors">
                      {t('restaurant.email')}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-balkan-blue flex items-center justify-center flex-shrink-0">
                  <Users size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">{t('restaurant.businessDeal')}</h3>
                  <p className="text-white/80">
                    {t('restaurant.businessDealDesc').replace('{{count}}', '')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Opening Hours */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 border-4 border-balkan-yellow"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-balkan-dark flex items-center justify-center">
                <Clock size={20} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-balkan-dark">
                {t('restaurant.openingHours')}
              </h3>
            </div>

            <div className="space-y-4">
              {openingHours.map((schedule, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex justify-between items-center p-4 border-2 border-balkan-dark/10 hover:border-balkan-red/50 transition-colors"
                >
                  <span className="font-semibold text-balkan-dark">
                    {schedule.day}
                  </span>
                  <span className="font-bold text-balkan-red">
                    {schedule.hours}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 p-6 bg-balkan-red text-center"
            >
              <h4 className="text-white font-bold text-lg mb-2">
                {t('restaurant.callToOrder')}
              </h4>
              <a
                href="https://wa.me/4792518238"
                className="text-white text-2xl font-black hover:text-balkan-yellow transition-colors"
              >
                {t('restaurant.phone').replace('{{count}}', '')}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantInfo;