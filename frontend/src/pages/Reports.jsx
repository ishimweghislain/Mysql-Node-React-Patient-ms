import { useState, useEffect } from 'react'
import api from '../lib/api'

function Reports() {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState('')
  const [reports, setReports] = useState([])
  const [newReport, setNewReport] = useState({ findings: ''})
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true)
      try {
        const { data } = await api.get('/patients')
        setPatients(data)
      } catch (err) {
        setError('Failed to load patients')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPatients()
  }, [])

  const handleSelectPatient = async (patientId) => {
    setSelectedPatient(patientId)
    setIsLoading(true)
    try {
      const { data } = await api.get(`/reports/patient/${patientId}`)
      setReports(data)
    } catch (err) {
      setError('Failed to load reports')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddReport = async (e) => {
    e.preventDefault()
    setIsAdding(true)
    try {
      await api.post('/reports', { 
        patient_id: selectedPatient, 
        findings: newReport.findings,
      })
      const { data } = await api.get(`/reports/patient/${selectedPatient}`)
      setReports(data)
      setNewReport({ findings: '' })
      setError('')
      setIsModalOpen(false)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add report')
    } finally {
      setIsAdding(false)
    }
  }

  // Skeleton loader for table rows
  const SkeletonRow = () => (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div></td>
      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div></td>
      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div></td>
    </tr>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Medical Reports</h1>
            <p className="text-amber-700">Kabutare Hospital Patient Records</p>
          </div>
          {selectedPatient && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Report
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Patient Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Select Patient
          </h2>
          <select
            value={selectedPatient}
            onChange={(e) => handleSelectPatient(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none bg-white transition duration-200"
            disabled={isLoading}
          >
            <option value="">Select a patient...</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} (DOB: {new Date(patient.date_of_birth).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        {selectedPatient && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Medical Reports
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Findings</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <>
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                    </>
                  ) : reports.length > 0 ? (
                    reports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {new Date(report.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          Dr. {report.doctor_name}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          <div className="max-w-prose">{report.findings}</div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No reports found for this patient</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                New Medical Report
              </h2>
            </div>
            <form onSubmit={handleAddReport} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Patient</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {patients.find(p => p.id === Number(selectedPatient))?.name || 'Unknown Patient'}
                  </div>
                </div>
                <div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Findings *</label>
                  <textarea
                    name="findings"
                    placeholder="Detailed examination findings..."
                    value={newReport.findings}
                    onChange={(e) => setNewReport({ ...newReport, findings: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200"
                    rows="6"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-red-600 text-white rounded-lg hover:from-amber-600 hover:to-red-700 transition duration-200 flex items-center justify-center"
                >
                  {isAdding ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : 'Save Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports