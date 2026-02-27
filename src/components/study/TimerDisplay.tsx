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
      <CardHeader className="text-center pb-0">
        <div className="flex justify-center mb-1">
          <div className="bg-primary/10 p-2 rounded-full">
            <TimerIcon className="h-5 w-5 text-primary" />
          </div>
        </div>
        <CardTitle className="text-base font-bold text-white uppercase tracking-wider">Cronômetro</CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center gap-4 py-4 flex-1 justify-center overflow-y-auto">
        {/* Cronômetro de Estudo */}
        <div className="relative flex items-center justify-center scale-75 md:scale-90 transition-transform">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="74"
              stroke="currentColor"
              strokeWidth="5"
              fill="transparent"
              className="text-white/5"
            />
            <circle
              cx="80"
              cy="80"
              r="74"
              stroke="currentColor"
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={465}
              strokeDashoffset={465 - (465 * studyProgress) / 100}
              className={cn(
                "text-primary transition-all duration-1000 ease-linear",
                isActive && !isPaused ? "shadow-[0_0_15px_rgba(255,100,0,0.5)]" : "text-muted-foreground/30"
              )}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-mono font-black tracking-tighter text-white">
              {formatTime(time)}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-primary font-bold">
              Foco Ativo
            </span>
          </div>
        </div>

        {/* Cronômetro de Pausa (Pomodoro) */}
        <div className={cn(
          "relative flex items-center justify-center scale-50 md:scale-75 transition-all duration-500",
          (isActive && isPaused) ? "opacity-100" : "opacity-40"
        )}>
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-white/5"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={364}
              strokeDashoffset={364 - (364 * breakProgress) / 100}
              className={cn(
                "text-accent transition-all duration-1000 ease-linear",
                isActive && isPaused ? "shadow-[0_0_10px_rgba(255,200,0,0.4)]" : "text-muted-foreground/20"
              )}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Coffee className="h-3 w-3 text-accent" />
              <span className="text-xl font-mono font-bold tracking-tighter text-accent">
                {formatTime(breakTime)}
              </span>
            </div>
            <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold">
              Tempo de Pausa
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full max-w-[260px] mt-2">
          {!isActive || isPaused ? (
            <Button 
              onClick={handleStart} 
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-10 shadow-lg"
            >
              <Play className="h-4 w-4 mr-1" /> {isActive ? "Voltar" : "Iniciar"}
            </Button>
          ) : (
            <Button 
              onClick={handlePause} 
              size="sm"
              variant="outline"
              className="font-bold rounded-xl h-10 border-2 border-primary/50 text-white hover:bg-primary/10"
            >
              <Pause className="h-4 w-4 mr-1" /> Pausar
            </Button>
          )}

          <Button 
            onClick={handleStop} 
            size="sm"
            variant="ghost" 
            disabled={!isActive}
            className="font-bold rounded-xl h-10 text-muted-foreground hover:text-white hover:bg-white/5"
          >
            <Square className="h-4 w-4 mr-1" /> Parar
          </Button>
          
          <Button 
            onClick={handleReset} 
            size="sm"
            variant="outline"
            className="font-bold rounded-xl h-10 border border-white/10 text-white hover:bg-white/5"
          >
            <RotateCcw className="h-4 w-4 mr-1" /> Reset
          </Button>

          <Button 
            onClick={handleSave} 
            size="sm"
            className="bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl h-10 border border-white/5"
            disabled={time === 0}
          >
            <Save className="h-4 w-4 mr-1" /> Salvar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
