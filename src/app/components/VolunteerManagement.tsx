import { Users, UserPlus, Search } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface Volunteer {
  id: number;
  name: string;
  email: string;
  role: string;
  event: string;
}

const mockVolunteers: Volunteer[] = [
  { id: 1, name: "Alice Johnson", email: "alice.j@university.edu", role: "Registration Desk", event: "Tech Talk: AI Development" },
  { id: 2, name: "Bob Smith", email: "bob.s@university.edu", role: "Technical Support", event: "Tech Talk: AI Development" },
  { id: 3, name: "Carol White", email: "carol.w@university.edu", role: "Event Coordinator", event: "Hackathon 2026" },
];

const availableStudents = [
  { id: 101, name: "David Chen", email: "david.c@university.edu" },
  { id: 102, name: "Emma Davis", email: "emma.d@university.edu" },
  { id: 103, name: "Frank Wilson", email: "frank.w@university.edu" },
];

export function VolunteerManagement() {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAssign = () => {
    if (selectedEvent && selectedStudent && selectedRole) {
      alert("Volunteer assigned successfully!");
      setSelectedStudent("");
      setSelectedRole("");
    }
  };

  const filteredVolunteers = mockVolunteers.filter(v =>
    selectedEvent === "" || v.event === selectedEvent
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl text-[#1E3A8A] mb-2">Volunteer Management</h2>
        <p className="text-[#6B7280]">Assign and manage event volunteers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Total Volunteers</p>
              <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">{mockVolunteers.length}</p>
            </div>
            <div className="bg-[#CCFBF1] p-3 rounded-lg">
              <Users className="w-6 h-6 text-[#0D9488]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Active Events</p>
              <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">2</p>
            </div>
            <div className="bg-[#DBEAFE] p-3 rounded-lg">
              <UserPlus className="w-6 h-6 text-[#1E3A8A]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Available Students</p>
              <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">{availableStudents.length}</p>
            </div>
            <div className="bg-[#D1FAE5] p-3 rounded-lg">
              <Users className="w-6 h-6 text-[#10B981]" />
            </div>
          </div>
        </Card>
      </div>

      {/* Assign New Volunteer */}
      <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 mb-6">
        <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Assign New Volunteer</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="event" className="text-[#1F2937]">Select Event</Label>
            <select
              id="event"
              className="mt-1 w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[#1F2937]"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              <option value="">Choose an event</option>
              <option value="Tech Talk: AI Development">Tech Talk: AI Development</option>
              <option value="Hackathon 2026">Hackathon 2026</option>
              <option value="Coding Bootcamp">Coding Bootcamp</option>
            </select>
          </div>

          <div>
            <Label htmlFor="student" className="text-[#1F2937]">Select Student</Label>
            <select
              id="student"
              className="mt-1 w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[#1F2937]"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">Choose a student</option>
              {availableStudents.map(student => (
                <option key={student.id} value={student.name}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="role" className="text-[#1F2937]">Assign Role</Label>
            <select
              id="role"
              className="mt-1 w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[#1F2937]"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Choose a role</option>
              <option value="Registration Desk">Registration Desk</option>
              <option value="Technical Support">Technical Support</option>
              <option value="Event Coordinator">Event Coordinator</option>
              <option value="Photography">Photography</option>
              <option value="Hospitality">Hospitality</option>
            </select>
          </div>
        </div>

        <Button
          onClick={handleAssign}
          className="mt-4 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white"
          disabled={!selectedEvent || !selectedStudent || !selectedRole}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Assign Volunteer
        </Button>
      </Card>

      {/* Current Volunteers List */}
      <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#E5E7EB]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-[#1F2937]">Current Volunteers</h3>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] w-4 h-4" />
                <Input
                  placeholder="Search volunteers..."
                  className="pl-9 bg-[#F9FAFB] border-[#E5E7EB] w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <select
                className="px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[#1F2937] text-sm"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
              >
                <option value="">All Events</option>
                <option value="Tech Talk: AI Development">Tech Talk: AI Development</option>
                <option value="Hackathon 2026">Hackathon 2026</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider hidden md:table-cell">
                  Email
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">
                  Event
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E5E7EB]">
              {filteredVolunteers.map((volunteer) => (
                <tr key={volunteer.id} className="hover:bg-[#F9FAFB]">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#1F2937]">{volunteer.name}</div>
                    <div className="text-xs text-[#6B7280] md:hidden">{volunteer.email}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-[#6B7280] hidden md:table-cell">
                    {volunteer.email}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-[#DBEAFE] text-[#1E3A8A] border-0">
                      {volunteer.role}
                    </Badge>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-[#6B7280] hidden lg:table-cell">
                    {volunteer.event}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                    <Button variant="ghost" size="sm" className="text-[#EF4444]">
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
