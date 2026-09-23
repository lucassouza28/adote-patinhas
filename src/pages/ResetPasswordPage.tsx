import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PawPrint, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Página aberta pelo link de recuperação enviado por e-mail.
 * O Supabase cria uma sessão temporária de recuperação ao abrir o link,
 * permitindo definir uma nova senha.
 */
const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // A sessão de recuperação chega de forma assíncrona pelo link do e-mail.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "Senha muito curta", description: "Use pelo menos 8 caracteres.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "As senhas não coincidem", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Não foi possível alterar a senha", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Senha alterada com sucesso!", description: "Entre com a nova senha." });
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <PawPrint className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-heading text-2xl">Nova senha</CardTitle>
          <CardDescription>
            {ready
              ? "Escolha uma nova senha para o seu acesso."
              : "Abra esta página pelo link enviado ao seu e-mail para continuar."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirme a nova senha</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !ready}>
              <KeyRound className="h-4 w-4 mr-2" />
              {loading ? "Salvando..." : "Salvar nova senha"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button onClick={() => navigate("/login")} className="text-sm text-primary hover:underline">
              ← Voltar ao login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
