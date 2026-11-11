import { getContent } from "@/lib/content";

export async function Logo() {
  const { nama } = await getContent();
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 40 40" className="size-10" aria-hidden>
        <circle cx="20" cy="20" r="20" className="fill-primary" />
        <circle cx="20" cy="11" r="4" className="fill-primary-foreground" />
        <path d="M12 19c3 2 13 2 16 0M20 17v9m0 0-5 6m5-6 5 6" className="stroke-primary-foreground" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
      <span className="font-heading text-xl uppercase italic sm:text-2xl leading-none whitespace-nowrap">{nama}</span>
    </span>
  );
}
