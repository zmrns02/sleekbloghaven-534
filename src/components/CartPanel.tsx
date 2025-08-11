import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, ChevronDown } from 'lucide-react';
import { useCart } from './CartContext';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import OrderForm from './OrderForm';
import SauceBottleIcon from './SauceBottleIcon';
import KebabSauceIcon from './KebabSauceIcon';

const CartPanel = () => {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, isOpen, setIsOpen, addItem } = useCart();
  const { t } = useLanguage();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showSpicyOptions, setShowSpicyOptions] = useState<{[key: string]: boolean}>({});
  const [showKebabSauceOptions, setShowKebabSauceOptions] = useState<{[key: string]: boolean}>({});


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-balkan-dark flex items-center gap-2">
                  <ShoppingBag size={24} />
                  {t('cart.title')}
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                    <p>{t('cart.empty')}</p>
                    <p className="text-sm">{t('cart.emptyDescription')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-balkan-dark">{item.name}</h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        
                        {/* Sauce Indicators */}
                        <div className="flex flex-col gap-1 mb-3">
                          {/* Selected Options */}
                          {item.selectedOptions && item.selectedOptions.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
                              <span className="font-medium">{t('menu.selectedOptions')}:</span>
                              {item.selectedOptions.map((option, index) => (
                                <span 
                                  key={index} 
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${option === t('menu.spicy') ? 'bg-red-100 text-black' : 
                                    option === t('menu.mediumSpicy') ? 'bg-orange-100 text-black' : 
                                    option === t('menu.regularKebabSauce') ? 'bg-amber-100 text-black' : 
                                    option === t('menu.extraKebabSauce') ? 'bg-amber-200 text-black' : 
                                    'bg-gray-100 text-black'}`}
                                >
                                  {option === t('menu.spicy') && <SauceBottleIcon className="w-3 h-3 mr-1" color="#E11D48" />}
                                  {option === t('menu.mediumSpicy') && <SauceBottleIcon className="w-3 h-3 mr-1" color="#EA580C" />}
                                  {option === t('menu.regularKebabSauce') && <KebabSauceIcon className="w-3 h-3 mr-1" color="#B45309" />}
                                  {option === t('menu.extraKebabSauce') && <KebabSauceIcon className="w-3 h-3 mr-1" color="#92400E" />}
                                  {option}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* Spicy Level Indicator */}
                          {item.spicyLevel && (
                            <div className="flex items-center justify-between gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{t('menu.spicyLevel')}:</span>
                                {item.spicyLevel === 'regular' && (
                                  <span className="flex items-center gap-1 text-black">
                                    <SauceBottleIcon className="w-4 h-4" color="#E11D48" />
                                    {t('menu.regularSauce')}
                                  </span>
                                )}
                                {item.spicyLevel === 'medium' && (
                                  <span className="flex items-center gap-1 text-black">
                                    🌶️ {t('menu.mediumSauce')}
                                  </span>
                                )}
                                {item.spicyLevel === 'hot' && (
                                  <span className="flex items-center gap-1 text-black">
                                    🌶️🌶️ {t('menu.extraSauce')}
                                  </span>
                                )}
                              </div>
                              <button 
                                onClick={() => {
                                  const updatedItem = {...item};
                                  delete updatedItem.spicyLevel;
                                  removeItem(item.id);
                                  addItem(updatedItem);
                                  toast.success(t('menu.optionRemoved'));
                                }}
                                className="text-xs px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-700 hover:text-white text-black transition-colors"
                              >
                                {t('menu.update')}
                              </button>
                            </div>
                          )}
                          
                          {/* Kebab Sauce Indicator */}
                          {item.kebabSauceLevel && (
                            <div className="flex items-center justify-between gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{t('menu.kebabSauce')}:</span>
                                {item.kebabSauceLevel === 'regular' && (
                                  <span className="flex items-center gap-1 text-black">
                                    <KebabSauceIcon className="w-4 h-4" color="#B45309" />
                                    {t('menu.regularKebabSauce')}
                                  </span>
                                )}
                                {item.kebabSauceLevel === 'extra' && (
                                  <span className="flex items-center gap-1 text-black">
                                    <KebabSauceIcon className="w-4 h-4" color="#B45309" />
                                    {t('menu.extraKebabSauce')}
                                  </span>
                                )}
                              </div>
                              <button 
                                onClick={() => {
                                  const updatedItem = {...item};
                                  delete updatedItem.kebabSauceLevel;
                                  removeItem(item.id);
                                  addItem(updatedItem);
                                  toast.success(t('menu.optionRemoved'));
                                }}
                                className="text-xs px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-700 hover:text-white text-black transition-colors"
                              >
                                {t('menu.update')}
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {/* Add Spicy Sauce Button */}
                        {!item.spicyLevel && (
                          <div className="mb-3">
                            <Button 
                              onClick={() => {
                                // Sadece bu öğe için spicy seçeneklerini aç/kapat, diğerlerini etkileme
                                setShowSpicyOptions(prev => ({
                                  ...prev,
                                  [item.id]: !prev[item.id]
                                }));
                                // Eğer kebab sauce seçenekleri açıksa, onları kapatma
                              }}
                              variant="outline"
                              size="sm"
                              className="text-xs w-full border-dashed border-orange-500 text-white hover:bg-orange-500 hover:text-white mb-2"
                            >
                              <span className="flex items-center text-white">
                                <SauceBottleIcon className="w-4 h-4 mr-1" color="#E11D48" />
                                + {t('menu.addSpicySauce')}
                                <ChevronDown className="w-3 h-3 ml-1" />
                              </span>
                            </Button>
                            
                            {showSpicyOptions[item.id] && (
                              <div className="flex items-center justify-between gap-2 mt-2 mb-2 animate-in slide-in-from-top duration-300">
                                <button 
                                  onClick={() => {
                                    const updatedItem = {...item, spicyLevel: 'regular' as 'regular' | 'medium' | 'hot'};
                                    removeItem(item.id);
                                    addItem(updatedItem);
                                    setShowSpicyOptions(prev => ({ ...prev, [item.id]: false }));
                                    toast.success(t('menu.sauceAdded'));
                                  }}
                                  className="flex-1 flex items-center justify-center px-2 py-1 border-2 border-balkan-red rounded-md text-xs text-balkan-red hover:bg-balkan-red hover:text-white hover:bg-balkan-red/10 transition-colors"
                                >
                                  <SauceBottleIcon className="w-4 h-4 mr-1" color="#E11D48" />
                                  {t('menu.regularSauce')}
                                </button>
                                <button 
                                  onClick={() => {
                                    const updatedItem = {...item, spicyLevel: 'medium' as 'regular' | 'medium' | 'hot'};
                                    removeItem(item.id);
                                    addItem(updatedItem);
                                    setShowSpicyOptions(prev => ({ ...prev, [item.id]: false }));
                                    toast.success(t('menu.sauceAdded'));
                                  }}
                                  className="flex-1 flex items-center justify-center px-2 py-1 border-2 border-orange-500 rounded-md text-xs text-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
                                >
                                  🌶️ {t('menu.mediumSauce')}
                                </button>
                              </div>
                            )}
                            
                            {/* Add Kebab Sauce Button */}
                            <Button 
                              onClick={() => {
                                // Sadece bu öğe için kebab sauce seçeneklerini aç/kapat, diğerlerini etkileme
                                setShowKebabSauceOptions(prev => ({
                                  ...prev,
                                  [item.id]: !prev[item.id]
                                }));
                                // Eğer spicy seçenekleri açıksa, onları kapatma
                              }}
                              variant="outline"
                              size="sm"
                              className="text-xs w-full border-dashed border-amber-600 text-white hover:bg-amber-600 hover:text-white"
                            >
                              <span className="flex items-center text-white">
                                <KebabSauceIcon className="w-4 h-4 mr-1" color="#B45309" />
                                + {t('menu.addKebabSauce')}
                                <ChevronDown className="w-3 h-3 ml-1" />
                              </span>
                            </Button>
                            
                            {showKebabSauceOptions[item.id] && (
                              <div className="flex items-center justify-between gap-2 mt-2 animate-in slide-in-from-top duration-300">
                                <button 
                                  onClick={() => {
                                    const updatedItem = {...item, kebabSauceLevel: 'regular' as 'regular' | 'extra'};
                                    removeItem(item.id);
                                    addItem(updatedItem);
                                    setShowKebabSauceOptions(prev => ({ ...prev, [item.id]: false }));
                                    toast.success(t('menu.sauceAdded'));
                                  }}
                                  className="flex-1 flex items-center justify-center px-2 py-1 border-2 border-amber-600 rounded-md text-xs text-amber-600 hover:bg-amber-600 hover:text-white transition-colors"
                                >
                                  <KebabSauceIcon className="w-4 h-4 mr-1" color="#B45309" />
                                  {t('menu.regularKebabSauce')}
                                </button>
                                <button 
                                  onClick={() => {
                                    const updatedItem = {...item, kebabSauceLevel: 'extra' as 'regular' | 'extra'};
                                    removeItem(item.id);
                                    addItem(updatedItem);
                                    setShowKebabSauceOptions(prev => ({ ...prev, [item.id]: false }));
                                    toast.success(t('menu.sauceAdded'));
                                  }}
                                  className="flex-1 flex items-center justify-center px-2 py-1 border-2 border-amber-700 rounded-md text-xs text-amber-700 hover:bg-amber-700 hover:text-white transition-colors"
                                >
                                  <KebabSauceIcon className="w-4 h-4 mr-1" color="#B45309" />
                                  {t('menu.extraKebabSauce')}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-700 hover:text-white transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-semibold w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-balkan-red text-white flex items-center justify-center hover:bg-balkan-red/90 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="font-bold text-balkan-red">
                            {item.price * item.quantity} kr
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-gray-200 p-6 space-y-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>{t('cart.total')}</span>
                    <span className="text-balkan-red">{totalPrice} kr</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Button
                      onClick={() => setShowOrderForm(true)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="lg"
                    >
                      {t('cart.order')}
                    </Button>
                    
                    <Button
                      onClick={clearCart}
                      variant="outline"
                      className="w-full"
                    >
                      {t('cart.clearCart')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
      
      {/* Order Form Modal */}
      <AnimatePresence>
        {showOrderForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setShowOrderForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <OrderForm onClose={() => setShowOrderForm(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default CartPanel;