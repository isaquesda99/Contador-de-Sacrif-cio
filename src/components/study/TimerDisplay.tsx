
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime } from "@/lib/study-utils";
import { Play, Pause, RotateCcw, Square, Save, Timer as TimerIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  onSave: (duration: number) => void;
}

export function TimerDisplay({ onSave }: TimerDisplayProps) {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  // Atualiza o título da aba do navegador
  useEffect(() => {
    const defaultTitle = "Contador de Sacrifício";
    if (isActive && !isPaused) {
      document.title = `${formatTime(time)} - ${defaultTitle}`;
    } else if (isActive && isPaused && time > 0) {
      document.title = `Pausado (${formatTime(time)}) - ${defaultTitle}`;
    } else {
      document.title = defaultTitle;
    }

    // Retorna ao título padrão quando o componente é desmontado
    return () => {
      document.title = defaultTitle;
    };
  }, [time, isActive, isPaused]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(true);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(true);
    setTime(0);
  };

  const handleSave = () => {
    if (time > 0) {
      onSave(time);
      handleReset();
    }
  };

  // Progress animation placeholder calculation
  const progressPercentage = (time % 60) * (100 / 60);

  return (
    <Card className="w-full overflow-hidden border border-white/5 shadow-2xl bg-card h-full flex flex-col">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-1">
          <div className="bg-primary/10 p-2 rounded-full">
            <TimerIcon className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-lg font-bold text-white">Sessão Atual</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 py-4 flex-1 justify-center">
        <div className="relative flex items-center justify-center scale-90 md:scale-110">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-white/5"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={552}
              strokeDashoffset={552 - (552 * progressPercentage) / 100}
              className={cn(
                "text-primary transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(255,100,0,0.5)]",
                !isActive && "text-muted"
              )}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-mono font-bold tracking-tighter text-primary">
              {formatTime(time)}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              {isPaused ? "Pausado" : "Focado"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-[280px]">
          {!isActive || isPaused ? (
            <Button 
              onClick={handleStart} 
              size="sm"
              className="bg-secondary hover:bg-secondary/80 text-white font-bold rounded-xl h-12 border border-white/5"
            >
              <Play className="h-4 w-4 mr-1" /> Iniciar
            </Button>
          ) : (
            <Button 
              onClick={handlePause} 
              size="sm"
              variant="outline"
              className="font-bold rounded-xl h-12 border-2 text-white"
            >
              <Pause className="h-4 w-4 mr-1" /> Pausar
            </Button>
          )}

          <Button 
            onClick={handleStop} 
            size="sm"
            variant="ghost" 
            disabled={!isActive}
            className="font-bold rounded-xl h-12 text-muted-foreground hover:text-white"
          >
            <Square className="h-4 w-4 mr-1" /> Parar
          </Button>
          
          <Button 
            onClick={handleReset} 
            size="sm"
            variant="outline"
            className="font-bold rounded-xl h-12 border-2 text-white"
          >
            <RotateCcw className="h-4 w-4 mr-1" /> Reset
          </Button>

          <Button 
            onClick={handleSave} 
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 shadow-[0_0_20px_rgba(255,100,0,0.3)]"
            disabled={time === 0}
          >
            <Save className="h-4 w-4 mr-1" /> Salvar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
