import { useState, useEffect, useCallback } from "react";
import { fetchThumbnails } from "../utils/airtable";

export function useThumbnails(requiredCount) {
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Wrap loadThumbnails in useCallback to ensure it's not re-created on every render.
  const loadThumbnails = useCallback(async () => {
    setLoading(true);
    const images = await fetchThumbnails(requiredCount);
    setThumbnails(images);
    setLoading(false);
  }, [requiredCount]);

  // Now, we can safely list loadThumbnails in the dependency array.
  useEffect(() => {
    loadThumbnails();
  }, [loadThumbnails]);

  const rerollThumbnail = (index) => {
    fetchThumbnails(1).then(([newImage]) => {
      if (newImage) {
        setThumbnails((prev) => {
          const updated = [...prev];
          updated[index] = newImage;
          return updated;
        });
      }
    });
  };

  const rerollAll = () => {
    loadThumbnails();
  };

  return { thumbnails, loading, rerollThumbnail, rerollAll };
}
