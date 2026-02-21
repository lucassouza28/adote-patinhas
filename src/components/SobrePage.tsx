import { PawPrint, Heart, Users } from "lucide-react";

const SobrePage = ({ onVoltar }: { onVoltar: () => void }) => {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 animate-fade-in">
      <button onClick={onVoltar} className="text-primary font-semibold mb-6 hover:underline">
        ← Voltar
      </button>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <PawPrint className="h-16 w-16 text-primary mx-auto" />
          <h1 className="font-heading text-4xl font-bold text-foreground">Sobre o Adote Patinhas</h1>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card space-y-4">
          <div className="flex items-start gap-3">
            <Heart className="h-6 w-6 text-accent mt-1 shrink-0" />
            <div>
              <h3 className="font-heading font-bold text-lg text-foreground">Nossa Missão</h3>
              <p className="text-muted-foreground">
                Conectar animais que precisam de um lar com famílias cheias de amor. Acreditamos que todo pet merece carinho, cuidado e uma família.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="h-6 w-6 text-primary mt-1 shrink-0" />
            <div>
              <h3 className="font-heading font-bold text-lg text-foreground">Quem Somos</h3>
              <p className="text-muted-foreground">
                Somos um grupo de voluntários apaixonados por animais, trabalhando para facilitar o processo de adoção responsável em nossa comunidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SobrePage;
