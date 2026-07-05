import { Outlet, NavLink, useNavigate } from "react-router";
import { GraduationCap, User, Users, Settings, LogOut } from "lucide-react";
import { NotificationsPanel } from "./NotificationsPanel";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";

export function RootLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#1E3A8A] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8" />
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-white">UniClub</h1>
                <p className="text-xs sm:text-sm text-blue-100">Event Management Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <NotificationsPanel />

              {user && (
                <Button
                  variant="ghost"
                  className="hidden sm:inline-flex items-center gap-2 text-blue-100 hover:text-white"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              )}
              
              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {user?.role === "student" && (
                  <NavLink
                    to="/student"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#0D9488] text-white"
                          : "text-blue-100 hover:bg-blue-800"
                      }`
                    }
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">Student</span>
                  </NavLink>
                )}
                {user?.role === "club-admin" && (
                  <NavLink
                    to="/club-admin"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#0D9488] text-white"
                          : "text-blue-100 hover:bg-blue-800"
                      }`
                    }
                  >
                    <Users className="w-4 h-4" />
                    <span className="hidden lg:inline">Club Admin</span>
                  </NavLink>
                )}
                {user?.role === "system-admin" && (
                  <NavLink
                    to="/system-admin"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#0D9488] text-white"
                          : "text-blue-100 hover:bg-blue-800"
                      }`
                    }
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden lg:inline">System Admin</span>
                  </NavLink>
                )}
              </nav>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <nav className="md:hidden flex justify-around mt-3 gap-2">
            {user?.role === "student" && (
              <NavLink
                to="/student"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-2 rounded-lg flex-1 transition-colors ${
                    isActive
                      ? "bg-[#0D9488] text-white"
                      : "text-blue-100 hover:bg-blue-800"
                  }`
                }
              >
                <User className="w-4 h-4" />
                <span className="text-xs">Student</span>
              </NavLink>
            )}
            {user?.role === "club-admin" && (
              <NavLink
                to="/club-admin"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-2 rounded-lg flex-1 transition-colors ${
                    isActive
                      ? "bg-[#0D9488] text-white"
                      : "text-blue-100 hover:bg-blue-800"
                  }`
                }
              >
                <Users className="w-4 h-4" />
                <span className="text-xs">Club</span>
              </NavLink>
            )}
            {user?.role === "system-admin" && (
              <NavLink
                to="/system-admin"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-2 rounded-lg flex-1 transition-colors ${
                    isActive
                      ? "bg-[#0D9488] text-white"
                      : "text-blue-100 hover:bg-blue-800"
                  }`
                }
              >
                <Settings className="w-4 h-4" />
                <span className="text-xs">Admin</span>
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}