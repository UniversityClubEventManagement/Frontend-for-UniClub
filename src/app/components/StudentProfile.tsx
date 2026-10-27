import { BookOpen, GraduationCap, Hash, Mail, UserRound } from "lucide-react";
import { Card } from "./ui/card";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router";

const displayValue = (value?: string) => value?.trim() || "Not provided";

export function StudentProfile() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center text-[#6B7280]">Loading profile…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "student") return <Navigate to="/" replace />;

  const initials = user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const details = [
    { label: "Full Name", value: user.name, icon: UserRound },
    { label: "Email Address", value: user.email, icon: Mail },
    { label: "Registration Number", value: user.studentRegistrationNumber, icon: Hash },
    { label: "Department", value: user.department, icon: BookOpen },
    { label: "Academic Year", value: user.academicYear ? `Year ${user.academicYear}` : undefined, icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Card className="overflow-hidden bg-white border border-[#E5E7EB] shadow-sm">
          <div className="bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] px-6 py-8 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#0D9488] flex items-center justify-center text-2xl font-semibold border-4 border-white/30">
                {initials || "S"}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-semibold text-white">{user.name}</h2>
                <p className="text-blue-100">Student Profile</p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {details.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-start gap-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                  <div className="rounded-lg bg-[#DBEAFE] p-2">
                    <Icon className="w-5 h-5 text-[#1E3A8A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#6B7280]">{label}</p>
                    <p className="font-medium text-[#1F2937] break-words">{displayValue(value)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
