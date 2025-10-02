import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const BOOKMARKS_KEY = "quotidiano-bookmarks";

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Load bookmarks from localStorage
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveBookmarks = (newBookmarks: string[]) => {
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
      setBookmarks(newBookmarks);
    } catch (error) {
      console.error("Error saving bookmarks:", error);
    }
  };

  const toggleBookmark = (articleId: string) => {
    const isBookmarked = bookmarks.includes(articleId);

    if (isBookmarked) {
      const newBookmarks = bookmarks.filter(id => id !== articleId);
      saveBookmarks(newBookmarks);
      toast({
        title: "Rimosso dai salvati",
        description: "L'articolo è stato rimosso dai tuoi salvati.",
      });
    } else {
      const newBookmarks = [...bookmarks, articleId];
      saveBookmarks(newBookmarks);
      toast({
        title: "Salvato!",
        description: "L'articolo è stato aggiunto ai tuoi salvati.",
      });
    }
  };

  const isBookmarked = (articleId: string) => bookmarks.includes(articleId);

  return {
    bookmarks,
    loading,
    toggleBookmark,
    isBookmarked,
  };
};
