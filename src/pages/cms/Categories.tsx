import { useState, useEffect } from "react";
import { CMSLayout } from "@/components/cms/CMSLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  articles_count?: number;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Get categories with article count
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (categoriesError) throw categoriesError;

      // Get article counts for each category
      const categoriesWithCount = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const { count } = await supabase
            .from("articles")
            .select("*", { count: "exact", head: true })
            .eq("category_id", category.id)
            .eq("status", "published");

          return {
            ...category,
            articles_count: count || 0,
          };
        })
      );

      setCategories(categoriesWithCount);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le categorie",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
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

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Errore",
        description: "Il nome è obbligatorio",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from("categories")
          .update({
            name: formData.name,
            slug: formData.slug,
            description: formData.description || null,
          })
          .eq("id", editingCategory.id);

        if (error) throw error;

        toast({
          title: "Successo",
          description: "Categoria aggiornata con successo",
        });
      } else {
        // Create new category
        const { error } = await supabase
          .from("categories")
          .insert([{
            name: formData.name,
            slug: formData.slug,
            description: formData.description || null,
          }]);

        if (error) throw error;

        toast({
          title: "Successo",
          description: "Categoria creata con successo",
        });
      }

      setDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: "", slug: "", description: "" });
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Impossibile salvare la categoria",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (category.articles_count && category.articles_count > 0) {
      toast({
        title: "Impossibile eliminare",
        description: "Non puoi eliminare una categoria che contiene articoli",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Sei sicuro di voler eliminare la categoria "${category.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", category.id);

      if (error) throw error;

      toast({
        title: "Successo",
        description: "Categoria eliminata con successo",
      });

      fetchCategories();
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile eliminare la categoria",
        variant: "destructive",
      });
    }
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
            <h1 className="text-3xl font-bold">Categorie</h1>
            <p className="text-muted-foreground">
              Gestisci le categorie degli articoli
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingCategory(null);
                setFormData({ name: "", slug: "", description: "" });
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Nuova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Modifica Categoria" : "Nuova Categoria"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Nome della categoria"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="slug">Slug URL</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="slug-categoria"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    URL: /{formData.slug}
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="description">Descrizione</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrizione opzionale"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Annulla
                  </Button>
                  <Button type="submit">
                    {editingCategory ? "Aggiorna" : "Crea"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Categories Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Articoli</TableHead>
                <TableHead>Data creazione</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{category.name}</div>
                        {category.description && (
                          <div className="text-sm text-muted-foreground">
                            {category.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        /{category.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      {category.articles_count || 0} articoli
                    </TableCell>
                    <TableCell>
                      {formatDate(category.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(category)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifica
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(category)}
                            className="text-destructive"
                            disabled={category.articles_count && category.articles_count > 0}
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
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-muted-foreground">
                      Nessuna categoria presente
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

export default Categories;
