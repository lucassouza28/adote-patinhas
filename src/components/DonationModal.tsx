import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Heart } from "lucide-react";

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Doacao {
  nome: string;
  email: string;
  motivo: string;
}

// Armazena doações localmente (simula banco de dados)
const doacoes: Doacao[] = [];

const DonationModal = ({ open, onOpenChange }: DonationModalProps) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !motivo) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setEnviando(true);

    // Simula salvamento no "banco de dados"
    setTimeout(() => {
      doacoes.push({ nome, email, motivo });
      console.log("Doações salvas:", doacoes);
      toast.success("Doação registrada com sucesso! Obrigado pelo seu carinho 💚");
      setNome("");
      setEmail("");
      setMotivo("");
      setEnviando(false);
      onOpenChange(false);
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl flex items-center gap-2 text-foreground">
            <Heart className="h-6 w-6 text-accent" />
            Fazer Doação
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha seus dados para registrar sua doação. Todo carinho faz diferença!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-foreground">Nome</Label>
            <Input
              id="nome"
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivo" className="text-foreground">Motivo da doação</Label>
            <Textarea
              id="motivo"
              placeholder="Conte-nos por que quer ajudar..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
              className="bg-background"
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full gradient-warm text-accent-foreground font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "Enviar Doação 🧡"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
