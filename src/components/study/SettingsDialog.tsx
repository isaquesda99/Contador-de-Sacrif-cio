
"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, Download, Upload, AlertTriangle, CheckCircle2, ListPlus } from "lucide-react";
import { StudySession } from "@/types/study";
import { toast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  sessions: StudySession[];
  weeklyGoal: number;
  onImport: (sessions: StudySession[], goal: number, merge?: boolean) => void;
}

export function SettingsDialog({ sessions, weeklyGoal, onImport }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<string | null>(null);

  const handleExport = () => {
    const data = {
      sessions,
      weeklyGoal,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contador-sacrificio-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Backup Concluído",
      description: "Seu arquivo de backup foi baixado com sucesso.",
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const processImport = (content: string, merge: boolean) => {
    try {
      const data = JSON.parse(content);
      if (!Array.isArray(data.sessions)) {
        throw new Error("Formato de backup inválido.");
      }
      onImport(data.sessions, data.weeklyGoal || 20, merge);
      setOpen(false);
      setPendingFile(null);
      toast({
        title: merge ? "Dados Mesclados" : "Dados Restaurados",
        description: `${data.sessions.length} sessões foram processadas com sucesso.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na Importação",
        description: "O arquivo selecionado não é um backup válido.",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPendingFile(e.target?.result as string);
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hover:bg-white/10 rounded-full h-10 w-10">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-white/10 text-white sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configurações e Backup
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Gerencie seus dados. Utilize a opção de mesclagem para evitar perda de dados entre dispositivos.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Exportar Dados</h4>
              <p className="text-xs text-muted-foreground">Baixe todo o seu histórico atual em um arquivo .json.</p>
              <Button onClick={handleExport} variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10 justify-start gap-3 h-12">
                <Download className="h-4 w-4 text-primary" />
                <span>Salvar Backup Local</span>
              </Button>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-white/5 pt-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Importar Dados</h4>
              {!pendingFile ? (
                <>
                  <p className="text-xs text-muted-foreground">Selecione um arquivo de backup para começar.</p>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                  <Button onClick={handleImportClick} variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10 justify-start gap-3 h-12">
                    <Upload className="h-4 w-4 text-primary" />
                    <span>Selecionar Backup (.json)</span>
                  </Button>
                </>
              ) : (
                <div className="space-y-3 p-3 bg-primary/5 rounded-xl border border-primary/20">
                  <p className="text-xs font-bold text-center">Arquivo selecionado. Como deseja importar?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => processImport(pendingFile, true)} variant="secondary" className="gap-2 h-12 font-bold text-xs uppercase">
                      <ListPlus className="h-4 w-4" />
                      Mesclar
                    </Button>
                    <Button onClick={() => processImport(pendingFile, false)} variant="destructive" className="gap-2 h-12 font-bold text-xs uppercase">
                      <AlertTriangle className="h-4 w-4" />
                      Substituir
                    </Button>
                  </div>
                  <Button onClick={() => setPendingFile(null)} variant="ghost" className="w-full text-[10px] h-6">Cancelar</Button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3 items-start">
            <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-[10px] leading-relaxed text-muted-foreground">
              <strong className="text-primary uppercase block mb-1">Dica de Sincronização:</strong>
              Use o botão <strong>Mesclar</strong> para unir os dados deste computador com o arquivo de backup, sem apagar o que já está aqui.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
