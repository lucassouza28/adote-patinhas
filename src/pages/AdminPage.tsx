import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PawPrint, Plus, Pencil, Trash2, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnimalDB {
  id: string;
  nome: string;
  especie: string;
  idade: string;
  descricao: string;
  foto_url: string;
  created_at: string;
}

const emptyAnimal = { nome: "", especie: "", idade: "", descricao: "", foto_url: "" };

const AdminPage = () => {
  const [animais, setAnimais] = useState<AnimalDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyAnimal);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchAnimais = async () => {
    const { data, error } = await supabase.from("animais").select("*").order("created_at", { ascending: true });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setAnimais(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Check auth & admin role
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");
      if (!roles || roles.length === 0) {
        navigate("/login");
        return;
      }
      fetchAnimais();
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const openNew = () => {
    setEditingId(null);
    setForm(emptyAnimal);
    setDialogOpen(true);
  };

  const openEdit = (animal: AnimalDB) => {
    setEditingId(animal.id);
    setForm({
      nome: animal.nome,
      especie: animal.especie,
      idade: animal.idade,
      descricao: animal.descricao,
      foto_url: animal.foto_url,
    });
    setDialogOpen(true);
  };

  const animalSchema = z.object({
    nome: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
    especie: z.string().trim().min(1, "Espécie é obrigatória").max(50, "Espécie deve ter no máximo 50 caracteres"),
    idade: z.string().trim().min(1, "Idade é obrigatória").max(50, "Idade deve ter no máximo 50 caracteres"),
    descricao: z.string().trim().min(1, "Descrição é obrigatória").max(500, "Descrição deve ter no máximo 500 caracteres"),
    foto_url: z.string().url("URL da foto inválida").max(500, "URL deve ter no máximo 500 caracteres"),
  });

  const handleSave = async () => {
    const validation = animalSchema.safeParse(form);
    if (!validation.success) {
      toast({ title: "Erro de validação", description: validation.error.errors[0].message, variant: "destructive" });
      return;
    }
    setSaving(true);
    const validatedData = validation.data as { nome: string; especie: string; idade: string; descricao: string; foto_url: string };
    if (editingId) {
      const { error } = await supabase.from("animais").update(validatedData).eq("id", editingId);
      if (error) {
        toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Animal atualizado com sucesso!" });
      }
    } else {
      const { error } = await supabase.from("animais").insert([validatedData]);
      if (error) {
        toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Animal cadastrado com sucesso!" });
      }
    }
    setSaving(false);
    setDialogOpen(false);
    fetchAnimais();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("animais").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Animal removido com sucesso!" });
      fetchAnimais();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-2">
            <PawPrint className="h-7 w-7 text-primary-foreground" />
            <h1 className="font-heading text-xl font-bold text-primary-foreground">Painel Admin</h1>
          </div>
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-xl">Animais Cadastrados</CardTitle>
            <Button onClick={openNew}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Animal
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-center py-8">Carregando...</p>
            ) : animais.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhum animal cadastrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Espécie</TableHead>
                      <TableHead>Idade</TableHead>
                      <TableHead className="hidden md:table-cell">Descrição</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {animais.map((animal) => (
                      <TableRow key={animal.id}>
                        <TableCell className="font-medium">{animal.nome}</TableCell>
                        <TableCell>{animal.especie}</TableCell>
                        <TableCell>{animal.idade}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate">{animal.descricao}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="outline" onClick={() => openEdit(animal)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="destructive" onClick={() => handleDelete(animal.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Dialog for Create/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingId ? "Editar Animal" : "Novo Animal"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Rex" />
            </div>
            <div className="space-y-2">
              <Label>Espécie</Label>
              <Input value={form.especie} onChange={(e) => setForm({ ...form, especie: e.target.value })} placeholder="Ex: Cachorro" />
            </div>
            <div className="space-y-2">
              <Label>Idade</Label>
              <Input value={form.idade} onChange={(e) => setForm({ ...form, idade: e.target.value })} placeholder="Ex: 2 anos" />
            </div>
            <div className="space-y-2">
              <Label>URL da Foto</Label>
              <Input value={form.foto_url} onChange={(e) => setForm({ ...form, foto_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descreva o animal..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.nome || !form.especie || !form.idade || !form.descricao || !form.foto_url}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
