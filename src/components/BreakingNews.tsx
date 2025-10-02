import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";
import { Skeleton } from "@/components/ui/skeleton";

const BreakingNews = () => {
  const { articles: breakingNews, loading } = useArticles({ 
    isBreaking: true, 
    limit: 5 
  });

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
    <div className="rounded-sm border border-accent/20 bg-accent/5 p-4">
      <div className="mb-4 flex items-center gap-2 border-b border-accent/20 pb-3">
        <AlertCircle className="h-5 w-5 text-accent" />
        <h3 className="font-sans text-sm font-bold uppercase tracking-wide">Ultime Notizie</h3>
      </div>
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      ) : breakingNews.length > 0 ? (
        <ul className="space-y-4">
          {breakingNews.map((item) => (
            <li key={item.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
              <Link to={`/articolo/${item.slug}`} className="group block">
                <p className="mb-1 font-serif text-sm font-semibold leading-tight transition-colors group-hover:text-accent">
                  {item.title}
                </p>
                <span className="text-xs text-muted-foreground">{formatDate(item.published_at)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-4 text-center text-sm text-muted-foreground">
          Nessuna notizia urgente al momento
        </p>
      )}
    </div>
  );
};

export default BreakingNews;
