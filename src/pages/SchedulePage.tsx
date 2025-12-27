import { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function SchedulePage() {
  const { requests } = useApp();

  const events = useMemo(() => {
    return requests.map((request) => ({
      id: request.id,
      title: request.subject,
      start: request.createdAt,
      end: request.dueDate,
      backgroundColor: 
        request.priority === 'critical' ? 'hsl(0, 75%, 55%)' :
        request.priority === 'normal' ? 'hsl(215, 70%, 50%)' :
        'hsl(145, 60%, 40%)',
      borderColor: 'transparent',
      extendedProps: {
        equipment: request.equipmentName,
        type: request.type,
        status: request.status,
      },
    }));
  }, [requests]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Schedule</h1>
        <p className="text-muted-foreground mt-0.5 sm:mt-1 text-sm sm:text-base">
          View and manage preventive maintenance schedules
        </p>
      </div>

      {/* Calendar */}
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Maintenance Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="fc-custom -mx-2 sm:mx-0">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: 'today',
              }}
              height="auto"
              eventClick={(info) => {
                console.log('Event clicked:', info.event);
              }}
              dayMaxEvents={2}
              eventDisplay="block"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false,
              }}
              titleFormat={{ year: 'numeric', month: 'short' }}
              buttonText={{
                today: 'Today',
                month: 'Month',
                week: 'Week',
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="glass-card">
        <CardContent className="py-4 sm:pt-6">
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-status-critical" />
              <span className="text-xs sm:text-sm">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-status-normal" />
              <span className="text-xs sm:text-sm">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-status-low" />
              <span className="text-xs sm:text-sm">Low</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
