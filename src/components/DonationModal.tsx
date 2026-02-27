import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Heart, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PIX_KEY = "textepix@gmail.com";

const DonationModal = ({ open, onOpenChange }: DonationModalProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      toast.success("Chave PIX copiada! 💚");
    } catch {
      toast.error("Não foi possível copiar. Copie manualmente.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl flex items-center gap-2 text-foreground">
            <Heart className="h-6 w-6 text-accent" />
            Ajude a Adote Patinhas
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-base leading-relaxed pt-2">
            Cada patinha resgatada precisa de cuidados, amor e uma segunda chance. 
            Com a sua doação, conseguimos alimentar, vacinar e tratar nossos peludos 
            até encontrarem um lar cheio de carinho. 🐾💚
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <p className="text-sm text-foreground font-medium text-center">
            Faça sua doação via <span className="font-bold">PIX</span> usando a chave abaixo:
          </p>

          <div className="flex items-center gap-2 bg-muted rounded-lg p-3 border border-border">
            <code className="flex-1 text-sm font-mono text-foreground break-all select-all">
              {PIX_KEY}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="shrink-0"
              aria-label="Copiar chave PIX"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Qualquer valor faz a diferença na vida de um animal. Obrigado! 🧡
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
