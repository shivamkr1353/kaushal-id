export default function Input({ label, id, type = 'text', className = '', ...props }) {
  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        type={type}
        placeholder=" "
        className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#6366f1]/50 focus:bg-white/8 transition-all placeholder-transparent"
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-2 text-xs text-white/40 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#818cf8] transition-all pointer-events-none"
      >
        {label}
      </label>
    </div>
  );
}
