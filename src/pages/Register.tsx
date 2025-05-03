import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, CircleUserRound, LockKeyhole, Calendar, Mail, User2, CalendarCheck } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    dateOfBirth: ''
  });
  
  const { register, loading, error } = useAuth();

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      dateOfBirth: ''
    };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

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
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && dateOfBirth) {
      const formattedDate = dateOfBirth.toISOString().split('T')[0];
      
      await register({
        name,
        email,
        password,
        dateOfBirth: formattedDate
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center w-[48vw] h-[85vh] bg-gradient-to-b from-[#007c7b] to-[#00c5ba] rounded-lg shadow-lg px-8 py-8">
        <div className='bg-navy-700 h-[80vh] w-[20vw] relative rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] p-8 pt-0 flex flex-col items-center justify-start'>
          <h1 className="text-2xl font-bold text-gray-200 mb-4 bg-[#00ffe5] text-navy-800 p-4 px-6">SIGN UP</h1>
          <span className="text-sm text-gray-400 mb-4">
            <CircleUserRound className="relative top-[1rem] right-[0px] z-10" size={70} />
          </span>
           
          {error && (
              <div className="w-full mt-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-500 text-center">
                {error}
              </div>
            )}

          <div className="absolute top-[10rem] w-[100%] border-t z-1 border-2 border-gray-600 mb-4"></div>
          <div className='flex mt-8 flex-col items-center justify-center w-full'>
            <Input
              icon={User2}
              className='my-2 w-full'
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            <Input
              icon={Mail}
              className='my-2 w-full'
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            
            <Input
              icon={CalendarCheck}
              className='my-2 w-full'
              label="Date of Birth"
              type="date"
              placeholder="Enter your date of birth"
              value={dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                setDateOfBirth(date);
              }}
              error={errors.dateOfBirth}
              max={new Date().toISOString().split('T')[0]}
              style={{ width: '100%', minWidth: '18rem' }}
            />
            
            <Input
              icon={LockKeyhole}
              className='mb-4 w-full'
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            
            <div className='flex items-center justify-between w-full px-4 mt-1'>
              <p className="text-sm text-gray-400">
                Already have an account?
              </p>
              <Link to="/login" className="text-sm text-[#00ffe5] hover:text-[#00ffe5]/80 transition-colors">
                Sign In
              </Link>
            </div>
           
            
            <button
              className='w-[100%] mt-8 bg-[#00ffe5] text-xl text-navy-800 font-bold py-2 px-4 rounded hover:bg-[#00ffe5]/80 transition duration-200'
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-navy-800 rounded-full border-t-transparent animate-spin mr-2"></div>
                  Creating Account...
                </span>
              ) : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;