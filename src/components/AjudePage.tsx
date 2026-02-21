import { HandHeart, Package, Megaphone } from "lucide-react";

const AjudePage = ({ onVoltar }: { onVoltar: () => void }) => {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 animate-fade-in">
      <button onClick={onVoltar} className="text-primary font-semibold mb-6 hover:underline">
        ← Voltar
      </button>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <HandHeart className="h-16 w-16 text-primary mx-auto" />
          <h1 className="font-heading text-4xl font-bold text-foreground">Como Ajudar</h1>
          <p className="text-muted-foreground text-lg">Existem várias formas de contribuir!</p>
        </div>

        <div className="grid gap-4">
          {[
            {
              icon: HandHeart,
              titulo: "Doação Financeira",
              desc: "Qualquer valor ajuda a manter os animais alimentados, vacinados e saudáveis.",
            },
            {
              icon: Package,
              titulo: "Doação de Materiais",
              desc: "Ração, cobertores, brinquedos e medicamentos são sempre bem-vindos.",
            },
            {
              icon: Megaphone,
              titulo: "Divulgue",
              desc: "Compartilhe nosso projeto com amigos e familiares. Juntos somos mais fortes!",
            },
          ].map((item) => (
            <div key={item.titulo} className="bg-card rounded-xl p-5 shadow-card flex items-start gap-4">
              <item.icon className="h-8 w-8 text-accent shrink-0 mt-0.5" />
              <div>
                <h3 className="font-heading font-bold text-lg text-foreground">{item.titulo}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AjudePage;
