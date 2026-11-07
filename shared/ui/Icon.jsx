export function Icon({ name, size = 18 }) {
  const paths = {
    coin: <><circle cx="12" cy="12" r="9" /><path d="M15.2 8.7c-.6-.7-1.5-1-2.6-1-1.5 0-2.6.8-2.6 1.9 0 2.8 5.3 1.2 5.3 4.3 0 1.2-1.1 2.2-2.8 2.2-1.2 0-2.2-.4-2.9-1.2M12.5 6v12" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M12 14v3" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    refresh: <><path d="M20 7v5h-5" /><path d="M4.8 9A7.5 7.5 0 0 1 18 6.6L20 12M4 17v-5h5" /><path d="M19.2 15A7.5 7.5 0 0 1 6 17.4L4 12" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.1L12 19l-1.9-5.9L4 11l6.1-2.2L12 3Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}
