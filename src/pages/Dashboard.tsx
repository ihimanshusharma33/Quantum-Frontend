import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Settings, Search, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { getUsers } from '../services/api';
import { User } from '../types';

// Mock user data as fallback
const sampleUsers = [
  { _id: "1", name: 'Michael Holz', email: 'michael@example.com', createdAt: '04/10/2013', role: 'Admin', status: 'active', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { _id: "2", name: 'Paula Wilson', email: 'paula@example.com', createdAt: '05/08/2014', role: 'Publisher', status: 'active', avatar: 'https://randomuser.me/api/portraits/women/26.jpg' },
  { _id: "3", name: 'Antonio Moreno', email: 'antonio@example.com', createdAt: '11/05/2015', role: 'Publisher', status: 'suspended', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
];

// Mock user data for bypassing authentication
const mockUser = {
  _id: "999",
  name: 'Design User',
  email: 'design@example.com',
  createdAt: '05/02/2025',
  role: 'Designer',
  status: 'active',
};

const Dashboard: React.FC = () => {
  const auth = useAuth();
  const mockAuthState = {
    user: mockUser,
    isAuthenticated: true,
    token: 'mock-token'
  };
  
  // Use real auth state if available, otherwise use mock
  const { authState = mockAuthState, logout = () => console.log('Mock logout') } = auth || {};
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getUsers();
        if (response.success && response.users) {
          setUsers(response.users);
        } else {
          setError(response.message || 'Failed to fetch users');
          // Don't fall back to sample data in production
          setUsers([]);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch users if we're authenticated
    if (authState.isAuthenticated && authState.token) {
      fetchUsers();
    } else {
      // If not authenticated, don't try to fetch users
      setError('Authentication required');
      setUsers([]);
    }
  }, [authState.isAuthenticated, authState.token]);

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase() || user.username?.toLowerCase() || '')
      .includes(searchTerm.toLowerCase()) || 
    (user.email?.toLowerCase() || '')
      .includes(searchTerm.toLowerCase()) ||
    (user.role?.toLowerCase() || '')
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusColor = (status: string = 'active') => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-orange-400';
      case 'suspended':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-navy-900">
      <header className="bg-navy-800 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Users size={24} className="text-teal-400 mr-2" />
            <h1 className="text-white text-lg font-bold">User Management</h1>
          </div>
          <div className="flex items-center">
            <div className="mr-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-teal-500 mr-2 flex items-center justify-center text-white font-bold">
                {authState.user?.name?.charAt(0) || authState.user?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-white">{authState.user?.name || 'User'}</span>
            </div>
            <Button
              variant="outline"
              className="px-3 py-1"
              onClick={logout}
            >
              <LogOut size={16} className="mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-navy-700 rounded-lg shadow-xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">User Management</h2>
            <div className="relative">
              <Search size={18} className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 bg-navy-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-400/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-4 border-teal-400 rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-400">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name/Username</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date Created</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentUsers.map((user, index) => (
                    <tr key={user._id} className="hover:bg-navy-600 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{indexOfFirstUser + index + 1}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full mr-3 bg-teal-500 flex items-center justify-center text-white">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name || user.username || ""} className="h-10 w-10 rounded-full" />
                            ) : (
                              <span className="font-bold">{(user.name || user.username || "U").charAt(0)}</span>
                            )}
                          </div>
                          <div className="text-sm font-medium text-white">{user.name || user.username}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{user.role || 'User'}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white items-center">
                          <span className={`h-2 w-2 rounded-full ${getStatusColor(user.status)} mr-1`}></span>
                          {(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex space-x-2">
                          <button className="p-1 rounded text-blue-400 hover:bg-blue-400/20 transition-colors">
                            <Settings size={18} />
                          </button>
                          <button className="p-1 rounded text-red-400 hover:bg-red-400/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="15" y1="9" x2="9" y2="15" />
                              <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                        No users found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {!loading && filteredUsers.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} entries
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-gray-600 text-gray-300 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? 'bg-teal-500 text-white'
                        : 'border border-gray-600 text-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border border-gray-600 text-gray-300 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;