import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="mb-4 font-serif text-4xl font-bold">Termini e Condizioni</h1>
        <p className="text-muted-foreground">
          Questa è una versione placeholder dei Termini e Condizioni. Inserire qui il testo legale completo.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
