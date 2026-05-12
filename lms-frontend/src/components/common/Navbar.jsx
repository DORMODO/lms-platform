import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../store/AuthContext';
import RoleBadge from './RoleBadge';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;
  const role = user.role;
  const displayName = user.name || user.email;

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      <Link to="/" className="text-lg font-semibold text-foreground">
        LMS Platform
      </Link>

      <div className="flex items-center gap-4">
        <RoleBadge role={role} />
        <span className="text-sm text-muted-foreground">{displayName}</span>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Sign out
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
