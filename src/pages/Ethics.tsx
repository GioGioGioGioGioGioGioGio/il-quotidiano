import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Ethics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="mb-4 font-serif text-4xl font-bold">Codice Etico</h1>
        <p className="text-muted-foreground">
          Questa è una versione placeholder del Codice Etico. Inserire qui i principi editoriali e deontologici della testata.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Ethics;
