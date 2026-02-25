
-- Create storage bucket for animal photos
INSERT INTO storage.buckets (id, name, public) VALUES ('animais-fotos', 'animais-fotos', true);

-- Allow anyone to view photos
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'animais-fotos');

-- Allow admins to upload photos
CREATE POLICY "Admins can upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'animais-fotos' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to update photos
CREATE POLICY "Admins can update photos" ON storage.objects FOR UPDATE USING (bucket_id = 'animais-fotos' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete photos
CREATE POLICY "Admins can delete photos" ON storage.objects FOR DELETE USING (bucket_id = 'animais-fotos' AND public.has_role(auth.uid(), 'admin'));
