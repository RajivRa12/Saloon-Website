import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const sections = [
  { key: "dashboard", label: "Dashboard" },
  { key: "bookings", label: "Bookings" },
  { key: "customers", label: "Customers" },
  { key: "staff", label: "Staff" },
  { key: "services", label: "Services" },
  { key: "notifications", label: "Notifications & Reminders" },
  { key: "settings", label: "Settings" },
  { key: "useraccess", label: "User Access Management" },
  { key: "reports", label: "Reports & Analytics" },
  { key: "reviews", label: "Reviews & Feedback" },
];

const SectionContent: React.FC<{ section: string }> = ({ section }) => {
  switch (section) {
    case "dashboard":
      return (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-8">
          <div className="mb-4 p-4 bg-gradient-to-r from-rose-100 to-purple-100 border-l-4 border-rose-400 rounded">
            <strong>AI Insight:</strong> Your bookings are up 12% this week. Peak hours: 4-6pm. Most popular service: Hair Spa.
          </div>
          <h1 className="text-2xl font-bold mb-4 text-rose-600">Dashboard Overview</h1>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Quick stats: bookings, revenue, upcoming appointments, etc.</li>
            <li>Recent activity feed</li>
          </ul>
          <div className="mt-4 text-gray-400">(Feature coming soon)</div>
        </div>
      );
    case "bookings":
      return (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-8">
          <div className="mb-4 p-4 bg-gradient-to-r from-rose-100 to-purple-100 border-l-4 border-rose-400 rounded">
            <strong>AI Suggestion:</strong> 3 appointments are at risk of no-show based on past behavior. 2 bookings overlap, check staff assignments.
          </div>
          <h1 className="text-2xl font-bold mb-4 text-rose-600">Bookings Management</h1>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>View, filter, and search all bookings</li>
            <li>Approve, reschedule, or cancel appointments</li>
            <li>See booking details</li>
          </ul>
          <div className="mt-4 text-gray-400">(Feature coming soon)</div>
        </div>
      );
    case "customers":
      return (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-8">
          <div className="mb-4 p-4 bg-gradient-to-r from-rose-100 to-purple-100 border-l-4 border-rose-400 rounded">
            <strong>AI Insight:</strong> Top customer: Priya (12 visits, ₹8,000 spent). 2 customers haven’t booked in 3 months. Average customer rating: 4.8/5.
          </div>
          <h1 className="text-2xl font-bold mb-4 text-rose-600">Customers Management</h1>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>List of all customers</li>
            <li>View profiles, booking history, contact info</li>
            <li>Ban or deactivate users</li>
          </ul>
          <div className="mt-4 text-gray-400">(Feature coming soon)</div>
        </div>
      );
    case "staff":
      return (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-8">
          <div className="mb-4 p-4 bg-gradient-to-r from-rose-100 to-purple-100 border-l-4 border-rose-400 rounded">
            <strong>AI Insight:</strong> Rohit has the highest booking rate this month. 2 staff on leave tomorrow. Average service rating: 4.7/5.
          </div>
          <h1 className="text-2xl font-bold mb-4 text-rose-600">Staff Management</h1>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>List of all staff members</li>
            <li>Assign staff to services/appointments</li>
            <li>Manage staff profiles, roles, and schedules</li>
          </ul>
          <div className="mt-4 text-gray-400">(Feature coming soon)</div>
        </div>
      );
    case "services":
      return (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-8">
          <div className="mb-4 p-4 bg-gradient-to-r from-rose-100 to-purple-100 border-l-4 border-rose-400 rounded">
            <strong>AI Suggestion:</strong> Consider promoting ‘Nail Art’—low bookings this month. Haircut is booked 40% more than other services.
          </div>
          <h1 className="text-2xl font-bold mb-4 text-rose-600">Services Management</h1>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Add, edit, or remove services</li>
            <li>Set prices, durations, assign staff</li>
          </ul>
          <div className="mt-4 text-gray-400">(Feature coming soon)</div>
        </div>
      );
    case "notifications":
      return (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-8">
          <div className="mb-4 p-4 bg-gradient-to-r from-rose-100 to-purple-100 border-l-4 border-rose-400 rounded">
            <strong>AI Suggestion:</strong> Send reminders 2 hours before appointments for best attendance. 98% of reminders sent successfully this week.
          </div>
          <h1 className="text-2xl font-bold mb-4 text-rose-600">Notifications & Reminders</h1>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Send SMS/Email reminders for appointments</li>
            <li>Notification to staff for new bookings</li>
            <li>Alert for cancellations or changes</li>
          </ul>
          <div className="mt-4 text-gray-400">(Feature coming soon)</div>
        </div>
      );
    case "settings":
      return (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-8">
          <div className="mb-4 p-4 bg-gradient-to-r from-rose-100 to-purple-100 border-l-4 border-rose-400 rounded">
            <strong>AI Suggestion:</strong> Your business hours are set for 9am-7pm. Most bookings are at 5pm—consider extending hours.
          </div>
          <h1 className="text-2xl font-bold mb-4 text-rose-600">Settings</h1>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Manage salon profile (logo, address, timing)</li>
            <li>Holiday scheduling</li>
            <li>Business hours setup</li>
            <li>Enable/disable online bookings</li>
            <li>Change admin password</li>
          </ul>
          <div className="mt-4 text-gray-400">(Feature coming soon)</div>
        </div>
      );
    case "useraccess":
      return (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-8">
          <div className="mb-4 p-4 bg-gradient-to-r from-rose-100 to-purple-100 border-l-4 border-rose-400 rounded">
            <strong>AI Insight:</strong> No suspicious login activity detected. 3 sub-admins, last login: 2 hours ago.
          </div>
          <h1 className="text-2xl font-bold mb-4 text-rose-600">User Access Management</h1>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Add sub-admins with specific roles</li>
            <li>Track login history</li>
            <li>Access control levels</li>
          </ul>
          <div className="mt-4 text-gray-400">(Feature coming soon)</div>
        </div>
      );
    case "reports":
      return (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-8">
          <div className="mb-4 p-4 bg-gradient-to-r from-rose-100 to-purple-100 border-l-4 border-rose-400 rounded">
            <strong>AI Insight:</strong> Revenue up 15% compared to last month. Most bookings on Fridays.
          </div>
          <h1 className="text-2xl font-bold mb-4 text-rose-600">Reports & Analytics</h1>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Revenue reports (daily, weekly, monthly)</li>
            <li>Booking trends and staff performance</li>
            <li>Export data (CSV, PDF)</li>
          </ul>
          <div className="mt-4 text-gray-400">(Feature coming soon)</div>
        </div>
      );
    case "reviews":
      return (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-8">
          <div className="mb-4 p-4 bg-gradient-to-r from-rose-100 to-purple-100 border-l-4 border-rose-400 rounded">
            <strong>AI Suggestion:</strong> Positive feedback on ‘Facial’ service. One negative review flagged for follow-up. Average review response time: 2 hours.
          </div>
          <h1 className="text-2xl font-bold mb-4 text-rose-600">Reviews & Feedback</h1>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>View and manage customer reviews</li>
            <li>Respond to feedback</li>
          </ul>
          <div className="mt-4 text-gray-400">(Feature coming soon)</div>
        </div>
      );
    default:
      return null;
  }
};

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = React.useState("dashboard");

  React.useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-rose-100 to-purple-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-rose-600 mb-8">Admin Panel</h2>
        <nav className="flex-1">
          {sections.map((section) => (
            <button
              key={section.key}
              className={`w-full text-left px-4 py-2 mb-2 rounded-lg font-medium transition-colors ${
                activeSection === section.key
                  ? "bg-rose-100 text-rose-700"
                  : "hover:bg-rose-50 text-gray-700"
              }`}
              onClick={() => setActiveSection(section.key)}
            >
              {section.label}
            </button>
          ))}
        </nav>
        <button
          className="mt-8 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-semibold"
          onClick={() => {
            logout();
            navigate("/", { replace: true });
          }}
        >
          Logout
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start p-12">
        <SectionContent section={activeSection} />
      </main>
    </div>
  );
};

export default AdminDashboard; 