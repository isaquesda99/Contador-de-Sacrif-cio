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
import { Settings, Download, Upload, AlertTriangle, CheckCircle2 } from "lucide-react";
import { StudySession } from "@/types/study";
import { toast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  sessions: StudySession[];
  weeklyGoal: number;
  onImport: (sessions: StudySession[], goal: number) => void;
}

export function SettingsDialog({ sessions, weeklyGoal, onImport }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (!Array.isArray(data.sessions)) {
          throw new Error("Formato de backup inválido: lista de sessões ausente.");
        }

        onImport(data.sessions, data.weeklyGoal || 20);
        setOpen(false);
        
        toast({
          title: "Dados Restaurados",
          description: `${data.sessions.length} sessões foram importadas com sucesso.`,
        });
      } catch (error) {
        console.error("Erro ao importar backup:", error);
        toast({
          variant: "destructive",
          title: "Erro na Importação",
          description: "O arquivo selecionado não é um backup válido.",
        });
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hover:bg-white/10 rounded-full h-10 w-10">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-white/10 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configurações e Backup
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Gerencie seus dados localmente. O backup salva suas sessões e metas em um arquivo no seu dispositivo.
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

            <div className="flex flex-col gap-2 pt-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Importar Dados</h4>
              <p className="text-xs text-muted-foreground">Restaure informações de um arquivo de backup anterior.</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
              <Button onClick={handleImportClick} variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10 justify-start gap-3 h-12">
                <Upload className="h-4 w-4 text-primary" />
                <span>Carregar Backup (.json)</span>
              </Button>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3 items-start">
            <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed text-muted-foreground">
              <strong className="text-primary uppercase block mb-1">Aviso de Importação:</strong>
              Ao carregar um novo arquivo, os dados atuais serão substituídos pelos dados do backup. Recomendamos exportar seus dados atuais antes de importar um novo arquivo.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
