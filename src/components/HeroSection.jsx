import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  AlertCircle,
  Gift,
  ChevronRight,
  CheckCircle2,
  Star,
  DollarSign,
  Users,
  ChevronDown,
  ChevronUp,
  X,
  TrendingUp,
} from "lucide-react";
import { initOTPless } from "../utils/init";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
// import { useAuth } from "./AuthContext";
import earn from "../assets/earn.png";
import survey from "../assets/survey.png";
import openiomea from "../assets/opineomi.png";
import step1 from "../assets/step1.svg";
import step2 from "../assets/step2.svg";
import step3 from "../assets/step3.svg";
import soc from "../assets/image.png";
import Header from "./header";
import pvr from "../assets/pvr.png";
import dom from "../assets/dom.png";
import buy from "../assets/buy.png";
import buck from "../assets/bucks.png";
import nike from "../assets/nike.png";
import pizaa from "../assets/pizaa.png";

import person from "../assets/person.png";
import person1 from "../assets/person1.png";
import person2 from "../assets/person2.png";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
const IMAGES = {
  logo: openiomea,
  hero: "/api/placeholder/600/400",
  step1: step1,
  step2: step2,
  step3: step3,
  testimonial1: person,
  testimonial2: person1,
  testimonial3: person2,
  brands: {
    amazon: soc,
    bestBuy: buy,
    starbucks: buck,
    nike: nike,
    dom: dom,
    pizaa: pizaa,
    pvr: pvr,
  },
};

import axios from "axios";
const useCurrencyDetection = () => {
  const [userCurrency, setUserCurrency] = useState("USD");
  const [userCountry, setUserCountry] = useState(null);
  const [detectionMethod, setDetectionMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const detectCurrency = () => {
      try {
        setIsLoading(true);
        setError(null);

        // Method 1: Check for Indian timezone
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const isIndianTimeZone =
          timeZone.includes("Asia/Kolkata") ||
          timeZone.includes("Asia/Calcutta") ||
          timeZone.startsWith("Asia/");

        // Method 2: Check browser language
        const browserLanguage =
          navigator.language || navigator.userLanguage || "en-US";
        const isIndianLocale =
          browserLanguage.includes("IN") ||
          browserLanguage === "hi" ||
          browserLanguage.startsWith("hi-") ||
          browserLanguage.includes("en-IN");

        // Method 3: Check system time offset
        const timeOffset = new Date().getTimezoneOffset();
        const isIndianOffset = timeOffset === -330; // IST is UTC+5:30 (-330 minutes)

        // If any of the Indian indicators are true, set to INR
        if (isIndianTimeZone || isIndianLocale || isIndianOffset) {
          if (isMounted) {
            setUserCurrency("INR");
            setUserCountry("IN");
            setDetectionMethod(
              isIndianTimeZone
                ? "timezone"
                : isIndianLocale
                  ? "locale"
                  : "offset"
            );
            setIsLoading(false);
            return;
          }
        }

        // Fallback currency mapping
        const localeCurrencyMap = {
          "en-US": { currency: "USD", country: "US" },
          "en-GB": { currency: "GBP", country: "GB" },
          de: { currency: "EUR", country: "DE" },
          fr: { currency: "EUR", country: "FR" },
          ja: { currency: "JPY", country: "JP" },
          zh: { currency: "CNY", country: "CN" },
        };

        const localePrefix = browserLanguage.split("-")[0];
        const detectedInfo = localeCurrencyMap[browserLanguage] ||
          localeCurrencyMap[localePrefix] || { currency: "USD", country: "US" };

        if (isMounted) {
          setUserCurrency(detectedInfo.currency);
          setUserCountry(detectedInfo.country);
          setDetectionMethod("fallback");
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error detecting currency:", error);
          setError(error.message);
          setUserCurrency("USD");
          setUserCountry("US");
          setDetectionMethod("error-fallback");
          setIsLoading(false);
        }
      }
    };

    detectCurrency();
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    userCurrency,
    userCountry,
    detectionMethod,
    isLoading,
    error,
  };
};

// In your HeroSection component, update the stats section:

