
import { Home, UserPlus, Users } from 'lucide-react';
import { Button, Tooltip } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <Users size={20} />,
    description: 'Main page to display all users with their info and follower/following counts. Includes follow/unfollow functionality.',
  },
  {
    name: 'Create User',
    path: '/create-user',
    icon: <UserPlus size={20} />,
    description: 'Form page to add a new user with validation.',
  },

];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-blue-600 text-white shadow-md px-6 py-3 flex justify-between items-center">
      <div className="text-2xl font-bold tracking-widest">Social App</div>

      <div className="space-x-4 flex items-center">
        {navItems.map(({ name, path, icon, description }) => {
          const active = location.pathname === path;
          return (
            <Tooltip key={path} title={description} placement="bottom">
              <Link to={path}>
                <Button
                  type={active ? "primary" : "text"}
                  icon={icon}
                  className={`flex items-center space-x-2 capitalize font-semibold ${
                    active ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-400'
                  }`}
                >
                  <span>{name}</span>
                </Button>
              </Link>
            </Tooltip>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
