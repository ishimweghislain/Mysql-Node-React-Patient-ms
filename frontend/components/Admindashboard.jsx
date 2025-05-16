import { FiUsers, FiBriefcase, FiArrowRight } from 'react-icons/fi';

function AdminDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h2>
        <p className="text-gray-600 text-lg">
          Welcome back, Admin! Manage your healthcare team and system settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="bg-blue-100 w-fit p-4 rounded-full mb-4">
            <FiUsers className="text-2xl text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Manage Users</h3>
          <p className="text-gray-600 mb-4">
            Oversee staff accounts, permissions, and access levels within the system.
          </p>
          <a 
            href="/users" 
            className="inline-flex items-center bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>User Management</span>
            <FiArrowRight className="ml-2" />
          </a>
        </div>

        {/* Doctors Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="bg-green-100 w-fit p-4 rounded-full mb-4">
            <FiBriefcase className="text-2xl text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Manage Doctors</h3>
          <p className="text-gray-600 mb-4">
            Maintain physician profiles, specialties, and practice information.
          </p>
          <a 
            href="/doctors" 
            className="inline-flex items-center bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <span>Doctor Directory</span>
            <FiArrowRight className="ml-2" />
          </a>
        </div>
      </div>

      {/* Additional Stats/Quick Actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-blue-600 text-xl font-bold">24</div>
          <div className="text-gray-600 text-sm">Pending Requests</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-green-600 text-xl font-bold">152</div>
          <div className="text-gray-600 text-sm">Active Users</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-purple-600 text-xl font-bold">45</div>
          <div className="text-gray-600 text-sm">Medical Staff</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-yellow-600 text-xl font-bold">93%</div>
          <div className="text-gray-600 text-sm">System Health</div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;