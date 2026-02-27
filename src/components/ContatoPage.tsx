import { ArrowLeft, Mail, MapPin, MessageCircle } from "lucide-react";

interface ContatoPageProps {
  onVoltar: () => void;
}

const ContatoPage = ({ onVoltar }: ContatoPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero py-12 text-center">
        <h1 className="font-heading text-3xl font-bold text-primary-foreground">
          Fale Conosco 💬
        </h1>
        <p className="text-primary-foreground/80 mt-2 max-w-md mx-auto px-4">
          Quer adotar, ajudar ou tirar dúvidas? Estamos prontos para te ouvir!
        </p>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-2xl space-y-6">
        <button onClick={onVoltar} className="text-primary font-semibold hover:underline">
          ← Voltar
        </button>

        <div className="space-y-5">
          {/* Email */}
          <div className="flex items-start gap-4 bg-card border border-border rounded-xl p-5 shadow-soft">
            <div className="bg-primary/10 p-3 rounded-lg shrink-0">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">E-mail</h3>
              <p className="text-muted-foreground text-sm mb-1">
                Envie sua mensagem e responderemos o mais rápido possível!
              </p>
              <a href="mailto:emai.texte@gmail.com" className="text-primary font-medium hover:underline break-all">
                emai.texte@gmail.com
              </a>
            </div>
          </div>

          {/* Localização */}
          <div className="flex items-start gap-4 bg-card border border-border rounded-xl p-5 shadow-soft">
            <div className="bg-primary/10 p-3 rounded-lg shrink-0">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">Localização</h3>
              <p className="text-muted-foreground text-sm mb-1">
                Venha nos visitar e conhecer nossos peludos de pertinho! 🐾
              </p>
              <span className="text-foreground font-medium">Cristalina</span>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex items-start gap-4 bg-card border border-border rounded-xl p-5 shadow-soft">
            <div className="bg-primary/10 p-3 rounded-lg shrink-0">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">WhatsApp</h3>
              <p className="text-muted-foreground text-sm mb-1">
                Mande uma mensagem e converse diretamente com a gente!
              </p>
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline"
              >
                (00) 00000-0000
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContatoPage;
