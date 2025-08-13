/*
  # Allow anonymous users to place orders

  1. Security Changes
    - Update RLS policy to allow anonymous users to create orders
    - Remove authentication requirement for order creation
    - Maintain admin-only access for viewing and managing orders

  2. Changes Made
    - Modified INSERT policy on orders table to allow anonymous access
    - Kept existing policies for SELECT, UPDATE, DELETE (admin only)
*/

-- Drop existing INSERT policy for orders
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Create new policy that allows anonymous users to insert orders
CREATE POLICY "Anonymous users can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Ensure anon role has INSERT permission on orders table
GRANT INSERT ON public.orders TO anon;