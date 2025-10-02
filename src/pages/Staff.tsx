import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Staff = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="mb-4 font-serif text-4xl font-bold">Redazione</h1>
        <p className="text-muted-foreground">
          In questa pagina presentiamo i membri della nostra redazione. Contenuti in aggiornamento.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Staff;
