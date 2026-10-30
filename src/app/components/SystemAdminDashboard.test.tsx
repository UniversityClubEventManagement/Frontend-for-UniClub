import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SystemAdminDashboard } from "./SystemAdminDashboard";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../lib/api";

vi.mock("../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../lib/api", () => ({
  apiFetch: vi.fn(),
}));

const mockUseAuth = vi.mocked(useAuth);
const mockApiFetch = vi.mocked(apiFetch);
const adminUser = {
  _id: "admin-1",
  name: "System Admin",
  email: "admin@example.edu",
  role: "system-admin",
};

const requests = [
  {
    _id: "event-1",
    title: "Robotics Workshop",
    category: "Workshop",
    date: "2026-11-15T00:00:00.000Z",
    startTime: "10:00",
    location: "Innovation Hall",
    clubName: "Robotics Club",
    attendees: 25,
    status: "pending" as const,
    createdBy: { name: "Club Admin", email: "club@example.edu" },
  },
  {
    _id: "event-2",
    title: "Art Showcase",
    category: "Arts",
    date: "2026-11-20T00:00:00.000Z",
    startTime: "14:00",
    location: "Gallery",
    clubName: "Art Club",
    attendees: 40,
    status: "pending" as const,
    createdBy: { name: "Club Admin", email: "club@example.edu" },
  },
];

const clubs = [
  {
    clubName: "Robotics Club",
    members: 18,
    activeEvents: 2,
    status: "active" as const,
    president: "Ada Lovelace",
    presidentEmail: "ada@example.edu",
  },
  {
    clubName: "Art Club",
    members: 12,
    activeEvents: 1,
    status: "inactive" as const,
    president: "Grace Hopper",
    presidentEmail: "grace@example.edu",
  },
];

const conflicts = [
  {
    id: "conflict-1",
    event1Id: "event-1",
    event2Id: "event-2",
    event1: "Robotics Workshop",
    event2: "Art Showcase",
    location: "Innovation Hall",
    date: "2026-11-15T00:00:00.000Z",
    time: "10:00",
  },
];

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

function renderDashboard(user: ReturnType<typeof useAuth>["user"] = adminUser) {
  mockUseAuth.mockReturnValue({
    user,
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  });
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="*" element={<><SystemAdminDashboard /><LocationDisplay /></>} />
      </Routes>
    </MemoryRouter>,
  );
}

function getStatValue(label: string) {
  const labelElement = screen.getByText(label);
  return labelElement.parentElement?.querySelectorAll("p")[1]?.textContent;
}

