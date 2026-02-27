import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PawPrint, CheckCircle2 } from "lucide-react";
import type { Animal } from "@/data/animals";

interface AdoptionFormModalProps {
    animal: Animal;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AdoptionFormModal({ animal, open, onOpenChange }: AdoptionFormModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    const handleClose = (newOpen: boolean) => {
        // Reset state upon closing
        if (!newOpen) {
            setTimeout(() => setIsSuccess(false), 300);
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                {!isSuccess ? (
                    <>
                        <DialogHeader>
                            <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2">
                                <PawPrint className="h-8 w-8 text-primary" />
                            </div>
                            <DialogTitle className="text-center text-2xl font-heading text-primary">
                                Interesse em Adoção
                            </DialogTitle>
                            <DialogDescription className="text-center text-md">
                                Você está a um passo de mudar a vida do(a) <span className="font-bold text-foreground">{animal.nome}</span>! Preencha seus dados para entrarmos em contato.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome completo</Label>
                                <Input id="nome" required placeholder="Ex: João da Silva" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telefone">WhatsApp</Label>
                                <Input id="telefone" required placeholder="(00) 00000-0000" type="tel" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mensagem">Por que você quer adotar este pet?</Label>
                                <Textarea
                                    id="mensagem"
                                    required
                                    placeholder={`Conte-nos um pouco sobre onde o(a) ${animal.nome} vai morar, se há outros animais, etc.`}
                                    className="min-h-[100px]"
                                />
                            </div>

                            <Button type="submit" className="w-full gradient-hero font-bold text-md mt-4" disabled={isSubmitting}>
                                {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="py-8 space-y-4 text-center">
                        <div className="mx-auto bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold font-heading text-green-700">Solicitação Enviada!</h2>
                        <p className="text-muted-foreground text-md max-w-[300px] mx-auto">
                            Sua demonstração de interesse pelo(a) <strong>{animal.nome}</strong> foi recebida com sucesso. Em breve, a ONG entrará em contato com você pelo WhatsApp!
                        </p>
                        <Button
                            className="mt-6"
                            variant="outline"
                            onClick={() => handleClose(false)}
                        >
                            Fechar e continuar explorando
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
