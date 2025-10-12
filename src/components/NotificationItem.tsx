import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationItemProps {
  id: string;
  title: string;
  time: string;
  onDismiss: (id: string) => void;
}

export const NotificationItem = ({ id, title, time, onDismiss }: NotificationItemProps) => {
  return (
    <div className="flex items-start justify-between gap-2 py-2 px-2 hover:bg-accent rounded-md transition-colors">
      <div className="flex flex-col space-y-1 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(id);
        }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};
