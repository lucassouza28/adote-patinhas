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
import { PawPrint, Plus, Pencil, Trash2, LogOut, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnimalDB {
  id: string;
  nome: string;
  especie: string;
  idade: string;
  porte?: string;
  descricao: string;
  foto_url: string;
  created_at: string;
}

const emptyAnimal = { nome: "", especie: "", idade: "", porte: "", descricao: "", foto_url: "" };
const STORAGE_BUCKET = "animais-fotos";

const AdminPage = () => {
  const [animais, setAnimais] = useState<AnimalDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyAnimal);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
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
    setFotoFile(null);
    setFotoPreview(null);
    setDialogOpen(true);
  };

  const openEdit = (animal: AnimalDB) => {
    setEditingId(animal.id);
    setForm({
      nome: animal.nome,
      especie: animal.especie,
      idade: animal.idade,
      porte: animal.porte || "",
      descricao: animal.descricao,
      foto_url: animal.foto_url,
    });
    setFotoFile(null);
    setFotoPreview(animal.foto_url);
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Arquivo inválido", description: "Selecione uma imagem.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Arquivo muito grande", description: "Máximo 5MB.", variant: "destructive" });
      return;
    }
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, file);
    if (error) {
      toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
      return null;
    }
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const animalSchema = z.object({
    nome: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
    especie: z.string().trim().min(1, "Espécie é obrigatória").max(50, "Espécie deve ter no máximo 50 caracteres"),
    idade: z.string().trim().min(1, "Idade é obrigatória").max(50, "Idade deve ter no máximo 50 caracteres"),
    porte: z.string().trim().optional(),
    descricao: z.string().trim().min(1, "Descrição é obrigatória").max(500, "Descrição deve ter no máximo 500 caracteres"),
    foto_url: z.string().max(500).optional(),
  });

  const handleSave = async () => {
    // For new animals, require a photo file
    if (!editingId && !fotoFile) {
      toast({ title: "Erro de validação", description: "Selecione uma foto para o animal.", variant: "destructive" });
      return;
    }
    const validation = animalSchema.safeParse(form);
    if (!validation.success) {
      toast({ title: "Erro de validação", description: validation.error.errors[0].message, variant: "destructive" });
      return;
    }
    setSaving(true);

    let fotoUrl = form.foto_url;
    if (fotoFile) {
      const uploaded = await uploadPhoto(fotoFile);
      if (!uploaded) { setSaving(false); return; }
      fotoUrl = uploaded;
    }

    const saveData = { nome: validation.data.nome, especie: validation.data.especie, idade: validation.data.idade, porte: validation.data.porte, descricao: validation.data.descricao, foto_url: fotoUrl };

    if (editingId) {
      const { error } = await supabase.from("animais").update(saveData).eq("id", editingId);
      if (error) {
        toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Animal atualizado com sucesso!" });
      }
    } else {
      const { error } = await supabase.from("animais").insert([saveData]);
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
                      <TableHead>Porte</TableHead>
                      <TableHead className="hidden md:table-cell">Descrição</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {animais.map((animal) => (
                      <TableRow key={animal.id}>
                        <TableCell className="font-medium">{animal.nome}</TableCell>
                        <TableCell>{animal.especie}</TableCell>
                        <TableCell>{animal.idade}{!/ano/i.test(animal.idade) && " anos"}</TableCell>
                        <TableCell>{animal.porte || "-"}</TableCell>
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
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
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
              <Label>Porte</Label>
              <Input value={form.porte} onChange={(e) => setForm({ ...form, porte: e.target.value })} placeholder="Ex: Pequeno, Médio, Grande" />
            </div>
            <div className="space-y-2">
              <Label>Foto do Animal</Label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer border border-input rounded-md px-4 py-2 hover:bg-accent transition-colors">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{fotoFile ? fotoFile.name : "Selecionar foto..."}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
                {fotoPreview && (
                  <img src={fotoPreview} alt="Preview" className="h-32 w-32 object-cover rounded-md border" />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descreva o animal..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.nome || !form.especie || !form.idade || !form.descricao || (!form.foto_url && !fotoFile)}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
