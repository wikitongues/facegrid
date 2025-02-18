// src/hooks/useThumbnailsIndex.js
import { useState, useEffect } from "react";
import { fetchIndex } from "../utils/airtableIndex";
import { shuffleArray } from "../utils/shuffle";
import { fetchFullRecordsByIds } from "../utils/airtableFull";

export function useThumbnailsIndex(pageSize = 12) {
  const [index, setIndex] = useState([]);       // Lightweight index
  const [currentPage, setCurrentPage] = useState(0);
  const [fullRecords, setFullRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [indexAttempts, setIndexAttempts] = useState(0);

  async function initIndex() {
    const idx = await fetchIndex();
    const shuffled = shuffleArray(idx);
    setIndex(shuffled);
    setCurrentPage(0);
  }

  async function loadPage(page = 0) {
    if (index.length === 0) return;
    const start = page * pageSize;
    if (start >= index.length) {
      // Index exhausted – reinitialize
      setIndexAttempts(prev => prev + 1);
      await initIndex();
      return loadPage(0);
    }
    const pageIds = index.slice(start, start + pageSize).map(item => item.id);
    const fullRecs = await fetchFullRecordsByIds(pageIds);
    setFullRecords(fullRecs);
    setCurrentPage(page);
  }

  useEffect(() => {
    async function initialize() {
      setLoading(true);
      await initIndex();
      await loadPage(0);
      setLoading(false);
    }
    initialize();
  }, [pageSize]);

  const nextPage = async () => {
    setLoading(true);
    await loadPage(currentPage + 1);
    setLoading(false);
  };

  // Optional: function to reroll one item using the next available record in the index
  const rerollOne = async (pageIndex) => {
    // ... your logic to fetch a new record from the index and update fullRecords
  };

  return { fullRecords, loading, nextPage, rerollOne };
}
