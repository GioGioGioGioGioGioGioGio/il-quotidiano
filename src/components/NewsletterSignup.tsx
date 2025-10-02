import { useState } from "react";
import { Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().email("Email non valida").max(255);

export const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({
        title: "Errore",
        description: "Inserisci un indirizzo email valido.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email: result.data }]);

      if (error) {
        if (error.code === "23505") {
          // Duplicate key error
          toast({
            title: "Già iscritto",
            description: "Questo indirizzo email è già iscritto alla newsletter.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Iscrizione completata!",
          description: "Riceverai le nostre notizie nella tua casella email.",
        });
        setEmail("");
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-sm border bg-secondary p-6">
      <h3 className="mb-2 font-serif text-lg font-bold">Newsletter Quotidiana</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Le notizie più importanti nella tua casella email
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="La tua email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          <Mail className="mr-2 inline-block h-4 w-4" />
          {isLoading ? "Iscrizione..." : "Iscriviti Gratis"}
        </button>
      </form>
    </div>
  );
};
