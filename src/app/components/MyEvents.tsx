import { Calendar, Clock, MapPin, XCircle, ArrowLeft } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router";
import { useState } from "react";

interface RegisteredEvent {
  id: number;
  title: string;
  club: string;
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
  category: string;
}

const mockRegisteredEvents: RegisteredEvent[] = [
  {
    id: 1,
    title: "Spring Networking Mixer",
    club: "Business Society",
    date: "2026-03-08",
    time: "19:00",
    location: "Student Center - Hall A",
    status: "upcoming",
    category: "Social"
  },
  {
    id: 2,
    title: "Photography Workshop",
    club: "Photography Club",
    date: "2026-03-15",
    time: "14:00",
    location: "Arts Building - Studio 2",
    status: "upcoming",
    category: "Workshop"
  },
  {
    id: 3,
    title: "Coding Competition Finals",
    club: "Computer Science Club",
    date: "2026-02-20",
    time: "10:00",
    location: "Engineering Building",
    status: "completed",
    category: "Competition"
  },
];

export function MyEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(mockRegisteredEvents);

  const handleCancel = (eventId: number) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-[#D1FAE5] text-[#10B981] border-0">Upcoming</Badge>;
      case "completed":
        return <Badge className="bg-[#E5E7EB] text-[#6B7280] border-0">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-[#FEE2E2] text-[#EF4444] border-0">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const upcomingEvents = events.filter(e => e.status === "upcoming");
  const completedEvents = events.filter(e => e.status === "completed");

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mb-4 text-[#1F2937] -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl sm:text-3xl text-[#1E3A8A] mb-2">My Events</h2>
          <p className="text-[#6B7280]">Manage your event registrations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280] mb-1">Upcoming Events</p>
            <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">{upcomingEvents.length}</p>
          </Card>
          <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280] mb-1">Completed</p>
            <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">{completedEvents.length}</p>
          </Card>
          <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280] mb-1">Total Registered</p>
            <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">{events.length}</p>
          </Card>
        </div>

        {/* Events Table */}
        <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-[#E5E7EB]">
            <h3 className="text-lg font-semibold text-[#1F2937]">Registered Events</h3>
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Event Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Club
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E5E7EB]">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-[#F9FAFB]">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[#1F2937]">{event.title}</div>
                      <div className="text-xs text-[#6B7280]">{event.category}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B7280]">
                      {event.club}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1F2937]">
                      <div>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      <div className="text-xs text-[#6B7280]">{event.time}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B7280]">
                      {event.location}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(event.status)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[#1E3A8A]"
                          onClick={() => navigate('/event-detail')}
                        >
                          View
                        </Button>
                        {event.status === "upcoming" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#EF4444]"
                            onClick={() => handleCancel(event.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-[#E5E7EB]">
            {events.map((event) => (
              <div key={event.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-[#1F2937] mb-1">{event.title}</h4>
                    <p className="text-sm text-[#0D9488] mb-2">{event.club}</p>
                  </div>
                  {getStatusBadge(event.status)}
                </div>
                
                <div className="space-y-1 text-sm text-[#6B7280] mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-[#E5E7EB] text-[#1F2937]"
                    onClick={() => navigate('/event-detail')}
                  >
                    View Details
                  </Button>
                  {event.status === "upcoming" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#EF4444] text-[#EF4444]"
                      onClick={() => handleCancel(event.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
