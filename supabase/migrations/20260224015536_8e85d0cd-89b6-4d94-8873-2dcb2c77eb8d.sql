
CREATE TABLE public.animais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  especie TEXT NOT NULL,
  idade TEXT NOT NULL,
  descricao TEXT NOT NULL,
  foto_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.animais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Animais são visíveis por todos"
  ON public.animais FOR SELECT
  USING (true);

INSERT INTO public.animais (nome, especie, idade, descricao, foto_url) VALUES
  ('Rex', 'Cachorro', '2 anos', 'Golden Retriever brincalhão e carinhoso. Adora correr e brincar de buscar.', '/assets/dog-rex.jpg'),
  ('Mimi', 'Gato', '1 ano', 'Gatinha laranja muito dócil. Adora colo e carinho.', '/assets/cat-mimi.jpg'),
  ('Pipoca', 'Coelho', '6 meses', 'Coelhinha branca super fofa e tranquila. Ideal para famílias.', '/assets/rabbit-pipoca.jpg'),
  ('Luna', 'Cachorro', '3 anos', 'Border Collie inteligente e leal. Muito obediente e adora aprender truques.', '/assets/dog-luna.jpg'),
  ('Thor', 'Gato', '4 anos', 'Gato persa cinza e majestoso. Calmo e perfeito para apartamento.', '/assets/cat-thor.jpg'),
  ('Bob', 'Cachorro', '8 meses', 'Dachshund filhote cheio de energia. Muito curioso e amoroso.', '/assets/dog-bob.jpg');
