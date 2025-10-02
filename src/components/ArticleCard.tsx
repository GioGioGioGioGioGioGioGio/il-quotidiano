import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
  date: string;
  featured?: boolean;
}

const ArticleCard = ({
  id,
  title,
  excerpt,
  category,
  image,
  readTime,
  date,
  featured = false,
}: ArticleCardProps) => {
  return (
    <Link to={`/articolo/${id}`} className="group block">
      <article className={`rounded-lg border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-accent/20 ${
        featured ? "space-y-6" : "space-y-4"
      }`}>
        {image && (
          <div className="relative overflow-hidden rounded-md bg-muted">
            <img
              src={image}
              alt={title}
              className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                featured ? "aspect-[16/9]" : "aspect-[4/3]"
              }`}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        )}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 font-sans font-semibold uppercase tracking-wider text-accent">
              {category}
            </span>
            <span className="text-muted-foreground">{date}</span>
          </div>
          <h3
            className={`font-serif font-bold leading-tight text-foreground transition-colors group-hover:text-accent ${
              featured ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
            }`}
          >
            {title}
          </h3>
          <p className={`text-muted-foreground leading-relaxed ${featured ? "text-base" : "text-sm"}`}>
            {excerpt}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
            <Clock className="h-3 w-3" />
            <span>{readTime} di lettura</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
