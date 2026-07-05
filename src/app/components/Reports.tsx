import { Download, Calendar, TrendingUp } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";

// Mock data for charts
const participationData = [
  { month: "Sep", events: 12, participants: 450 },
  { month: "Oct", events: 15, participants: 580 },
  { month: "Nov", events: 18, participants: 720 },
  { month: "Dec", events: 10, participants: 380 },
  { month: "Jan", events: 14, participants: 520 },
  { month: "Feb", events: 16, participants: 640 },
];

const venueUsageData = [
  { name: "Engineering Bldg", value: 35, color: "#1E3A8A" },
  { name: "Student Center", value: 28, color: "#0D9488" },
  { name: "Arts Building", value: 18, color: "#10B981" },
  { name: "Sports Complex", value: 12, color: "#F59E0B" },
  { name: "Library", value: 7, color: "#6B7280" },
];

const clubActivityData = [
  { club: "CS Club", events: 12, members: 125 },
  { club: "Business Society", events: 10, members: 98 },
  { club: "Volunteer Club", events: 8, members: 76 },
  { club: "Photography Club", events: 6, members: 45 },
  { club: "Music Club", events: 5, members: 62 },
  { club: "Drama Club", events: 4, members: 52 },
];

export function Reports() {
  const [dateFilter, setDateFilter] = useState({
    from: "2025-09-01",
    to: "2026-02-28"
  });

  const totalEvents = participationData.reduce((sum, item) => sum + item.events, 0);
  const totalParticipants = participationData.reduce((sum, item) => sum + item.participants, 0);
  const avgParticipation = Math.round(totalParticipants / totalEvents);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl text-[#1E3A8A] mb-2">Reports & Analytics</h2>
            <p className="text-[#6B7280]">Track event performance and club activities</p>
          </div>
          <Button className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Date Filter */}
      <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateFrom" className="text-[#1F2937]">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                value={dateFilter.from}
                onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="dateTo" className="text-[#1F2937]">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                value={dateFilter.to}
                onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
              />
            </div>
          </div>
          <Button className="bg-[#0D9488] hover:bg-[#0F766E] text-white">
            Apply Filter
          </Button>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Total Events</p>
              <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">{totalEvents}</p>
              <p className="text-xs text-[#10B981] mt-1">+12% from last period</p>
            </div>
            <div className="bg-[#DBEAFE] p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-[#1E3A8A]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Total Participants</p>
              <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">{totalParticipants.toLocaleString()}</p>
              <p className="text-xs text-[#10B981] mt-1">+18% from last period</p>
            </div>
            <div className="bg-[#CCFBF1] p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-[#0D9488]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Avg Participation</p>
              <p className="text-2xl sm:text-3xl font-semibold text-[#1F2937]">{avgParticipation}</p>
              <p className="text-xs text-[#10B981] mt-1">+5% from last period</p>
            </div>
            <div className="bg-[#D1FAE5] p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-[#10B981]" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Participation Trend */}
        <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Participation Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={participationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="participants" 
                stroke="#1E3A8A" 
                strokeWidth={2}
                name="Participants"
              />
              <Line 
                type="monotone" 
                dataKey="events" 
                stroke="#0D9488" 
                strokeWidth={2}
                name="Events"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Venue Usage */}
        <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Venue Usage Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={venueUsageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {venueUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Club Activity Statistics */}
      <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Club Activity Statistics</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={clubActivityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="club" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="events" fill="#1E3A8A" name="Events Hosted" />
            <Bar dataKey="members" fill="#0D9488" name="Members" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Club Statistics Table */}
      <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] mt-6 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#1F2937]">Detailed Club Statistics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Club Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Events
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Members
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Avg Attendance
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Activity Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E5E7EB]">
              {clubActivityData.map((club, index) => (
                <tr key={index} className="hover:bg-[#F9FAFB]">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1F2937]">
                    {club.club}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                    {club.events}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                    {club.members}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                    {Math.round(club.members * 0.6)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#E5E7EB] rounded-full h-2 max-w-20">
                        <div
                          className="bg-[#10B981] h-2 rounded-full"
                          style={{ width: `${(club.events / 15) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-[#6B7280]">
                        {Math.round((club.events / 15) * 100)}%
                      </span>
                    </div>
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
