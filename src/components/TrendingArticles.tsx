import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

interface TrendingArticle {
  id: string;
  title: string;
  slug: string;
  views_count: number;
}

const TrendingArticles = () => {
  const [trending, setTrending] = useState<TrendingArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("id, title, slug, views_count")
          .eq("status", "published")
          .order("views_count", { ascending: false })
          .limit(5);

        if (error) throw error;
        setTrending(data || []);
      } catch (error) {
        console.error("Error fetching trending articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3 border-b pb-4">
        <div className="rounded-full bg-accent/10 p-2">
          <TrendingUp className="h-4 w-4 text-accent" />
        </div>
        <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-foreground">Più Letti</h3>
      </div>
      {loading ? (
        <div className="space-y-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : trending.length > 0 ? (
        <ol className="space-y-5">
          {trending.map((item, index) => (
            <li key={item.id} className="flex gap-4 border-b border-border/50 pb-4 last:border-0 last:pb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-sm">
                {index + 1}
              </div>
              <Link to={`/articolo/${item.slug}`} className="group flex-1">
                <p className="font-serif text-sm font-semibold leading-tight transition-colors group-hover:text-accent text-foreground mb-1">
                  {item.title}
                </p>
                <span className="text-xs text-muted-foreground">
                  {item.views_count} visualizzazioni
                </span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="py-4 text-center text-sm text-muted-foreground">
          Nessun articolo di tendenza al momento
        </p>
      )}
    </div>
  );
};

export default TrendingArticles;
