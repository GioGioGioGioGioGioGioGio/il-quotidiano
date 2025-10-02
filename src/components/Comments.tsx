import { useState, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface CommentsProps {
  articleId: string;
}

export const Comments = ({ articleId }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          author:profiles(display_name, avatar_url)
        `)
        .eq("article_id", articleId)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("comments")
        .insert([{
          article_id: articleId,
          author_id: user.id,
          content: newComment.trim(),
          status: "pending"
        }]);

      if (error) throw error;

      toast({
        title: "Commento inviato!",
        description: "Il tuo commento è in attesa di moderazione.",
      });
      
      setNewComment("");
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'invio del commento.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="mt-12 border-t pt-8">
      <div className="mb-6 flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="font-serif text-xl font-bold">
          Commenti ({comments.length})
        </h3>
      </div>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <Textarea
            placeholder="Scrivi il tuo commento..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            required
          />
          <Button type="submit" disabled={submitting || !newComment.trim()}>
            <Send className="mr-2 h-4 w-4" />
            {submitting ? "Invio..." : "Invia commento"}
          </Button>
        </form>
      ) : (
        <div className="mb-8 rounded-lg border bg-muted p-4 text-center">
          <p className="text-muted-foreground">
            <a href="/auth" className="text-accent underline">Accedi</a> per lasciare un commento
          </p>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b pb-6 last:border-0 last:pb-0">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  {comment.author?.avatar_url ? (
                    <img
                      src={comment.author.avatar_url}
                      alt={comment.author.display_name || "Utente"}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {(comment.author?.display_name || "Anonimo").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {comment.author?.display_name || "Utente anonimo"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(comment.created_at)}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-muted-foreground">
          Nessun commento ancora. Sii il primo a commentare!
        </p>
      )}
    </div>
  );
};
