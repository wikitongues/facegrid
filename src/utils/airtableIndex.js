import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_API_KEY })
  .base(process.env.REACT_APP_AIRTABLE_BASE_ID);

export async function fetchIndex() {
  const records = [];
  await base(process.env.REACT_APP_AIRTABLE_TABLE_NAME)
    .select({
      view: "fred temp", // a view optimized to return minimal fields
      fields: ["speaker_id", "Identifier"],
    })
    .eachPage((recordsPage, fetchNextPage) => {
      records.push(...recordsPage);
      fetchNextPage();
    });
  // Map records to an index object
  return records.map(record => ({
    id: record.id,
    speaker_id: record.get("speaker_id"),
    identifier: record.get("Identifier"),
  }));
}
