import { Link } from 'react-router-dom';

export default function AgentNav() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAgent');
    window.location.replace('/login');
  };

  const links = [
    { to: '/tenants', label: 'Agent List' },
    { to: '/reports', label: 'Reports' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-[#8A9A57] shadow-lg py-4 px-8">
      {/* Logo & Title */}
      <div className="flex items-center space-x-4">
        <img
          src="/Test/images/logo1.png"
          alt="Agent Logo"
          className="h-30 w-30 rounded-full border-2 border-white"
        />
        <h2 className="text-white text-lg font-bold uppercase">Account Manager</h2>
      </div>

      {/* Links */}
      <ul className="flex space-x-6">
        {links.map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              className="text-white text-md font-semibold uppercase transition hover:scale-105 hover:text-gray-200"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="text-white text-md font-semibold uppercase transition hover:scale-105 hover:text-gray-200"
      >
        Logout
      </button>
    </nav>
  );
}
