import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import BreakingNews from "@/components/BreakingNews";
import TrendingArticles from "@/components/TrendingArticles";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { useArticles } from "@/hooks/useArticles";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { articles: featuredArticles, loading: featuredLoading } = useArticles({ isFeatured: true, limit: 1 });
  const { articles: topArticles, loading: topLoading } = useArticles({ limit: 6 });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Pochi minuti fa";
    if (diffHours < 24) return `${diffHours} ore fa`;
    return date.toLocaleDateString("it-IT", { day: "numeric", month: "long" });
  };

  const featuredArticle = featuredArticles[0];
  const mainArticles = topArticles.slice(0, 3);
  const secondaryArticles = topArticles.slice(3, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main content */}
          <div className="space-y-12">
            {/* Featured article */}
            <section>
              {featuredLoading ? (
                <Skeleton className="h-96 w-full" />
              ) : featuredArticle ? (
                <ArticleCard
                  id={featuredArticle.slug}
                  title={featuredArticle.title}
                  excerpt={featuredArticle.excerpt || ""}
                  category={featuredArticle.category?.name || ""}
                  image={featuredArticle.featured_image || ""}
                  readTime={`${featuredArticle.read_time || 5} min`}
                  date={formatDate(featuredArticle.published_at)}
                  featured
                />
              ) : (
                <div className="rounded-lg bg-muted p-8 text-center">
                  <p className="text-muted-foreground">Nessun articolo in evidenza disponibile</p>
                </div>
              )}
            </section>

            {/* Top stories */}
            <section>
              <h2 className="mb-6 border-b-2 border-primary pb-2 font-serif text-2xl font-bold">
                Le Notizie del Giorno
              </h2>
              {topLoading ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-80 w-full" />
                  ))}
                </div>
              ) : mainArticles.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {mainArticles.map((article) => (
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
                <div className="rounded-lg bg-muted p-8 text-center">
                  <p className="text-muted-foreground">Nessun articolo disponibile</p>
                </div>
              )}
            </section>

            {/* More articles */}
            {secondaryArticles.length > 0 && (
              <section>
                <h2 className="mb-6 border-b-2 border-primary pb-2 font-serif text-2xl font-bold">
                  Altri Articoli
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {secondaryArticles.map((article) => (
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
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <BreakingNews />
            <TrendingArticles />
            <NewsletterSignup />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
