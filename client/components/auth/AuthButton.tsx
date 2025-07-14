import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  LogOut,
  Settings,
  Calendar,
  Heart,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";

const AuthButton: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  // Prevent background scroll when a modal is open
  React.useEffect(() => {
    if (showLogin || showSignup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up on unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showLogin, showSignup]);

  // Ensure only one modal is open at a time
  const openLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };
  const openSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm"
            onClick={openLogin}
          >
            Login
          </Button>
          <Button
            size="sm"
            className="bg-rose-500 hover:bg-rose-600 text-white text-sm px-3 py-1"
            onClick={openSignup}
          >
            Sign Up
          </Button>
        </div>

        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={openSignup}
        />

        <SignupModal
          isOpen={showSignup}
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={openLogin}
        />
      </>
    );
  }

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 p-1"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className="relative">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <ChevronDown className="h-3 w-3" />
        </Button>

        {/* User Menu Dropdown */}
        {showUserMenu && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {user?.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email}
                  </p>
                  <Badge className="mt-1 bg-green-100 text-green-700 text-xs">
                    Premium Member
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-2">
              {/* Admin Dashboard link for admin users */}
              {user?.role === 'admin' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/admin');
                  }}
                >
                  <span className="mr-3">🛡️</span> Admin Dashboard
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setShowProfile(true);
                  setShowUserMenu(false);
                }}
              >
                <Settings className="mr-3 h-4 w-4" />
                Edit Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <Calendar className="mr-3 h-4 w-4" />
                My Bookings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <Heart className="mr-3 h-4 w-4" />
                Favorites
              </Button>
              <hr className="my-2" />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>

      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};

export default AuthButton;
