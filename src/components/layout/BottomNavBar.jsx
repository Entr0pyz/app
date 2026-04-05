import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, History, Settings } from 'lucide-react';

const navItems = [
  { to: '/',        label: 'Home',     Icon: Home },
  { to: '/workout', label: 'Workout',  Icon: Dumbbell },
  { to: '/history', label: 'History',  Icon: History },
  { to: '/settings',label: 'Settings', Icon: Settings },
];

export default function BottomNavBar() {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {navItems.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `bottom-nav__item${isActive ? ' active' : ''}`
          }
          aria-label={label}
        >
          <Icon className="bottom-nav__icon" strokeWidth={1.75} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
