import { useState, useEffect } from "react";
import { CMSLayout } from "@/components/cms/CMSLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { FileText, Users, Eye, Mail, TrendingUp, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  totalComments: number;
  totalSubscribers: number;
  recentArticles: Array<{
    id: string;
    title: string;
    status: string;
    views_count: number;
    created_at: string;
  }>;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalViews: 0,
    totalComments: 0,
    totalSubscribers: 0,
    recentArticles: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get articles stats
        const { data: articles } = await supabase
          .from("articles")
          .select("status, views_count");

        const totalArticles = articles?.length || 0;
        const publishedArticles = articles?.filter(a => a.status === "published").length || 0;
        const draftArticles = articles?.filter(a => a.status === "draft").length || 0;
        const totalViews = articles?.reduce((sum, article) => sum + (article.views_count || 0), 0) || 0;

        // Get comments count
        const { count: commentsCount } = await supabase
          .from("comments")
          .select("*", { count: "exact", head: true });

        // Get subscribers count
        const { count: subscribersCount } = await supabase
          .from("newsletter_subscribers")
          .select("*", { count: "exact", head: true });

        // Get recent articles
        const { data: recentArticles } = await supabase
          .from("articles")
          .select("id, title, status, views_count, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        setStats({
          totalArticles,
          publishedArticles,
          draftArticles,
          totalViews,
          totalComments: commentsCount || 0,
          totalSubscribers: subscribersCount || 0,
          recentArticles: recentArticles || [],
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "text-green-600";
      case "draft": return "text-yellow-600";
      case "review": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published": return "Pubblicato";
      case "draft": return "Bozza";
      case "review": return "In revisione";
      default: return status;
    }
  };

  return (
    <CMSLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Panoramica delle attività del sito
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Articoli Totali</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalArticles}</div>
              )}
              <p className="text-xs text-muted-foreground">
                {stats.publishedArticles} pubblicati, {stats.draftArticles} bozze
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visualizzazioni</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
              )}
              <p className="text-xs text-muted-foreground">
                Visualizzazioni totali
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Iscritti Newsletter</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
              )}
              <p className="text-xs text-muted-foreground">
                Iscritti attivi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commenti</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalComments}</div>
              )}
              <p className="text-xs text-muted-foreground">
                Commenti totali
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Articoli Recenti
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : stats.recentArticles.length > 0 ? (
              <div className="space-y-4">
                {stats.recentArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium line-clamp-1">{article.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className={getStatusColor(article.status)}>
                          {getStatusLabel(article.status)}
                        </span>
                        <span>{formatDate(article.created_at)}</span>
                        <span>{article.views_count} visualizzazioni</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nessun articolo trovato</p>
            )}
          </CardContent>
        </Card>
      </div>
    </CMSLayout>
  );
};

export default Dashboard;