// Update the useEffect for stats:
// useEffect(() => {
//   const stats = getStats(userCurrency);
//   setStats(stats);
// }, [userCurrency]);
const CURRENCY_CONFIG = {
  USD: {
    symbol: "$",
    rate: 1,
    format: (amount) =>
      `$${parseFloat(amount).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
    welcomeBonus: "5",
    avgEarning: "100",
  },
  INR: {
    symbol: "₹",
    rate: 1 / 30,
    format: (amount) =>
      `₹${(parseFloat(amount) * 83).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
    welcomeBonus: "415",
    avgEarning: "500",
  },
};

const HeroSection = ({ userCurrency, userCountry }) => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const { userCurrency, userCountry } = useCurrencyDetection();
  // const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: "50,000+",
    totalEarned: "$1.2M+",
    activeSurveys: "500+",
    avgEarnings: "$100",
  });
  const [consents, setConsents] = useState({
    cookies: false,
    privacy: false,
    terms: false,
  });

  console.log(userCurrency);

  const { isAuthorized } = useAuth();

  const handleClick = () => {
    if (isAuthorized) {
      window.location.href = "https://opiniomea.com/dashboard";
    } else {
      scrollToSection("auth");
    }
  };

  console.log(userCurrency);

  const sendVerificationEmail = () => {
    try {
      setShowOtpDialog(true);
    } catch (err) {
      setError("Failed to send verification email. Please try again.");
    }
  };
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");

  const handleConsentChange = (field) => (e) => {
    setConsents((prev) => ({
      ...prev,
      [field]: e.target.checked,
    }));
  };


  // const currency = useState(userCurrency)
  // console.log("currency is ", userCurrency, userCountry);

  // Utility functions
  const formatCurrency = (
    amount,
    currency = userCurrency,
    includeSymbol = true
  ) => {
    console.log("amount is  a", amount);
    const config = CURRENCY_CONFIG[currency];
    if (!config) return CURRENCY_CONFIG.USD.format(amount);

    const numericAmount = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
    const convertedAmount = Math.round(numericAmount * config.rate);
    // console.log("config is  a", config, amount, numericAmount, convertedAmount);

    return includeSymbol
      ? config.format(convertedAmount.toLocaleString())
      : convertedAmount.toLocaleString();
  };

  // Form handling utilities
  const handleInputChange = (setter) => (e) => setter(e.target.value);

  const [showAll, setShowAll] = useState(false);

  const features = [
    {
      icon: <DollarSign size={24} className="text-green-600" />,
      text: `Earn up to ${formatCurrency(CURRENCY_CONFIG[userCurrency].avgEarning)} per month`,
      description: "Complete surveys and receive competitive compensation",
    },
    {
      icon: <Users size={24} className="text-green-600" />,
      text: "Join 50,000+ members",
      description: "Be part of our growing community of survey takers",
    },
    {
      icon: <Star size={24} className="text-green-600" />,
      text: "Premium survey opportunities",
      description: "Access high-paying surveys from top brands",
    },
    {
      icon: <TrendingUp size={24} className="text-green-600" />,
      text: "Regular rewards",
      description: "Cash out your earnings weekly or monthly",
    },
  ];

  // Rewards array with all items
  const formatDollarCurrency = (amount, currencyType = "USD") => {
    return new Intl.NumberFormat(currencyType === "INR" ? "en-IN" : "en-US", {
      style: "currency",
      currency: currencyType,
    }).format(amount);
  };

  const getRewardValue = (points, userCurrency = "USD") => {
    const dollarAmount = points / 100;
    return userCurrency === "INR"
      ? formatDollarCurrency(dollarAmount * 80, "INR")
      : formatDollarCurrency(dollarAmount, "USD");
  };

  // Example usage: const userCurrency = 'INR' or 'USD'
  const rewards = [
    {
      name: "Amazon",
      minPoints: 2500,
      value: getRewardValue(2500, userCurrency),
      color: "bg-blue-500",
      popular: true,
      image: IMAGES.brands.amazon,
    },
    {
      name: "Pizza Hut",
      minPoints: 2000,
      value: getRewardValue(2000, userCurrency),
      color: "bg-red-600",
      popular: true,
      image: IMAGES.brands.pizaa,
    },
    {
      name: "PVR",
      minPoints: 3000,
      value: getRewardValue(3000, userCurrency),
      color: "bg-yellow-700",
      popular: true,
      image: IMAGES.brands.pvr,
    },
    {
      name: "Dominos",
      minPoints: 4000,
      value: getRewardValue(4000, userCurrency),
      color: "bg-red-800",
      popular: true,
      image: IMAGES.brands.dom,
    },
    {
      name: "Starbucks",
      minPoints: 2000,
      value: getRewardValue(2000, userCurrency),
      color: "bg-green-600",
      image: IMAGES.brands.starbucks,
    },
    {
      name: "Nike",
      minPoints: 5000,
      value: getRewardValue(5000, userCurrency),
      color: "bg-gray-800",
      image: IMAGES.brands.nike,
    },
  ];
  const getStats = (currency) => ({
    totalUsers: "50,000+",
    totalEarned: currency === "INR" ? "₹10 lakhs +" : "$1.2M+",
    activeSurveys: "500+",
    avgEarnings: currency === "INR" ? "₹8,000+" : "$100+",
  });

  // Then update the stats state when currency changes
  useEffect(() => {
    console.log(userCurrency);

    setStats(getStats());
  }, [userCurrency]);

  // Update the stats display section
  const StatsSection = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
      {Object.entries(stats).map(([key, value]) => (
        <div
          key={key}
          className="text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          {/* {userCurrency} */}
          <div className="text-4xl font-bold text-green-600 mb-2">{value}</div>
          <div className="text-gray-600 capitalize">
            {key
              .replace(/([A-Z])/g, " $1")
              .trim()
              .split(" ")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ")}
          </div>
        </div>
      ))}
    </div>
  );
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  const initialDisplayCount = 2;
  const displayedRewards = showAll
    ? rewards
    : rewards.slice(0, initialDisplayCount);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular Member",
      image: IMAGES.testimonial1,
      content:
        "I've earned over $500 in gift cards just by taking surveys in my spare time. The platform is super easy to use!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Power User",
      image: IMAGES.testimonial2,
      content:
        "The variety of surveys keeps things interesting, and the rewards are always delivered promptly.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "New Member",
      image: IMAGES.testimonial3,
      content:
        "Started last month and already earned enough for two Amazon gift cards. Great experience so far!",
      rating: 4,
    },
  ];

  const process = [
    {
      title: "Sign Up",
      description: "Create your free account in seconds",
      image: IMAGES.step1,
      benefits: [
        "Instant account activation",
        "Secure & private",
        "No credit card required",
      ],
    },
    {
      title: "Take Surveys",
      description: "Choose from hundreds of available surveys",
      image: IMAGES.step2,
      benefits: [
        "Daily new opportunities",
        "Mobile-friendly platform",
        "Flexible schedule",
      ],
    },
    {
      title: "Get Rewarded",
      description: "Redeem points for gift cards",
      image: IMAGES.step3,
      benefits: [
        "Fast redemption",
        "Multiple reward options",
        "Regular bonuses",
      ],
    },
  ];

  // FAQ Data
  const faqs = [
    {
      question: "How much can I earn?",
      answer:
        "Earnings vary based on survey length and complexity. Most users earn between $50-$100 per month with regular participation.",
    },
    {
      question: "How do I get paid?",
      answer:
        "You can redeem your points for gift cards from popular retailers like Amazon, Target, and Walmart. Points are converted to rewards instantly upon redemption.",
    },
    {
      question: "How long do surveys take?",
      answer:
        "Most surveys take between 5-20 minutes to complete. You'll always see the estimated time before starting.",
    },
    {
      question: "Is it really free to join?",
      answer:
        "Yes, it's completely free to join and participate. We never charge any fees.",
    },
  ];


  useEffect(() => initOTPless(handle), [])
  const handle = async(data) => {
    console.log("data is here ",data);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 font-sans">
      <nav className="bg-white shadow-sm h-50">
        <div className="container mx-auto px-4 py-4 relative z-10">
          <div className="flex justify-between items-center">
            {typeof IMAGES.logo === "string" ? (
              // Render as an image if IMAGES.logo is a URL
              <img src={IMAGES.logo} alt="Logo" className="h-11" />
            ) : (
              // Render as a component if IMAGES.logo is an SVG/JSX
              <div className="h-8">{IMAGES.logo}</div>
            )}
            <button
              onClick={handleClick}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12" id="main">
        <div className="absolute inset-3">
          {/* <div className="absolute w-[500px] h-[500px] -top-[250px] -right-[250px] bg-blue-100 rounded-full mix-blend-multiply animate-pulse"></div> */}
          <div className="absolute w-[500px] h-[400px] top-1/3 -left-[250px] bg-indigo-100 rounded-full mix-blend-multiply animate-pulse delay-300"></div>
          <div className="absolute w-[500px] h-[500px] bottom-0 right-1/3 bg-purple-100 rounded-full mix-blend-multiply animate-pulse delay-500"></div>
          {/* <div className="absolute w-[500px] h-[500px] bottom -left-[250px] bg-indigo-100 rounded-full mix-blend-multiply animate-pulse delay-300"></div> */}
        </div>
        {/* Hero Section */}
        <div className="text-center mb-24">
          <h1 className="text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Share Your Opinion,
            <br />
            Earn Rewards
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Join our community of survey takers and earn gift cards from your
            favorite brands. Start earning today with our{" "}
            {userCurrency === "INR" ? "₹200" : "$5"} welcome bonus!
          </p>
        </div>

        {/* Stats Section */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24"> */}
        <StatsSection />
        {/* </div> */}

        {/* Features Grid */}
        <div className="px-4 lg:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 lg:mb-24">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-green-100 transform hover:-translate-y-1"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4">
                  <div className="text-green-600 w-5 h-5 sm:w-6 sm:h-6">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">
                  {feature.text}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Section */}
        <div className="min-h-screen bg-gray-50" id="auth">
          <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Left Banner - Hidden on mobile, shown on lg screens */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600" />
              <div className="absolute inset-0 bg-[url('/api/placeholder/800/600')] mix-blend-overlay opacity-20" />
              <div className="relative w-full flex flex-col justify-center p-6 lg:px-16 lg:py-12">
                <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 lg:mb-8">
                  {isLogin ? "Welcome Back!" : "Join Our Community"}
                </h1>
                <p className="text-lg lg:text-xl text-white/90 mb-6 lg:mb-12">
                  {isLogin
                    ? "Log in to access your account and continue your journey with us."
                    : "Create an account today and start earning rewards while supporting sustainable practices."}
                </p>
                <div className="space-y-4 lg:space-y-8">
                  <div className="flex items-center space-x-4 lg:space-x-6 bg-white/10 p-3 lg:p-4 rounded-xl lg:rounded-2xl backdrop-blur-lg">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 rounded-lg lg:rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 lg:w-7 lg:h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-base lg:text-lg">
                        Quick & Easy
                      </h3>
                      <p className="text-white/80 text-sm lg:text-base">
                        Get started in less than 2 minutes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 lg:space-x-6 bg-white/10 p-3 lg:p-4 rounded-xl lg:rounded-2xl backdrop-blur-lg">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 rounded-lg lg:rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 lg:w-7 lg:h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-base lg:text-lg">
                        Secure & Protected
                      </h3>
                      <p className="text-white/80 text-sm lg:text-base">
                        Your data is always safe with us
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center lg:w-1/2 px-6 py-12 lg:px-16">
              {isAuthorized ? (
                <div className="w-full max-w-md space-y-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Welcome to Your Account
                  </h2>
                  <p className="text-gray-600">
                    You're successfully logged in. Ready to continue?
                  </p>
                  <button
                    onClick={() =>
                      (window.location.href = "https://opiniomea.com/dashboard")
                    }
                    className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    <span>Go to Dashboard</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div id="otpless-login-page" className="w-full" />
              )}
            </div>
          </div>
        </div>
        {/* Process Section */}
        <div
          className="mx-3 sm:mx-4 lg:mx-24 my-8 sm:my-12 lg:my-24"
          id="how-it-works"
        >
          {/* Header Section */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 lg:mb-6">
              How It Works
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-3 sm:px-4">
              Start earning rewards in three simple steps
            </p>
          </div>

          {/* Process Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {process.map((step, index) => (
              <div key={index} className="relative group">
                {/* Background gradient with improved rotation */}
                <div
                  className="absolute inset-0 bg-gradient-to-b from-green-50 to-green-100 
              rounded-lg sm:rounded-xl lg:rounded-3xl transform rotate-1 
              group-hover:rotate-2 transition-transform duration-300 
              opacity-80 sm:opacity-90"
                />

                {/* Content Card */}
                <div
                  className="relative bg-white p-3 sm:p-4 lg:p-6 
              rounded-lg sm:rounded-xl lg:rounded-2xl 
              shadow-md hover:shadow-lg sm:hover:shadow-xl 
              transition-all duration-300"
                >
                  {/* Image */}
                  <div className="aspect-video w-full mb-3 sm:mb-4 overflow-hidden rounded-lg">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm sm:text-base lg:text-base mb-3 sm:mb-4 lg:mb-6">
                    {step.description}
                  </p>

                  {/* Benefits List */}
                  <div className="space-y-2 sm:space-y-2.5 lg:space-y-3">
                    {step.benefits.map((benefit, benefitIndex) => (
                      <div
                        key={benefitIndex}
                        className="flex items-start space-x-2 sm:space-x-3"
                      >
                        <CheckCircle2
                          className="text-green-500 flex-shrink-0 mt-0.5"
                          size={16}
                        />
                        <span className="text-gray-700 text-sm sm:text-base">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mx-4 lg:mx-24 mb-12 lg:mb-24">
          <div className="text-center mb-8 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 lg:mb-6">
              What Our Members Say
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Join thousands of satisfied members who earn rewards daily
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-5 lg:p-6 rounded-xl lg:rounded-2xl shadow-lg"
              >
                <div className="flex items-center space-x-3 lg:space-x-4 mb-3 lg:mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full"
                  />
                  <div>
                    <div className="font-bold text-sm lg:text-base">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-500 text-xs lg:text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm lg:text-base mb-3 lg:mb-4">
                  {testimonial.content}
                </p>
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-yellow-400 fill-current"
                      size={14}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards Section */}
        <div
          className="mx-3 sm:mx-4 md:mx-8 lg:mx-24 py-6 sm:py-8 lg:py-16 bg-white rounded-lg sm:rounded-xl lg:rounded-3xl shadow-md sm:shadow-lg lg:shadow-xl mb-8 sm:mb-12 lg:mb-24"
          id="rewards"
        >
          {/* Header Section */}
          <div className="text-center mb-4 sm:mb-6 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-6">
              Choose Your Reward
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-2xl mx-auto px-3 sm:px-4">
              Convert your survey points into gift cards from your favorite
              brands
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6 px-3 sm:px-4 lg:px-8">
            {/* Rewards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-8">
              {displayedRewards.map((reward, index) => (
                <div key={index} className="group relative animate-fadeIn">
                  <div
                    className={`absolute inset-0 ${reward.color} opacity-5 rounded-lg sm:rounded-xl lg:rounded-2xl transform transition-transform duration-300 group-hover:scale-105`}
                  />
                  <div className="relative bg-white p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
                    {reward.popular && (
                      <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-green-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                        Popular
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-16 sm:w-20 lg:w-24 h-6 sm:h-7 lg:h-8 flex items-center justify-center">
                          <img
                            src={reward.image}
                            alt={reward.name}
                            className="w-8 sm:w-10 max-h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg lg:text-xl font-bold truncate">
                            {reward.name}
                          </h3>
                          <p className="text-gray-600 text-xs lg:text-sm">
                            {reward.minPoints} points required
                          </p>
                        </div>
                      </div>
                      <span className="text-base sm:text-lg lg:text-xl font-bold text-green-600 ml-2">
                        {reward.value.slice(0, 6)}
                      </span>
                    </div>
                    <button
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-200 to-green-400 text-gray-700 font-medium py-2 sm:py-2.5 lg:py-3 rounded-md sm:rounded-lg lg:rounded-xl transition-colors duration-200 hover:bg-gradient-to-r hover:from-green-300 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                      onClick={() => scrollToSection("auth")}
                      aria-label="Redeem now"
                    >
                      <span className="text-xs sm:text-sm lg:text-base">
                        Redeem now
                      </span>
                      <ChevronRight className="w-4 sm:w-5 lg:w-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More/Less Button */}
            {rewards.length > initialDisplayCount && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm transition-all duration-200 group"
                >
                  <span className="text-xs sm:text-sm lg:text-base">
                    {showAll
                      ? "Show Less"
                      : `Show More (${rewards.length - initialDisplayCount})`}
                  </span>
                  {showAll ? (
                    <ChevronUp className="w-4 sm:w-5 lg:w-6 text-gray-500 group-hover:transform group-hover:-translate-y-0.5 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="w-4 sm:w-5 lg:w-6 text-gray-500 group-hover:transform group-hover:translate-y-0.5 transition-transform duration-200" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        {/* FAQ Section */}
        <div className="mb-24" id="faq">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our platform
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mb-24">
          <div className="bg-gradient-to-r from-green-600 to-green-400 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Earning?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of members who are already earning rewards for
              their opinions. Sign up now and get your $5 welcome bonus!
            </p>
            <button
              onClick={() => scrollToSection("auth")}
              className="bg-white text-green-600 px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-shadow duration-300"
            >
              Create Your Free Account
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src={IMAGES.logo} alt="Logo" className="h-8 mb-4" />
              <p className="text-gray-600">
                Your trusted platform for online surveys and rewards.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="block text-gray-600 hover:text-green-600 text-left w-full"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection("rewards")}
                  className="block text-gray-600 hover:text-green-600 text-left w-full"
                >
                  Rewards
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="block text-gray-600 hover:text-green-600 text-left w-full"
                >
                  FAQ
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <div className="space-y-2">
                <a
                  href="https://privacy.opiniomea.com"
                  className="block text-gray-600 hover:text-green-600"
                >
                  Privacy Policy
                </a>
                <a
                  href="https://termofcondition.opiniomea.com"
                  className="block text-gray-600 hover:text-green-600"
                >
                  Terms of Service
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <div className="space-y-2">
                <a
                  href="mailto:contactus@acutusai.com"
                  className="block text-gray-600 hover:text-green-600"
                >
                  contactus@acutusai.com
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 py-6 text-center text-gray-600">
            <p>
              ©  2024 Survey Platform All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HeroSection;
