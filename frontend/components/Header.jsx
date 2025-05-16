import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiOutlineLogout, HiSearch, HiUserCircle } from 'react-icons/hi';
import { FiBell, FiMessageSquare } from 'react-icons/fi';

function Header({ setIsLoggedIn, setRole }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
    setIsLoggedIn(false);
    setRole('');
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Search */}
          <div className="flex-1 flex items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiSearch className="h-5 w-5 text-blue-200" />
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-blue-500/50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:text-sm"
                placeholder="Search patients, reports..."
                type="search"
              />
            </div>
          </div>

          {/* Right section - Icons and profile */}
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white relative">
              <FiBell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <button className="p-1 rounded-full text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white relative">
              <FiMessageSquare className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-yellow-400"></span>
            </button>

            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <HiUserCircle className="h-8 w-8 text-blue-200 hover:text-white cursor-pointer" />
              </div>
              <span className="hidden md:block text-sm font-medium text-white">Admin User</span>
            </div>

            <button
              onClick={handleLogout}
              className="ml-4 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <HiOutlineLogout className="h-5 w-5" />
              <span className="hidden sm:inline-block font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;