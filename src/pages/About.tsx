import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="mb-4 font-serif text-4xl font-bold">Chi siamo</h1>
        <p className="text-muted-foreground mb-6">
          "Il Quotidiano" è una testata indipendente che racconta l'attualità con attenzione, rigore e chiarezza.
          La nostra redazione lavora per fornire notizie affidabili, approfondimenti e analisi sui temi più importanti.
        </p>
        <p className="text-muted-foreground">
          La missione è promuovere un'informazione di qualità, libera e accessibile a tutti.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default About;
