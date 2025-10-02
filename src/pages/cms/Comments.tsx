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
  Search, 
  MoreHorizontal, 
  Check, 
  X, 
  Eye,
  Filter
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Comment {
  id: string;
  content: string;
  status: string;
  created_at: string;
  author: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  article: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [statusFilter]);

  const fetchComments = async () => {
    try {
      let query = supabase
        .from("comments")
        .select(`
          *,
          author:profiles(display_name, avatar_url),
          article:articles(id, title, slug)
        `)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i commenti",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCommentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("comments")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setComments(comments.map(comment => 
        comment.id === id ? { ...comment, status } : comment
      ));

      toast({
        title: "Successo",
        description: `Commento ${status === "approved" ? "approvato" : "rifiutato"}`,
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il commento",
        variant: "destructive",
      });
    }
  };

  const deleteComment = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo commento?")) return;

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setComments(comments.filter(comment => comment.id !== id));
      toast({
        title: "Successo",
        description: "Commento eliminato con successo",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile eliminare il commento",
        variant: "destructive",
      });
    }
  };

  const filteredComments = comments.filter(comment =>
    comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.author?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.article?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "default",
      pending: "secondary",
      rejected: "destructive",
    } as const;

    const labels = {
      approved: "Approvato",
      pending: "In attesa",
      rejected: "Rifiutato",
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <CMSLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Commenti</h1>
            <p className="text-muted-foreground">
              Modera i commenti degli utenti
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cerca commenti..."
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
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                In attesa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("approved")}>
                Approvati
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
                Rifiutati
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Comments Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Autore</TableHead>
                <TableHead>Commento</TableHead>
                <TableHead>Articolo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredComments.length > 0 ? (
                filteredComments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          {comment.author?.avatar_url ? (
                            <img
                              src={comment.author.avatar_url}
                              alt={comment.author.display_name || "Utente"}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium">
                              {(comment.author?.display_name || "A").charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {comment.author?.display_name || "Utente anonimo"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm">{truncateContent(comment.content)}</p>
                    </TableCell>
                    <TableCell>
                      {comment.article ? (
                        <Link 
                          to={`/articolo/${comment.article.slug}`}
                          target="_blank"
                          className="text-sm hover:underline line-clamp-1"
                        >
                          {comment.article.title}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">Articolo eliminato</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(comment.status)}
                    </TableCell>
                    <TableCell>
                      {formatDate(comment.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {comment.article && (
                            <DropdownMenuItem asChild>
                              <Link to={`/articolo/${comment.article.slug}`} target="_blank">
                                <Eye className="mr-2 h-4 w-4" />
                                Vedi articolo
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {comment.status !== "approved" && (
                            <DropdownMenuItem 
                              onClick={() => updateCommentStatus(comment.id, "approved")}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Approva
                            </DropdownMenuItem>
                          )}
                          {comment.status !== "rejected" && (
                            <DropdownMenuItem 
                              onClick={() => updateCommentStatus(comment.id, "rejected")}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Rifiuta
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => deleteComment(comment.id)}
                            className="text-destructive"
                          >
                            <X className="mr-2 h-4 w-4" />
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
                      {searchQuery ? "Nessun commento trovato" : "Nessun commento presente"}
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

export default Comments;
