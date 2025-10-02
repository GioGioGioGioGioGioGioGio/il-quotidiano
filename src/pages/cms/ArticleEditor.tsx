import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CMSLayout } from "@/components/cms/CMSLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, ArrowLeft } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ArticleForm {
  title: string;
  subtitle: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category_id: string;
  status: string;
  is_featured: boolean;
  is_breaking: boolean;
  read_time: number;
}

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const isEditing = Boolean(id && id !== "nuovo");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState<ArticleForm>({
    title: "",
    subtitle: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    category_id: "",
    status: "draft",
    is_featured: false,
    is_breaking: false,
    read_time: 5,
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchArticle();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchArticle = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setForm({
          title: data.title || "",
          subtitle: data.subtitle || "",
          slug: data.slug || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          featured_image: data.featured_image || "",
          category_id: data.category_id || "",
          status: data.status || "draft",
          is_featured: data.is_featured || false,
          is_breaking: data.is_breaking || false,
          read_time: data.read_time || 5,
        });
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare l'articolo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleContentChange = (content: string) => {
    setForm(prev => ({
      ...prev,
      content,
      read_time: estimateReadTime(content),
    }));
  };

  const handleSave = async (status?: string) => {
    if (!form.title.trim()) {
      toast({
        title: "Errore",
        description: "Il titolo è obbligatorio",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const articleData = {
        ...form,
        status: (status || form.status) as "draft" | "review" | "published" | "archived",
        author_id: user?.id,
        updated_at: new Date().toISOString(),
        ...(status === "published" && !isEditing ? { published_at: new Date().toISOString() } : {}),
      };

      let result;
      if (isEditing) {
        result = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("articles")
          .insert([{ ...articleData, created_at: new Date().toISOString() }])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: "Successo",
        description: `Articolo ${isEditing ? "aggiornato" : "creato"} con successo`,
      });

      if (!isEditing && result.data) {
        navigate(`/cms/articoli/${result.data.id}/modifica`);
      }
    } catch (error) {
      console.error("Error saving article:", error);
      toast({
        title: "Errore",
        description: "Impossibile salvare l'articolo",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <CMSLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Caricamento articolo...</p>
          </div>
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/cms/articoli")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {isEditing ? "Modifica Articolo" : "Nuovo Articolo"}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? "Modifica i dettagli dell'articolo" : "Crea un nuovo articolo"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {form.slug && (
              <Button variant="outline" asChild>
                <a href={`/articolo/${form.slug}`} target="_blank" rel="noopener noreferrer">
                  <Eye className="mr-2 h-4 w-4" />
                  Anteprima
                </a>
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => handleSave("draft")}
              disabled={saving}
            >
              <Save className="mr-2 h-4 w-4" />
              Salva Bozza
            </Button>
            <Button 
              onClick={() => handleSave("published")}
              disabled={saving}
            >
              {saving ? "Pubblicazione..." : "Pubblica"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Main Content */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contenuto Principale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Titolo *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Inserisci il titolo dell'articolo"
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle">Sottotitolo</Label>
                  <Input
                    id="subtitle"
                    value={form.subtitle}
                    onChange={(e) => setForm(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Sottotitolo opzionale"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug URL</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="url-articolo"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    URL: /articolo/{form.slug}
                  </p>
                </div>

                <div>
                  <Label htmlFor="excerpt">Riassunto</Label>
                  <Textarea
                    id="excerpt"
                    value={form.excerpt}
                    onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Breve riassunto dell'articolo"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Contenuto *</Label>
                  <Textarea
                    id="content"
                    value={form.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Scrivi il contenuto dell'articolo..."
                    rows={20}
                    className="font-serif"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Tempo di lettura stimato: {form.read_time} minuti
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Impostazioni</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={form.status} onValueChange={(value) => setForm(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Bozza</SelectItem>
                      <SelectItem value="review">In revisione</SelectItem>
                      <SelectItem value="published">Pubblicato</SelectItem>
                      <SelectItem value="archived">Archiviato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={form.category_id} onValueChange={(value) => setForm(prev => ({ ...prev, category_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Articolo in evidenza</Label>
                  <Switch
                    id="featured"
                    checked={form.is_featured}
                    onCheckedChange={(checked) => setForm(prev => ({ ...prev, is_featured: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="breaking">Notizia urgente</Label>
                  <Switch
                    id="breaking"
                    checked={form.is_breaking}
                    onCheckedChange={(checked) => setForm(prev => ({ ...prev, is_breaking: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Immagine in evidenza</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="featured_image">URL Immagine</Label>
                  <Input
                    id="featured_image"
                    value={form.featured_image}
                    onChange={(e) => setForm(prev => ({ ...prev, featured_image: e.target.value }))}
                    placeholder="https://esempio.com/immagine.jpg"
                  />
                </div>
                {form.featured_image && (
                  <div className="mt-4">
                    <img
                      src={form.featured_image}
                      alt="Anteprima"
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CMSLayout>
  );
};

export default ArticleEditor;
