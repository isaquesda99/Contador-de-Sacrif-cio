"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime } from "@/lib/study-utils";
import { Play, Pause, RotateCcw, Square, Save, Timer as TimerIcon, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  onSave: (duration: number, breakDuration: number) => void;
}

export function TimerDisplay({ onSave }: TimerDisplayProps) {
  const [time, setTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    const defaultTitle = "Forja de Estudo";
    if (isActive && !isPaused) {
      document.title = `🔥 ${formatTime(time)} - ${defaultTitle}`;
    } else if (isActive && isPaused && time > 0) {
      document.title = `☕ Pausa (${formatTime(breakTime)}) - ${defaultTitle}`;
    } else {
      document.title = defaultTitle;
    }

    return () => {
      document.title = defaultTitle;
    };
  }, [time, breakTime, isActive, isPaused]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (!isPaused) {
          setTime((prev) => prev + 1);
        } else {
          setBreakTime((prev) => prev + 1);
        }
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
    setBreakTime(0);
  };

  const handleSave = () => {
    if (time > 0) {
      onSave(time, breakTime);
      handleReset();
    }
  };

  const studyProgress = (time % 60) * (100 / 60);
  const breakProgress = (breakTime % 60) * (100 / 60);

  return (
    <Card className="w-full overflow-hidden border border-white/5 shadow-2xl bg-card h-full flex flex-col">
      <CardHeader className="text-center pb-2 shrink-0">
        <div className="flex justify-center mb-1">
          <div className="bg-primary/10 p-2 rounded-full">
            <TimerIcon className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-lg font-bold text-white uppercase tracking-wider">Cronômetro</CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center gap-4 py-4 flex-1 justify-center overflow-hidden">
        {/* Cronômetro de Estudo */}
        <div className="relative flex items-center justify-center transition-transform">
          <svg className="w-64 h-64 transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-white/5"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={754}
              strokeDashoffset={754 - (754 * studyProgress) / 100}
              className={cn(
                "text-primary transition-all duration-1000 ease-linear",
                isActive && !isPaused ? "shadow-[0_0_25px_rgba(255,100,0,0.6)]" : "text-muted-foreground/30"
              )}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-mono font-black tracking-tighter text-white">
              {formatTime(time)}
            </span>
            <span className="text-xs uppercase tracking-widest text-primary font-bold mt-1">
              Foco Ativo
            </span>
          </div>
        </div>

        {/* Cronômetro de Pausa */}
        <div className={cn(
          "relative flex items-center justify-center transition-all duration-500",
          (isActive && isPaused) ? "opacity-100 scale-105" : "opacity-30"
        )}>
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="74"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-white/5"
            />
            <circle
              cx="80"
              cy="80"
              r="74"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={465}
              strokeDashoffset={465 - (465 * breakProgress) / 100}
              className={cn(
                "text-accent transition-all duration-1000 ease-linear",
                isActive && isPaused ? "shadow-[0_0_15px_rgba(255,200,0,0.5)]" : "text-muted-foreground/20"
              )}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <div className="flex items-center gap-2">
              <Coffee className="h-4 w-4 text-accent" />
              <span className="text-2xl font-mono font-bold tracking-tighter text-accent">
                {formatTime(breakTime)}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              Tempo de Pausa
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full max-w-[280px] mt-2 shrink-0">
          {!isActive || isPaused ? (
            <Button 
              onClick={handleStart} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-lg h-10 shadow-lg text-xs uppercase tracking-tight"
            >
              <Play className="h-4 w-4 mr-1.5" /> {isActive ? "Voltar" : "Iniciar"}
            </Button>
          ) : (
            <Button 
              onClick={handlePause} 
              variant="outline"
              className="font-black rounded-lg h-10 border-2 border-primary/50 text-white hover:bg-primary/10 text-xs uppercase tracking-tight"
            >
              <Pause className="h-4 w-4 mr-1.5" /> Pausar
            </Button>
          )}

          <Button 
            onClick={handleStop} 
            variant="ghost" 
            disabled={!isActive}
            className="font-black rounded-lg h-10 text-muted-foreground hover:text-white hover:bg-white/5 text-xs uppercase tracking-tight"
          >
            <Square className="h-4 w-4 mr-1.5" /> Parar
          </Button>
          
          <Button 
            onClick={handleReset} 
            variant="outline"
            className="font-black rounded-lg h-10 border border-white/10 text-white hover:bg-white/5 text-xs uppercase tracking-tight"
          >
            <RotateCcw className="h-4 w-4 mr-1.5" /> Reset
          </Button>

          <Button 
            onClick={handleSave} 
            className="bg-white/10 hover:bg-white/20 text-white font-black rounded-lg h-10 border border-white/5 text-xs uppercase tracking-tight"
            disabled={time === 0}
          >
            <Save className="h-4 w-4 mr-1.5" /> Salvar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
