/* eslint-disable react/prop-types */
import 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center space-x-2 text-red-500 mt-2">
      <AlertCircle className="w-5 h-5" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
