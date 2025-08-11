import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "./CartContext";
import { toast } from "sonner";
import { useMenu } from "@/hooks/useMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Search, X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import SauceBottleIcon from "./SauceBottleIcon";
import KebabSauceIcon from "./KebabSauceIcon";

export default function MenuSection() {
  const { addItem } = useCart();
  const { categories, menuItems, loading, getPopularItems } = useMenu();
  const { t } = useLanguage();
  const [selectedSpicyLevel, setSelectedSpicyLevel] = useState({});
  const [selectedKebabSauceLevel, setSelectedKebabSauceLevel] = useState({});
  const [showKebabSauceOptions, setShowKebabSauceOptions] = useState({});
  const [showSpicyOptions, setShowSpicyOptions] = useState({});
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string[]}>({});
  
  // Add CSS for highlighting items when clicked from search
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .highlight-item {
        animation: highlight-pulse 2s ease-in-out;
      }
      
      @keyframes highlight-pulse {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          transform: scale(1);
        }
        50% {
          box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.3);
          transform: scale(1.03);
          background-color: rgba(59, 130, 246, 0.1);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [activeMainCategory, setActiveMainCategory] = useState<number | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<number | null>(null);
  const [showPopularOnly, setShowPopularOnly] = useState(true); // Başlangıçta Populær seçili olacak
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false); // Vejetaryen filtresi için

  // Auto-collapse timer for subcategory rows and smooth scroll to menu
  const autoCollapseRef = useRef<number | null>(null);
  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const resetAutoCollapse = () => {
    if (autoCollapseRef.current) {
      window.clearTimeout(autoCollapseRef.current);
    }
    autoCollapseRef.current = window.setTimeout(() => {
      setActiveSubCategory(null);
      if (activeMainCategory) {
        setActiveCategory(activeMainCategory);
      }
    }, 60000); // 1 dakika (60000 ms)
  };

  // Get main categories (no parent)
  const mainCategories = categories.filter(cat => !cat.parent_id);
  
  // Get subcategories for a given parent
  const getSubcategories = (parentId: number) => 
    categories.filter(cat => cat.parent_id === parentId);

  useEffect(() => {
    // Sayfa yüklendiğinde veya yenilendiğinde her zaman Populær seçili olacak
    if (categories.length > 0) {
      setShowPopularOnly(true);
      setShowVegetarianOnly(false);
      setActiveMainCategory(null);
      setActiveSubCategory(null);
      // Populær seçildiğinde, activeCategory'yi 'popular' olarak ayarla
      setActiveCategory(1); // İlk kategoriyi seç, böylece ürünler gösterilecek
    }
  }, [categories]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Clear auto-collapse timer on unmount
  useEffect(() => {
    return () => {
      if (autoCollapseRef.current) {
        window.clearTimeout(autoCollapseRef.current);
      }
    };
  }, []);

  const handleAddToCart = (item: any) => {
    // Include selected options if any
    const itemWithOptions = {
      ...item,
      selectedOptions: selectedOptions[item.id] || []
    };
    addItem(itemWithOptions);
    toast.success(t('menu.addedToCart').replace('{name}', item.name));
    
    // Reset selected options for this item
    setSelectedOptions(prev => ({
      ...prev,
      [item.id]: []
    }));
  };

  const getItemsByCategory = (categoryId: number) => {
    return menuItems.filter(item => item.category_id === categoryId);
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Update getAllItemsForCategory function
  const getAllItemsForCategory = (categoryId: number) => {
    let filteredItems = menuItems;
    
    // Apply category filter if not using special filters
    if (!showPopularOnly && !showVegetarianOnly && !showSpicyOnly) {
      const collectIds = (id: number): number[] => {
        const children = getSubcategories(id);
        return [id, ...children.flatMap((c) => collectIds(c.id))];
      };
      
      const categoryIds = collectIds(categoryId);
      filteredItems = filteredItems.filter(item => categoryIds.includes(item.category_id));
    } else {
      // Apply special filters
      if (showPopularOnly) {
        filteredItems = getPopularItems();
      }
      
      if (showVegetarianOnly) {
        filteredItems = filteredItems.filter(item => item.is_vegetarian === true);
      }
      
      if (showSpicyOnly) {
        filteredItems = filteredItems.filter(item => item.is_spicy === true);
      }
    }
    
    // Apply additional filters
    if (caloriesFilter !== null) {
      filteredItems = filteredItems.filter(item => item.calories !== undefined && item.calories <= caloriesFilter);
    }
    
    if (prepTimeFilter !== null) {
      filteredItems = filteredItems.filter(item => item.preparation_time !== undefined && item.preparation_time <= prepTimeFilter);
    }
    
    // Apply search filter if search query exists
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filteredItems = filteredItems.filter(item => 
        item.name.toLowerCase().includes(query) || 
        (item.description && item.description.toLowerCase().includes(query))
      );
    }
    
    return filteredItems;
  };

  // State for additional filters
  const [showSpicyOnly, setShowSpicyOnly] = useState(false);
  const [caloriesFilter, setCaloriesFilter] = useState<number | null>(null);
  const [prepTimeFilter, setPrepTimeFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Add handling for popular and vegetarian filters in main categories section
  const handleCategoryClick = (categoryId: number | 'popular' | 'vegetarian' | 'spicy') => {
    if (categoryId === 'popular') {
      setShowPopularOnly(true);
      setShowVegetarianOnly(false);
      setShowSpicyOnly(false);
      setActiveMainCategory(null);
      setActiveSubCategory(null);
      setActiveCategory(1); // İlk kategoriyi seç, böylece populær ürünler gösterilecek
    } else if (categoryId === 'vegetarian') {
      setShowPopularOnly(false);
      setShowVegetarianOnly(true);
      setShowSpicyOnly(false);
      setActiveMainCategory(null);
      setActiveSubCategory(null);
      setActiveCategory(1); // İlk kategoriyi seç, böylece vegetarisk ürünler gösterilecek
    } else if (categoryId === 'spicy') {
      setShowPopularOnly(false);
      setShowVegetarianOnly(false);
      setShowSpicyOnly(true);
      setActiveMainCategory(null);
      setActiveSubCategory(null);
      setActiveCategory(1); // İlk kategoriyi seç, böylece spicy ürünler gösterilecek
    } else {
      setShowPopularOnly(false);
      setShowVegetarianOnly(false);
      setShowSpicyOnly(false);
      setActiveMainCategory(categoryId);
      setActiveSubCategory(null);
      
      // Eğer seçilen kategorinin alt kategorileri varsa, ilk alt kategorinin ürünlerini göster
      const subcategories = getSubcategories(categoryId);
      if (subcategories.length > 0) {
        // İlk alt kategoriyi seç
        const firstSubcategory = subcategories[0];
        setActiveSubCategory(firstSubcategory.id);
        setActiveCategory(firstSubcategory.id);
      } else {
        // Alt kategori yoksa, seçilen ana kategorinin ürünlerini göster
        setActiveCategory(categoryId);
      }
    }
    scrollToMenu();
    resetAutoCollapse();
  };

  if (loading) {
    return (
      <section className="py-20 bg-background" id="menu">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background" id="menu">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-foreground">{t('menu.title')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('Velg din favorittrett fra vår varierte meny, hvor du finner alt fra klassiske favoritter til spennende nyheter.')}
          </p>
        </motion.div>

        {/* Category Navigation - Desktop */}
        <div
          className={`hidden md:flex justify-center mb-12 transition-all duration-300 ${
            isSticky ? "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-background/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border-2 border-balkan-yellow" : ""
          }`}
        >
          <div className="flex flex-col gap-3 items-center">
            {/* Row 1: Main categories */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full">
              {/* Popular filter button */}
              <Button
                variant={showPopularOnly ? "default" : "outline"}
                onClick={() => handleCategoryClick('popular')}
                className="flex items-center gap-2 shrink-0 whitespace-nowrap bg-primary text-black hover:bg-primary/90 border-2 border-primary shadow-md font-semibold"
              >
                <span className="whitespace-nowrap">🔥</span>
                <span className="whitespace-nowrap">{t('Populær')}</span>
              </Button>

              {/* Vegetarian filter button */}
              <Button
                variant={showVegetarianOnly ? "default" : "outline"}
                onClick={() => handleCategoryClick('vegetarian')}
                className="flex items-center gap-2 shrink-0 whitespace-nowrap bg-green-600 text-white hover:bg-green-700 border-2 border-green-600 shadow-md font-semibold"
              >
                <span className="whitespace-nowrap">🌱</span>
                <span className="whitespace-nowrap">{t('Vegetarisk')}</span>
              </Button>

              {/* Main categories */}
              {mainCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={!showPopularOnly && activeMainCategory === category.id ? "default" : "outline"}
                  onClick={() => handleCategoryClick(category.id)}
                  className="flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <span className="whitespace-nowrap">{category.icon}</span>
                  <span className="whitespace-nowrap">{category.name}</span>
                </Button>
              ))}
            </div>

            {/* Row 2: Subcategories of selected main */}
            {!showPopularOnly && activeMainCategory && getSubcategories(activeMainCategory).length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full">
                {getSubcategories(activeMainCategory).map((subcategory) => (
                  <Button
                    key={subcategory.id}
                    variant={activeSubCategory === subcategory.id || activeCategory === subcategory.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setActiveSubCategory(subcategory.id);
                      setActiveCategory(subcategory.id);
                      scrollToMenu();
                      resetAutoCollapse();
                    }}
                    className="flex items-center gap-2 shrink-0 whitespace-nowrap"
                  >
                    <span className="whitespace-nowrap">{subcategory.icon}</span>
                    <span className="whitespace-nowrap">{subcategory.name}</span>
                  </Button>
                ))}
              </div>
            )}

            {/* Row 3: Sub-subcategories of selected sub */}
            {!showPopularOnly && activeSubCategory && getSubcategories(activeSubCategory).length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full">
                {getSubcategories(activeSubCategory).map((subsub) => (
                  <Button
                    key={subsub.id}
                    variant={activeCategory === subsub.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setActiveCategory(subsub.id);
                      scrollToMenu();
                      resetAutoCollapse();
                    }}
                    className="flex items-center gap-2 shrink-0 whitespace-nowrap"
                  >
                    <span className="whitespace-nowrap">{subsub.icon}</span>
                    <span className="whitespace-nowrap">{subsub.name}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Navigation - Mobile */}
        <div className="md:hidden mb-8 space-y-3">
          {/* Row 1: Main and Popular filter */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {/* Popular filter button */}
            <Button
              variant={showPopularOnly ? "default" : "outline"}
              onClick={() => {
                setShowPopularOnly(true);
                setShowVegetarianOnly(false);
                scrollToMenu();
              }}
              className="flex items-center gap-2 shrink-0 bg-primary text-black hover:bg-primary/90 border-2 border-primary shadow-md font-semibold"
            >
              <span>🔥</span>
              <span>{t('Populær')}</span>
            </Button>

            {/* Vegetarian filter button */}
            <Button
              variant={showVegetarianOnly ? "default" : "outline"}
              onClick={() => {
                setShowVegetarianOnly(true);
                setShowPopularOnly(false);
                scrollToMenu();
              }}
              className="flex items-center gap-2 shrink-0 bg-green-600 text-white hover:bg-green-700 border-2 border-green-600 shadow-md font-semibold"
            >
              <span>🌱</span>
              <span>{t('Vegetarisk')}</span>
            </Button>
            
            {/* Main categories */}
            {mainCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeMainCategory === category.id ? "default" : "outline"}
                onClick={() => {
                  setShowPopularOnly(false);
                  setShowVegetarianOnly(false);
                  setShowSpicyOnly(false);
                  setActiveMainCategory(category.id);
                  
                  // Eğer seçilen kategorinin alt kategorileri varsa, ilk alt kategorinin ürünlerini göster
                  const subcategories = getSubcategories(category.id);
                  if (subcategories.length > 0) {
                    // İlk alt kategoriyi seç
                    const firstSubcategory = subcategories[0];
                    setActiveSubCategory(firstSubcategory.id);
                    setActiveCategory(firstSubcategory.id);
                  } else {
                    // Alt kategori yoksa, seçilen ana kategorinin ürünlerini göster
                    setActiveSubCategory(null);
                    setActiveCategory(category.id);
                  }
                  
                  scrollToMenu();
                  resetAutoCollapse();
                }}
                className="flex items-center gap-2 shrink-0"
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </Button>
            ))}
          </div>

          {/* Row 2: Sub */}
          {activeMainCategory && getSubcategories(activeMainCategory).length > 0 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {getSubcategories(activeMainCategory).map((subcategory) => (
                <Button
                  key={subcategory.id}
                  variant={activeSubCategory === subcategory.id || activeCategory === subcategory.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setActiveSubCategory(subcategory.id);
                    setActiveCategory(subcategory.id);
                    scrollToMenu();
                    resetAutoCollapse();
                  }}
                  className="flex items-center gap-2 shrink-0"
                >
                  <span>{subcategory.icon}</span>
                  <span>{subcategory.name}</span>
                </Button>
              ))}
            </div>
          )}

          {/* Row 3: Sub-sub */}
          {activeSubCategory && getSubcategories(activeSubCategory).length > 0 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {getSubcategories(activeSubCategory).map((subsub) => (
                <Button
                  key={subsub.id}
                  variant={activeCategory === subsub.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setActiveCategory(subsub.id);
                    scrollToMenu();
                    resetAutoCollapse();
                  }}
                  className="flex items-center gap-2 shrink-0"
                >
                  <span>{subsub.icon}</span>
                  <span>{subsub.name}</span>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Button Removed */}

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-6 p-4 rounded-lg border border-border bg-card shadow-sm">
            <h3 className="text-lg font-semibold mb-3">{t('menu.filterOptions')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Special Filters */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">{t('menu.specialFilters')}</h4>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant={showSpicyOnly ? "default" : "outline"}
                    onClick={() => handleCategoryClick('spicy')}
                    className="flex items-center gap-1"
                  >
                    <span>🌶️</span>
                    <span>{t('menu.spicy')}</span>
                  </Button>
                </div>
              </div>
              
              {/* Calories Filter */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">{t('menu.maxCalories')}</h4>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="1000" 
                    step="100"
                    value={caloriesFilter || 1000}
                    onChange={(e) => setCaloriesFilter(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm font-medium min-w-[60px]">
                    {caloriesFilter || 1000} kcal
                  </span>
                </div>
              </div>
              
              {/* Prep Time Filter */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">{t('menu.maxPrepTime')}</h4>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="60" 
                    step="5"
                    value={prepTimeFilter || 60}
                    onChange={(e) => setPrepTimeFilter(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm font-medium min-w-[60px]">
                    {prepTimeFilter || 60} {t('min')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setCaloriesFilter(null);
                  setPrepTimeFilter(null);
                  setShowSpicyOnly(false);
                  if (showPopularOnly) handleCategoryClick('popular');
                  else if (showVegetarianOnly) handleCategoryClick('vegetarian');
                  else if (activeCategory) {
                    setActiveCategory(activeCategory);
                  }
                }}
              >
                {t('menu.resetFilters')}
              </Button>
            </div>
          </div>
        )}
        
        {/* Filter Info */}
        {(showPopularOnly || showVegetarianOnly || showSpicyOnly) && (
          <div className={`mb-6 p-4 rounded-lg text-center ${showPopularOnly ? 'bg-primary/10' : showVegetarianOnly ? 'bg-green-100' : 'bg-orange-100'}`}>
            <p className={`font-medium flex items-center justify-center gap-2 ${showPopularOnly ? 'text-primary' : showVegetarianOnly ? 'text-green-700' : 'text-orange-700'}`}>
              <span>{showPopularOnly ? '🔥' : showVegetarianOnly ? '🌱' : '🌶️'}</span>
              {showPopularOnly ? t('Populær') : showVegetarianOnly ? t('Vegetarisk') : t('menu.spicy')} {t('menu.itemsShown')}
            </p>
          </div>
        )}
        
        {/* Menu Items */}
        <AnimatePresence mode="wait">
          {activeCategory && (
            <motion.div
              key={`${activeCategory}-${showPopularOnly}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {getAllItemsForCategory(activeCategory).map((item) => (
                <div key={item.id} id={`menu-item-${item.id}`} className="relative transition-all duration-300">
                  <div className="p-6 hover:bg-primary/5 rounded-lg transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        {item.name}
                        {/* Move symbols to end of title */}
                        <span className="flex gap-1 items-center text-sm">
                          {item.is_popular && <span title={t('menu.popular')} className="cursor-pointer hover:scale-125 transition-transform">🔥</span>}
                          {item.is_vegetarian && <span title={t('menu.vegetarian')} className="cursor-pointer hover:scale-125 transition-transform">🌱</span>}
                          {item.is_spicy && <span title={t('menu.spicy')} className="cursor-pointer hover:scale-125 transition-transform">🌶️</span>}
                        </span>
                      </h3>
                      <span className="text-xl font-bold text-primary">{item.price} kr</span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        {item.preparation_time && (
                          <div className="flex items-center gap-1 text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-md min-w-[120px]">
                            <span className="text-base">⏱️</span>
                            <span>{item.preparation_time} {t('min')}</span>
                          </div>
                        )}
                        {item.calories && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span>🔥</span>
                            <span>{item.calories} {t('menu.calories')}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {item.is_spicy ? (
                          <div className="flex flex-col gap-3 pointer-events-auto">
                            <Button 
                              onClick={() => {
                                // If there are selected options, add to cart with those options
                                if (selectedOptions[item.id]?.length > 0) {
                                  handleAddToCart(item);
                                } else {
                                  // Otherwise show options
                                  setShowKebabSauceOptions(prev => ({
                                    ...prev,
                                    [item.id]: !prev[item.id]
                                  }));
                                }
                              }}
                              disabled={!item.is_available}
                              className="transition-all duration-300 hover:scale-105 bg-balkan-red text-white"
                            >
                              {item.is_available ? 
                                (selectedOptions[item.id]?.length > 0 ? 
                                  `${t('menu.addToCart')} (${selectedOptions[item.id].length})` : 
                                  t('menu.addToCart')) : 
                                t('menu.notAvailable')}
                            </Button>
                            
                            {showSpicyOptions[item.id] && (
                              <div className="flex items-center gap-2 mt-2 mb-2 animate-in slide-in-from-top duration-300 z-40 relative pointer-events-auto">
                                <input 
                                  type="radio" 
                                  id={`regular-${item.id}`} 
                                  name={`spicy-level-${item.id}`} 
                                  value="regular" 
                                  checked={!selectedSpicyLevel[item.id] || selectedSpicyLevel[item.id] === 'regular'}
                                  onChange={() => setSelectedSpicyLevel({...selectedSpicyLevel, [item.id]: 'regular'})}
                                  className="hidden" 
                                />
                                <label 
                                  htmlFor={`regular-${item.id}`}
                                  className={`flex items-center justify-center px-3 py-2 border-2 border-balkan-red rounded-md cursor-pointer transition-all duration-300 ${selectedSpicyLevel[item.id] === 'regular' || !selectedSpicyLevel[item.id] ? 'bg-balkan-red text-white' : 'bg-transparent text-balkan-red hover:bg-balkan-red/10'}`}
                                  onClick={() => {
                                    setSelectedSpicyLevel({...selectedSpicyLevel, [item.id]: 'regular'});
                                    handleAddToCart({...item, spicyLevel: 'regular'});
                                    setShowSpicyOptions(prev => ({ ...prev, [item.id]: false }));
                                  }}
                                >
                                  <span>
                                    <SauceBottleIcon className="w-6 h-6" color={selectedSpicyLevel[item.id] === 'regular' || !selectedSpicyLevel[item.id] ? 'white' : '#E11D48'} />
                                  </span>
                                </label>
                                
                                <input 
                                  type="radio" 
                                  id={`medium-${item.id}`} 
                                  name={`spicy-level-${item.id}`} 
                                  value="medium" 
                                  checked={selectedSpicyLevel[item.id] === 'medium'}
                                  onChange={() => setSelectedSpicyLevel({...selectedSpicyLevel, [item.id]: 'medium'})}
                                  className="hidden" 
                                />
                                <label 
                                  htmlFor={`medium-${item.id}`}
                                  className={`flex items-center justify-center px-3 py-2 border-2 border-orange-500 rounded-md cursor-pointer transition-all duration-300 ${selectedSpicyLevel[item.id] === 'medium' ? 'bg-orange-500 text-white' : 'bg-transparent text-orange-500 hover:bg-orange-500/10'}`}
                                  onClick={() => {
                                    setSelectedSpicyLevel({...selectedSpicyLevel, [item.id]: 'medium'});
                                    handleAddToCart({...item, spicyLevel: 'medium'});
                                    setShowSpicyOptions(prev => ({ ...prev, [item.id]: false }));
                                  }}
                                >
                                  <span>🌶️</span>
                                </label>
                                
                                <input 
                                  type="radio" 
                                  id={`hot-${item.id}`} 
                                  name={`spicy-level-${item.id}`} 
                                  value="hot" 
                                  checked={selectedSpicyLevel[item.id] === 'hot'}
                                  onChange={() => setSelectedSpicyLevel({...selectedSpicyLevel, [item.id]: 'hot'})}
                                  className="hidden" 
                                />
                                <label 
                                  htmlFor={`hot-${item.id}`}
                                  className={`flex items-center justify-center px-3 py-2 border-2 border-red-600 rounded-md cursor-pointer transition-all duration-300 ${selectedSpicyLevel[item.id] === 'hot' ? 'bg-red-600 text-white' : 'bg-transparent text-red-600 hover:bg-red-600/10'}`}
                                  onClick={() => {
                                    setSelectedSpicyLevel({...selectedSpicyLevel, [item.id]: 'hot'});
                                    handleAddToCart({...item, spicyLevel: 'hot'});
                                    setShowSpicyOptions(prev => ({ ...prev, [item.id]: false }));
                                  }}
                                >
                                  <span>🌶️🌶️</span>
                                </label>
                              </div>
                            )}
                            

                            
                            {showKebabSauceOptions[item.id] && (
                              <div className="flex flex-wrap items-center gap-2 mt-2 animate-in slide-in-from-top duration-300 z-40 relative pointer-events-auto">
                                {/* Add to Cart button */}
                                <Button 
                                  onClick={() => {
                                    // Clear all selections and add as normal
                                    setSelectedOptions(prev => ({
                                      ...prev,
                                      [item.id]: []
                                    }));
                                    handleAddToCart(item);
                                    setShowKebabSauceOptions(prev => ({ ...prev, [item.id]: false }));
                                  }}
                                  className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300 z-50 relative"
                                >
                                  {t('menu.addToCart')}
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3 pointer-events-auto">
                            <Button 
                              onClick={() => {
                                console.log('Legg i handlekurv clicked');
                                setShowKebabSauceOptions(prev => ({
                                  ...prev,
                                  [item.id]: !prev[item.id]
                                }));
                              }}
                              disabled={!item.is_available}
                              className="transition-all duration-300 hover:scale-105 bg-balkan-red text-white"
                            >
                              {item.is_available ? t('menu.addToCart') : t('menu.notAvailable')}
                            </Button>
                            
                            {showKebabSauceOptions[item.id] && (
                              <div className="flex flex-wrap items-center gap-2 mt-2 animate-in slide-in-from-top duration-300 z-40 relative pointer-events-auto">
                                {/* Add to Cart button */}
                                <Button 
                                  onClick={() => {
                                    console.log('Add to Cart button clicked');
                                    handleAddToCart(item);
                                    setShowKebabSauceOptions(prev => ({ ...prev, [item.id]: false }));
                                  }}
                                  className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300 z-50 relative"
                                >
                                  {t('menu.addToCart')}
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action - Modern Bulk Order Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-br from-card to-background rounded-xl p-8 shadow-xl border border-primary/10 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-xl"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <div className="inline-block bg-primary/10 text-primary font-semibold px-4 py-2 rounded-full mb-4">
                {t('menu.bulkOrder')}
              </div>
              
              <h3 className="text-3xl font-bold mb-4 text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                {t('menu.bulkOrder')}
              </h3>
              
              <div className="max-w-2xl mx-auto">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {t('menu.bulkOrderDescription')}
                </p>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button 
                  size="lg" 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2 rounded-full hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {t('menu.callUs')}
                </Button>
              </div>
              
              <div className="mt-4 text-xs text-muted-foreground/70">
                <p>* {t('menu.bulkOrderNote').replace('{{count}}', '')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Search Button (Fixed at bottom right) */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-2">
        <Button
          onClick={() => setShowSearch(!showSearch)}
          className="rounded-full w-12 h-12 p-0 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label={t('menu.search')}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4 pb-20"
            onClick={() => setShowSearch(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl p-6 w-full max-w-md shadow-xl border-t-2 border-blue-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">{t('menu.search')}</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowSearch(false)}
                  className="rounded-full h-8 w-8 text-white hover:bg-blue-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('menu.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-blue-900"
                  autoFocus
                />
                {searchQuery && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full text-blue-500 hover:bg-blue-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <div className="mt-4 text-sm">
                {searchQuery.trim() !== "" && (
                  <>
                    {getAllItemsForCategory(activeCategory || 1).length > 0 ? (
                      <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                        <p className="text-white font-medium mb-2">{t('menu.search')} ({getAllItemsForCategory(activeCategory || 1).length})</p>
                        <div className="max-h-40 overflow-y-auto bg-white/10 rounded-lg p-2">
                          {getAllItemsForCategory(activeCategory || 1).map((item) => (
                            <div 
                              key={item.id} 
                              className="p-2 hover:bg-white/20 rounded cursor-pointer mb-1 transition-colors flex justify-between items-center"
                              onClick={() => {
                                setShowSearch(false);
                                // Scroll to the item
                                const itemElement = document.getElementById(`menu-item-${item.id}`);
                                if (itemElement) {
                                  itemElement.scrollIntoView({ behavior: 'smooth' });
                                  // Highlight the item briefly
                                  itemElement.classList.add('highlight-item');
                                  setTimeout(() => {
                                    itemElement.classList.remove('highlight-item');
                                  }, 2000);
                                }
                              }}
                            >
                              <div>
                                <p className="font-medium text-white">{item.name}</p>
                                <p className="text-xs text-blue-100">{item.description?.substring(0, 30)}...</p>
                              </div>
                              <span className="text-blue-100 font-bold">{item.price} kr</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                        <p className="text-white font-bold">{t('menu.noSearchResults')}</p>
                      </div>
                    )}
                    {getAllItemsForCategory(activeCategory || 1).length === 0 && (
                      <script dangerouslySetInnerHTML={{
                        __html: `
                          setTimeout(() => {
                            window.location.href = '/';
                          }, 2000);
                        `
                      }} />
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

