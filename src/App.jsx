import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";

// Lazy-loaded pages (dynamically imported for better performance)
// Public Pages
const HomePage = lazy(() => import("./pages/HomePage"));
const Login = lazy(() => import("./pages/SigninPage"));
const Register = lazy(() => import("./pages/SignupPage"));
const Support = lazy(() => import("./pages/SupportPage"));

// User Pages
const UserDashboard = lazy(() => import("./pages/DashboardPage"));
const InvestmentsList = lazy(() => import("./pages/InvestmentsListPage"));
const CreateInvestment = lazy(() => import("./pages/CreateInvestmentPage"));
const InvestmentDetails = lazy(() => import("./pages/InvestmentDetailsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ReferralsPage = lazy(() => import("./pages/ReferralsPage"));
const BonusesPage = lazy(() => import("./pages/BonusesPage"));
const TransactionsPage = lazy(() => import("./pages/TransactionsPage"));
const WithdrawalsPage = lazy(() => import("./pages/WithdrawalsPage"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/AdminDashboardPage"));
const AdminUsers = lazy(() => import("./pages/AdminUsersPage"));
const AdminInvestments = lazy(() => import("./pages/AdminInvestmentsPage"));
const AdminWithdrawals = lazy(() => import("./pages/AdminWithdrawalsPage"));
const AdminSettings = lazy(() => import("./pages/AdminSettingsPage"));

function App() {
  const router = createBrowserRouter([
    // Public Routes
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },

    // User Routes (with Layout)
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [{ index: true, element: <UserDashboard /> }],
    },
    {
      path: "/investments",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <InvestmentsList /> },
        { path: "create", element: <CreateInvestment /> },
        { path: ":id", element: <InvestmentDetails /> },
      ],
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [{ index: true, element: <ProfilePage /> }],
    },
    {
      path: "/referrals",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [{ index: true, element: <ReferralsPage /> }],
    },
    {
      path: "/bonuses",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [{ index: true, element: <BonusesPage /> }],
    },
    {
      path: "/transactions",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [{ index: true, element: <TransactionsPage /> }],
    },
    {
      path: "/withdrawals",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [{ index: true, element: <WithdrawalsPage /> }],
    },
    {
      path: "/support",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [{ index: true, element: <Support /> }],
    },

    // Admin Routes (with AdminLayout)
    {
      path: "/admin",
      element: (
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      ),
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "users", element: <AdminUsers /> },
        { path: "investments", element: <AdminInvestments /> },
        { path: "withdrawals", element: <AdminWithdrawals /> },
        { path: "settings", element: <AdminSettings /> },
      ],
    },

    // Catch-all route - redirect to home
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Apex Trading...</p>
            </div>
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  );
}

export default App;
