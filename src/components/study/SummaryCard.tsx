import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTimeSummary } from "@/lib/study-utils";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  totalSeconds: number;
  icon: LucideIcon;
  description: string;
}

export function SummaryCard({ title, totalSeconds, icon: Icon, description }: SummaryCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg border border-white/5 bg-card shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black text-primary">{formatTimeSummary(totalSeconds)}</div>
        <p className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-tighter">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
