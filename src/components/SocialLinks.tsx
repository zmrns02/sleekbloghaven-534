
import { motion } from "framer-motion";
import { Instagram, Facebook, MapPin, Phone } from "lucide-react";

const SocialLinks = () => {
  return (
    <footer id="contact" className="py-16 bg-balkan-dark">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Restaurant Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-black text-white mb-6">
              BALKAN PORSGRUNN
            </h3>
            <div className="space-y-4 text-white/80">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-balkan-red flex-shrink-0" />
                <span>Storgata 101, 3921 Porsgrunn</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-balkan-yellow flex-shrink-0" />
                <a href="https://wa.me/4792518238" className="hover:text-white transition-colors">
                  +47 925 18 238
                </a>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm">E-post:</span>
                <a href="mailto:02veli0201@gmail.com" className="hover:text-white transition-colors text-sm">
                  02veli0201@gmail.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Opening Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-black text-white mb-6">
              ÅPNINGSTIDER
            </h3>
            <div className="space-y-2 text-white/80 text-sm">
              <div className="flex justify-between">
                <span>Man-Tor:</span>
                <span>10:00-22:00</span>
              </div>
              <div className="flex justify-between">
                <span>Fredag:</span>
                <span>10:00-23:00</span>
              </div>
              <div className="flex justify-between">
                <span>Lørdag:</span>
                <span>13:00-23:00</span>
              </div>
              <div className="flex justify-between">
                <span>Søndag:</span>
                <span>13:00-22:00</span>
              </div>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-black text-white mb-6">
              FØLG OSS
            </h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-12 h-12 bg-balkan-red flex items-center justify-center text-white hover:bg-white hover:text-balkan-red transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-balkan-blue flex items-center justify-center text-white hover:bg-white hover:text-balkan-blue transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-white/20 mt-12 pt-8 text-center"
        >
          <p className="text-white/60">
            &copy; 2024 Balkan Porsgrunn. Alle rettigheter forbeholdt.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default SocialLinks;
