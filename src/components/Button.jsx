export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'px-6 py-3 text-sm text-white hover:opacity-90 hover:scale-[1.02]',
    secondary: 'px-6 py-3 text-sm text-white bg-white/10 border border-white/15 hover:bg-white/15 hover:border-white/25',
    ghost: 'px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5',
    danger: 'px-6 py-3 text-sm text-white bg-red-500/20 border border-red-500/30 hover:bg-red-500/30',
  };

  const primaryStyle = variant === 'primary' ? { background: 'var(--gradient-primary)' } : {};

  return (
    <button
      className={`${baseClasses} ${variants[variant] || variants.primary} ${className}`}
      style={primaryStyle}
      {...props}
    >
      {children}
    </button>
  );
}
