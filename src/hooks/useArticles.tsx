import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Article {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  status: string;
  is_featured: boolean;
  is_breaking: boolean;
  published_at: string | null;
  read_time: number | null;
  views_count: number;
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  author: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const useArticles = (options?: {
  categorySlug?: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
  limit?: number;
  status?: "draft" | "review" | "published" | "archived";
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const statusFilter = options?.status || "published";
        
        let query = supabase
          .from("articles")
          .select(
            `
            *,
            category:categories(id, name, slug),
            author:profiles(id, display_name, avatar_url)
          `
          )
          .eq("status", statusFilter)
          .order("published_at", { ascending: false });

        if (options?.categorySlug) {
          const { data: categoryData } = await supabase
            .from("categories")
            .select("id")
            .eq("slug", options.categorySlug)
            .single();

          if (categoryData) {
            query = query.eq("category_id", categoryData.id);
          }
        }

        if (options?.isFeatured !== undefined) {
          query = query.eq("is_featured", options.isFeatured);
        }

        if (options?.isBreaking !== undefined) {
          query = query.eq("is_breaking", options.isBreaking);
        }

        if (options?.searchQuery) {
          query = query.or(`title.ilike.%${options.searchQuery}%,content.ilike.%${options.searchQuery}%,excerpt.ilike.%${options.searchQuery}%`);
        }

        // Handle pagination
        if (options?.page && options?.pageSize) {
          const from = (options.page - 1) * options.pageSize;
          const to = from + options.pageSize - 1;
          query = query.range(from, to);
          
          // Get total count for pagination
          const { count } = await supabase
            .from("articles")
            .select("*", { count: "exact", head: true })
            .eq("status", statusFilter);
          
          setTotalCount(count || 0);
        } else if (options?.limit) {
          query = query.limit(options.limit);
        }

        const { data, error } = await query;

        if (error) throw error;

        setArticles(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [options?.categorySlug, options?.isFeatured, options?.isBreaking, options?.limit, options?.status, options?.searchQuery, options?.page, options?.pageSize]);

  return { articles, loading, error, totalCount };
};

export const useArticle = (slug: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select(
            `
            *,
            category:categories(id, name, slug),
            author:profiles(id, display_name, avatar_url)
          `
          )
          .eq("slug", slug)
          .single();

        if (error) throw error;

        // Record view
        if (data) {
          await supabase.from("article_views").insert([{ article_id: data.id }]);
          
          // Update views count
          await supabase
            .from("articles")
            .update({ views_count: (data.views_count || 0) + 1 })
            .eq("id", data.id);
        }

        setArticle(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  return { article, loading, error };
};
