const Button = ({ children, variant = 'primary', size = 'md', className = '', disabled, ...props }) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/20',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-ring',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive/20',
    ghost: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-ring',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
