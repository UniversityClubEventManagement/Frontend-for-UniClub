import { Calendar, Clock, MapPin, Users, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { apiFetch } from "../lib/api";

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  registrationLimit: number;
  registrationDeadline: string;
  status: "pending" | "approved" | "rejected";
  clubName: string;
  attendees: number;
  isRegistered: boolean;
  bannerUrl?: string;
}

export function EventDetail() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) {
        setError("Event ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const loadedEvent = (await apiFetch(`/api/events/${eventId}`)) as Event;
        setEvent(loadedEvent);
      } catch (err) {
        console.error(err);
        setError((err as Error).message || "Unable to load event details");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  const handleRegister = async () => {
    if (!event) {
      return;
    }

    try {
      const response = await apiFetch(`/api/events/${event._id}/register`, {
        method: "POST",
      });
      setEvent({ ...event, isRegistered: response.isRegistered, attendees: response.attendees });
    } catch (err) {
      console.error(err);
      alert((err as Error).message || "Unable to update registration");
    }
  };

  const spotsLeft = event ? Math.max(0, event.registrationLimit - event.attendees) : 0;
  const spotsPercentage = event ? (event.registrationLimit ? (event.attendees / event.registrationLimit) * 100 : 0) : 0;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {loading && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-lg bg-white border border-[#E5E7EB] p-8 text-center text-[#6B7280]">
            Loading event details...
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-lg bg-red-50 border border-red-200 p-8 text-center text-red-700">
            {error}
          </div>
        </div>
      )}

      {!loading && event && (
        <>
          <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-r from-[#1E3A8A] to-[#0D9488]">
            <ImageWithFallback
              src={event.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="absolute top-4 left-4 bg-white/90 hover:bg-white text-[#1F2937]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-12">
            <Card className="bg-white rounded-lg shadow-lg border border-[#E5E7EB] overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge className="bg-[#DBEAFE] text-[#1E3A8A] border-0">{event.category}</Badge>
                    <Badge className="bg-[#CCFBF1] text-[#0D9488] border-0">{event.clubName}</Badge>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1F2937] mb-4">{event.title}</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-[#E5E7EB]">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#DBEAFE] p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-[#1E3A8A]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#6B7280]">Date</p>
                      <p className="font-medium text-[#1F2937]">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-[#DBEAFE] p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-[#1E3A8A]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#6B7280]">Time</p>
                      <p className="font-medium text-[#1F2937]">{event.startTime} - {event.endTime}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-[#DBEAFE] p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-[#1E3A8A]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#6B7280]">Venue</p>
                      <p className="font-medium text-[#1F2937]">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-[#DBEAFE] p-2 rounded-lg">
                      <Users className="w-5 h-5 text-[#1E3A8A]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#6B7280]">Attendees</p>
                      <p className="font-medium text-[#1F2937]">{event.attendees} / {event.registrationLimit}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-[#1F2937] mb-3">About This Event</h3>
                  <p className="text-[#6B7280] leading-relaxed">{event.description}</p>
                </div>

                <Card className="bg-[#F9FAFB] border border-[#E5E7EB] p-4 mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-[#F59E0B] mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1F2937] mb-1">Registration Deadline</p>
                      <p className="text-sm text-[#6B7280]">
                        {new Date(event.registrationDeadline).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[#6B7280]">Available Slots</span>
                      <span className="font-medium text-[#1F2937]">{spotsLeft} spots left</span>
                    </div>
                    <div className="bg-[#E5E7EB] rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          spotsPercentage >= 80 ? "bg-[#EF4444]" : spotsPercentage >= 50 ? "bg-[#F59E0B]" : "bg-[#10B981]"
                        }`}
                        style={{ width: `${spotsPercentage}%` }}
                      />
                    </div>
                  </div>
                </Card>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleRegister}
                    className={`flex-1 text-white ${event.isRegistered ? "bg-[#10B981] hover:bg-[#059669]" : "bg-[#1E3A8A] hover:bg-[#1E40AF]"}`}
                    disabled={!event.isRegistered && spotsLeft === 0}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {event.isRegistered ? "Cancel Registration" : spotsLeft === 0 ? "Event Full" : "Register for Event"}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#E5E7EB] text-[#1F2937]"
                  >
                    Share Event
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
