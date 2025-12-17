const Loader = () => {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className="flex items-end gap-1.5 h-4 p-4 b"
    >
      <span className="w-2.5 h-2.5 rounded-full bg-zinc-500 animate-dot-wave animate-dot-wave-1" />
      <span className="w-2.5 h-2.5 rounded-full bg-zinc-500 animate-dot-wave animate-dot-wave-2" />
      <span className="w-2.5 h-2.5 rounded-full bg-zinc-500 animate-dot-wave animate-dot-wave-3" />
      <span className="sr-only">Carregando…</span>
    </div>
  );
};

export default Loader;
