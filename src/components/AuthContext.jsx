// AuthContext.js
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthContext = createContext(null);

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";
const USER_EMAIL = "user_email";

export const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(() => {
    // Initialize auth state from localStorage to prevent unnecessary refreshes
    const token = localStorage.getItem(ACCESS_TOKEN);
    const email = localStorage.getItem(USER_EMAIL);
    return !!(token && email);
  });
  const [user, setUser] = useState(() => {
    const email = localStorage.getItem(USER_EMAIL);
    return email ? { email } : null;
  });

  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(USER_EMAIL);
    setIsAuthorized(false);
    setUser(null);
    window.location.href = "/login";
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      if (!refreshToken) {
        return false;
      }

      const response = await axios.post(
        "https://api.opiniomea.com/api/auth/refresh/",
        {
          refresh: refreshToken,
        }
      );

      if (response.status === 200 && response.data.access) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const email = localStorage.getItem(USER_EMAIL);

      if (!token || !email) {
        setIsAuthorized(false);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          const refreshSuccess = await refreshToken();
          if (!refreshSuccess) {
            throw new Error("Token refresh failed");
          }
        }

        setUser({ email });
        setIsAuthorized(true);
      } catch (error) {
        console.error("Token validation failed:", error);
        logout();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [refreshToken, logout]);

  const handleOtplessLogin = useCallback(async (otplessUser) => {
    try {
      const { identities } = otplessUser;

      if (!identities?.[0]?.identityValue) {
        throw new Error("Invalid OTPless response");
      }

      const email = identities[0].identityValue;
      const encodedEmail = encodeURIComponent(email);

      // Make parallel API requests
      const [profileResponse, otplessResponse] = await Promise.all([
        axios.get(`https://api.opiniomea.com/api/profiles?email=${encodedEmail}`),
        axios.post("https://api.opiniomea.com/api/opiniomea/data", otplessUser),
      ]);

      console.log("Profile Response:", profileResponse.data);
      console.log("OTPless Response:", otplessResponse.data);

      if (profileResponse.data.tokens?.accessToken) {
        localStorage.setItem(
          ACCESS_TOKEN,
          profileResponse.data.tokens.accessToken
        );
        if (profileResponse.data.tokens.refreshToken) {
          localStorage.setItem(
            REFRESH_TOKEN,
            profileResponse.data.tokens.refreshToken
          );
        }
        localStorage.setItem("USER_EMAIL", email);

        // Update state before navigation
        setIsAuthorized(true);
        setUser({ email });

        // console.log("About to set email:", email);
        localStorage.setItem("USER_EMAIL", email);
        
        setTimeout(() => {
          const hasProfile =
            profileResponse.data.hasProfile || profileResponse.status === 200;
          const destination = hasProfile ? "/dashboard" : "/profile";
          window.location.href = `https://opiniomea.com${destination}`;
        }, 100);
      } else {
        throw new Error("No access token received");
      }
    } catch (error) {
      console.error("OTPless login failed:", error);
      setIsAuthorized(false);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    window.otpless = handleOtplessLogin;
    // Clean up on unmount
    return () => {
      window.otpless = undefined;
    };
  }, [handleOtplessLogin]);

  const value = {
    isAuthorized,
    user,
    loading,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
