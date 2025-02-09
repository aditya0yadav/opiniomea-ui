import { useState, useCallback, useEffect } from "react";
import { Loader2, ChevronRight, Phone, AlertCircle, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";

class ProfileAPIHandler {
  constructor() {
    this.baseURL = `https://api.opiniomea.com/api/p/profiles?email=${encodeURIComponent(localStorage.getItem("USER_EMAIL"))}`;
  }

  async createProfile(userData) {
    try {
      console.log(userData, localStorage.getItem("USER_EMAIL"));
      const formattedData = this.formatUserData(userData);

      // Log the formatted data for debugging
      console.log("Sending formatted data to API:", formattedData);

      const response = await axios.post(this.baseURL, formattedData, {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          email: localStorage.getItem("USER_EMAIL"),
        },
      });

      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      if (error.response) {
        console.error("Error Response:", error.response.data);
        throw new Error(
          `Server error: ${error.response.data.message || error.message}`
        );
      } else if (error.request) {
        throw new Error("Network error: Please check your connection");
      }
      throw new Error(`Failed to create profile: ${error.message}`);
    }
  }

  formatUserData(userData) {
    // Log incoming userData for debugging
    console.log("Original userData:", userData);

    // Create a properly formatted data object
    const formattedData = {
      email: localStorage.getItem("USER_EMAIL"),
      profile: {
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phoneNumber: userData.phoneNumber || "",
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        country: userData.country || "",
        postalCode: userData.postalCode || "",
        dateOfBirth: userData.dateOfBirth || "",
        gender: userData.gender || "Male",
        point: 0,
      },
    };

    // Log the formatted data
    console.log("Formatted data:", formattedData);

    return formattedData;
  }
}
const POSTAL_CODE_CONFIGS = {
  US: {
    format: /^\d{5}(-\d{4})?$/,
    length: 5,
    errorMessage: "Enter valid 5-digit ZIP code",
    apiEndpoint: (code) => `https://api.zippopotam.us/us/${code}`,
  },

  IN: {
    format: /^\d{6}$/,
    length: 6,
    errorMessage: "Enter valid 6-digit postal code",
    apiEndpoint: (code) => `https://api.postalpincode.in/pincode/${code}`,
  },
  UK: {
    format: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
    length: null,
    errorMessage: "Enter valid UK postal code",
    apiEndpoint: (code) => `https://api.zippopotam.us/gb/${code}`,
  },
};

