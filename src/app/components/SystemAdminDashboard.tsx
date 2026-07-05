import { Calendar, Users, AlertCircle, CheckCircle, Clock, XCircle, Search, Filter } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

interface PendingEvent {
  _id: string;
  title: string;
  category: string;
  date: string;
  startTime: string;
  location: string;
  clubName: string;
  attendees: number;
  status: "pending" | "approved" | "rejected";
  createdBy: {
    name: string;
    email: string;
  };
}

interface ClubSummary {
  clubName: string;
  members: number;
  activeEvents: number;
  status: "active" | "inactive";
  president: string;
  presidentEmail: string;
}

interface ConflictEvent {
  id: string;
  event1: string;
  event2: string;
  location: string;
  date: string;
  time: string;
}

interface AdminStats {
  totalClubs: number;
  totalMembers: number;
  pendingRequests: number;
  approvedEvents: number;
  conflictCount: number;
}

export function SystemAdminDashboard() {
  const [activeTab, setActiveTab] = useState("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<AdminStats>({ totalClubs: 0, totalMembers: 0, pendingRequests: 0, approvedEvents: 0, conflictCount: 0 });
  const [pendingRequests, setPendingRequests] = useState<PendingEvent[]>([]);
  const [clubs, setClubs] = useState<ClubSummary[]>([]);
  const [conflicts, setConflicts] = useState<ConflictEvent[]>([]);
  const [showCreateClubForm, setShowCreateClubForm] = useState(false);
  const [clubName, setClubName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

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

  const getClubStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-[#D1FAE5] text-[#10B981] border-0">Active</Badge>;
      case "inactive":
        return <Badge className="bg-[#E5E7EB] text-[#6B7280] border-0">Inactive</Badge>;
      default:
        return null;
    }
  };

  const loadAdminData = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const [statsResponse, pendingResponse, clubsResponse, conflictsResponse] = await Promise.all([
        apiFetch("/api/admin/stats"),
        apiFetch("/api/admin/events/pending"),
        apiFetch("/api/admin/clubs"),
        apiFetch("/api/admin/conflicts"),
      ]);

      setStats(statsResponse);
      setPendingRequests(pendingResponse);
      setClubs(clubsResponse);
      setConflicts(conflictsResponse);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Unable to load system admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "system-admin")) {
      navigate(user ? `/${user.role === "club-admin" ? "club-admin" : "student"}` : "/login");
      return;
    }

    if (user?.role === "system-admin") {
      loadAdminData();
    }
  }, [user, authLoading, navigate]);

  const handleUpdateRequestStatus = async (eventId: string, status: "approved" | "rejected") => {
    setError(null);
    setMessage(null);

    try {
      await apiFetch(`/api/admin/events/${eventId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      setPendingRequests((prev) => prev.filter((request) => request._id !== eventId));
      setStats((prev) => ({
        ...prev,
        pendingRequests: Math.max(0, prev.pendingRequests - 1),
        approvedEvents: status === "approved" ? prev.approvedEvents + 1 : prev.approvedEvents,
      }));
      setMessage(`Event ${status} successfully.`);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Unable to update request status");
    }
  };

  const handleCreateClub = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!clubName.trim() || !adminName.trim() || !adminEmail.trim() || !adminPassword.trim()) {
      setError("Please complete all club registration fields.");
      return;
    }

    try {
      await apiFetch("/api/admin/clubs", {
        method: "POST",
        body: JSON.stringify({
          clubName: clubName.trim(),
          adminName: adminName.trim(),
          adminEmail: adminEmail.trim(),
          password: adminPassword,
        }),
      });

      setMessage("Club registered successfully.");
      setClubName("");
      setAdminName("");
      setAdminEmail("");
      setAdminPassword("");
      setShowCreateClubForm(false);
      loadAdminData();
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Unable to create club");
    }
  };

  const filteredRequests = pendingRequests.filter((request) => {
    const normalized = searchQuery.toLowerCase();
    return (
      request.title.toLowerCase().includes(normalized) ||
      request.clubName.toLowerCase().includes(normalized) ||
      request.location.toLowerCase().includes(normalized)
    );
  });

  const filteredClubs = clubs.filter((club) => club.clubName.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredConflicts = conflicts.filter((conflict) =>
    conflict.event1.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conflict.event2.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conflict.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl text-[#1E3A8A] mb-2">System Administration</h2>
          <p className="text-[#6B7280]">Approve events, manage clubs, and resolve scheduling conflicts.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Total Clubs</p>
                <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">{stats.totalClubs}</p>
              </div>
              <div className="bg-[#DBEAFE] p-3 rounded-lg">
                <Users className="w-6 h-6 text-[#1E3A8A]" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Pending Requests</p>
                <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">{stats.pendingRequests}</p>
              </div>
              <div className="bg-[#FEF3C7] p-3 rounded-lg">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-[#F59E0B]" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Approved Events</p>
                <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">{stats.approvedEvents}</p>
              </div>
              <div className="bg-[#D1FAE5] p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-[#10B981]" />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Conflicts</p>
                <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">{stats.conflictCount}</p>
              </div>
              <div className="bg-[#FEE2E2] p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-[#EF4444]" />
              </div>
            </div>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] w-5 h-5" />
              <Input
                placeholder="Search events, clubs, or locations..."
                className="pl-10 bg-[#F9FAFB] border-[#E5E7EB]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="border-[#E5E7EB] text-[#1F2937]"
              onClick={() => setShowCreateClubForm((prev) => !prev)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showCreateClubForm ? "Hide" : "Register New Club"}
            </Button>
          </div>
        </div>

        {showCreateClubForm && (
          <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 mb-6">
            <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Register New Club</h3>
            <form onSubmit={handleCreateClub} className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="clubName" className="text-sm font-medium text-[#1F2937]">Club Name</label>
                <Input
                  id="clubName"
                  type="text"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                  required
                />
              </div>
              <div>
                <label htmlFor="adminName" className="text-sm font-medium text-[#1F2937]">Club Admin Name</label>
                <Input
                  id="adminName"
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                  required
                />
              </div>
              <div>
                <label htmlFor="adminEmail" className="text-sm font-medium text-[#1F2937]">Club Admin Email</label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                  required
                />
              </div>
              <div>
                <label htmlFor="adminPassword" className="text-sm font-medium text-[#1F2937]">Password</label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                  required
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white" disabled={loading}>
                  Register Club
                </Button>
              </div>
            </form>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-[#E5E7EB] mb-6">
            <TabsTrigger value="requests" className="data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white">
              Event Requests
            </TabsTrigger>
            <TabsTrigger value="clubs" className="data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white">
              Clubs
            </TabsTrigger>
            <TabsTrigger value="conflicts" className="data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white">
              Conflicts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <h3 className="text-xl text-[#1F2937] mb-4">Event Approval Requests</h3>

            {loading ? (
              <Card className="p-6 bg-white rounded-lg border border-[#E5E7EB] text-[#6B7280]">Loading requests...</Card>
            ) : filteredRequests.length === 0 ? (
              <Card className="p-6 bg-white rounded-lg border border-[#E5E7EB] text-[#6B7280]">No pending requests found.</Card>
            ) : (
              filteredRequests.map((request) => (
                <Card key={request._id} className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between mb-2 gap-2">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-[#1F2937] mb-1">{request.title}</h4>
                            <p className="text-sm text-[#0D9488] mb-2">{request.clubName}</p>
                          </div>
                          <div className="flex gap-2">
                            {getStatusBadge(request.status)}
                            <Badge className="bg-[#DBEAFE] text-[#1E3A8A] border-0">{request.category}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#6B7280] mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#1E3A8A]" />
                            <span>{new Date(request.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {request.startTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#1E3A8A]" />
                            <span>{request.attendees} attendees</span>
                          </div>
                        </div>

                        <p className="text-sm text-[#6B7280]"><span className="font-medium">Location:</span> {request.location}</p>
                      </div>

                      <div className="flex lg:flex-col gap-2">
                        <Button
                          className="bg-[#10B981] hover:bg-[#059669] text-white flex-1 lg:flex-none lg:w-32"
                          onClick={() => handleUpdateRequestStatus(request._id, "approved")}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="border-[#EF4444] text-[#EF4444] hover:bg-[#FEE2E2] flex-1 lg:flex-none lg:w-32"
                          onClick={() => handleUpdateRequestStatus(request._id, "rejected")}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="clubs" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl text-[#1F2937]">Registered Clubs</h3>
            </div>

            {loading ? (
              <Card className="p-6 bg-white rounded-lg border border-[#E5E7EB] text-[#6B7280]">Loading clubs...</Card>
            ) : filteredClubs.length === 0 ? (
              <Card className="p-6 bg-white rounded-lg border border-[#E5E7EB] text-[#6B7280]">No clubs found.</Card>
            ) : (
              <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Club Name</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider hidden md:table-cell">President</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Members</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">Active Events</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider hidden sm:table-cell">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[#E5E7EB]">
                      {filteredClubs.map((club) => (
                        <tr key={club.clubName} className="hover:bg-[#F9FAFB]">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-[#1F2937]">{club.clubName}</div>
                            <div className="text-xs text-[#6B7280]">{club.presidentEmail}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-[#6B7280] hidden md:table-cell">{club.president}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-[#1F2937]">{club.members}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-[#1F2937] hidden lg:table-cell">{club.activeEvents}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">{getClubStatusBadge(club.status)}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                            <Button variant="ghost" size="sm" className="text-[#1E3A8A]">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="conflicts" className="space-y-4">
            <h3 className="text-xl text-[#1F2937] mb-4">Scheduling Conflicts</h3>

            {loading ? (
              <Card className="p-6 bg-white rounded-lg border border-[#E5E7EB] text-[#6B7280]">Loading conflicts...</Card>
            ) : filteredConflicts.length === 0 ? (
              <Card className="p-6 bg-white rounded-lg border border-[#E5E7EB] text-[#6B7280]">No conflicts detected.</Card>
            ) : (
              filteredConflicts.map((conflict) => (
                <Card key={conflict.id} className="bg-white rounded-lg shadow-sm border-l-4 border-l-[#EF4444] border-[#E5E7EB] overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#FEE2E2] p-2 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-[#EF4444]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#1F2937] mb-2">Location Conflict</h4>
                        <div className="space-y-1 text-sm text-[#6B7280]">
                          <p><span className="font-medium text-[#1F2937]">Event 1:</span> {conflict.event1}</p>
                          <p><span className="font-medium text-[#1F2937]">Event 2:</span> {conflict.event2}</p>
                          <p><span className="font-medium text-[#1F2937]">Location:</span> {conflict.location}</p>
                          <p><span className="font-medium text-[#1F2937]">Date:</span> {new Date(conflict.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {conflict.time}</p>
                        </div>
                      </div>
                      <Button className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white">Resolve</Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
