"use client"

import { useState } from "react"

export default function GovernmentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🛡️ SafeRoute AI - Emergency Operations Center</h1>
          <div className="flex items-center space-x-4 text-sm">
            <span>🛰️ Starlink: ✅</span>
            <span>👤 Admin Portal</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Emergency Overview Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-center mb-4">🚨 ACTIVE EMERGENCIES OVERVIEW</h2>
          <div className="flex justify-center space-x-8 text-lg font-semibold mb-6">
            <span className="text-red-600">CRITICAL: 2</span>
            <span className="text-orange-500">HIGH: 5</span>
            <span className="text-yellow-500">MEDIUM: 12</span>
            <span className="text-blue-500">LOW: 8</span>
            <span className="text-gray-700">TOTAL ACTIVE: 27</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
            <div className="text-3xl font-bold text-red-600">2</div>
            <div className="text-gray-600">Critical Emergencies</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
            <div className="text-3xl font-bold text-orange-600">5</div>
            <div className="text-gray-600">High Priority Alerts</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600">27</div>
            <div className="text-gray-600">Active Heroes</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="text-3xl font-bold text-green-600">98%</div>
            <div className="text-gray-600">Starlink Uptime</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Emergencies */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold">Active Emergencies</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border-l-4 border-red-500 bg-red-50 rounded">
                  <div>
                    <h4 className="font-bold">🔥 WILDFIRE</h4>
                    <p className="text-sm text-gray-600">North Shore</p>
                    <p className="text-xs text-gray-500">14:23 - 1h 15m</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">CRITICAL</div>
                    <p className="text-xs mt-1">🦸 12 Heroes | 👥 450 Affected</p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 border-l-4 border-orange-500 bg-orange-50 rounded">
                  <div>
                    <h4 className="font-bold">🏥 MEDICAL</h4>
                    <p className="text-sm text-gray-600">Downtown</p>
                    <p className="text-xs text-gray-500">15:45 - 23m</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">HIGH</div>
                    <p className="text-xs mt-1">🦸 3 Heroes | 👥 1 Affected</p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                  <div>
                    <h4 className="font-bold">🌊 FLOOD</h4>
                    <p className="text-sm text-gray-600">Fraser Valley</p>
                    <p className="text-xs text-gray-500">13:30 - 2h 8m</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">MEDIUM</div>
                    <p className="text-xs mt-1">🦸 8 Heroes | 👥 1,200 Aff.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-bold">Quick Actions</h3>
              </div>
              <div className="p-4 space-y-2">
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
                  🚨 Broadcast Alert
                </button>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                  👥 Deploy Heroes
                </button>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                  📡 Check Starlink
                </button>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
                  🏛️ Cultural Protocols
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-bold">Recent Activity</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                      🚨
                    </div>
                    <div>
                      <p className="font-medium">New Emergency</p>
                      <p className="text-gray-500 text-xs">Wildfire in North Shore</p>
                      <p className="text-gray-400 text-xs">2 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      👥
                    </div>
                    <div>
                      <p className="font-medium">Heroes Deployed</p>
                      <p className="text-gray-500 text-xs">8 heroes responding</p>
                      <p className="text-gray-400 text-xs">5 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      📡
                    </div>
                    <div>
                      <p className="font-medium">Starlink Restored</p>
                      <p className="text-gray-500 text-xs">Full connectivity</p>
                      <p className="text-gray-400 text-xs">15 min ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Map */}
        <div className="bg-white rounded-lg shadow-sm mt-6">
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold">🗺️ Regional Emergency Map</h3>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                🗺️ Interactive Emergency Map
              </div>
              {/* Emergency Markers */}
              <div className="absolute top-8 left-16 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute top-32 right-20 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute bottom-16 left-12 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute top-20 right-32 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>

              {/* Community Markers */}
              <div className="absolute top-12 left-24 text-lg">🏛️</div>
              <div className="absolute bottom-20 left-20 text-lg">🏛️</div>
              <div className="absolute top-28 right-28 text-lg">🏛️</div>
            </div>
            <div className="flex justify-center space-x-6 mt-4 text-sm">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>Critical (2)
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>High (5)
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>Medium (12)
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>Low (8)
              </span>
            </div>
          </div>
        </div>

        {/* Indigenous Communities Status */}
        <div className="bg-white rounded-lg shadow-sm mt-6">
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold">🏛️ Indigenous Community Status</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Community</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Population</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Heroes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emergencies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">🏛️ Squamish Nation</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-green-600">🟢 Safe</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">2,100</td>
                  <td className="px-6 py-4 whitespace-nowrap">12</td>
                  <td className="px-6 py-4 whitespace-nowrap">1 Active</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">🏛️ Tsilhqot'in Nation</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-yellow-600">🟡 Alert</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">5,000</td>
                  <td className="px-6 py-4 whitespace-nowrap">8</td>
                  <td className="px-6 py-4 whitespace-nowrap">0 Active</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">🏛️ Stó:lō Nation</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-orange-600">🟠 Emergency</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">11,000</td>
                  <td className="px-6 py-4 whitespace-nowrap">15</td>
                  <td className="px-6 py-4 whitespace-nowrap">2 Active</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
