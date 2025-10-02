import { Link } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { SearchDialog } from "@/components/SearchDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isEditor } = useUserRole();

  const categories = [
    { name: "Politica", path: "/politica" },
    { name: "Esteri", path: "/esteri" },
    { name: "Economia", path: "/economia" },
    { name: "Sport", path: "/sport" },
    { name: "Cultura", path: "/cultura" },
    { name: "Tecnologia", path: "/tecnologia" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="font-serif text-3xl font-bold tracking-tight">Il Quotidiano</h1>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {isEditor && (
                  <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                    <Link to="/cms">
                      <Settings className="mr-2 h-4 w-4" />
                      CMS
                    </Link>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>
                      <User className="mr-2 h-4 w-4" />
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/salvati">
                        <Bookmark className="mr-2 h-4 w-4" />
                        Articoli salvati
                      </Link>
                    </DropdownMenuItem>
                    {isEditor && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/cms">
                            <Settings className="mr-2 h-4 w-4" />
                            Dashboard CMS
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Esci
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                <Link to="/auth">Accedi</Link>
              </Button>
            )}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex">
                <SearchDialog />
              </div>
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden border-t py-3 md:block">
          <ul className="flex items-center justify-center space-x-8">
            {categories.map((category) => (
              <li key={category.path}>
                <Link
                  to={category.path}
                  className="font-sans text-sm font-medium uppercase tracking-wide text-foreground transition-colors hover:text-accent"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="border-t py-4 md:hidden">
            <ul className="space-y-4">
              {categories.map((category) => (
                <li key={category.path}>
                  <Link
                    to={category.path}
                    className="block font-sans text-base font-medium uppercase tracking-wide text-foreground transition-colors hover:text-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              {!user && (
                <>
                  <li className="border-t pt-4">
                    <Link
                      to="/auth"
                      className="block font-sans text-base font-medium uppercase tracking-wide text-foreground transition-colors hover:text-accent"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Accedi
                    </Link>
                  </li>
                </>
              )}
              {isEditor && (
                <li className={!user ? "" : "border-t pt-4"}>
                  <Link
                    to="/cms"
                    className="block font-sans text-base font-medium uppercase tracking-wide text-foreground transition-colors hover:text-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard CMS
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
