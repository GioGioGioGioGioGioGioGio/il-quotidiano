import { useState } from "react";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useArticles } from "@/hooks/useArticles";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export const SearchDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useState(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  });

  const { articles, loading } = useArticles({ 
    limit: 10,
    searchQuery: debouncedQuery.length > 2 ? debouncedQuery : undefined 
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cerca articoli</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cerca per titolo, contenuto o categoria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {!searchQuery || searchQuery.length <= 2 ? (
              <p className="py-8 text-center text-muted-foreground">
                Digita almeno 3 caratteri per iniziare la ricerca
              </p>
            ) : loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-16 w-16 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-3">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/articolo/${article.slug}`}
                    className="flex gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                    onClick={() => setIsOpen(false)}
                  >
                    {article.featured_image && (
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        className="h-16 w-16 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-semibold leading-tight line-clamp-2">
                        {article.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        {article.category?.name && (
                          <span className="font-medium text-accent">
                            {article.category.name}
                          </span>
                        )}
                        <span>•</span>
                        <span>{formatDate(article.published_at)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                Nessun risultato trovato per "{searchQuery}"
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
