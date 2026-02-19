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
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{formatTimeSummary(totalSeconds)}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}