describe("SystemAdminDashboard", () => {
  let currentConflicts = conflicts;

  beforeEach(() => {
    vi.clearAllMocks();
    currentConflicts = conflicts;
    mockUseAuth.mockReturnValue({
      user: adminUser,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });
    mockApiFetch.mockImplementation(async (path) => {
      switch (path) {
        case "/api/admin/stats":
          return {
            totalClubs: 2,
            totalMembers: 30,
            pendingRequests: 2,
            approvedEvents: 5,
            conflictCount: 1,
          };
        case "/api/admin/events/pending":
          return requests;
        case "/api/admin/clubs":
          return clubs;
        case "/api/admin/conflicts":
          return currentConflicts;
        default:
          if (path === "/api/admin/conflicts/event-1/resolve") {
            currentConflicts = [];
          }
          return { message: "Conflict resolved successfully." };
      }
    });
  });

  it("loads admin stats and pending event requests", async () => {
    renderDashboard();

    expect(await screen.findByText("Robotics Workshop")).toBeInTheDocument();
    expect(screen.getByText("Art Showcase")).toBeInTheDocument();
    expect(getStatValue("Total Clubs")).toBe("2");
    expect(getStatValue("Pending Requests")).toBe("2");
    expect(mockApiFetch).toHaveBeenCalledWith("/api/admin/stats");
    expect(mockApiFetch).toHaveBeenCalledWith("/api/admin/events/pending");
    expect(mockApiFetch).toHaveBeenCalledWith("/api/admin/clubs");
    expect(mockApiFetch).toHaveBeenCalledWith("/api/admin/conflicts");
  });

  it("shows a clear error when the admin data cannot be loaded", async () => {
    mockApiFetch.mockRejectedValue(new Error("Service unavailable"));

    renderDashboard();

    expect(await screen.findByText("Service unavailable")).toBeInTheDocument();
  });

  it("redirects users who are not system admins", async () => {
    renderDashboard({ ...adminUser, role: "student" });

    await waitFor(() => {
      expect(screen.getByTestId("location")).toHaveTextContent("/student");
    });
    expect(mockApiFetch).not.toHaveBeenCalled();
  });

  it("approves a request, removes it, updates the pending count, and confirms success", async () => {
    renderDashboard();
    await screen.findByText("Robotics Workshop");

    fireEvent.click(screen.getAllByRole("button", { name: /approve/i })[0]);

    expect(await screen.findByText("Event approved successfully.")).toBeInTheDocument();
    expect(screen.queryByText("Robotics Workshop")).not.toBeInTheDocument();
    expect(getStatValue("Pending Requests")).toBe("1");
    expect(getStatValue("Approved Events")).toBe("6");
    expect(mockApiFetch).toHaveBeenCalledWith("/api/admin/events/event-1/status", {
      method: "PUT",
      body: JSON.stringify({ status: "approved" }),
    });
  });

  it("rejects a request and displays failures from the status update", async () => {
    renderDashboard();
    await screen.findByText("Robotics Workshop");
    mockApiFetch.mockRejectedValueOnce(new Error("Update failed"));

    fireEvent.click(screen.getAllByRole("button", { name: /reject/i })[0]);

    expect(await screen.findByText("Update failed")).toBeInTheDocument();
    expect(screen.getByText("Robotics Workshop")).toBeInTheDocument();
  });

  it("filters requests, clubs, and conflicts using the search field", async () => {
    renderDashboard();
    await screen.findByText("Robotics Workshop");

    fireEvent.change(screen.getByPlaceholderText("Search events, clubs, or locations..."), {
      target: { value: "Art" },
    });
    expect(screen.queryByText("Robotics Workshop")).not.toBeInTheDocument();
    expect(screen.getByText("Art Showcase")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Clubs" }));
    expect(screen.getByText("Art Club")).toBeInTheDocument();
    expect(screen.queryByText("Robotics Club")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Conflicts" }));
    expect(screen.getByText("Art Showcase")).toBeInTheDocument();
    expect(screen.queryByText("Robotics Workshop")).not.toBeInTheDocument();
  });

  it("registers a club with the provided admin details", async () => {
    renderDashboard();
    await screen.findByText("Robotics Workshop");
    fireEvent.click(screen.getByRole("button", { name: "Register New Club" }));

    fireEvent.change(screen.getByLabelText("Club Name"), { target: { value: "  Chess Club  " } });
    fireEvent.change(screen.getByLabelText("Club Admin Name"), { target: { value: "  Taylor  " } });
    fireEvent.change(screen.getByLabelText("Club Admin Email"), { target: { value: "taylor@example.edu" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "StrongPass1!" } });
    mockApiFetch.mockResolvedValueOnce({ message: "Created" });
    fireEvent.click(screen.getByRole("button", { name: "Register Club" }));

    expect(await screen.findByText("Club registered successfully.")).toBeInTheDocument();
    expect(mockApiFetch).toHaveBeenCalledWith("/api/admin/clubs", {
      method: "POST",
      body: JSON.stringify({
        clubName: "Chess Club",
        adminName: "Taylor",
        adminEmail: "taylor@example.edu",
        password: "StrongPass1!",
      }),
    });
    await waitFor(() => expect(mockApiFetch).toHaveBeenCalledTimes(9));
    expect(screen.queryByLabelText("Club Name")).not.toBeInTheDocument();
  });

  it("resolves a conflict and reloads admin data", async () => {
    const user = userEvent.setup();
    renderDashboard();
    await screen.findByText("Robotics Workshop");
    const clubsTab = screen.getByRole("tab", { name: "Clubs" });
    await user.click(clubsTab);
    await waitFor(() => {
      expect(clubsTab).toHaveAttribute("aria-selected", "true");
    });
    const conflictsTab = screen.getByRole("tab", { name: "Conflicts" });
    await user.click(conflictsTab);
    await waitFor(() => {
      expect(conflictsTab).toHaveAttribute("aria-selected", "true");
    });
    await user.click(screen.getByRole("button", { name: "Resolve" }));

    expect(await screen.findByText("Conflict resolved successfully.")).toBeInTheDocument();
    expect(mockApiFetch).toHaveBeenCalledWith("/api/admin/conflicts/event-1/resolve", { method: "POST" });
    await waitFor(() => {
      expect(mockApiFetch).toHaveBeenCalledTimes(9);
    });
  });
});
