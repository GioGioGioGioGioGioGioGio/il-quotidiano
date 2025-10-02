import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FileText, Users, Eye } from "lucide-react";

interface Stats {
  totalArticles: number;
  totalViews: number;
  totalSubscribers: number;
}

export const SiteStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalArticles: 0,
    totalViews: 0,
    totalSubscribers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total published articles
        const { count: articlesCount } = await supabase
          .from("articles")
          .select("*", { count: "exact", head: true })
          .eq("status", "published");

        // Get total views
        const { data: viewsData } = await supabase
          .from("articles")
          .select("views_count")
          .eq("status", "published");

        const totalViews = viewsData?.reduce((sum, article) => sum + (article.views_count || 0), 0) || 0;

        // Get total newsletter subscribers
        const { count: subscribersCount } = await supabase
          .from("newsletter_subscribers")
          .select("*", { count: "exact", head: true });

        setStats({
          totalArticles: articlesCount || 0,
          totalViews,
          totalSubscribers: subscribersCount || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4 text-center">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-1">
            <div className="h-6 w-12 mx-auto bg-muted animate-pulse rounded" />
            <div className="h-4 w-16 mx-auto bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-1">
          <FileText className="h-4 w-4 text-accent" />
          <span className="font-bold text-lg">{formatNumber(stats.totalArticles)}</span>
        </div>
        <p className="text-xs text-muted-foreground">Articoli</p>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-1">
          <Eye className="h-4 w-4 text-accent" />
          <span className="font-bold text-lg">{formatNumber(stats.totalViews)}</span>
        </div>
        <p className="text-xs text-muted-foreground">Visualizzazioni</p>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-1">
          <Users className="h-4 w-4 text-accent" />
          <span className="font-bold text-lg">{formatNumber(stats.totalSubscribers)}</span>
        </div>
        <p className="text-xs text-muted-foreground">Iscritti</p>
      </div>
    </div>
  );
};
