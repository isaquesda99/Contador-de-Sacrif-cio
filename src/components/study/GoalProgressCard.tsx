"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatTimeSummary } from "@/lib/study-utils";
import { Target, Settings2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GoalProgressCardProps {
  currentSeconds: number;
  goalHours: number;
  onGoalChange: (newGoal: number) => void;
}

export function GoalProgressCard({ currentSeconds, goalHours, onGoalChange }: GoalProgressCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(goalHours.toString());

  // Sincroniza o estado temporário quando a prop muda
  useEffect(() => {
    setTempGoal(goalHours.toString());
  }, [goalHours]);

  const currentHours = currentSeconds / 3600;
  const progress = Math.min((currentHours / goalHours) * 100, 100);

  const handleSave = () => {
    const val = parseFloat(tempGoal);
    if (!isNaN(val) && val > 0) {
      onGoalChange(val);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempGoal(goalHours.toString());
    setIsEditing(false);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg h-full border border-white/5 shadow-sm bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meta Semanal</CardTitle>
        <Target className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-3xl font-black text-primary">
              {progress.toFixed(0)}%
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">Concluído</span>
          </div>
          
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 animate-in fade-in zoom-in duration-200">
                <Input 
                  type="number" 
                  value={tempGoal} 
                  onChange={(e) => setTempGoal(e.target.value)}
                  className="h-7 w-14 text-xs font-bold border-none bg-transparent focus-visible:ring-0 p-1 text-white"
                  autoFocus
                />
                <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-green-500/20" onClick={handleSave}>
                  <Check className="h-3.5 w-3.5 text-green-500" />
                </Button>
                <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-red-500/20" onClick={handleCancel}>
                  <X className="h-3.5 w-3.5 text-red-500" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-white">{goalHours}h</span>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    <Settings2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Objetivo</span>
              </div>
            )}
          </div>
        </div>

        <Progress value={progress} className="h-2.5 mb-2 bg-white/5" />
        
        <div className="flex justify-between items-center">
          <p className="text-[10px] text-muted-foreground font-semibold">
            {formatTimeSummary(currentSeconds)} realizados
          </p>
          {progress >= 100 && (
            <span className="text-[10px] font-bold text-green-500 animate-bounce">
              Meta Batida! 🎉
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}