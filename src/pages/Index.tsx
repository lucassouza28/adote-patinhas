import { useState } from "react";
import { Menu, PawPrint, Heart, Eye } from "lucide-react";
import heroPets from "@/assets/hero-pets.jpg";
import { animaisDisponiveis } from "@/data/animals";
import AnimalCard from "@/components/AnimalCard";
import DonationModal from "@/components/DonationModal";
import AppDrawer from "@/components/AppDrawer";
import SobrePage from "@/components/SobrePage";
import AjudePage from "@/components/AjudePage";

type Page = "home" | "animais" | "sobre" | "ajude";

const Index = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const [page, setPage] = useState<Page>("home");

  if (page === "sobre") return <SobrePage onVoltar={() => setPage("home")} />;
  if (page === "ajude") return <AjudePage onVoltar={() => setPage("home")} />;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <button onClick={() => setDrawerOpen(true)} className="text-primary-foreground p-2 -ml-2 hover:bg-primary-foreground/10 rounded-lg transition-colors">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <PawPrint className="h-7 w-7 text-primary-foreground" />
            <h1 className="font-heading text-xl font-bold text-primary-foreground">Adote Patinhas</h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <AppDrawer open={drawerOpen} onOpenChange={setDrawerOpen} onNavigate={setPage} />
      <DonationModal open={donationOpen} onOpenChange={setDonationOpen} />

      {page === "home" && (
        <main className="animate-fade-in">
          {/* Hero */}
          <section className="relative h-64 md:h-80 overflow-hidden">
            <img src={heroPets} alt="Pets esperando adoção" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-6 left-0 right-0 text-center px-4">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Dê um lar, ganhe um amigo 🐾
              </h2>
              <p className="text-muted-foreground mt-2">
                Encontre seu companheiro perfeito e mude uma vida
              </p>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="container mx-auto px-4 -mt-4 relative z-10">
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={() => setDonationOpen(true)}
                className="gradient-warm text-accent-foreground font-bold py-4 px-6 rounded-xl shadow-soft flex flex-col items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Heart className="h-7 w-7" />
                <span>Fazer Doação</span>
              </button>
              <button
                onClick={() => setPage("animais")}
                className="gradient-hero text-primary-foreground font-bold py-4 px-6 rounded-xl shadow-soft flex flex-col items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Eye className="h-7 w-7" />
                <span>Ver Disponíveis</span>
              </button>
            </div>
          </section>

          {/* Preview */}
          <section className="container mx-auto px-4 py-12">
            <h3 className="font-heading text-2xl font-bold text-foreground text-center mb-6">
              Alguns dos nossos peludos 💚
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {animaisDisponiveis.slice(0, 3).map((animal) => (
                <AnimalCard key={animal.id} animal={animal} />
              ))}
            </div>
          </section>
        </main>
      )}

      {page === "animais" && (
        <main className="container mx-auto px-4 py-6 animate-fade-in">
          <button onClick={() => setPage("home")} className="text-primary font-semibold mb-6 hover:underline">
            ← Voltar
          </button>
          <h2 className="font-heading text-3xl font-bold text-foreground mb-6 text-center">
            Animais Disponíveis para Adoção 🐾
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {animaisDisponiveis.map((animal, i) => (
              <div key={animal.id} style={{ animationDelay: `${i * 100}ms` }}>
                <AnimalCard animal={animal} />
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
};

export default Index;
