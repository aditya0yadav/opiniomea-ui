import React, { useState, useEffect, useCallback } from "react";
import {
  Edit2,
  Save,
  X,
  UserCircle,
  LogOut,
  Upload,
  Camera,
} from "lucide-react";
import axios from "axios";

const AccountManagement = ({ onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ basic: null });
  const [editedProfile, setEditedProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const email = localStorage.getItem("USER_EMAIL");

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handlePhotoChange(file);
    }
  }, []);

  const handlePhotoChange = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const photoData = reader.result;
      setPhotoPreview(photoData);
      setEditedProfile((prev) => ({
        ...prev,
        photoUrl: photoData,
      }));
    };
    reader.readAsDataURL(file);
  };

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.opiniomea.com/api/profiles?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      const profile = data.profile || {};

      setProfileData({ basic: profile });
      setEditedProfile(profile);

      if (profile?.photoUrl) {
        setPhotoPreview(profile.photoUrl);
        localStorage.setItem("USER_PHOTO", profile.photoUrl);
      } else {
        const savedPhoto = localStorage.getItem("USER_PHOTO");
        if (savedPhoto) {
          setPhotoPreview(savedPhoto);
          setEditedProfile((prev) => ({
            ...prev,
          }));
        }
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      setError("Failed to load profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const formattedData = {
        email,
        profile: {
          ...editedProfile,
          email: email,
        },
      };

      const response = await axios.post(
        "https://api.opiniomea.com/api/p/profiles",
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedProfile = formattedData.profile;
      setProfileData({ basic: updatedProfile });
      setEditedProfile(updatedProfile);

      if (photoPreview) {
        localStorage.setItem("USER_PHOTO", photoPreview);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      setError("Failed to update profile. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setEditedProfile(profileData.basic || {});
    const savedPhoto =
      profileData.basic?.photoUrl || localStorage.getItem("USER_PHOTO");
    setPhotoPreview(savedPhoto || null);
  };

  useEffect(() => {
    if (email) {
      fetchProfile();
    }
  }, [email]);

  const renderField = (label, field) => (
    <div className="mb-4 last:mb-0">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {isEditing && field !== "point" ? ( // Check if the field is not "point"
        <input
          type="text"
          value={editedProfile[field] || ""}
          onChange={(e) =>
            setEditedProfile((prev) => ({
              ...prev,
              [field]: e.target.value,
            }))
          }
          className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all duration-200 bg-white shadow-sm"
        />
      ) : (
        <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 break-words">
          {profileData.basic?.[field] || "-"}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center space-x-2">
            <X className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="mb-6 bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
            <div
              className={`relative group mx-auto sm:mx-0 ${isEditing ? "cursor-pointer" : ""}`}
              onDragEnter={isEditing ? handleDragEnter : undefined}
              onDragOver={isEditing ? handleDragEnter : undefined}
              onDragLeave={isEditing ? handleDragLeave : undefined}
              onDrop={isEditing ? handleDrop : undefined}
            >
              {photoPreview ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100">
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <UserCircle className="w-24 h-24 text-gray-400 transition-colors duration-200 group-hover:text-green-400" />
              )}

              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-gradient-to-r from-green-200 to-green-400 text-white p-2 rounded-full cursor-pointer hover:from-green-300 hover:to-green-500 transition-colors duration-200">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handlePhotoChange(e.target.files[0]);
                      }
                    }}
                  />
                  <Camera className="w-4 h-4" />
                </label>
              )}

              {isDragging && (
                <div className="absolute inset-0 bg-green-300 bg-opacity-20 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-green-400" />
                </div>
              )}
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {editedProfile.firstName || "Unknown"}{" "}
                {editedProfile.lastName || ""}
              </h1>
              <p className="text-gray-500 mt-1 text-sm sm:text-base break-all">
                {email}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-200 to-green-400 text-white rounded-lg hover:from-green-300 hover:to-green-500 transition-colors duration-200 shadow-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-200 to-green-400 text-white rounded-lg hover:from-green-300 hover:to-green-500 transition-colors duration-200 shadow-sm w-full sm:w-auto"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-200 w-full sm:w-auto"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-100">
              Personal Information
            </h2>
            {renderField("First Name", "firstName")}
            {renderField("Last Name", "lastName")}
            {renderField("Date of Birth", "dateOfBirth")}
            {renderField("Gender", "gender")}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-100">
              Contact Information
            </h2>
            {renderField("Phone Number", "phoneNumber")}
            {renderField("Email", "email")}
            {renderField("Address", "address")}
            {renderField("City", "city")}
            {renderField("State", "state")}
            {renderField("Country", "country")}
            {renderField("Postal Code", "postalCode")}
            {renderField("Points", "point")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;