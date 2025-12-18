const Loader = () => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-end gap-1.5 h-4 p-4 b"
    >
      <span className="w-2 h-2 rounded-full bg-zinc-500 animate-dot-wave animate-dot-wave-1" />
      <span className="w-2 h-2 rounded-full bg-zinc-500 animate-dot-wave animate-dot-wave-2" />
      <span className="w-2 h-2 rounded-full bg-zinc-500 animate-dot-wave animate-dot-wave-3" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;
