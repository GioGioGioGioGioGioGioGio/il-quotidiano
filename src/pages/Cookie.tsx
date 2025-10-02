import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Cookie = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="mb-4 font-serif text-4xl font-bold">Cookie Policy</h1>
        <p className="text-muted-foreground">
          Questa è una versione placeholder della Cookie Policy. Inserire qui il testo legale completo e il banner gestione cookie se richiesto.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Cookie;