const FormField = ({
  name,
  label,
  type = "text",
  value,
  onChange,
  error,
  disabled = false,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label}{" "}
      {label !== "Address Line 1" && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-4 py-3 rounded-lg border ${
        error ? "border-red-500 bg-red-50" : "border-gray-300"
      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        disabled ? "bg-gray-100" : ""
      }`}
    />
    {error && (
      <p className="text-red-500 text-sm flex items-center">
        <AlertCircle className="w-4 h-4 mr-1" />
        {error}
      </p>
    )}
  </div>
);

const ProgressSteps = ({ currentStep }) => (
  <div className="flex justify-center items-center space-x-4 mt-6">
    {[1, 2].map((step) => (
      <div
        key={step}
        className={`flex items-center ${step !== 2 ? "flex-1" : ""}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= step
              ? "bg-white text-emerald-600"
              : "bg-emerald-400 text-white"
          }`}
        >
          {currentStep > step ? <Check className="w-5 h-5" /> : step}
        </div>
        {step === 1 && (
          <div className="flex-1 h-1 mx-4 bg-emerald-400">
            <div
              className={`h-full bg-white transition-all duration-500 ${
                currentStep > 1 ? "w-full" : "w-0"
              }`}
            />
          </div>
        )}
      </div>
    ))}
  </div>
);

const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [selectedCountry, setSelectedCountry] = useState("US"); // Changed default to US
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "Male",
    dateOfBirth: "",
    phoneNumber: "",
    postalCode: "",
    address: "",
    country: "United States", // Changed default to United States
    state: "",
    city: "",
  });
  const [whatsappVerification, setWhatsappVerification] = useState({
    isWhatsapp: false,
    whatsappNumber: "",
    showWhatsappInput: false,
    otpSent: false,
    otp: "",
    verificationStatus: "",
    requestId: "",
  });

  const verifyPhoneNumber = async (phoneNumber, isWhatsapp = false) => {
    try {
      const options = {
        method: "POST",
        headers: {
          clientId: "AH4J140Y1BD3TT6OB16YHRMHID3MZRB8",
          clientSecret: "a9l1dr3iilp9rzcekrz41ng7ys1ge1n2",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: `+${phoneNumber}`,
          expiry: 30,
          otpLength: 6,
          channels: isWhatsapp ? ["WHATSAPP"] : ["SMS"],
          metadata: {
            userType: "registration",
            country: formData.country,
          },
        }),
      };

      const response = await fetch(
        "https://auth.otpless.app/auth/v1/initiate/otp",
        options
      );
      const data = await response.json();
      console.log(response);

      if (data.requestId) {
        setWhatsappVerification((prev) => ({
          ...prev,
          otpSent: true,
          requestId: data.requestId,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Verification initiation failed:", error);
      return false;
    }
  };

  const verifyOTP = async (otp) => {
    try {
      const options = {
        method: "POST",
        headers: {
          clientId: "AH4J140Y1BD3TT6OB16YHRMHID3MZRB8",
          clientSecret: "a9l1dr3iilp9rzcekrz41ng7ys1ge1n2",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: whatsappVerification.requestId,
          otp: otp,
        }),
      };

      console.log(options);

      const response = await fetch(
        "https://auth.otpless.app/auth/v1/verify/otp",
        options
      );
      const data = await response.json();
      console.log(response);

      if (data.isOTPVerified) {
        setWhatsappVerification((prev) => ({
          ...prev,
          verificationStatus: "verified",
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("OTP verification failed:", error);
      return false;
    }
  };

  // Add this in your PhoneInput section
  const renderPhoneVerification = () => {
    if (formData.country === "United States" && formData.phoneNumber) {
      return (
        <div className="mt-4 space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={whatsappVerification.isWhatsapp}
              onChange={(e) => {
                setWhatsappVerification((prev) => ({
                  ...prev,
                  isWhatsapp: e.target.checked,
                  showWhatsappInput: !e.target.checked,
                }));
              }}
              className="rounded border-gray-300"
            />
            <label className="text-sm text-gray-700">
              This is my WhatsApp number
            </label>
          </div>

          {whatsappVerification.showWhatsappInput && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                country="us"
                value={whatsappVerification.whatsappNumber}
                onChange={(value) => {
                  setWhatsappVerification((prev) => ({
                    ...prev,
                    whatsappNumber: value,
                  }));
                }}
                inputClass="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {!whatsappVerification.verificationStatus && (
            <button
              type="button"
              onClick={() =>
                verifyPhoneNumber(
                  whatsappVerification.showWhatsappInput
                    ? whatsappVerification.whatsappNumber
                    : formData.phoneNumber,
                  whatsappVerification.isWhatsapp
                )
              }
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Verify Number
            </button>
          )}

          {whatsappVerification.otpSent &&
            !whatsappVerification.verificationStatus && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={whatsappVerification.otp}
                  onChange={(e) =>
                    setWhatsappVerification((prev) => ({
                      ...prev,
                      otp: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => verifyOTP(whatsappVerification.otp)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Submit OTP
                </button>
              </div>
            )}

          {whatsappVerification.verificationStatus === "verified" && (
            <div
              className="flex items-center p-4 mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg"
              role="alert"
            >
              <svg
                className="w-5 h-5 mr-2 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m-6 4L9 9m3 6 4-4m2 0a8 8 0 11-16 0 8 8 0 0116 0z"
                />
              </svg>
              <span className="font-medium">
                Phone number verified successfully!
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  console.log("mail tax is ", localStorage.getItem("USER_EMAIL"));

  const navigate = useNavigate();
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const apiHandler = new ProfileAPIHandler();

  // In the handlePostalCodeChange function, replace the existing API handling code with this:

  const handlePostalCodeChange = useCallback(
    async (value) => {
      handleInputChange("postalCode", value);

      const config = POSTAL_CODE_CONFIGS[selectedCountry];

      if (
        config &&
        (config.length === null || value.length === config.length)
      ) {
        if (!config.format.test(value)) {
          setErrors((prev) => ({
            ...prev,
            postalCode: config.errorMessage,
          }));
          return;
        }

        setIsLookingUp(true);
        try {
          const response = await fetch(config.apiEndpoint(value));
          const data = await response.json();

          let locationData;

          if (selectedCountry === "US") {
            // Check if data exists and has the expected structure
            if (data && data.places && data.places[0]) {
              locationData = {
                country: "United States",
                state:
                  data.places[0]["state abbreviation"] ||
                  data.places[0]["state"] ||
                  "",
                city: data.places[0]["place name"] || "",
                stateFullName: data.places[0]["state"] || "",
              };
            } else {
              throw new Error("Invalid ZIP code");
            }
          } else if (selectedCountry === "IN") {
            if (
              data &&
              data[0] &&
              data[0].PostOffice &&
              data[0].PostOffice[0]
            ) {
              locationData = {
                country: "India",
                state: data[0].PostOffice[0].State || "",
                city: data[0].PostOffice[0].District || "",
                stateFullName: data[0].PostOffice[0].State || "",
              };
            } else {
              throw new Error("Invalid postal code");
            }
          } else {
            if (data && data.places && data.places[0]) {
              locationData = {
                country: data.country,
                state: data.places[0].state || "",
                city: data.places[0]["place name"] || "",
                stateFullName: data.places[0].state || "",
              };
            } else {
              throw new Error("Invalid postal code");
            }
          }

          // Only update form if we have valid location data
          if (locationData) {
            setFormData((prev) => ({
              ...prev,
              country: locationData.country,
              state: locationData.stateFullName || locationData.state,
              stateCode: locationData.state,
              city: locationData.city,
              postalCode: value,
            }));
            setErrors((prev) => ({ ...prev, postalCode: undefined }));
          }
        } catch (error) {
          console.error("Postal code lookup error:", error);
          setErrors((prev) => ({
            ...prev,
            postalCode: "Invalid postal code",
          }));
        } finally {
          setIsLookingUp(false);
        }
      }
    },
    [selectedCountry, handleInputChange]
  );
  const validateForm = useCallback(() => {
    const newErrors = {};
    const config = POSTAL_CODE_CONFIGS[selectedCountry];

    if (!formData.firstName?.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName?.trim())
      newErrors.lastName = "Last name is required";
    if (!formData.phoneNumber?.trim())
      newErrors.phoneNumber = "Phone number is required";

    if (currentStep === 2) {
      if (!formData.postalCode?.trim()) {
        newErrors.postalCode = "Postal code is required";
      } else if (config && !config.format.test(formData.postalCode.trim())) {
        newErrors.postalCode = config.errorMessage;
      }
      if (!formData.state?.trim()) newErrors.state = "State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, currentStep, selectedCountry]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (
      formData.country === "United States" &&
      !whatsappVerification.verificationStatus
    ) {
      setSubmitStatus({
        type: "error",
        message: "Please verify your phone number before submitting",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    try {
      // Prepare the data including WhatsApp information
      const submissionData = {
        ...formData,
        whatsappNumber: whatsappVerification.isWhatsapp
          ? formData.phoneNumber
          : whatsappVerification.whatsappNumber,
        isPhoneWhatsapp: whatsappVerification.isWhatsapp,
      };

      await apiHandler.createProfile(submissionData);
      window.location.href = "https://opiniomea.com/dashboard";
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = useCallback(() => {
    if (validateForm()) setCurrentStep(2);
  }, [validateForm]);

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-emerald-100 px-8 py-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Complete Registration
            </h2>
            <p className="mt-2 text-gray-600">Join our community</p>
          </div>

          <ProgressSteps currentStep={currentStep} />

          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    name="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={(value) => handleInputChange("firstName", value)}
                    error={errors.firstName}
                    disabled={isSubmitting}
                  />
                  <FormField
                    name="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(value) => handleInputChange("lastName", value)}
                    error={errors.lastName}
                    disabled={isSubmitting}
                  />
                  <div className="space-y-5">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <PhoneInput
                      country="us" // Changed default to us
                      value={formData.phoneNumber}
                      onChange={(value) =>
                        handleInputChange("phoneNumber", value)
                      }
                      disabled={isSubmitting}
                      inputClass={`w-full  px-4 py-5 rounded-lg border ${
                        errors.phoneNumber
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {errors.phoneNumber}
                      </p>
                    )}
                    {renderPhoneVerification()}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => {
                        setSelectedCountry(e.target.value);
                        handleInputChange(
                          "country",
                          e.target.value === "US"
                            ? "United States"
                            : e.target.value === "IN"
                              ? "India"
                              : "United Kingdom"
                        );
                      }}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="US">United States</option>
                      <option value="IN">India</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Zip Code <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => handlePostalCodeChange(e.target.value)}
                        disabled={isSubmitting}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.postalCode
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {isLookingUp && (
                        <div className="absolute right-3 top-3">
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>
                    {errors.postalCode && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                  <FormField
                    name="state"
                    label="State"
                    value={formData.state}
                    onChange={(value) => handleInputChange("state", value)}
                    error={errors.state}
                    disabled={isSubmitting || isLookingUp}
                  />
                  <FormField
                    name="city"
                    label="City"
                    value={formData.city}
                    onChange={(value) => handleInputChange("city", value)}
                    error={errors.city}
                    disabled={isSubmitting || isLookingUp}
                  />
                  <FormField
                    name="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(value) =>
                      handleInputChange("dateOfBirth", value)
                    }
                    disabled={isSubmitting}
                  />
                  <FormField
                    name="address"
                    label="Address Line 1"
                    value={formData.address}
                    onChange={(value) => handleInputChange("address", value)}
                    disabled={isSubmitting}
                  />
                </div>
              )}

              {submitStatus.type === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {submitStatus.message}
                  </p>
                </div>
              )}

              <div className="flex justify-center space-x-4 pt-6">
                {currentStep === 1 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center space-x-2 disabled:opacity-50"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isLookingUp}
                      className="px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <span>Submit</span>
                      )}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
