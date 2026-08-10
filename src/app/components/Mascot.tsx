export default function Mascot({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* тело-домик */}
      <rect x="18" y="42" width="60" height="44" rx="12" fill="#fff" />
      <rect x="18" y="42" width="60" height="44" rx="12" stroke="#e2e8f0" strokeWidth="2" />
      {/* крыша */}
      <path d="M48 10 L86 44 Q88 47 84 48 L12 48 Q8 47 10 44 Z" fill="#4f46e5" />
      <path d="M48 10 L86 44 Q88 47 84 48 L12 48 Q8 47 10 44 Z" fill="#4f46e5" />
      {/* труба */}
      <rect x="66" y="20" width="9" height="16" rx="2" fill="#4338ca" />
      {/* глаза */}
      <circle cx="38" cy="60" r="5.5" fill="#0f172a" />
      <circle cx="58" cy="60" r="5.5" fill="#0f172a" />
      <circle cx="40" cy="58.5" r="1.8" fill="#fff" />
      <circle cx="60" cy="58.5" r="1.8" fill="#fff" />
      {/* улыбка */}
      <path d="M38 70 Q48 79 58 70" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* щёчки */}
      <circle cx="30" cy="68" r="3" fill="#fca5a5" opacity="0.7" />
      <circle cx="66" cy="68" r="3" fill="#fca5a5" opacity="0.7" />
    </svg>
  );
}
