import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { BackToTop } from "@/components/BackToTop";
import Index from "./pages/Index";
import ArticleDetail from "./pages/ArticleDetail";
import CategoryPage from "./pages/CategoryPage";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Staff from "./pages/Staff";
import Contact from "./pages/Contact";
import Advertising from "./pages/Advertising";
import Privacy from "./pages/Privacy";
import Cookie from "./pages/Cookie";
import Terms from "./pages/Terms";
import Ethics from "./pages/Ethics";
import CMS from "./pages/CMS";
import Bookmarks from "./pages/Bookmarks";
import Articles from "./pages/cms/Articles";
import ArticleEditor from "./pages/cms/ArticleEditor";
import Categories from "./pages/cms/Categories";
import Comments from "./pages/cms/Comments";
import Newsletter from "./pages/cms/Newsletter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="quotidiano-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/articolo/:slug" element={<ArticleDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/politica" element={<CategoryPage />} />
          <Route path="/esteri" element={<CategoryPage />} />
          <Route path="/economia" element={<CategoryPage />} />
          <Route path="/sport" element={<CategoryPage />} />
          <Route path="/cultura" element={<CategoryPage />} />
          <Route path="/tecnologia" element={<CategoryPage />} />
          <Route path="/chi-siamo" element={<About />} />
          <Route path="/redazione" element={<Staff />} />
          <Route path="/contatti" element={<Contact />} />
          <Route path="/pubblicita" element={<Advertising />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookie" element={<Cookie />} />
          <Route path="/termini" element={<Terms />} />
          <Route path="/etica" element={<Ethics />} />
          <Route path="/cms" element={<CMS />} />
          <Route path="/cms/articoli" element={<Articles />} />
          <Route path="/cms/articoli/nuovo" element={<ArticleEditor />} />
          <Route path="/cms/articoli/:id/modifica" element={<ArticleEditor />} />
          <Route path="/cms/categorie" element={<Categories />} />
          <Route path="/cms/commenti" element={<Comments />} />
          <Route path="/cms/newsletter" element={<Newsletter />} />
          <Route path="/salvati" element={<Bookmarks />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
        <BackToTop />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
