import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SiteStats } from "@/components/SiteStats";

const Footer = () => {
  const sections = [
    {
      title: "Sezioni",
      links: [
        { name: "Politica", path: "/politica" },
        { name: "Esteri", path: "/esteri" },
        { name: "Economia", path: "/economia" },
        { name: "Sport", path: "/sport" },
        { name: "Cultura", path: "/cultura" },
        { name: "Tecnologia", path: "/tecnologia" },
      ],
    },
    {
      title: "Il Quotidiano",
      links: [
        { name: "Chi siamo", path: "/chi-siamo" },
        { name: "Redazione", path: "/redazione" },
        { name: "Contatti", path: "/contatti" },
        { name: "Pubblicità", path: "/pubblicita" },
      ],
    },
    {
      title: "Informazioni",
      links: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Cookie Policy", path: "/cookie" },
        { name: "Termini e Condizioni", path: "/termini" },
        { name: "Codice Etico", path: "/etica" },
      ],
    },
  ];

  return (
    <footer className="border-t bg-secondary mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="font-serif text-2xl font-bold mb-4">Il Quotidiano</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Informazione libera, indipendente e di qualità dal 2024.
            </p>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
              <SiteStats />
            </div>
          </div>

          {/* Links sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-sans text-sm font-semibold uppercase tracking-wide mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <h3 className="font-sans text-lg font-semibold mb-1">Iscriviti alla newsletter</h3>
              <p className="text-sm text-muted-foreground">
                Ricevi ogni giorno le notizie più importanti
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Il Quotidiano. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
