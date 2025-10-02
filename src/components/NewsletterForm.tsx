import { useState } from "react";
import { Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().email("Email non valida").max(255);

export const NewsletterForm = () => {
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
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <input
        type="email"
        placeholder="La tua email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        <Mail className="h-4 w-4 mr-2" />
        {isLoading ? "..." : "Iscriviti"}
      </button>
    </form>
  );
};
