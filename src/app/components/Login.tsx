import { GraduationCap } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login({ email, password });
      const targetRoute = response.user?.role === "club-admin"
        ? "/club-admin"
        : response.user?.role === "system-admin"
        ? "/system-admin"
        : "/student";
      navigate(targetRoute);
    } catch (err) {
      setError((err as Error).message || "Unable to login");
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
          <p className="text-[#6B7280]">Event Management Platform</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white rounded-lg shadow-lg border border-[#E5E7EB] p-8">
          <h2 className="text-2xl font-semibold text-[#1F2937] mb-6 text-center">Welcome Back</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-md bg-[#FEE2E2] border border-[#FECACA] p-3 text-sm text-[#B91C1C]">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="email" className="text-[#1F2937]">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@university.edu"
                className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-[#1F2937]">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="mt-1 bg-[#F9FAFB] border-[#E5E7EB]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-[#6B7280]">
                <input type="checkbox" className="mr-2 rounded border-[#E5E7EB]" />
                Remember me
              </label>
              <a href="#" className="text-[#1E3A8A] hover:text-[#1E40AF]">
                Forgot password?
              </a>
            </div>

            <Button 
              type="submit"
              className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-[#6B7280]">
              Don't have an account?{" "}
              <Link to="/create-account" className="text-[#1E3A8A] hover:text-[#1E40AF] font-medium">
                Register here
              </Link>
            </p>
            <Link
              to="/create-account"
              className="inline-flex items-center justify-center rounded-lg bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E40AF]"
            >
              Create Account
            </Link>
            <p className="text-sm text-[#6B7280]">
              Already have an account?{" "}
              <Link to="/login" className="text-[#1E3A8A] hover:text-[#1E40AF] font-medium">
                Login here
              </Link>
            </p>
          </div>
        </Card>

        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          © 2026 University. All rights reserved.
        </p>
      </div>
    </div>
  );
}
