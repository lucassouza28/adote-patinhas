import dogRex from "@/assets/dog-rex.jpg";
import catMimi from "@/assets/cat-mimi.jpg";
import rabbitPipoca from "@/assets/rabbit-pipoca.jpg";
import dogLuna from "@/assets/dog-luna.jpg";
import catThor from "@/assets/cat-thor.jpg";
import dogBob from "@/assets/dog-bob.jpg";

export interface Animal {
  id: string;
  nome: string;
  especie: string;
  idade: string;
  porte?: string;
  descricao: string;
  foto: string;
}

export const animaisDisponiveis: Animal[] = [
  {
    id: "1",
    nome: "Rex",
    especie: "Cachorro",
    idade: "2 anos",
    descricao: "Golden Retriever brincalhão e carinhoso. Adora correr e brincar de buscar.",
    foto: dogRex,
  },
  {
    id: "2",
    nome: "Mimi",
    especie: "Gato",
    idade: "1 ano",
    descricao: "Gatinha laranja muito dócil. Adora colo e carinho.",
    foto: catMimi,
  },
  {
    id: "3",
    nome: "Pipoca",
    especie: "Coelho",
    idade: "6 meses",
    descricao: "Coelhinha branca super fofa e tranquila. Ideal para famílias.",
    foto: rabbitPipoca,
  },
  {
    id: "4",
    nome: "Luna",
    especie: "Cachorro",
    idade: "3 anos",
    descricao: "Border Collie inteligente e leal. Muito obediente e adora aprender truques.",
    foto: dogLuna,
  },
  {
    id: "5",
    nome: "Thor",
    especie: "Gato",
    idade: "4 anos",
    descricao: "Gato persa cinza e majestoso. Calmo e perfeito para apartamento.",
    foto: catThor,
  },
  {
    id: "6",
    nome: "Bob",
    especie: "Cachorro",
    idade: "8 meses",
    descricao: "Dachshund filhote cheio de energia. Muito curioso e amoroso.",
    foto: dogBob,
  },
];
