import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_API_KEY })
  .base(process.env.REACT_APP_AIRTABLE_BASE_ID);

export async function fetchFullRecordsByIds(identifiers) {
  if (identifiers.length === 0) return [];
  // Build a filter formula that checks for each Identifier.
  // E.g.: OR({Identifier} = "ID1", {Identifier} = "ID2", ...)
  const formula = `OR(${identifiers.map(id => `{Identifier} = "${id}"`).join(", ")})`;
  const records = [];
  await base(process.env.REACT_APP_AIRTABLE_TABLE_NAME)
    .select({
      view: process.env.REACT_APP_AIRTABLE_VIEW_NAME,
      filterByFormula: formula,
    })
    .eachPage((recordsPage, fetchNextPage) => {
      records.push(...recordsPage);
      fetchNextPage();
    });
  return records.map(record => ({
    id: record.id,
    speaker_id: record.get("speaker_id"),
    identifier: record.get("Identifier"),
    imageUrl:
      record.get("Raw Thumbnail")?.[0]?.thumbnails?.large?.url ||
      record.get("Raw Thumbnail")?.[0]?.url ||
      "",
    orientation:
      record.get("Raw Thumbnail")?.[0]?.width >= record.get("Raw Thumbnail")?.[0]?.height
        ? "landscape"
        : "portrait",
    data: {
      youtubeLink: record.get("youtube_link") || null,
      publicStatus: record.get("public_status") || "Unknown",
      featuredLanguages: record.get("featured_languages") || [],
    },
  }));
}
