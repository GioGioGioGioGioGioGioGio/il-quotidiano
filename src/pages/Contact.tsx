import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="mb-4 font-serif text-4xl font-bold">Contatti</h1>
        <p className="text-muted-foreground mb-6">
          Per richieste generali e segnalazioni: <a className="text-accent underline" href="mailto:info@ilquotidiano.it">info@ilquotidiano.it</a>
        </p>
        <p className="text-muted-foreground">
          Per comunicati stampa e media: <a className="text-accent underline" href="mailto:press@ilquotidiano.it">press@ilquotidiano.it</a>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
