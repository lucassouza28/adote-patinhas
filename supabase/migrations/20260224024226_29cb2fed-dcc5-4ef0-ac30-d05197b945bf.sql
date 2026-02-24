
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS on user_roles: users can read their own roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Animais: admins can insert
CREATE POLICY "Admins can insert animais"
  ON public.animais FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Animais: admins can update
CREATE POLICY "Admins can update animais"
  ON public.animais FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Animais: admins can delete
CREATE POLICY "Admins can delete animais"
  ON public.animais FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
