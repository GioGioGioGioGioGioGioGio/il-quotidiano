import { useState, useEffect } from "react";
import { CMSLayout } from "@/components/cms/CMSLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Trash2,
  Download,
  Mail
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
  is_active: boolean;
}

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare gli iscritti",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriber = async (id: string, email: string) => {
    if (!confirm(`Sei sicuro di voler rimuovere ${email} dalla newsletter?`)) return;

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSubscribers(subscribers.filter(subscriber => subscriber.id !== id));
      toast({
        title: "Successo",
        description: "Iscritto rimosso con successo",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile rimuovere l'iscritto",
        variant: "destructive",
      });
    }
  };

  const exportSubscribers = () => {
    const csvContent = [
      "Email,Data Iscrizione,Attivo",
      ...subscribers.map(sub => 
        `${sub.email},${new Date(sub.created_at).toLocaleDateString("it-IT")},${sub.is_active ? "Sì" : "No"}`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Successo",
      description: "Lista iscritti esportata con successo",
    });
  };

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const activeSubscribers = subscribers.filter(sub => sub.is_active).length;
  const totalSubscribers = subscribers.length;

  return (
    <CMSLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Newsletter</h1>
            <p className="text-muted-foreground">
              Gestisci gli iscritti alla newsletter
            </p>
          </div>
          
          <Button onClick={exportSubscribers} disabled={subscribers.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Esporta CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Iscritti Totali</span>
            </div>
            <div className="mt-2 text-2xl font-bold">{totalSubscribers}</div>
          </div>
          
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Iscritti Attivi</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-green-600">{activeSubscribers}</div>
          </div>
          
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Tasso Attivazione</span>
            </div>
            <div className="mt-2 text-2xl font-bold">
              {totalSubscribers > 0 ? Math.round((activeSubscribers / totalSubscribers) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cerca per email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Iscrizione</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredSubscribers.length > 0 ? (
                filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">
                      {subscriber.email}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        subscriber.is_active 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}>
                        {subscriber.is_active ? "Attivo" : "Inattivo"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {formatDate(subscriber.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => deleteSubscriber(subscriber.id, subscriber.email)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Rimuovi
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {searchQuery ? "Nessun iscritto trovato" : "Nessun iscritto presente"}
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

export default Newsletter;
