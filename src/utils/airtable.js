// src/utils/airtable.js
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_API_KEY })
  .base(process.env.REACT_APP_AIRTABLE_BASE_ID);

// Global pool and set to track unique speaker_ids.
let globalImagePool = [];
let usedSpeakerIds = new Set();
let prefetching = false;

// Configuration constants.
const INITIAL_FETCH_COUNT = 20; // Quick load for first paint.
const PREFETCH_COUNT = 200;       // Batch size for background prefetch.
const MAX_RETRIES = 3;            // Maximum retry attempts for prefetching.
const MAX_FETCH_ATTEMPTS = 3;     // Safeguard for when pool is exhausted.

// Helper: Fetch raw records from Airtable.
async function fetchRecordsFromAirtable(maxRecords) {
  const records = [];
  await base(process.env.REACT_APP_AIRTABLE_TABLE_NAME)
    .select({
      view: "fred temp",
      filterByFormula: "AND({public_status} = 'Public', {Raw Thumbnail} != '')",
      maxRecords: maxRecords,
    })
    .eachPage((recordsPage, fetchNextPage) => {
      records.push(...recordsPage);
      fetchNextPage();
    });
  return records;
}

// Helper: Format a raw record into our desired image object.
function formatRecord(record) {
  const rawThumbnail = record.get("Raw Thumbnail");
  if (!rawThumbnail || rawThumbnail.length === 0) return null;
  // Prefer small thumbnail if available; fallback to full URL.
  const thumb = rawThumbnail[0];
  const imageUrl =
    thumb.thumbnails?.large?.url ||
    thumb.url ||
    null;
  if (!imageUrl) return null;
  // Compute orientation: 'landscape' if width >= height, else 'portrait'
  const orientation = thumb.width >= thumb.height ? 'landscape' : 'portrait';
  return {
    id: record.id,
    speaker_id: record.get("speaker_id"),
    identifier: record.get("Identifier"),
    imageUrl: imageUrl,
    orientation, // add the computed orientation
    data: {
      youtubeLink: record.get("youtube_link") || null,
      publicStatus: record.get("public_status") || "Unknown",
      featuredLanguages: record.get("featured_languages") || [],
    },
  };
}


/**
 * Main function: Returns exactly `count` unique images (by speaker_id).
 * If the pool is exhausted, it resets (by clearing usedSpeakerIds and pool)
 * and refetches new records. A maximum fetch attempt is enforced.
 */
export async function fetchThumbnails(count = 12, attempt = 1) {
  // If our pool is low, do an initial quick fetch.
  if (globalImagePool.length < count) {
    try {
      const records = await fetchRecordsFromAirtable(INITIAL_FETCH_COUNT);
      const formattedRecords = records.map(formatRecord).filter(Boolean);
      // Only add records whose speaker_id hasn’t been used.
      const newRecords = formattedRecords.filter(
        (record) => !usedSpeakerIds.has(record.speaker_id)
      );
      globalImagePool.push(...newRecords);
    } catch (error) {
      console.error("Error during initial fetch:", error);
    }
    // Trigger background prefetch if not already in progress.
    if (!prefetching) {
      prefetchMoreImages();
    }
  }

  // Select images from the pool that haven’t been used (by speaker_id).
  const selected = [];
  let i = 0;
  while (selected.length < count && i < globalImagePool.length) {
    const img = globalImagePool[i];
    if (!usedSpeakerIds.has(img.speaker_id)) {
      selected.push(img);
      usedSpeakerIds.add(img.speaker_id);
    }
    i++;
  }
  // Remove the selected images from the pool.
  globalImagePool = globalImagePool.filter(
    (img) => !usedSpeakerIds.has(img.speaker_id)
  );

  // If we couldn't get enough images and haven't reached the max attempts,
  // then reset our usedSpeakerIds and pool, then try fetching again.
  if (selected.length < count && attempt < MAX_FETCH_ATTEMPTS) {
    console.warn(
      `Pool exhausted: only ${selected.length} images found. Refetching new records (attempt ${attempt + 1})...`
    );
    usedSpeakerIds = new Set();
    globalImagePool = [];
    return fetchThumbnails(count, attempt + 1);
  }

  return selected;
}

// Function to prefetch more images in the background with error handling & retry.
async function prefetchMoreImages(retryCount = 0) {
  prefetching = true;
  try {
    const records = await fetchRecordsFromAirtable(PREFETCH_COUNT);
    const formattedRecords = records.map(formatRecord).filter(Boolean);
    // Build a set of speaker_ids already used or in the pool.
    const existingSpeakerIds = new Set([
      ...usedSpeakerIds,
      ...globalImagePool.map((img) => img.speaker_id),
    ]);
    // Filter out any records whose speaker_id is already present.
    const uniqueRecords = formattedRecords.filter(
      (record) => !existingSpeakerIds.has(record.speaker_id)
    );
    globalImagePool.push(...uniqueRecords);
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.error("Error prefetching images, retrying...", error);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds.
      return prefetchMoreImages(retryCount + 1);
    } else {
      console.error("Error prefetching images after max retries:", error);
    }
  } finally {
    prefetching = false;
  }
}
