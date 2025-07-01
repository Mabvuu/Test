import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setToken, setIsAdmin }) {
  const [view, setView] = useState('admin'); // 'admin' or 'manager'
  const navigate = useNavigate();

  // Directly simulate successful login
  const handleLogin = () => {
    if (view === 'admin') {
      setToken('mockAdminToken');
      setIsAdmin(true);
      navigate('/add');
    } else if (view === 'manager') {
      setToken('mockManagerToken');
      setIsAdmin(false);
      navigate('/tenants');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f5] text-gray-700 relative">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setView('admin')}
          className={`px-4 py-2 rounded-md font-semibold border border-white ${
            view === 'admin' ? 'bg-[#4F5862] text-white' : 'bg-[#8A9A57] text-white'
          }`}
        >
          ADMIN
        </button>
        <button
          onClick={() => setView('manager')}
          className={`px-4 py-2 rounded-md font-semibold border border-white ${
            view === 'manager' ? 'bg-[#4F5862] text-white' : 'bg-[#8A9A57] text-white'
          }`}
        >
          ACCOUNT MANAGER
        </button>
      </div>

      {view === 'admin' && (
        <div className="w-full max-w-sm bg-[#6E7881] rounded-lg shadow-md p-6">
          <div className="rounded-full border-4 border-white border-double p-1">
            <img
              src="/Test/images/logo1.png"
              alt="Logo"
              className="h-36 w-36 rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-center pt-4 mb-6 text-white">
            ADMIN LOGIN
          </h1>
          <button
            onClick={handleLogin}
            className="w-full bg-white text-[#6E7881] hover:text-[#ffffff] py-2 rounded-md hover:bg-[#556B2F] transition-colors"
          >
            LOGIN
          </button>
        </div>
      )}

      {view === 'manager' && (
        <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
          <div className="rounded-full border-4 border-[#4F5862] border-double p-1">
            <img
              src="/Test/images/logo1.png"
              alt="Logo"
              className="h-36 w-36 rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6 pt-4 text-[#4F5862]">
            ACCOUNT MANAGER LOGIN
          </h1>
          <button
            onClick={handleLogin}
            className="w-full bg-[#8A9A57] text-white py-2 rounded-md hover:bg-[#556B2F] transition-colors"
          >
            LOGIN
          </button>
        </div>
      )}
    </div>
  );
}
