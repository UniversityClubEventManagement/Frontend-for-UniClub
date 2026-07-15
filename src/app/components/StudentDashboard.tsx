import { Calendar, Clock, MapPin, Users, Filter, Search, CheckCircle, User, Mail, Edit, Trash2, X, Save} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useEffect, useState, ChangeEvent } from "react";
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
interface StudentProfile {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  faculty?: string;
  department?: string;
  academicYear?: string;
  clubName?: string;
  isActive?: boolean;
}

export function StudentDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
//
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);

  const [profileForm, setProfileForm] = useState<StudentProfile>({
    name: "",
    faculty: "",
    department: "",
    academicYear: "",
    clubName: "",
  });
//
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
//
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");

  navigate("/login", { replace: true });
};
//

//student profile
const loadStudentProfile = async () => {
  try {
    setProfileLoading(true);
    setProfileError(null);

    const data = await apiFetch("/api/auth/profile");

    setStudentProfile(data.user);

    setProfileForm({
      name: data.user?.name || "",
      faculty: data.user?.faculty || "",
      department: data.user?.department || "",
      academicYear: data.user?.academicYear || "",
      clubName: data.user?.clubName || "",
    });
  } catch (error) {
    setProfileError((error as Error).message || "Unable to load profile");
  } finally {
    setProfileLoading(false);
  }
};

const openProfileModal = async () => {
  setShowProfileModal(true);
  setIsEditingProfile(false);
  setProfileSuccess(null);
  setProfileError(null);

  await loadStudentProfile();
};

const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  setProfileForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleUpdateProfile = async () => {
  try {
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(null);

    const data = await apiFetch("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify({
        name: profileForm.name,
        faculty: profileForm.faculty,
        department: profileForm.department,
        academicYear: profileForm.academicYear,
        clubName: profileForm.clubName,
      }),
    });

    setStudentProfile(data.user);
    setIsEditingProfile(false);
    setProfileSuccess("Profile updated successfully");
  } catch (error) {
    setProfileError((error as Error).message || "Unable to update profile");
  } finally {
    setProfileSaving(false);
  }
};

const handleDeleteProfile = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to deactivate your profile?"
  );

  if (!confirmDelete) return;

  try {
    setProfileSaving(true);
    setProfileError(null);

    await apiFetch("/api/auth/profile", {
      method: "DELETE",
    });

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");

    navigate("/login", { replace: true });
  } catch (error) {
    setProfileError((error as Error).message || "Unable to deactivate profile");
  } finally {
    setProfileSaving(false);
  }
};

//


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
<div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <div>
    <h2 className="text-2xl sm:text-3xl text-[#1E3A8A] mb-2">
      Welcome, Student
    </h2>
    <p className="text-[#6B7280]">Discover and join upcoming club events</p>
  </div>

  <Button
    onClick={openProfileModal}
    className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white w-full sm:w-auto"
  >
    <User className="w-4 h-4 mr-2" />
    My Profile
  </Button>
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

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 text-[#6B7280] hover:text-[#111827]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <h2 className="text-xl font-semibold text-[#111827] flex items-center">
                <User className="w-5 h-5 mr-2 text-[#1E3A8A]" />
                Student Profile
              </h2>
              <p className="text-sm text-[#6B7280] mt-1">
                View and manage your registered profile details.
              </p>
            </div>

            {profileLoading ? (
              <p className="text-sm text-[#6B7280]">Loading profile...</p>
            ) : (
              <>
                {profileError && (
                  <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {profileError}
                  </div>
                )}

                {profileSuccess && (
                  <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {profileSuccess}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#374151]">
                      Name
                    </label>
                    <Input
                      name="name"
                      value={profileForm.name || ""}
                      onChange={handleProfileChange}
                      disabled={!isEditingProfile}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#374151]">
                      Email
                    </label>
                    <div className="mt-1 flex items-center gap-2 rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-[#6B7280] bg-[#F9FAFB]">
                      <Mail className="w-4 h-4" />
                      {studentProfile?.email || "Not available"}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#374151]">
                      Faculty
                    </label>
                    <Input
                      name="faculty"
                      value={profileForm.faculty || ""}
                      onChange={handleProfileChange}
                      disabled={!isEditingProfile}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#374151]">
                      Department
                    </label>
                    <Input
                      name="department"
                      value={profileForm.department || ""}
                      onChange={handleProfileChange}
                      disabled={!isEditingProfile}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#374151]">
                      Academic Year
                    </label>
                    <Input
                      name="academicYear"
                      value={profileForm.academicYear || ""}
                      onChange={handleProfileChange}
                      disabled={!isEditingProfile}
                      className="mt-1"
                    />
                  </div>

                  {studentProfile?.role === "club-admin" && (
                    <div>
                      <label className="text-sm font-medium text-[#374151]">
                        Club Name
                      </label>
                      <Input
                        name="clubName"
                        value={profileForm.clubName || ""}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  {!isEditingProfile ? (
                    <Button
                      onClick={() => setIsEditingProfile(true)}
                      className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={profileSaving}
                      className="bg-[#10B981] hover:bg-[#059669] text-white flex-1"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {profileSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  )}

                  <Button
                    onClick={handleDeleteProfile}
                    disabled={profileSaving}
                    className="bg-red-600 hover:bg-red-700 text-white flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Deactivate
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}