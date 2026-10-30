import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StudentProfile } from "./StudentProfile";
import { useAuth } from "../contexts/AuthContext";

vi.mock("../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = vi.mocked(useAuth);
const noOp = vi.fn();

function authState(user: ReturnType<typeof useAuth>["user"], loading = false) {
  return {
    user,
    loading,
    login: noOp,
    register: noOp,
    logout: noOp,
  };
}

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

function renderProfile(initialEntry = "/student/profile") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/login" element={<LocationDisplay />} />
        <Route path="/" element={<LocationDisplay />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("StudentProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a loading message while authentication is loading", () => {
    mockUseAuth.mockReturnValue(authState(null, true));

    renderProfile();

    expect(screen.getByText("Loading profile…")).toBeInTheDocument();
  });

  it("shows student details and formats the academic year and initials", () => {
    mockUseAuth.mockReturnValue(authState({
        _id: "student-1",
        name: "Ada Lovelace",
        email: "ada@example.edu",
        role: "student",
        studentRegistrationNumber: "STU-001",
        department: "Computer Science",
        academicYear: "2",
      }));

    renderProfile();

    expect(screen.getByRole("heading", { name: "Ada Lovelace" })).toBeInTheDocument();
    expect(screen.getByText("AL")).toBeInTheDocument();
    expect(screen.getByText("ada@example.edu")).toBeInTheDocument();
    expect(screen.getByText("STU-001")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("Year 2")).toBeInTheDocument();
  });

  it("shows a fallback for missing optional profile details", () => {
    mockUseAuth.mockReturnValue(authState({
        _id: "student-2",
        name: "Grace",
        email: "grace@example.edu",
        role: "student",
      }));

    renderProfile();

    expect(screen.getByText("G")).toBeInTheDocument();
    expect(screen.getAllByText("Not provided")).toHaveLength(3);
  });

  it("redirects unauthenticated users to login", () => {
    mockUseAuth.mockReturnValue(authState(null));

    renderProfile();

    expect(screen.getByTestId("location")).toHaveTextContent("/login");
  });

  it("redirects users who are not students to the home page", () => {
    mockUseAuth.mockReturnValue(authState({
        _id: "admin-1",
        name: "Admin",
        email: "admin@example.edu",
        role: "system-admin",
      }));

    renderProfile();

    expect(screen.getByTestId("location")).toHaveTextContent("/");
  });
});
