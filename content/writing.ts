export type WritingEntry = {
  slug: string;
  title: string;
  summary: string;
  publishedOn: string;
  category: string;
  references: readonly { title: string; href: string }[];
};

// Add only approved articles. Each entry has a matching content/notes/<slug>.md body.
export const writing: readonly WritingEntry[] = [];

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" });

export function noteDate(date: string) {
  return dateFormat.format(new Date(`${date}T00:00:00Z`));
}
