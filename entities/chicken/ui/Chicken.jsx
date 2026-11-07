export function SquashedChicken() {
  return (
    <svg className="chicken squashed-chicken" viewBox="0 0 90 62" role="img" aria-label="Цыплёнок сплющен после столкновения">
      <ellipse cx="45" cy="49" rx="29" ry="5" fill="rgba(0,0,0,.25)" />
      <path d="M17 39c0-10 10-17 27-17 17 0 28 6 28 16 0 8-11 12-28 12S17 47 17 39Z" fill="#ffd15e" stroke="#9e6327" strokeWidth="2.5" />
      <path d="M29 31c-5-6-2-12 3-13 5-1 7 4 8 8m16 3c7-5 12-2 11 3" fill="#f4b84d" stroke="#9e6327" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M59 23c-1-5 4-7 7-3 4-3 8 0 5 5" fill="#ef6c58" stroke="#a9433b" strokeWidth="2" />
      <path d="m69 31 12 4-12 4c2-3 2-5 0-8Z" fill="#f47b45" stroke="#a94e31" strokeWidth="2" />
      <path d="m43 27 4 5-4 4m12-9 4 5-4 4" fill="none" stroke="#263028" strokeWidth="2.5" strokeLinecap="round" />
      <path d="m10 19-3-5m70 16 5-4M17 12l-2-5" fill="none" stroke="#ffe28d" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Chicken({ jumping = false, crashed = false }) {
  if (crashed) return <SquashedChicken />;
  return (
    <svg className={`chicken ${jumping ? 'is-jumping' : ''}`} viewBox="0 0 76 76" role="img" aria-label="Курочка">
      <ellipse cx="37" cy="59" rx="20" ry="4" fill="rgba(0,0,0,.23)" />
      <path d="M15 42c0-12 9-20 22-20 12 0 21 8 21 19 0 12-9 20-22 20-12 0-21-7-21-19Z" fill="#ffd463" stroke="#9e6327" strokeWidth="2.5" />
      <path d="M21 39c4-7 13-9 18-4 4 4 3 10-2 13-5 4-13 2-16-3" fill="#fff0a1" stroke="#d89e3d" strokeWidth="1.5" />
      <circle cx="48" cy="24" r="14" fill="#ffe17d" stroke="#9e6327" strokeWidth="2.5" />
      <path d="M43 10c-2-5 4-8 7-3 4-4 9-1 6 5" fill="#ff765f" stroke="#aa463e" strokeWidth="2" strokeLinecap="round" />
      <path d="m60 23 13 5-13 5c2-4 2-7 0-10Z" fill="#ff8248" stroke="#a94e31" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="51" cy="21" r="2.2" fill="#25211a" /><circle cx="51.7" cy="20.2" r=".65" fill="#fff" />
      <path d="M28 58v6m13-6v6m-14 0-4 3m18-3 4 3" fill="none" stroke="#d5793e" strokeWidth="3" strokeLinecap="round" />
      <path d="M17 31c-5 1-7 5-7 9 0 4 3 7 7 8" fill="none" stroke="#e5a842" strokeWidth="3" strokeLinecap="round" />
      <path d="m18 22-4-4m8 1-1-6" fill="none" stroke="#ffd463" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Car({ color = 'mint', delay = '0s', duration = '4s' }) {
  return (
    <span className={`car car-${color}`} style={{ '--delay': delay, '--duration': duration }} aria-hidden="true">
      <svg className="car-model" viewBox="0 0 64 128" focusable="false">
        <ellipse cx="32" cy="67" rx="25" ry="55" fill="rgba(0,0,0,.34)" />
        <path d="M13 33 17 16Q19 7 27 5h10q8 2 10 11l4 17 5 9q3 6 3 14v42q0 9-5 13l-5 7H15l-5-7q-5-4-5-13V56q0-8 3-14l5-9Z" fill="currentColor" stroke="#17201c" strokeWidth="3" />
        <path d="m19 19 3-8q1-3 5-3h10q4 0 5 3l3 8-2 18H21l-2-18Z" fill="#bdd8d2" stroke="#e7eee0" strokeWidth="2" />
        <path d="m20 43 3-3h18l3 3 3 12H17l3-12Z" fill="#293a3b" stroke="rgba(255,255,255,.22)" strokeWidth="1.5" />
        <path d="M17 62h30v29H17z" fill="rgba(255,255,255,.07)" />
        <path d="m20 96 2 17q1 5 5 5h10q4 0 5-5l2-17H20Z" fill="#9cbab4" stroke="#dce7dd" strokeWidth="2" />
        <path d="M11 23h5v16h-5q-4 0-4-4v-8q0-4 4-4Zm42 0h-5v16h5q4 0 4-4v-8q0-4-4-4ZM7 48h5v16H7q-3 0-3-4v-8q0-4 3-4Zm50 0h-5v16h5q3 0 3-4v-8q0-4-3-4ZM8 99h5v15H8q-3 0-3-4v-7q0-4 3-4Zm48 0h-5v15h5q3 0 3-4v-7q0-4-3-4Z" fill="#171d1a" />
        <path d="M14 12h5v9h-6Zm31 0h5v9h-6ZM20 117h7v4h-9Zm17 0h7l2 4h-9Z" fill="#ffe3a0" />
        <path d="M14 73h3v12h-3Zm33 0h3v12h-3Z" fill="rgba(255,255,255,.3)" />
      </svg>
    </span>
  );
}
