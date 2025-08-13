-- Drop existing policies for orders
DROP POLICY IF EXISTS "Only admins can view orders" ON public.orders;
DROP POLICY IF EXISTS "Only admins can update orders" ON public.orders;

-- Create new policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (
  -- Allow admins to view all orders
  is_admin(auth.uid()) OR 
  -- Allow authenticated users to view their own orders
  (auth.uid() IS NOT NULL)
);

CREATE POLICY "Only admins can update orders" 
ON public.orders 
FOR UPDATE 
USING (is_admin(auth.uid()));