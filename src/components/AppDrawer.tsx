import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Heart, Info, HandHeart, PawPrint } from "lucide-react";

interface AppDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (page: "sobre" | "ajude") => void;
}

const AppDrawer = ({ open, onOpenChange, onNavigate }: AppDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 bg-sidebar border-sidebar-border p-0">
        <SheetHeader className="gradient-hero p-6 pb-8">
          <div className="flex items-center gap-3">
            <PawPrint className="h-8 w-8 text-primary-foreground" />
            <SheetTitle className="font-heading text-2xl font-bold text-primary-foreground">
              Adote Patinhas
            </SheetTitle>
          </div>
          <p className="text-sm text-primary-foreground/80 mt-1">
            Dê um lar cheio de amor 🐾
          </p>
        </SheetHeader>

        <nav className="p-4 space-y-2 mt-2">
          <button
            onClick={() => { onNavigate("sobre"); onOpenChange(false); }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <Info className="h-5 w-5 text-primary" />
            <span className="font-semibold">Sobre</span>
          </button>
          <button
            onClick={() => { onNavigate("ajude"); onOpenChange(false); }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <HandHeart className="h-5 w-5 text-primary" />
            <span className="font-semibold">Ajude-nos</span>
          </button>
        </nav>

        <div className="absolute bottom-6 left-0 right-0 px-6">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Heart className="h-3 w-3 text-accent" />
            <span>Feito com amor para os animais</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AppDrawer;
