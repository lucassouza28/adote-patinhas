import type { Animal } from "@/data/animals";
import { Badge } from "@/components/ui/badge";

const AnimalCard = ({ animal }: { animal: Animal }) => {
  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 animate-fade-in">
      <div className="aspect-square overflow-hidden">
        <img
          src={animal.foto}
          alt={`Foto de ${animal.nome}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xl font-bold text-foreground">{animal.nome}</h3>
          <Badge variant="secondary" className="text-xs">
            {animal.especie}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{animal.idade}</p>
        <p className="text-sm text-foreground/80 leading-relaxed">{animal.descricao}</p>
        <a
          href={`https://wa.me/5561993639511?text=${encodeURIComponent(`Olá! Tenho interesse em adotar o(a) ${animal.nome} (${animal.especie}). Podemos conversar?`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full mt-2 gradient-hero text-primary-foreground font-semibold py-2.5 rounded-md hover:opacity-90 transition-opacity text-sm text-center"
        >
          Quero Adotar 💚
        </a>
      </div>
    </div>
  );
};

export default AnimalCard;
