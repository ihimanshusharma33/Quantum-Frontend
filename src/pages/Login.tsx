import React, { useState } from 'react';
import { User, Lock, CircleUserRound, LockKeyhole } from 'lucide-react';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const { login, loading, error } = useAuth();

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await login({ email, password });
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div
        className="flex flex-col items-center justify-center w-[48vw] h-[85vh] bg-gradient-to-b from-[#007c7b] to-[#00c5ba] rounded-lg shadow-lg px-8 py-8"
      >
        <div className='bg-navy-700 w-[20vw] relative h-[65vh] rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]  p-8 pt-0 flex flex-col items-center justify-start'>
          <h1 className="text-2xl font-bold text-gray-200 mb-4 bg-[#00ffe5] text-navy-800 p-4 px-6">SIGN IN</h1>
          <span className="text-sm text-gray-400 mb-4">
            <CircleUserRound className="relative top-[1rem] right-[0px] z-10" size={70} />
          </span>

          <div className="absolute top-[10rem] w-[100%] border-t z-1 border-2 border-gray-600 mb-4"></div>
          {error && (
            <div className="w-full mt-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-500 text-center">
              {error}
            </div>
          )}
          <div className='flex mt-8 flex-col items-center justify-center'>
            <Input
              icon={User}
              className='my-2 w-[100%]'
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Input
              icon={LockKeyhole}
              className='mb-4'
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            <div className='flex items-center justify-between w-full px-4 mt-1'>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id="remember-me"
                  className='w-4 h-4 text-[#00ffe5] border-gray-300 rounded focus:ring-[#00ffe5] cursor-pointer'
                />
                <label htmlFor="remember-me" className='text-sm text-gray-400 ml-2 cursor-pointer'>Remember me</label>
              </div>
              <button className="text-sm text-[#00ffe5] hover:text-[#00ffe5]/80 transition-colors">
                Forgot Password?
              </button>
            </div>

            <button
              className='w-[100%] mt-8 bg-[#00ffe5] text-xl text-navy-800 font-bold py-2 px-4 rounded hover:bg-[#00ffe5]/80 transition duration-200'
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          <Link to="/register" className="text-sm text-[#00ffe5] hover:text-[#00ffe5]/80 transition-colors mt-4">
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;