import { useState } from "react";
import type { Animal } from "@/data/animals";
import { Badge } from "@/components/ui/badge";
import AdoptionFormModal from "@/components/AdoptionFormModal";

const AnimalCard = ({ animal }: { animal: Animal }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 animate-fade-in flex flex-col h-full">
        <div className="aspect-square overflow-hidden">
          <img
            src={animal.foto}
            alt={`Foto de ${animal.nome}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading text-xl font-bold text-foreground">{animal.nome}</h3>
              <Badge variant="secondary" className="text-xs">
                {animal.especie}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-medium mb-1">
              {animal.idade}{!/ano/i.test(animal.idade) && " anos"}
            </p>
            {animal.porte && (
              <p className="text-sm text-muted-foreground mb-2">
                <span className="font-semibold">Porte:</span> {animal.porte}
              </p>
            )}
            <p className="text-sm text-foreground/80 leading-relaxed mb-4">{animal.descricao}</p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="block w-full mt-2 gradient-hero text-primary-foreground font-semibold py-2.5 rounded-md hover:opacity-90 transition-opacity text-sm text-center"
          >
            Quero Adotar 💚
          </button>
        </div>
      </div>

      <AdoptionFormModal
        animal={animal}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
};

export default AnimalCard;
