import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { StudentDashboard } from "./components/StudentDashboard";
import { ClubAdminDashboard } from "./components/ClubAdminDashboard";
import { SystemAdminDashboard } from "./components/SystemAdminDashboard";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { EventDetail } from "./components/EventDetail";
import { MyEvents } from "./components/MyEvents";
import { CreateEvent } from "./components/CreateEvent";
import { VolunteerManagement } from "./components/VolunteerManagement";
import { ResourceRequest } from "./components/ResourceRequest";
import { CalendarView } from "./components/CalendarView";
import { Reports } from "./components/Reports";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Login },
      { path: "student", Component: StudentDashboard },
      { path: "events/:eventId", Component: EventDetail },
      { path: "my-events", Component: MyEvents },
      { path: "club-admin", Component: ClubAdminDashboard },
      { path: "create-event", Component: CreateEvent },
      { path: "volunteers", Component: VolunteerManagement },
      { path: "resource-request", Component: ResourceRequest },
      { path: "system-admin", Component: SystemAdminDashboard },
      { path: "calendar", Component: CalendarView },
      { path: "reports", Component: Reports },
      { path: "create-account", Component: Register },
    ],
  },
]);