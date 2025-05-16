function StaffDashboard() {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Staff Dashboard</h2>
      <p className="text-gray-600 mb-6">
        Welcome, Staff! You can manage patients and view reports.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Manage Patients</h3>
          <p className="text-gray-600">
            Add, edit, or delete patients to keep records up to date.
          </p>
          <a href="/patients" className="mt-4 inline-block bg-blue-600 text-white p-2 rounded hover:bg-gray-700">
            Go to Patients
          </a>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">View Monthly Reports</h3>
          <p className="text-gray-600">
            Check monthly reports to review patient care.
          </p>
          <a href="/monthly-report" className="mt-4 inline-block bg-blue-600 text-white p-2 rounded hover:bg-gray-700">
            Go to Monthly Reports
          </a>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;