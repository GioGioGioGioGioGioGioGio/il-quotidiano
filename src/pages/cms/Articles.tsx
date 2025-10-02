import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CMSLayout } from "@/components/cms/CMSLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Filter
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { Article } from "@/hooks/useArticles";

type ArticleStatus = "draft" | "review" | "published" | "archived";

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | "all">("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, [statusFilter]);

  const fetchArticles = async () => {
    try {
      let query = supabase
        .from("articles")
        .select(`
          *,
          category:categories(id, name, slug),
          author:profiles(id, display_name, avatar_url)
        `)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as ArticleStatus);
      }

      const { data, error } = await query;
      if (error) throw error;

      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare gli articoli",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo articolo?")) return;

    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setArticles(articles.filter(article => article.id !== id));
      toast({
        title: "Successo",
        description: "Articolo eliminato con successo",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile eliminare l'articolo",
        variant: "destructive",
      });
    }
  };

  const updateArticleStatus = async (id: string, status: ArticleStatus) => {
    try {
      const { error } = await supabase
        .from("articles")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setArticles(articles.map(article => 
        article.id === id ? { ...article, status: status as any } : article
      ));

      toast({
        title: "Successo",
        description: "Status articolo aggiornato",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare lo status",
        variant: "destructive",
      });
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: ArticleStatus) => {
    const variants = {
      published: "default",
      draft: "secondary",
      review: "outline",
      archived: "destructive",
    } as const;

    const labels = {
      published: "Pubblicato",
      draft: "Bozza",
      review: "In revisione",
      archived: "Archiviato",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <CMSLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Articoli</h1>
            <p className="text-muted-foreground">
              Gestisci tutti gli articoli del sito
            </p>
          </div>
          <Button asChild>
            <Link to="/cms/articoli/nuovo">
              <Plus className="mr-2 h-4 w-4" />
              Nuovo Articolo
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cerca articoli..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Status: {statusFilter === "all" ? "Tutti" : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                Tutti
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("published" as ArticleStatus)}>
                Pubblicati
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("draft" as ArticleStatus)}>
                Bozze
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("review" as ArticleStatus)}>
                In revisione
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Articles Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titolo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Visualizzazioni</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium line-clamp-1">{article.title}</div>
                        {article.subtitle && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {article.subtitle}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {article.category?.name || "Senza categoria"}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(article.status as ArticleStatus)}
                    </TableCell>
                    <TableCell>
                      {article.views_count || 0}
                    </TableCell>
                    <TableCell>
                      {formatDate(article.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/articolo/${article.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizza
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/cms/articoli/${article.id}/modifica`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifica
                            </Link>
                          </DropdownMenuItem>
                          {article.status !== "published" && (
                            <DropdownMenuItem 
                              onClick={() => updateArticleStatus(article.id, "published" as ArticleStatus)}
                            >
                              Pubblica
                            </DropdownMenuItem>
                          )}
                          {article.status === "published" && (
                            <DropdownMenuItem 
                              onClick={() => updateArticleStatus(article.id, "draft" as ArticleStatus)}
                            >
                              Rimuovi pubblicazione
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => deleteArticle(article.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Elimina
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {searchQuery ? "Nessun articolo trovato" : "Nessun articolo presente"}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </CMSLayout>
  );
};

export default Articles;
