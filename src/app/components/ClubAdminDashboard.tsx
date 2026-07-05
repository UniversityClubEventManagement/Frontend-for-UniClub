import { Calendar, Users, TrendingUp, Plus, Edit, Trash2, Eye, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "../lib/api";

interface ClubEvent {
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
  status: "approved" | "pending" | "rejected";
  clubName: string;
  attendees: number;
  bannerUrl?: string;
}

interface Member {
  _id: string;
  name: string;
  email: string;
  role: string;
  clubName?: string;
  createdAt?: string;
}

export function ClubAdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [clubName, setClubName] = useState("");
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [memberMessage, setMemberMessage] = useState<string | null>(null);

  const approvedEvents = events.filter((event) => event.status === "approved");
  const pendingEvents = events.filter((event) => event.status === "pending");
  const totalAttendees = approvedEvents.reduce((sum, event) => sum + event.attendees, 0);

  const loadClubData = async () => {
    setError(null);
    setLoadingEvents(true);
    setLoadingMembers(true);

    try {
      const authResponse = await apiFetch("/api/auth/me");
      setClubName(authResponse.user.clubName || "Your Club");

      const [eventData, memberData] = await Promise.all([
        apiFetch("/api/events/club"),
        apiFetch("/api/clubs/members"),
      ]);

      setEvents(eventData);
      setMembers(memberData);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Unable to load club admin data");
    } finally {
      setLoadingEvents(false);
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    loadClubData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-[#D1FAE5] text-[#10B981] border-0">Approved</Badge>;
      case "pending":
        return <Badge className="bg-[#FEF3C7] text-[#F59E0B] border-0">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-[#FEE2E2] text-[#EF4444] border-0">Rejected</Badge>;
      default:
        return null;
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    const confirmed = window.confirm("Delete this event? This action cannot be undone.");
    if (!confirmed) {
      return;
    }

    try {
      await apiFetch(`/api/events/${eventId}`, { method: "DELETE" });
      setEvents((prev) => prev.filter((event) => event._id !== eventId));
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Unable to delete event");
    }
  };

  const handleAddMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMemberMessage(null);

    if (!newMemberEmail.trim()) {
      setMemberMessage("Please enter an email address.");
      return;
    }

    try {
      const response = await apiFetch("/api/clubs/members", {
        method: "POST",
        body: JSON.stringify({ email: newMemberEmail.trim() }),
      });
      setMembers((prev) => [response.member, ...prev]);
      setNewMemberEmail("");
      setMemberMessage("Member added successfully.");
      setShowAddMemberForm(false);
    } catch (err) {
      console.error(err);
      setMemberMessage((err as Error).message || "Unable to add member");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    const confirmed = window.confirm("Remove this member from the club?");
    if (!confirmed) {
      return;
    }

    try {
      await apiFetch(`/api/clubs/members/${memberId}`, {
        method: "DELETE",
      });
      setMembers((prev) => prev.filter((member) => member._id !== memberId));
      setMemberMessage("Member removed successfully.");
    } catch (err) {
      console.error(err);
      setMemberMessage((err as Error).message || "Unable to remove member");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl text-[#1E3A8A] mb-2">{clubName}</h2>
          <p className="text-[#6B7280]">Manage your club events and members</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Total Events</p>
                <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">{events.length}</p>
              </div>
              <div className="bg-[#DBEAFE] p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-[#1E3A8A]" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Club Members</p>
                <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">{members.length}</p>
              </div>
              <div className="bg-[#CCFBF1] p-3 rounded-lg">
                <Users className="w-6 h-6 text-[#0D9488]" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Total Attendees</p>
                <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">{totalAttendees}</p>
              </div>
              <div className="bg-[#D1FAE5] p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-[#10B981]" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Pending Approval</p>
                <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">{pendingEvents.length}</p>
              </div>
              <div className="bg-[#FEF3C7] p-3 rounded-lg">
                <Clock className="w-6 h-6 text-[#F59E0B]" />
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white" onClick={() => navigate("/create-event") }>
            <Plus className="w-4 h-4 mr-2" />
            Create New Event
          </Button>
          {showAddMemberForm ? (
            <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <input
                type="email"
                className="w-full sm:w-72 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#1F2937]"
                placeholder="Member email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
              <Button type="submit" className="bg-[#0D9488] hover:bg-[#0F766E] text-white">
                Add Member
              </Button>
            </form>
          ) : (
            <Button
              variant="outline"
              className="border-[#E5E7EB] text-[#1F2937]"
              onClick={() => setShowAddMemberForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          )}
        </div>

        {memberMessage && (
          <div className="mb-6 rounded-lg bg-white border border-[#E5E7EB] p-4 text-sm text-[#1F2937]">
            {memberMessage}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-[#E5E7EB] mb-6">
            <TabsTrigger value="events" className="data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white">
              Events
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white">
              Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            <h3 className="text-xl text-[#1F2937] mb-4">Your Events</h3>

            {loadingEvents ? (
              <Card className="p-6 bg-white rounded-lg border border-[#E5E7EB] text-[#6B7280]">Loading events...</Card>
            ) : events.length === 0 ? (
              <Card className="p-6 bg-white rounded-lg border border-[#E5E7EB] text-[#6B7280]">
                No events found for your club yet.
              </Card>
            ) : (
              events.map((event) => (
                <Card key={event._id} className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-[#1F2937] mb-2">{event.title}</h4>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              {getStatusBadge(event.status)}
                              <Badge className="bg-[#DBEAFE] text-[#1E3A8A] border-0">
                                {event.category}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#6B7280] mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#1E3A8A]" />
                            <span>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} at {event.startTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#1E3A8A]" />
                            <span>{event.attendees}/{event.registrationLimit || "∞"} registered</span>
                          </div>
                        </div>

                        {event.status === "approved" && event.attendees > 0 && (
                          <div className="mt-2">
                            <div className="bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-[#0D9488] h-full"
                                style={{ width: `${event.registrationLimit ? (event.attendees / event.registrationLimit) * 100 : 0}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex lg:flex-col gap-2">
                        <Button
                          variant="outline"
                          className="border-[#E5E7EB] text-[#1F2937] flex-1 lg:flex-none lg:w-32"
                          onClick={() => navigate(`/events/${event._id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          className="border-[#E5E7EB] text-[#1F2937] flex-1 lg:flex-none lg:w-32"
                          onClick={() => navigate(`/create-event?eventId=${event._id}`)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          className="border-[#E5E7EB] text-[#EF4444] flex-1 lg:flex-none lg:w-32"
                          onClick={() => handleDeleteEvent(event._id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl text-[#1F2937]">Club Members</h3>
            </div>

            {loadingMembers ? (
              <Card className="p-6 bg-white rounded-lg border border-[#E5E7EB] text-[#6B7280]">Loading members...</Card>
            ) : members.length === 0 ? (
              <Card className="p-6 bg-white rounded-lg border border-[#E5E7EB] text-[#6B7280]">
                No club members have been added yet.
              </Card>
            ) : (
              <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider hidden sm:table-cell">
                          Email
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">
                          Join Date
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[#E5E7EB]">
                      {members.map((member) => (
                        <tr key={member._id} className="hover:bg-[#F9FAFB]">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-[#1F2937]">{member.name}</div>
                            <div className="text-xs text-[#6B7280] sm:hidden">{member.email}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                            <div className="text-sm text-[#6B7280]">{member.email}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <Badge className={member.role === "club-admin" ? "bg-[#D1FAE5] text-[#10B981] border-0" : "bg-[#E5E7EB] text-[#6B7280] border-0"}>
                              {member.role}
                            </Badge>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-[#6B7280] hidden lg:table-cell">
                            {member.createdAt ? new Date(member.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                            <Button variant="ghost" size="sm" className="text-[#1E3A8A]">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#EF4444]"
                              onClick={() => handleRemoveMember(member._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
