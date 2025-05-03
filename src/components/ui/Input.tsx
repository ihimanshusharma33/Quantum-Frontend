import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: typeof LucideIcon;
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  icon: Icon,
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      <div className="relative">
        {Icon && (
          <span className="absolute left-2  text-[#00ffe5] top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon size={24} />
          </span>
        )}

        <input
          className={`w-full bg-gray-600 border ${error ? 'border-red-400' : 'border-gray-600'
            } rounded px-4 py-2.5 text-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all duration-200 ${Icon ? 'pl-10' : ''
            } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-400 text-xs ">{error}</p>}
    </div>
  );
};

export default Input;