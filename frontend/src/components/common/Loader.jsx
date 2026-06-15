export default function Loader({ fullscreen = false, size = "md" }) {
  const sizes = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };

  const spinner = (
    <div className={`${sizes[size]} rounded-full border-2 border-[#2a2a2a] border-t-red-600 animate-spin`} />
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-blue-50 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      {spinner}
    </div>
  );
}