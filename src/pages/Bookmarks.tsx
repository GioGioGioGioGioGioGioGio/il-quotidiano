import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { useBookmarks } from "@/hooks/useBookmarks";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark } from "lucide-react";
import type { Article } from "@/hooks/useArticles";

const Bookmarks = () => {
  const { bookmarks } = useBookmarks();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkedArticles = async () => {
      if (bookmarks.length === 0) {
        setArticles([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("articles")
          .select(`
            *,
            category:categories(id, name, slug),
            author:profiles(id, display_name, avatar_url)
          `)
          .in("id", bookmarks)
          .eq("status", "published");

        if (error) throw error;
        setArticles(data || []);
      } catch (error) {
        console.error("Error fetching bookmarked articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedArticles();
  }, [bookmarks]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Pochi minuti fa";
    if (diffHours < 24) return `${diffHours} ore fa`;
    return date.toLocaleDateString("it-IT", { day: "numeric", month: "long" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-3">
          <Bookmark className="h-6 w-6 text-accent" />
          <h1 className="font-serif text-4xl font-bold md:text-5xl">
            Articoli Salvati
          </h1>
        </div>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.slug}
                title={article.title}
                excerpt={article.excerpt || ""}
                category={article.category?.name || ""}
                image={article.featured_image || ""}
                readTime={`${article.read_time || 5} min`}
                date={formatDate(article.published_at)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Bookmark className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 font-serif text-2xl font-bold">
              Nessun articolo salvato
            </h2>
            <p className="text-muted-foreground">
              Salva gli articoli che ti interessano per leggerli più tardi
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Bookmarks;
