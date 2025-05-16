import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  HiDocumentAdd, 
  HiPencilAlt, 
  HiTrash, 
  HiRefresh, 
  HiSearch,
  HiUserCircle,
  HiCalendar,
  HiOutlineClipboardList,
  HiOutlineUser,
  HiOutlineUserGroup,
  HiOutlineX,
  HiCheck,
  HiOutlineDocumentText
} from 'react-icons/hi';
import { FaUserMd, FaFileMedicalAlt } from 'react-icons/fa';

function Reports({ role }) {
  const [reports, setReports] = useState([]);
  const [Reports, setFiltereReport] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ 
    id: '', 
    patient_id: '', 
    doctor_id: '', 
    report_date: '', 
    findings: '' 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReports();
    fetchPatients();
    fetchDoctors();
  }, []);

  useEffect(() => {
    const filtered = reports.filter(report => 
      report.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.findings?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setReports(filtered);
  }, [searchTerm, reports]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/reports', { withCredentials: true });
      setReports(response.data);
      setReports(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch reports. Please try again.');
      console.error('Error fetching reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/patients', { withCredentials: true });
      setPatients(response.data);
    } catch (err) {
      setError('Failed to fetch patients. Please try again.');
      console.error('Error fetching patients:', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/doctors', { withCredentials: true });
      setDoctors(response.data);
    } catch (err) {
      setError('Failed to fetch doctors. Please try again.');
      console.error('Error fetching doctors:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/reports/${form.id}`, form, { withCredentials: true });
      } else {
        await axios.post('http://localhost:5000/api/reports', form, { withCredentials: true });
      }
      await fetchReports();
      setForm({ id: '', patient_id: '', doctor_id: '', report_date: '', findings: '' });
      setIsEditing(false);
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} report. Please try again.`);
      console.error('Error submitting report:', err);
    }
  };

  const handleEdit = (report) => {
    setForm(report);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await axios.delete(`http://localhost:5000/api/reports/${id}`, { withCredentials: true });
        await fetchReports();
      } catch (err) {
        setError('Failed to delete report. Please try again.');
        console.error('Error deleting report:', err);
      }
    }
  };

  if (role !== 'Doctor') {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-red-100 to-pink-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-md">
          <HiOutlineX className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-4 text-3xl font-bold text-red-600">Access Denied</h2>
          <p className="mt-2 text-gray-600">
            You don't have permission to access medical reports. Please contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaFileMedicalAlt className="text-blue-600" />
          Medical Reports
        </h2>
        <button 
          onClick={fetchReports}
          className="flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <HiRefresh className="text-lg" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Search and Add Report */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search reports by patient, doctor or findings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Report Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          {isEditing ? (
            <>
              <HiPencilAlt className="text-blue-500" />
              Edit Medical Report
            </>
          ) : (
            <>
              <HiDocumentAdd className="text-green-500" />
              Create New Report
            </>
          )}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <HiOutlineUser className="text-gray-500" />
              Patient
            </label>
            <select
              value={form.patient_id}
              onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Patient</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} (ID: {patient.id})
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaUserMd className="text-gray-500" />
              Doctor
            </label>
            <select
              value={form.doctor_id}
              onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.name} ({doctor.specialization})
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <HiCalendar className="text-gray-500" />
              Report Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiCalendar className="text-gray-400" />
              </div>
              <input
                type="date"
                value={form.report_date}
                onChange={(e) => setForm({ ...form, report_date: e.target.value })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <HiOutlineDocumentText className="text-gray-500" />
              Findings
            </label>
            <textarea
              placeholder="Enter detailed medical findings..."
              value={form.findings}
              onChange={(e) => setForm({ ...form, findings: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
              required
            />
          </div>
          
          <div className="md:col-span-2 flex justify-end space-x-3 pt-2">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setForm({ id: '', patient_id: '', doctor_id: '', report_date: '', findings: '' });
                  setIsEditing(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <HiCheck className="h-5 w-5" />
              {isEditing ? 'Update Report' : 'Create Report'}
            </button>
          </div>
        </form>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Findings Summary
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Loading medical reports...
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No medical reports found
                  </td>
                </tr>
              ) : (
                ffffffffffffffReports.map(report => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <HiUserCircle className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{report.patient_name}</div>
                          <div className="text-xs text-gray-500">ID: {report.patient_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <FaUserMd className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Dr. {report.doctor_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.report_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="line-clamp-2">
                        {report.findings}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEdit(report)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                          title="Edit"
                        >
                          <HiPencilAlt className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                          title="Delete"
                        >
                          <HiTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;