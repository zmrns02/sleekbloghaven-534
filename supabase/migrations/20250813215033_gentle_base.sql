/*
  # Grant INSERT privileges to anon role for orders table

  1. Permissions
    - Grant INSERT privilege to `anon` role on `orders` table
    - This allows client-side applications to create new orders

  2. Security
    - RLS policies still apply to control access
    - Only the base INSERT privilege is granted
*/

-- Grant INSERT privilege to anon role on orders table
GRANT INSERT ON public.orders TO anon;