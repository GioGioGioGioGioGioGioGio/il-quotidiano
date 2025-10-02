import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreakingNews from "@/components/BreakingNews";
import TrendingArticles from "@/components/TrendingArticles";
import { Comments } from "@/components/Comments";
import { ReadingProgress } from "@/components/ReadingProgress";
import { Clock, Calendar, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useArticle } from "@/hooks/useArticles";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import "@/styles/article.css";

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { article, loading } = useArticle(slug || "");
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { toast } = useToast();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatArticleContent = (content: string) => {
    // Se il contenuto ha già tag HTML, restituiscilo così com'è
    if (content.includes('<p>') || content.includes('<h1>') || content.includes('<h2>')) {
      return content;
    }
    
    // Altrimenti, formatta il testo plain in HTML
    return content
      .split('\n\n')
      .filter(paragraph => paragraph.trim().length > 0)
      .map(paragraph => `<p>${paragraph.trim()}</p>`)
      .join('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt || "",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiato!",
        description: "Il link dell'articolo è stato copiato negli appunti.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="mb-8 h-96 w-full" />
          <Skeleton className="mb-4 h-12 w-3/4" />
          <Skeleton className="mb-4 h-6 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold">Articolo non trovato</h1>
            <p className="text-muted-foreground">L'articolo che stai cercando non esiste o è stato rimosso.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Article content */}
          <article className="max-w-4xl">
            {/* Category and metadata */}
            <div className="mb-8 flex flex-wrap items-center gap-4 text-sm">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-2 font-sans font-semibold uppercase tracking-wider text-accent">
                {article.category?.name}
              </span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.published_at)}</span>
              </div>
              {article.read_time && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{article.read_time} min di lettura</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="mb-6 font-serif text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            {/* Subtitle */}
            {article.subtitle && (
              <p className="mb-8 text-lg text-muted-foreground leading-relaxed md:text-xl">{article.subtitle}</p>
            )}

            {/* Author and actions */}
            <div className="mb-8 flex items-center justify-between rounded-lg border bg-card/50 p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-accent font-semibold text-sm">
                    {(article.author?.display_name || "R").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-sans text-sm font-semibold text-foreground">
                    {article.author?.display_name || "Redazione"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {article.views_count} visualizzazioni
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={handleShare} className="hover:bg-accent/10">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => toggleBookmark(article.id)}
                  className={`hover:bg-accent/10 ${isBookmarked(article.id) ? "text-accent" : ""}`}
                >
                  <Bookmark className={`h-5 w-5 ${isBookmarked(article.id) ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Featured image */}
            {article.featured_image && (
              <div className="mb-8 overflow-hidden rounded-lg">
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full object-cover aspect-[16/9] transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}

            {/* Article body */}
            <div
              className="article-content prose prose-lg max-w-none font-serif text-foreground"
              dangerouslySetInnerHTML={{ 
                __html: formatArticleContent(article.content)
              }}
            />

            {/* Comments section */}
            <Comments articleId={article.id} />
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            <BreakingNews />
            <TrendingArticles />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetail;
