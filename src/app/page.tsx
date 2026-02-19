"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { TimerDisplay } from "@/components/study/TimerDisplay";
import { SummaryCard } from "@/components/study/SummaryCard";
import { GoalProgressCard } from "@/components/study/GoalProgressCard";
import { DailyHistory } from "@/components/study/DailyHistory";
import { SettingsDialog } from "@/components/study/SettingsDialog";
import { StudySession } from "@/types/study";
import { isSameWeek, isSameMonth, getTodayStr } from "@/lib/study-utils";
import { LayoutDashboard, TrendingUp, CalendarDays } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

export default function StudyTimeTracker() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [weeklyGoal, setWeeklyGoal] = useState(20); // Default 20 hours
  const [mounted, setMounted] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    // Load from local storage on mount
    const savedSessions = localStorage.getItem("study_sessions");
    const savedGoal = localStorage.getItem("weekly_goal");
    
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (e) {
        console.error("Failed to parse study sessions", e);
      }
    }

    if (savedGoal) {
      setWeeklyGoal(parseFloat(savedGoal));
    }
    
    // Set current date safely after mount
    setFormattedDate(new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date()));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("study_sessions", JSON.stringify(sessions));
      localStorage.setItem("weekly_goal", weeklyGoal.toString());
    }
  }, [sessions, weeklyGoal, mounted]);

  const handleSaveSession = (durationSeconds: number) => {
    const newSession: StudySession = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      durationSeconds,
      dateStr: getTodayStr(),
    };
    setSessions((prev) => [newSession, ...prev]);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleImportData = (importedSessions: StudySession[], importedGoal: number) => {
    setSessions(importedSessions);
    setWeeklyGoal(importedGoal);
  };

  const now = new Date();
  const weekTotal = sessions
    .filter((s) => isSameWeek(new Date(s.timestamp), now))
    .reduce((acc, s) => acc + s.durationSeconds, 0);

  const monthTotal = sessions
    .filter((s) => isSameMonth(new Date(s.timestamp), now))
    .reduce((acc, s) => acc + s.durationSeconds, 0);

  if (!mounted) return null;

  return (
    <div className="h-screen bg-background text-foreground overflow-hidden">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 h-full flex flex-col">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-primary/5 p-2 rounded-2xl shadow-xl border border-primary/10 flex items-center justify-center overflow-hidden w-24 h-24 md:w-32 md:h-32">
              <Image 
                src="/icon.png" 
                alt="Logo" 
                width={112} 
                height={112} 
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white">Contador de Sacrifício</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-3 bg-card px-5 py-3 rounded-2xl shadow-md border border-white/10">
              <CalendarDays className="h-5 w-5 text-primary" />
              <span className="text-sm md:text-base font-bold uppercase tracking-tight text-white">
                {formattedDate}
              </span>
            </div>
            <SettingsDialog 
              sessions={sessions} 
              weeklyGoal={weeklyGoal} 
              onImport={handleImportData} 
            />
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          {/* Coluna do Timer */}
          <div className="lg:col-span-4 xl:col-span-3 h-full overflow-hidden">
            <div className="h-full max-h-[500px] lg:max-h-none">
              <TimerDisplay onSave={handleSaveSession} />
            </div>
          </div>

          {/* Coluna Central e Direita */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6 min-h-0">
            {/* Grid de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
              <SummaryCard 
                title="Semana" 
                totalSeconds={weekTotal} 
                icon={TrendingUp} 
                description="Esforço semanal"
              />
              <SummaryCard 
                title="Mês" 
                totalSeconds={monthTotal} 
                icon={LayoutDashboard} 
                description="Esforço mensal"
              />
              <GoalProgressCard 
                currentSeconds={weekTotal} 
                goalHours={weeklyGoal} 
                onGoalChange={(newGoal) => setWeeklyGoal(newGoal)}
              />
            </div>

            {/* Histórico */}
            <div className="flex-1 min-h-0">
              <DailyHistory sessions={sessions} onDelete={handleDeleteSession} />
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
