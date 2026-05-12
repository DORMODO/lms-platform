const config = {
  ADMIN: { label: 'Admin', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  INSTRUCTOR: { label: 'Instructor', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  STUDENT: { label: 'Student', className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
};

const RoleBadge = ({ role, className = '' }) => {
  const { label, className: badgeClass } = config[role] || config.STUDENT;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass} ${className}`}>
      {label}
    </span>
  );
};

export default RoleBadge;
