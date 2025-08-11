import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url?: string;
  is_available: boolean;
  is_popular: boolean;
  is_vegetarian: boolean;
  is_spicy: boolean;
  allergens?: string[];
  rating?: number;
  preparation_time?: number;
  calories?: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  display_order: number;
  parent_id?: number | null;
}

export function useMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesResult, itemsResult] = await Promise.all([
        supabase.from('categories').select('*').order('display_order'),
        supabase.from('menu_items')
          .select(`
            *,
            is_popular,
            is_vegetarian,
            is_spicy,
            is_available,
            preparation_time,
            calories
          `)
          .order('name')
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (itemsResult.error) throw itemsResult.error;

      setCategories(categoriesResult.data || []);
      setMenuItems(itemsResult.data || []);
    } catch (error) {
      console.error('Error fetching menu data:', error);
      toast.error('Menü verileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

      if (error) throw error;
      
      setCategories(prev => [...prev, data].sort((a, b) => a.display_order - b.display_order));
      toast.success('Kategori başarıyla eklendi');
      return { data, error: null };
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Kategori eklenirken hata oluştu');
      return { data: null, error };
    }
  };

  const updateCategory = async (id: number, updates: Partial<Category>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCategories(prev => prev.map(cat => cat.id === id ? data : cat));
      toast.success('Kategori başarıyla güncellendi');
      return { data, error: null };
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Kategori güncellenirken hata oluştu');
      return { data: null, error };
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCategories(prev => prev.filter(cat => cat.id !== id));
      setMenuItems(prev => prev.filter(item => item.category_id !== id));
      toast.success('Kategori başarıyla silindi');
      return { error: null };
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Kategori silinirken hata oluştu');
      return { error };
    }
  };

  const createMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([{
          ...item,
          is_popular: Boolean(item.is_popular),
          is_vegetarian: Boolean(item.is_vegetarian),
          is_spicy: Boolean(item.is_spicy),
          is_available: Boolean(item.is_available)
        }])
        .select()
        .single();

      if (error) throw error;
      
      setMenuItems(prev => [...prev, data]);
      toast.success('Menü öğesi başarıyla eklendi');
      return { data, error: null };
    } catch (error) {
      console.error('Error creating menu item:', error);
      toast.error('Menü öğesi eklenirken hata oluştu');
      return { data: null, error };
    }
  };

  const updateMenuItem = async (id: number, updates: Partial<MenuItem>) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setMenuItems(prev => prev.map(item => item.id === id ? data : item));
      toast.success('Menü öğesi başarıyla güncellendi');
      return { data, error: null };
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error('Menü öğesi güncellenirken hata oluştu');
      return { data: null, error };
    }
  };

  const deleteMenuItem = async (id: number) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMenuItems(prev => prev.filter(item => item.id !== id));
      toast.success('Menü öğesi başarıyla silindi');
      return { error: null };
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Menü öğesi silinirken hata oluştu');
      return { error };
    }
  };

  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `menu-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      return { url: data.publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Resim yüklenirken hata oluştu');
      return { url: null, error };
    }
  };

  // Get popular menu items
  const getPopularItems = () => {
    return menuItems.filter(item => item.is_popular);
  };

  return {
    categories,
    menuItems,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    uploadImage,
    refetch: fetchData,
    getPopularItems, // Add the new function to the returned object
  };
}