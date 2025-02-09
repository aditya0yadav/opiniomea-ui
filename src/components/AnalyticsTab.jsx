import React from 'react';
import { BarChart,  Calendar, LineChart } from 'lucide-react';

const AnalyticsPlaceholder = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-emerald-100 p-4 rounded-full">
            <BarChart className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Coming Soon!</h2>
        <p className="text-gray-600 max-w-md text-center">
          We're working hard to bring you powerful analytics tools to help you track your survey participation and earnings.
        </p>
      </div>

      {/* Feature Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <LineChart className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Earnings Analytics</h3>
          <p className="text-sm text-gray-600">Track your earnings over time and identify peak earning periods.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Survey History</h3>
          <p className="text-sm text-gray-600">View detailed history of your completed surveys and performance.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          {/* <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <ChartIcon className="w-6 h-6 text-orange-600" />
          </div> */}
          <h3 className="font-semibold text-gray-900 mb-2">Performance Metrics</h3>
          <p className="text-sm text-gray-600">Get insights into your survey completion rates and efficiency.</p>
        </div>
      </div>

      {/* Email Notification Option */}
      <div className="mt-8 text-center">
        <button className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-medium hover:bg-emerald-100 transition-colors">
          Get notified when analytics launches
        </button>
        <p className="text-sm text-gray-500 mt-2">We'll let you know as soon as it's ready!</p>
      </div>
    </div>
  );
};

export default AnalyticsPlaceholder;