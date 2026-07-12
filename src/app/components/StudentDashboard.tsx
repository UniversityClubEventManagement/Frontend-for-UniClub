import { Calendar, Clock, MapPin, Users, Filter, Search, CheckCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "../lib/api";

interface Event {
  _id: string;
  title: string;
  description?: string;
  category: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  registrationLimit: number;
  registrationDeadline?: string;
  status: "pending" | "approved" | "rejected";
  clubName: string;
  attendees: number;
  isRegistered?: boolean;
}

export function StudentDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadedEvents = (await apiFetch("/api/events")) as Event[];
        setEvents(loadedEvents);
      } catch (err) {
        console.error(err);
        setError((err as Error).message || "Unable to load events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleRegister = async (eventId: string) => {
    try {
      const response = await apiFetch(`/api/events/${eventId}/register`, {
        method: "POST",
      });
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? { ...event, isRegistered: response.isRegistered, attendees: response.attendees }
            : event
        )
      );
    } catch (error) {
      console.error(error);
      alert((error as Error).message || "Unable to update registration");
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.clubName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingCount = filteredEvents.length;
  const registeredCount = events.filter((event) => event.isRegistered).length;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl text-[#1E3A8A] mb-2">Welcome, Student</h2>
          <p className="text-[#6B7280]">Discover and join upcoming club events</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Upcoming Events</p>
                <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">{upcomingCount}</p>
              </div>
              <div className="bg-[#DBEAFE] p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-[#1E3A8A]" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">My Registrations</p>
                <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">{registeredCount}</p>
              </div>
              <div className="bg-[#D1FAE5] p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-[#10B981]" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Active Clubs</p>
                <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">12</p>
              </div>
              <div className="bg-[#CCFBF1] p-3 rounded-lg">
                <Users className="w-6 h-6 text-[#0D9488]" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">This Week</p>
                <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">3</p>
              </div>
              <div className="bg-[#FEF3C7] p-3 rounded-lg">
                <Clock className="w-6 h-6 text-[#F59E0B]" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] w-5 h-5" />
              <Input
                placeholder="Search events or clubs..."
                className="pl-10 bg-[#F9FAFB] border-[#E5E7EB]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-[#E5E7EB] text-[#1F2937]">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          <h3 className="text-xl text-[#1F2937] mb-4">Upcoming Events</h3>
          
          {filteredEvents.map((event) => (
            <Card key={event._id} className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-[#1F2937] mb-1">{event.title}</h4>
                        <p className="text-sm text-[#0D9488] mb-2">{event.clubName}</p>
                      </div>
                      <Badge className="bg-[#DBEAFE] text-[#1E3A8A] border-0 ml-2">
                        {event.category}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-[#6B7280]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#1E3A8A]" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#1E3A8A]" />
                        <span>{event.startTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#1E3A8A]" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees}/{event.registrationLimit} attendees</span>
                      </div>
                      <div className="mt-2 bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#0D9488] h-full"
                          style={{ width: `${event.registrationLimit ? (event.attendees / event.registrationLimit) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex lg:flex-col gap-2">
                    <Button
                      onClick={() => handleRegister(event._id)}
                      className={`w-full lg:w-32 text-white ${event.isRegistered ? "bg-[#10B981] hover:bg-[#059669]" : "bg-[#1E3A8A] hover:bg-[#1E40AF]"}`}
                    >
                      {event.isRegistered ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Registered
                        </>
                      ) : (
                        "Register"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#E5E7EB] text-[#1F2937] w-full lg:w-32"
                      onClick={() => navigate(`/events/${event._id}`)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}