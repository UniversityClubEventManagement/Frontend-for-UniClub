import { Send, Calendar, FileText } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface Request {
  id: number;
  event: string;
  resourceType: string;
  date: string;
  time: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
}

const mockRequests: Request[] = [
  {
    id: 1,
    event: "Tech Talk: AI Development",
    resourceType: "Photography",
    date: "2026-03-05",
    time: "18:00",
    status: "approved",
    submittedDate: "2026-02-20"
  },
  {
    id: 2,
    event: "Hackathon 2026",
    resourceType: "Venue",
    date: "2026-04-15",
    time: "09:00",
    status: "pending",
    submittedDate: "2026-02-25"
  },
];

export function ResourceRequest() {
  const [formData, setFormData] = useState({
    event: "",
    resourceType: "",
    date: "",
    time: "",
    details: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Resource request submitted successfully!");
    setFormData({
      event: "",
      resourceType: "",
      date: "",
      time: "",
      details: "",
    });
  };

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl text-[#1E3A8A] mb-2">Resource Requests</h2>
        <p className="text-[#6B7280]">Request venue, photography, or video services for your events</p>
      </div>

      {/* New Request Form */}
      <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 mb-6">
        <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Submit New Request</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="event" className="text-[#1F2937]">Select Event *</Label>
            <select
              id="event"
              className="mt-1 w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[#1F2937]"
              value={formData.event}
              onChange={(e) => handleInputChange("event", e.target.value)}
              required
            >
              <option value="">Choose an event</option>
              <option value="Tech Talk: AI Development">Tech Talk: AI Development</option>
              <option value="Hackathon 2026">Hackathon 2026</option>
              <option value="Coding Bootcamp">Coding Bootcamp for Beginners</option>
            </select>
          </div>

          <div>
            <Label htmlFor="resourceType" className="text-[#1F2937]">Resource Type *</Label>
            <select
              id="resourceType"
              className="mt-1 w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[#1F2937]"
              value={formData.resourceType}
              onChange={(e) => handleInputChange("resourceType", e.target.value)}
              required
            >
              <option value="">Select resource type</option>
              <option value="Venue">Venue</option>
              <option value="Photography">Photography</option>
              <option value="Video">Video Recording</option>
              <option value="Audio">Audio Equipment</option>
              <option value="Projector">Projector</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-[#1F2937]">Date *</Label>
              <Input
                id="date"
                type="date"
                className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="time" className="text-[#1F2937]">Time *</Label>
              <Input
                id="time"
                type="time"
                className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="details" className="text-[#1F2937]">Additional Details *</Label>
            <Textarea
              id="details"
              placeholder="Provide specific requirements, preferences, or special instructions..."
              className="mt-1 bg-[#F9FAFB] border-[#E5E7EB] min-h-24"
              value={formData.details}
              onChange={(e) => handleInputChange("details", e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Request
          </Button>
        </form>
      </Card>

      {/* Previous Requests */}
      <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#1F2937]">Request History</h3>
        </div>

        <div className="divide-y divide-[#E5E7EB]">
          {mockRequests.map((request) => (
            <div key={request.id} className="p-4 sm:p-6 hover:bg-[#F9FAFB] transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-[#1F2937] mb-1">{request.event}</h4>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {getStatusBadge(request.status)}
                        <Badge className="bg-[#DBEAFE] text-[#1E3A8A] border-0">
                          {request.resourceType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#6B7280]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#1E3A8A]" />
                      <span>
                        {new Date(request.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })} at {request.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#1E3A8A]" />
                      <span>
                        Submitted {new Date(request.submittedDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-[#E5E7EB] text-[#1F2937]">
                    View Details
                  </Button>
                  {request.status === "pending" && (
                    <Button variant="outline" size="sm" className="border-[#EF4444] text-[#EF4444]">
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
