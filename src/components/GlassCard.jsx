export default function GlassCard({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`glass rounded-2xl p-6 ${hover ? 'hover-lift' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
