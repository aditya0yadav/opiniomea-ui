import React, { useState, useEffect } from "react";
import {
  Shield,
  Bell,
  Mail,
  LogOut,
  Trash2,
  AlertTriangle,
  Save,
  XCircle,
} from "lucide-react";
import axios from "axios";

const API_CONFIG = {
  BASE_URL: "https://api.opiniomea.com/api",
  AUTH_URL: "https://auth.otpless.app/auth/v1",
};

const SettingsPage = () => {
  const [userEmail, setUserEmail] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: "", otp: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    otp: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("USER_EMAIL");
    setUserEmail(storedEmail);
  }, []);

  const updateGlobalEmail = (newEmail) => {
    try {
      localStorage.setItem("USER_EMAIL", newEmail);
      setUserEmail(newEmail);
    } catch (error) {
      console.error("Error updating email in localStorage:", error);
      setErrors((prev) => ({
        ...prev,
        email: "Failed to save email settings",
      }));
    }
  };

  const initiateOTP = async (email) => {
    setIsLoading(true);
    setErrors({ email: "", otp: "" });

    try {
      const response = await axios.post(
        `${API_CONFIG.AUTH_URL}/initiate/otp`,
        {
          channels: ["EMAIL"],
          email: email,
        },
        {
          headers: {
            clientId: "AH4J140Y1BD3TT6OB16YHRMHID3MZRB8",
            clientSecret: "a9l1dr3iilp9rzcekrz41ng7ys1ge1n2",
            "Content-Type": "application/json",
          },
        }
      );

      setRequestId(response.data.requestId);
      setOtpSent(true);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        email:
          error.response?.data?.message ||
          "Failed to send OTP. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp) => {
    setIsLoading(true);
    setErrors({ email: "", otp: "" });

    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/change/email`, {
        updatedEmail: emailForm.email,
        email: userEmail,
        otp: otp,
        requestId: requestId,
      });

      if (response.status === 200) {
        updateGlobalEmail(emailForm.email);
        setEmailForm({ email: "", otp: "" });
        setOtpSent(false);
        setRequestId("");
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        otp:
          error.response?.data?.message ||
          "Failed to verify OTP. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    if (!emailForm.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }

    if (!otpSent) {
      await initiateOTP(emailForm.email);
    } else {
      if (!emailForm.otp) {
        setErrors((prev) => ({ ...prev, otp: "OTP is required" }));
        return;
      }
      await verifyOTP(emailForm.otp);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/delete`
      );
      if (response.status === 200) {
        localStorage.setItem("USER_EMAIL", "") ;
        localStorage.clear();
        window.location.href = "https://opiniomea.com";
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.setItem("USER_EMAIL","") ;
      localStorage.clear();
      window.location.href = "https://opiniomea.com";
    } catch (error) {
      console.error("Error during logout:", error);
    }
    setShowLogoutDialog(false);
  };

  const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return (
      <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
        <XCircle className="w-4 h-4" />
        <span>{message}</span>
      </div>
    );
  };

  const Switch = ({ checked, onChange }) => (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
        checked ? "bg-emerald-500" : "bg-gray-200"
      }`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`${
          checked ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </button>
  );

  const Modal = ({
    show,
    onClose,
    title,
    description,
    onConfirm,
    confirmText,
    children,
  }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={onClose}
          />
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-500">{description}</p>
            </div>
            {children}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full p-6 space-y-4">
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Account Security
            </h2>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleEmailChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Email Address
                </label>
                <input
                  type="email"
                  value={emailForm.email}
                  onChange={(e) =>
                    setEmailForm({ ...emailForm, email: e.target.value })
                  }
                  className={`mt-1 block w-full rounded-md border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500`}
                  placeholder="Enter new email address"
                  required
                  disabled={isLoading}
                />
                <ErrorMessage message={errors.email} />
              </div>
              {otpSent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={emailForm.otp}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, otp: e.target.value })
                    }
                    className={`mt-1 block w-full rounded-md border ${
                      errors.otp ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500`}
                    placeholder="Enter OTP sent to your email"
                    required
                    disabled={isLoading}
                  />
                  <ErrorMessage message={errors.otp} />
                </div>
              )}
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading
                  ? "Processing..."
                  : otpSent
                    ? "Verify OTP"
                    : "Send OTP"}
              </button>
            </form>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-medium text-gray-900">
                  Notification Preferences
                </h3>
              </div>
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize">
                      {key} Notifications
                    </span>
                    <Switch
                      checked={value}
                      onChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, [key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Account Actions
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <Modal
        show={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone."
        onConfirm={handleDeleteAccount}
        confirmText="Delete Account"
      >
        <div className="mt-4 flex items-center space-x-2 text-yellow-600">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm">All your data will be permanently deleted.</p>
        </div>
      </Modal>

      <Modal
        show={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        title="Logout"
        description="Are you sure you want to logout?"
        onConfirm={handleLogout}
        confirmText="Logout"
      />
    </div>
  );
};

export default SettingsPage;