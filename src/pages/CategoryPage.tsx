import { useParams, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import BreakingNews from "@/components/BreakingNews";
import { useArticles } from "@/hooks/useArticles";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryPage = () => {
  const location = useLocation();
  const categorySlug = location.pathname.replace("/", "");

  const categoryTitles: { [key: string]: string } = {
    politica: "Politica",
    esteri: "Esteri",
    economia: "Economia",
    sport: "Sport",
    cultura: "Cultura",
    tecnologia: "Tecnologia",
  };

  const { articles, loading } = useArticles({ categorySlug, limit: 12 });

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
        <div className="mb-8">
          <h1 className="mb-2 font-serif text-4xl font-bold md:text-5xl">
            {categoryTitles[categorySlug] || "Categoria"}
          </h1>
          <p className="text-lg text-muted-foreground">
            Le ultime notizie e gli approfondimenti dalla redazione
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Articles grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {loading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-96 w-full" />
                ))}
              </>
            ) : articles.length > 0 ? (
              articles.map((article) => (
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
              ))
            ) : (
              <div className="col-span-2 rounded-lg bg-muted p-8 text-center">
                <p className="text-muted-foreground">
                  Nessun articolo disponibile in questa categoria
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <BreakingNews />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
