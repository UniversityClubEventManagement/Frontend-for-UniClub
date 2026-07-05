import { Calendar, Upload, Save, Send } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { apiFetch } from "../lib/api";

interface FormData {
  title: string;
  category: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  registrationLimit: string;
  registrationDeadline: string;
  bannerUrl: string;
}

export function CreateEvent() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    registrationLimit: "",
    registrationDeadline: "",
    bannerUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const event = await apiFetch(`/api/events/${eventId}`);
        setFormData({
          title: event.title || "",
          category: event.category || "",
          description: event.description || "",
          date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
          startTime: event.startTime || "",
          endTime: event.endTime || "",
          location: event.location || "",
          registrationLimit: String(event.registrationLimit || ""),
          registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().split("T")[0] : "",
          bannerUrl: event.bannerUrl || "",
        });
      } catch (err) {
        console.error(err);
        setError((err as Error).message || "Unable to load event details");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const submitEvent = async (stayOnPage = false) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...formData,
        registrationLimit: Number(formData.registrationLimit) || 0,
      };

      if (eventId) {
        await apiFetch(`/api/events/${eventId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setSuccess("Event updated successfully.");
      } else {
        await apiFetch("/api/events", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccess("Event submitted for approval.");
      }

      if (!stayOnPage) {
        navigate("/club-admin");
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Unable to save event");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    await submitEvent(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitEvent();
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl text-[#1E3A8A] mb-2">{eventId ? "Edit Event" : "Create New Event"}</h2>
        <p className="text-[#6B7280]">Fill in the details below to submit your event for approval.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Basic Information</h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-[#1F2937]">Event Title *</Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., Tech Talk: AI in Development"
                className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-[#1F2937]">Category *</Label>
              <select
                id="category"
                className="mt-1 w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[#1F2937]"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="Workshop">Workshop</option>
                <option value="Social">Social</option>
                <option value="Competition">Competition</option>
                <option value="Seminar">Seminar</option>
                <option value="Fundraiser">Fundraiser</option>
                <option value="Exhibition">Exhibition</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="description" className="text-[#1F2937]">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of your event..."
                className="mt-1 bg-[#F9FAFB] border-[#E5E7EB] min-h-32"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                required
              />
            </div>
          </div>
        </Card>

        <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Schedule</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="date" className="text-[#1F2937]">Event Date *</Label>
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
              <Label htmlFor="startTime" className="text-[#1F2937]">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                value={formData.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="endTime" className="text-[#1F2937]">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                value={formData.endTime}
                onChange={(e) => handleInputChange("endTime", e.target.value)}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="location" className="text-[#1F2937]">Location *</Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., Engineering Building - Room 301"
                className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
              />
            </div>
          </div>
        </Card>

        <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Event Poster</h3>
          <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-8 text-center hover:border-[#1E3A8A] transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-[#6B7280] mx-auto mb-3" />
            <p className="text-sm text-[#1F2937] mb-1">
              <span className="text-[#1E3A8A] font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-[#6B7280]">PNG, JPG up to 5MB</p>
          </div>
          <div className="mt-4">
            <Label htmlFor="bannerUrl" className="text-[#1F2937]">Banner URL</Label>
            <Input
              id="bannerUrl"
              type="url"
              placeholder="https://example.com/banner.jpg"
              className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
              value={formData.bannerUrl}
              onChange={(e) => handleInputChange("bannerUrl", e.target.value)}
            />
          </div>
        </Card>

        <Card className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Registration Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="registrationLimit" className="text-[#1F2937]">Registration Limit *</Label>
              <Input
                id="registrationLimit"
                type="number"
                placeholder="e.g., 100"
                className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                value={formData.registrationLimit}
                onChange={(e) => handleInputChange("registrationLimit", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="registrationDeadline" className="text-[#1F2937]">Registration Deadline *</Label>
              <Input
                id="registrationDeadline"
                type="date"
                className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                value={formData.registrationDeadline}
                onChange={(e) => handleInputChange("registrationDeadline", e.target.value)}
                required
              />
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-[#E5E7EB] text-[#1F2937]"
            onClick={handleSaveDraft}
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            Save as Draft
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white"
            disabled={loading}
          >
            <Send className="w-4 h-4 mr-2" />
            {eventId ? "Update Event" : "Submit for Approval"}
          </Button>
        </div>
      </form>
    </div>
  );
}
