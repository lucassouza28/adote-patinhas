DO $$
DECLARE new_id uuid := gen_random_uuid();
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@adotepatinhas.com') THEN
    UPDATE auth.users
      SET encrypted_password = extensions.crypt('Patinhas@2026', extensions.gen_salt('bf')),
          email_confirmed_at = now(),
          updated_at = now()
    WHERE email = 'admin@adotepatinhas.com';
    SELECT id INTO new_id FROM auth.users WHERE email = 'admin@adotepatinhas.com';
  ELSE
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', new_id, 'authenticated', 'authenticated',
      'admin@adotepatinhas.com', extensions.crypt('Patinhas@2026', extensions.gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now()
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), new_id,
      jsonb_build_object('sub', new_id::text, 'email', 'admin@adotepatinhas.com', 'email_verified', true),
      'email', 'admin@adotepatinhas.com', now(), now(), now());
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;