export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
  icon,
}) {
  const base =
    "inline-flex items-center justify-center gap-2 text-sm font-medium rounded-full px-4 py-1.5 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-white text-black hover:bg-gray-200 active:scale-95",
    secondary: "bg-[#272727] text-white hover:bg-[#3a3a3a] active:scale-95",
    danger: "bg-red-600 text-white hover:bg-red-700 active:scale-95",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-[#272727] active:scale-95",
    outline: "border border-[#3a3a3a] text-white bg-transparent hover:bg-[#272727] active:scale-95",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/>
        </svg>
      ) : icon ? (
        <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}