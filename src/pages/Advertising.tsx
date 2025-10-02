import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Advertising = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="mb-4 font-serif text-4xl font-bold">Pubblicità</h1>
        <p className="text-muted-foreground mb-6">
          Per collaborazioni commerciali e informazioni su formati, pianificazioni e listini, contattaci a
          <a className="text-accent underline ml-1" href="mailto:adv@ilquotidiano.it">adv@ilquotidiano.it</a>.
        </p>
        <p className="text-muted-foreground">
          Offriamo soluzioni pubblicitarie personalizzate e progetti speciali.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Advertising;
