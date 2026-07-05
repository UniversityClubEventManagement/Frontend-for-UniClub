import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface CalendarEvent {
  id: number;
  title: string;
  club: string;
  date: string;
  time: string;
  status: "approved" | "pending" | "conflict";
}

const mockCalendarEvents: CalendarEvent[] = [
  { id: 1, title: "Tech Talk: AI Development", club: "CS Club", date: "2026-03-05", time: "18:00", status: "approved" },
  { id: 2, title: "Spring Networking Mixer", club: "Business Society", date: "2026-03-08", time: "19:00", status: "approved" },
  { id: 3, title: "Community Service Day", club: "Volunteer Club", date: "2026-03-12", time: "09:00", status: "approved" },
  { id: 4, title: "Photography Exhibition", club: "Photography Club", date: "2026-03-15", time: "17:00", status: "approved" },
  { id: 5, title: "Coding Bootcamp", club: "CS Club", date: "2026-03-20", time: "14:00", status: "pending" },
  { id: 6, title: "Study Session", club: "Math Club", date: "2026-03-20", time: "14:00", status: "conflict" },
];

export function CalendarView() {
  const [view, setView] = useState<"month" | "week">("month");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockCalendarEvents.filter(event => event.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-[#DBEAFE] text-[#1E3A8A] border-l-[#1E3A8A]";
      case "pending":
        return "bg-[#FEF3C7] text-[#F59E0B] border-l-[#F59E0B]";
      case "conflict":
        return "bg-[#FEE2E2] text-[#EF4444] border-l-[#EF4444]";
      default:
        return "bg-[#E5E7EB] text-[#6B7280] border-l-[#6B7280]";
    }
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl text-[#1E3A8A] mb-2">Event Calendar</h2>
        <p className="text-[#6B7280]">View and manage all scheduled events</p>
      </div>

      {/* Legend */}
      <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-[#1F2937]">Status:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#1E3A8A]"></div>
            <span className="text-sm text-[#6B7280]">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#F59E0B]"></div>
            <span className="text-sm text-[#6B7280]">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#EF4444]"></div>
            <span className="text-sm text-[#6B7280]">Conflict</span>
          </div>
        </div>
      </Card>

      {/* Calendar Controls */}
      <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#1F2937]">{monthYear}</h3>
            
            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="hidden sm:flex bg-[#F9FAFB] rounded-lg p-1 mr-2">
                <button
                  onClick={() => setView("month")}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    view === "month" 
                      ? "bg-white text-[#1E3A8A] shadow-sm" 
                      : "text-[#6B7280] hover:text-[#1F2937]"
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setView("week")}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    view === "week" 
                      ? "bg-white text-[#1E3A8A] shadow-sm" 
                      : "text-[#6B7280] hover:text-[#1F2937]"
                  }`}
                >
                  Week
                </button>
              </div>

              {/* Navigation */}
              <Button
                variant="outline"
                size="sm"
                onClick={previousMonth}
                className="border-[#E5E7EB]"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextMonth}
                className="border-[#E5E7EB]"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4 sm:p-6">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs sm:text-sm font-medium text-[#6B7280] py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square sm:min-h-24 bg-[#F9FAFB] rounded-lg"></div>
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const events = getEventsForDate(day);
              const isToday = day === 5; // Mock today as March 5

              return (
                <div
                  key={day}
                  className={`aspect-square sm:min-h-24 p-1 sm:p-2 rounded-lg border transition-colors ${
                    isToday 
                      ? 'border-[#1E3A8A] bg-[#EFF6FF]' 
                      : 'border-[#E5E7EB] hover:border-[#1E3A8A] bg-white'
                  }`}
                >
                  <div className={`text-xs sm:text-sm font-medium mb-1 ${
                    isToday ? 'text-[#1E3A8A]' : 'text-[#1F2937]'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {events.map(event => (
                      <div
                        key={event.id}
                        className={`text-[10px] sm:text-xs p-1 rounded border-l-2 truncate ${getStatusColor(event.status)}`}
                        title={`${event.title} - ${event.club}`}
                      >
                        <div className="font-medium truncate hidden sm:block">{event.title}</div>
                        <div className="sm:hidden">•</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Events List for Selected Day */}
      <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] mt-6">
        <div className="p-4 sm:p-6 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#1F2937]">Upcoming Events</h3>
        </div>
        <div className="divide-y divide-[#E5E7EB]">
          {mockCalendarEvents.slice(0, 5).map(event => (
            <div key={event.id} className="p-4 sm:p-6 hover:bg-[#F9FAFB] transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-[#1F2937]">{event.title}</h4>
                    <Badge className={
                      event.status === "approved" ? "bg-[#D1FAE5] text-[#10B981] border-0" :
                      event.status === "pending" ? "bg-[#FEF3C7] text-[#F59E0B] border-0" :
                      "bg-[#FEE2E2] text-[#EF4444] border-0"
                    }>
                      {event.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <span>{event.time}</span>
                    <span className="text-[#0D9488]">{event.club}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-[#E5E7EB] text-[#1F2937]">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
