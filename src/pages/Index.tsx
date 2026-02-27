import { useState, useMemo, useEffect } from "react";
import { Menu, PawPrint, Heart, Eye, Search, Filter, Loader2 } from "lucide-react";
import heroPets from "@/assets/hero-pets.jpg";
import type { Animal } from "@/data/animals";
import { supabase } from "@/integrations/supabase/client";
import AnimalCard from "@/components/AnimalCard";
import DonationModal from "@/components/DonationModal";
import AppDrawer from "@/components/AppDrawer";
import SobrePage from "@/components/SobrePage";
import AjudePage from "@/components/AjudePage";
import { Input } from "@/components/ui/input";

type Page = "home" | "animais" | "sobre" | "ajude";

const Index = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const [page, setPage] = useState<Page>("home");

  // States for DB data
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  // States for filtering
  const [busca, setBusca] = useState("");
  const [filtroEspecie, setFiltroEspecie] = useState("Todos");

  // Fetch real data from DB
  useEffect(() => {
    const fetchAnimais = async () => {
      const { data, error } = await supabase
        .from("animais")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setAnimais(data.map(d => ({
          id: d.id,
          nome: d.nome,
          especie: d.especie,
          idade: d.idade,
          porte: d.porte,
          descricao: d.descricao,
          foto: d.foto_url || "",
        })));
      }
      setLoading(false);
    };

    fetchAnimais();
  }, []);

  // Get unique species for the filter
  const especiesUnicas = useMemo(() => {
    const especies = animais.map(a => a.especie);
    return ["Todos", ...new Set(especies)];
  }, [animais]);

  // Filter animals based on search and species
  const animaisFiltrados = useMemo(() => {
    return animais.filter(animal => {
      const matchBusca = animal.nome.toLowerCase().includes(busca.toLowerCase()) ||
        animal.descricao.toLowerCase().includes(busca.toLowerCase());
      const matchEspecie = filtroEspecie === "Todos" || animal.especie === filtroEspecie;
      return matchBusca && matchEspecie;
    });
  }, [animais, busca, filtroEspecie]);

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

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {animais.slice(0, 3).map((animal) => (
                  <AnimalCard key={animal.id} animal={animal} />
                ))}
              </div>
            )}
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

          {/* Filters Section */}
          <div className="max-w-5xl mx-auto mb-8 space-y-4 bg-muted/30 p-4 rounded-xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar pelo nome ou descrição..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="h-5 w-5 text-muted-foreground mr-1" />
              <span className="text-sm font-medium text-foreground mr-2">Filtrar por espécie:</span>
              {especiesUnicas.map(especie => (
                <button
                  key={especie}
                  onClick={() => setFiltroEspecie(especie)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filtroEspecie === especie
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground hover:bg-muted border border-border"
                    }`}
                >
                  {especie}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : animaisFiltrados.length > 0 ? (
              animaisFiltrados.map((animal, i) => (
                <div key={animal.id} style={{ animationDelay: `${i * 100}ms` }}>
                  <AnimalCard animal={animal} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <p className="text-lg">Nenhum peludo encontrado com os filtros selecionados. 😢</p>
                <button
                  onClick={() => { setBusca(""); setFiltroEspecie("Todos"); }}
                  className="mt-4 text-primary font-medium hover:underline"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-muted py-8 mt-12 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground font-medium mb-2 flex items-center justify-center gap-2">
            <PawPrint className="h-4 w-4" />
            2026 Adote Patinhas. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground/80">
            Designed and Developed By Lucas
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
