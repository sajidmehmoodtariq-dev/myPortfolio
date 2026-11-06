export type Note = {
  slug: string;
  title: string;
  summary: string;
  topic: string;
  publishedOn: `${number}-${number}-${number}`;
};

// Register only approved pieces. The body is src/content/notes/<slug>.md.
const notes: readonly Note[] = [];

export const publishedNotes = [...notes].sort(
  (a, b) => b.publishedOn.localeCompare(a.publishedOn),
);

const noteDate = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
});

export function formatNoteDate(publishedOn: Note["publishedOn"]) {
  return noteDate.format(new Date(publishedOn));
}
