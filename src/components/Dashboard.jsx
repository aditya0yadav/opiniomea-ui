import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  User,
  Settings,
  BarChart,
  Clock,
  Award,
  Target,
  Star,
  Trophy,
  ChevronRight,
  Wallet,
} from "lucide-react";
import axios from "axios";
import AccountManagement from "./AccountProfile";
import SettingsPage from "./SettingPage";
import AnalyticsPlaceholder from "./AnalyticsTab";
import opineomi from "../assets/opineomi.png";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Home className="w-5 h-5" />,
  },
  {
    id: "account",
    label: "Account",
    icon: <User className="w-5 h-5" />,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart className="w-5 h-5" />,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

// Define the points mapping that was referenced but missing
const pointsMapping = [
  {
    min: 0,
    max: 5,
    points: 50,
    icon: <Clock className="w-6 h-6 text-white" />,
    title: "Quick Survey",
  },
  {
    min: 6,
    max: 10,
    points: 70,
    icon: <Award className="w-6 h-6 text-white" />,
    title: "Short Survey",
  },
  {
    min: 11,
    max: 15,
    points: 100,
    icon: <Target className="w-6 h-6 text-white" />,
    title: "Standard Survey",
  },
  {
    min: 16,
    max: 20,
    points: 125,
    icon: <Star className="w-6 h-6 text-white" />,
    title: "Extended Survey",
  },
  {
    min: 21,
    max: 25,
    points: 150,
    icon: <Trophy className="w-6 h-6 text-white" />,
    title: "Premium Survey",
  },
];

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [totalPoints, setTotalPoints] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    dateOfBirth: "",
    gender: "",
    point: 0,
  });

  const fetchUserPoints = async () => {
    try {
      const email = localStorage.getItem("USER_EMAIL");
      const response = await axios.get(
        `https://api.opiniomea.com/api/profiles?email=${encodeURIComponent(email)}`
      );
      
      if (response.data && response.data.profile) {
        const points = response.data.profile.point || 0;
        setTotalPoints(points);
        setFormData(prev => ({
          ...prev,
          ...response.data.profile
        }));
      }
    } catch (error) {
      console.error("Error fetching user points:", error);
    }
  };

  useEffect(() => {
    fetchUserPoints();
  }, []);

  const handleRedeem = () => {
    // Add redemption logic here
    alert("Points redemption feature coming soon!");
  };

  const handleTileClick = async (tile) => {
    try {
      const PID = Math.random().toString(36).substr(2, 9);
      const email = localStorage.getItem("USER_EMAIL");
  
      // Make sure we're using the tile object from pointsMapping
      const surveyTile = pointsMapping[tile];
  
      await axios.post(`https://api.opiniomea.com/api/status/${formData.id}`, {
        PID,
        points: surveyTile.points,
        surveyType: surveyTile.title,
        timeRange: `${surveyTile.min}-${surveyTile.max}`,
      });
      console.log(surveyTile)
      window.location.href = `https://api.qmapi.com/opiniomea/entry?PNID=${PID}&SupplyID=6000&loi_min=${surveyTile.min}&loi_max=${surveyTile.max}&points=${surveyTile.points}`;
    } catch (error) {
      console.error("Error recording survey completion:", error);
    }
  };

  const [activeTile, setActiveTile] = useState(null);


  // ... (keep all the existing handleTileClick and other functions the same)

  const renderPointsHeader = () => {
    const currentPoints = formData.point || totalPoints;
    const isRedeemable = currentPoints >= 1000;

    return (
      <div className="mb-6">
        <div className="bg-gradient-to-r from-white-400 to-green-600 rounded-lg shadow-md">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="text-black text-sm font-bold">Total Points</div>
                <div className="text-green-500 text-3xl font-bold flex items-center gap-2">
                  <Wallet className="w-6 h-6" />
                  {currentPoints}
                </div>
              </div>
              <button
                onClick={handleRedeem}
                disabled={!isRedeemable}
                className={`px-6 py-2 rounded-lg font-medium 
                          transition-colors duration-200 
                          active:scale-95 transform flex items-center gap-2
                          ${isRedeemable 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                <Wallet className="w-5 h-5" />
                Redeem Points
                {!isRedeemable && (
                  <span className="text-xs ml-1">
                    ({1000 - currentPoints} more needed)
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ... (keep all the remaining code the same)

  const renderPointsTiles = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
        {pointsMapping.map((survey, index) => (
          <div
            key={index}
            onClick={() => handleTileClick(index)}
            className={`
              group bg-white rounded-xl shadow-md overflow-hidden 
              transform transition-all duration-300
              active:scale-98 md:hover:-translate-y-1 md:hover:shadow-xl
              ${activeTile === index ? "ring-2 ring-green-400" : ""}
            `}
          >
            {/* Mobile touch feedback */}
            <div className="md:hidden absolute right-4 top-1/2 -translate-y-1/2">
              <ChevronRight
                className={`w-5 h-5 text-green-600 transition-transform duration-300 
                ${activeTile === index ? "rotate-90" : ""}`}
              />
            </div>

            {/* Header with icon */}
            <div className="bg-gradient-to-r from-green-300 to-green-500 p-3 md:p-4 flex items-center gap-3">
              <div className="rounded-full bg-green-400/30 p-2 md:p-3 group-hover:scale-110 transition-transform duration-300">
                {survey.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-green-800 text-lg md:text-xl">
                  {survey.title}
                </h3>
                <div className="flex items-center text-green-700 text-sm">
                  <Trophy className="w-4 h-4 mr-1" />
                  {survey.points} Points
                </div>
              </div>
            </div>

            {/* Expandable content on mobile */}
            <div
              className={`
              overflow-hidden transition-all duration-300
              ${activeTile === index ? "max-h-96" : "max-h-0 md:max-h-none"}
            `}
            >
              <div className="p-4 md:p-6 space-y-3">
                {/* Description - only shown on mobile when expanded */}
                <p className="text-gray-600 text-sm md:hidden">
                  {survey.description}
                </p>

                {/* Survey details */}
                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center bg-green-50 rounded-full px-3 py-1">
                    <Clock className="w-4 h-4 mr-1 text-green-700" />
                    <span className="text-green-700">
                      ~{Math.ceil(survey.max * 1.5)} min
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <button className="w-full bg-gradient-to-r from-green-400 to-green-500 text-green-800 py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:from-green-300 hover:to-green-400 active:scale-95">
                  Start Survey
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 z-30 w-64 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <img
            src={opineomi}
            alt="Logo"
            className="h-8 w-auto object-contain"
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors
                ${
                  activeTab === item.id
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden z-30">
        <nav className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1
                ${
                  activeTab === item.id ? "text-emerald-600" : "text-gray-600"
                }`}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-300 pb-16 lg:pb-0 lg:ml-64
        ${isSidebarOpen ? "brightness-50" : ""}`}
      >
        {/* Top Header - Mobile Only */}
        <header className="bg-white shadow-sm lg:hidden">
          <div className="flex items-center justify-between p-4">
            <img
              src={opineomi}
              alt="Logo"
              className="h-8 w-auto object-contain"
            />
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className={activeTab === "dashboard" ? "p-4" : ""}>
          {activeTab === "dashboard" && (
            <>
              {renderPointsHeader()}
              {renderPointsTiles()}
            </>
          )}
          {activeTab === "account" && (
            <div className="w-full">
              <AccountManagement />
            </div>
          )}
          {activeTab === "settings" && (
            <div className="w-full">
              <SettingsPage />
            </div>
          )}
          {activeTab === "analytics" && <AnalyticsPlaceholder />}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;