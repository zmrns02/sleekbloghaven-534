-- Enable Row Level Security on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_item_badges ENABLE ROW LEVEL SECURITY;

-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'user');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT,
  role app_role DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(_user_id, 'admin'::app_role)
$$;

-- RLS Policies for categories (public read, admin write)
CREATE POLICY "Anyone can view categories" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert categories" 
ON public.categories FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update categories" 
ON public.categories FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete categories" 
ON public.categories FOR DELETE 
USING (public.is_admin(auth.uid()));

-- RLS Policies for menu_items (public read, admin write)
CREATE POLICY "Anyone can view menu items" 
ON public.menu_items FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert menu items" 
ON public.menu_items FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update menu items" 
ON public.menu_items FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete menu items" 
ON public.menu_items FOR DELETE 
USING (public.is_admin(auth.uid()));

-- RLS Policies for menu_item_badges (public read, admin write)
CREATE POLICY "Anyone can view menu item badges" 
ON public.menu_item_badges FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert menu item badges" 
ON public.menu_item_badges FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update menu item badges" 
ON public.menu_item_badges FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete menu item badges" 
ON public.menu_item_badges FOR DELETE 
USING (public.is_admin(auth.uid()));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all roles" 
ON public.user_roles FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles FOR ALL 
USING (public.is_admin(auth.uid()));

-- Create storage bucket for menu images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('menu-images', 'menu-images', true);

-- Storage policies for menu images
CREATE POLICY "Anyone can view menu images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'menu-images');

CREATE POLICY "Admins can upload menu images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'menu-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update menu images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'menu-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete menu images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'menu-images' AND public.is_admin(auth.uid()));

-- Create trigger for updating timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();