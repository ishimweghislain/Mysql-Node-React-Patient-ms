import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import TableRowSkeleton from '../components/TableRowSkeleton'

function DoctorDashboard() {
  const [metrics, setMetrics] = useState({
    totalPatients: 0,
    totalReports: 0,
    appointmentsToday: 0,
    pendingTasks: 0,
    recentPatients: [],
    recentReports: [],
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true)
      try {
        const { data } = await api.get('/dashboard/doctor')
        setMetrics(data)
      } catch (err) {
        setError('Failed to load dashboard metrics')
      } finally {
        setIsLoading(false)
      }
    }
    fetchMetrics()
  }, [])

  // Skeleton loader components
  const MetricSkeleton = () => (
    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-2"></div>
  )

  const TableRowSkeleton = ({ cols = 2 }) => (
    <tr>
      {Array(cols).fill(0).map((_, i) => (
        <td key={i} className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </td>
      ))}
    </tr>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-red-50">
     

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="Total Patients" 
            value={metrics.totalPatients} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            color="blue"
            isLoading={isLoading}
          />
          
          <MetricCard 
            title="Total Reports" 
            value={metrics.totalReports} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            color="amber"
            isLoading={isLoading}
          />
          
          <MetricCard 
            title="Appointments Today" 
            value={metrics.appointmentsToday} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            color="green"
            isLoading={isLoading}
          />
          
          <MetricCard 
            title="Pending Tasks" 
            value={metrics.pendingTasks} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="red"
            isLoading={isLoading}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/patients"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center space-x-3"
          >
            
            <span className="text-lg font-medium">Manage Patients</span>
          </Link>
          <Link
            to="/reports"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center space-x-3"
          >
            
            <span className="text-lg font-medium">Manage Reports</span>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivityTable 
            title="Recent Patients" 
            data={metrics.recentPatients} 
            columns={[
              { header: 'Name', accessor: 'name' },
              { header: 'Sex', accessor: 'sex', format: (value) => value.charAt(0).toUpperCase() },
              { header: 'Last Visit', accessor: 'last_visit', render: () => '2 days ago' }
            ]}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            isLoading={isLoading}
            emptyMessage="No recent patients found"
          />
          
          <RecentActivityTable 
            title="Recent Reports" 
            data={metrics.recentReports} 
            columns={[
              { header: 'Patient', accessor: 'patient_name' },
              { header: 'Date', accessor: 'date' },
              { header: 'Status', accessor: 'status', render: () => (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Completed
                </span>
              )}
            ]}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            isLoading={isLoading}
            emptyMessage="No recent reports found"
          />
        </div>
      </main>
    </div>
  )
}

// Reusable Metric Card Component
const MetricCard = ({ title, value, icon, color, isLoading }) => {
  const colorClasses = {
    amber: {
      bg: 'bg-amber-100',
      text: 'text-amber-600',
      border: 'border-amber-500'
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      border: 'border-red-500'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      border: 'border-green-500'
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-500'
    }
  }

  return (
    <div className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${colorClasses[color].border}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 font-medium">{title}</p>
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-2"></div>
          ) : (
            <p className="text-3xl font-bold text-gray-800">{value}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color].bg}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

// Reusable Recent Activity Table Component
const RecentActivityTable = ({ title, data, columns, icon, isLoading, emptyMessage }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <TableRowSkeleton key={`skeleton-${i}`} cols={columns.length} />
              ))
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {column.render 
                        ? column.render(item) 
                        : column.format 
                          ? column.format(item[column.accessor]) 
                          : item[column.accessor]
                      }
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DoctorDashboard