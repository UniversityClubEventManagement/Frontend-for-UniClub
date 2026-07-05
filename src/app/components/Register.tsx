import { GraduationCap, ChevronRight, ChevronLeft } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    faculty: "",
    department: "",
    academicYear: "",
    clubName: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(formData);
      const dashboardRoute = formData.role === "club-admin" ? "/club-admin" : formData.role === "system-admin" ? "/system-admin" : "/student";
      navigate(dashboardRoute);
    } catch (err) {
      setError((err as Error).message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* University Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="bg-[#1E3A8A] p-3 rounded-xl">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-[#1E3A8A] mb-1">UniClub</h1>
          <p className="text-[#6B7280]">Create Your Account</p>
        </div>

        {/* Registration Card */}
        <Card className="bg-white rounded-lg shadow-lg border border-[#E5E7EB] p-8">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${step === 1 ? 'text-[#1E3A8A] font-medium' : 'text-[#9CA3AF]'}`}>
                Step 1: Basic Info
              </span>
              <span className={`text-sm ${step === 2 ? 'text-[#1E3A8A] font-medium' : 'text-[#9CA3AF]'}`}>
                Step 2: Details
              </span>
            </div>
            <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#1E3A8A] transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-[#FEE2E2] border border-[#FECACA] p-3 text-sm text-[#B91C1C] mb-4">
                {error}
              </div>
            )}
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-[#1F2937]">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-[#1F2937]">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@university.edu"
                    className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-[#1F2937]">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-[#1F2937]">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label className="text-[#1F2937] mb-2 block">Role</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange("role", "student")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.role === "student"
                          ? "border-[#1E3A8A] bg-[#DBEAFE]"
                          : "border-[#E5E7EB] hover:border-[#1E3A8A]"
                      }`}
                    >
                      <div className="text-sm font-medium text-[#1F2937]">Student</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange("role", "club-admin")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.role === "club-admin"
                          ? "border-[#1E3A8A] bg-[#DBEAFE]"
                          : "border-[#E5E7EB] hover:border-[#1E3A8A]"
                      }`}
                    >
                      <div className="text-sm font-medium text-[#1F2937]">Club Admin</div>
                    </button>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white"
                  disabled={!formData.role}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Additional Details */}
            {step === 2 && (
              <div className="space-y-4">
                {formData.role === "student" && (
                  <>
                    <div>
                      <Label htmlFor="faculty" className="text-[#1F2937]">Faculty</Label>
                      <select
                        id="faculty"
                        className="mt-1 w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[#1F2937]"
                        value={formData.faculty}
                        onChange={(e) => handleInputChange("faculty", e.target.value)}
                        required
                      >
                        <option value="">Select Faculty</option>
                        <option value="engineering">Engineering</option>
                        <option value="science">Science</option>
                        <option value="arts">Arts</option>
                        <option value="business">Business</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="department" className="text-[#1F2937]">Department</Label>
                      <Input
                        id="department"
                        type="text"
                        placeholder="e.g., Computer Science"
                        className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                        value={formData.department}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="academicYear" className="text-[#1F2937]">Academic Year</Label>
                      <select
                        id="academicYear"
                        className="mt-1 w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[#1F2937]"
                        value={formData.academicYear}
                        onChange={(e) => handleInputChange("academicYear", e.target.value)}
                        required
                      >
                        <option value="">Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>
                  </>
                )}

                {formData.role === "club-admin" && (
                  <div>
                    <Label htmlFor="clubName" className="text-[#1F2937]">Club Name</Label>
                    <Input
                      id="clubName"
                      type="text"
                      placeholder="e.g., Computer Science Club"
                      className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                      value={formData.clubName}
                      onChange={(e) => handleInputChange("clubName", e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 border-[#E5E7EB] text-[#1F2937]"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B7280]">
              Already have an account?{" "}
              <Link to="/login" className="text-[#1E3A8A] hover:text-[#1E40AF] font-medium">
                Login here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
