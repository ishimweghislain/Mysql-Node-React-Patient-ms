import { Link } from 'react-router-dom';
import { 
  HiHomeModern, 
  HiUserGroup, 
  HiUserCircle, 
  HiDocumentText, 
  HiUsers, 
  HiCalendarDays,
  HiCog6Tooth,
  HiChartBar,
  HiBell,
  HiQuestionMarkCircle
} from 'react-icons/hi2';
import { FaStethoscope } from 'react-icons/fa';

function Sidebar({ role }) {
  return (
    <div className="w-72 bg-gradient-to-b from-blue-700 to-blue-900 text-white h-screen p-6 flex flex-col">
      {/* Header with logo and notification */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <span className="bg-white text-blue-700 p-2 rounded-lg">
            <HiHomeModern className="text-2xl" />
          </span>
          <span>HMS Pro</span>
        </h2>
        <div className="relative">
          <HiBell className="text-2xl text-blue-200 hover:text-white cursor-pointer" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs">3</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-2">
        <Link 
          to="/" 
          className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl transition-all group"
        >
          <span className="bg-white/20 p-2 rounded-lg group-hover:bg-white group-hover:text-blue-700 transition-colors">
            <HiHomeModern className="text-xl" />
          </span>
          <span className="font-medium">Dashboard</span>
        </Link>

        {(role === 'Doctor' || role === 'Staff') && (
          <Link 
            to="/patients" 
            className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl transition-all group"
          >
            <span className="bg-white/20 p-2 rounded-lg group-hover:bg-white group-hover:text-blue-700 transition-colors">
              <HiUserGroup className="text-xl" />
            </span>
            <span className="font-medium">Patients</span>
            <span className="ml-auto bg-green-500 text-xs px-2 py-1 rounded-full">New</span>
          </Link>
        )}

        {role === 'Admin' && (
          <Link 
            to="/doctors" 
            className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl transition-all group"
          >
            <span className="bg-white/20 p-2 rounded-lg group-hover:bg-white group-hover:text-blue-700 transition-colors">
              <FaStethoscope className="text-xl" />
            </span>
            <span className="font-medium">Doctors</span>
          </Link>
        )}

        {role === 'Doctor' && (
          <Link 
            to="/reports" 
            className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl transition-all group"
          >
            <span className="bg-white/20 p-2 rounded-lg group-hover:bg-white group-hover:text-blue-700 transition-colors">
              <HiDocumentText className="text-xl" />
            </span>
            <span className="font-medium">Reports</span>
          </Link>
        )}

        {role === 'Admin' && (
          <Link 
            to="/users" 
            className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl transition-all group"
          >
            <span className="bg-white/20 p-2 rounded-lg group-hover:bg-white group-hover:text-blue-700 transition-colors">
              <HiUsers className="text-xl" />
            </span>
            <span className="font-medium">Users</span>
          </Link>
        )}

        {(role === 'Staff' || role === 'Doctor') && (
          <Link 
            to="/monthly-report" 
            className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl transition-all group"
          >
            <span className="bg-white/20 p-2 rounded-lg group-hover:bg-white group-hover:text-blue-700 transition-colors">
              <HiCalendarDays className="text-xl" />
            </span>
            <span className="font-medium">Monthly Report</span>
          </Link>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto space-y-2">
        <Link 
          to="/settings" 
          className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl transition-all group"
        >
          <span className="bg-white/20 p-2 rounded-lg group-hover:bg-white group-hover:text-blue-700 transition-colors">
            <HiCog6Tooth className="text-xl" />
          </span>
          <span className="font-medium">Settings</span>
        </Link>

        <div className="bg-blue-800/50 p-4 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-yellow-400 text-blue-900 p-2 rounded-full">
              <HiQuestionMarkCircle className="text-xl" />
            </div>
            <div>
              <p className="font-medium">Need Help?</p>
              <p className="text-xs text-blue-200">Contact our support team</p>
            </div>
          </div>
          <button className="w-full bg-yellow-400 text-blue-900 py-2 rounded-lg font-bold hover:bg-yellow-300 transition-colors">
            Quick Help
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;