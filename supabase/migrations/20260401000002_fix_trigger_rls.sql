-- Fix: handle_new_user trigger perlu bypass RLS saat insert ke profiles
-- Di Supabase, SECURITY DEFINER function milik postgres bisa bypass RLS
-- dengan SET row_security = off

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  default_outlet_id UUID;
BEGIN
  -- Disable RLS for this function (runs as postgres/owner)
  SET LOCAL row_security = off;

  SELECT id INTO default_outlet_id
  FROM public.outlets
  WHERE is_active = true
  ORDER BY created_at
  LIMIT 1;

  INSERT INTO public.profiles (id, outlet_id, full_name)
  VALUES (
    NEW.id,
    default_outlet_id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;

  -- Also create default outlet assignment
  IF default_outlet_id IS NOT NULL THEN
    INSERT INTO public.user_outlet_assignments (user_id, outlet_id, role)
    VALUES (NEW.id, default_outlet_id, 'staff_media')
    ON CONFLICT (user_id, outlet_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Also add explicit service_role insert bypass for profiles
-- (belt-and-suspenders approach)
CREATE POLICY "profiles_service_insert" ON public.profiles
  FOR INSERT
  WITH CHECK (true);
