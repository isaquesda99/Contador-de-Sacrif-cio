
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ManualEntryDialogProps {
  onAdd: (durationSeconds: number, timestamp: number) => void;
}

export function ManualEntryDialog({ onAdd }: ManualEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");

  const handleAdd = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const totalSeconds = (h * 3600) + (m * 60);

    if (totalSeconds <= 0) {
      toast({
        variant: "destructive",
        title: "Duração inválida",
        description: "Por favor, insira um tempo válido.",
      });
      return;
    }

    onAdd(totalSeconds, date.getTime());
    setOpen(false);
    setHours("0");
    setMinutes("0");
    setDate(new Date());

    toast({
      title: "Sessão Adicionada",
      description: "Seu tempo de estudo foi registrado manualmente.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2 rounded-xl h-12 px-4">
          <Plus className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Lançamento Manual</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-white/10 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Lançar Horas Manuais
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label className="text-xs uppercase font-bold text-muted-foreground">Data do Estudo</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal border-white/10 bg-white/5 hover:bg-white/10 text-white h-12",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border-white/10" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  locale={ptBR}
                  className="bg-card text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-muted-foreground">Horas</Label>
              <Input
                type="number"
                min="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="bg-white/5 border-white/10 h-12 text-white text-lg font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-muted-foreground">Minutos</Label>
              <Input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="bg-white/5 border-white/10 h-12 text-white text-lg font-bold"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAdd} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-xl">
            Confirmar Lançamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
