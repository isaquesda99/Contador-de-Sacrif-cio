
"use client";

import { useState } from "react";
import { StudySession } from "@/types/study";
import { formatTimeSummary } from "@/lib/study-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface DailyHistoryProps {
  sessions: StudySession[];
  onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 8;

export function DailyHistory({ sessions, onDelete }: DailyHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Sort sessions by newest first
  const sortedSessions = [...sessions].sort((a, b) => b.timestamp - a.timestamp);

  const totalPages = Math.max(1, Math.ceil(sortedSessions.length / ITEMS_PER_PAGE));
  
  // Ensure current page is valid after deletions
  const effectivePage = Math.min(currentPage, totalPages);
  
  const startIndex = (effectivePage - 1) * ITEMS_PER_PAGE;
  const currentSessions = sortedSessions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <Card className="h-full border border-white/5 shadow-sm overflow-hidden flex flex-col bg-card">
      <CardHeader className="py-3 px-6 shrink-0 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-bold text-white uppercase tracking-tight">Atividades Recentes</CardTitle>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                Página {effectivePage} de {totalPages}
              </span>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7 border-white/10 bg-white/5 hover:bg-white/10 text-white"
                  onClick={handlePrevPage}
                  disabled={effectivePage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7 border-white/10 bg-white/5 hover:bg-white/10 text-white"
                  onClick={handleNextPage}
                  disabled={effectivePage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
        <div className="flex-1 px-6">
          {sortedSessions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p className="text-xs italic">Nenhum registro encontrado.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5 pb-4">
              {currentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between py-2.5 group transition-colors hover:bg-white/5 px-2 -mx-2 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white uppercase tracking-tighter">
                      {format(new Date(session.timestamp), "eee, d 'de' MMM", { locale: ptBR })}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {format(new Date(session.timestamp), "HH:mm")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-black shadow-[0_0_10px_rgba(255,100,0,0.1)]">
                      {formatTimeSummary(session.durationSeconds)}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                      onClick={() => onDelete(session.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Fill empty space to keep card size consistent if fewer than 8 items */}
        {currentSessions.length > 0 && currentSessions.length < ITEMS_PER_PAGE && (
          <div className="flex-1" />
        )}
      </CardContent>
    </Card>
  );
}
