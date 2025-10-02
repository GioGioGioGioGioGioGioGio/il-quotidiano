import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  FolderOpen,
  Mail,
  MessageSquare,
  LogOut,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CMSLayoutProps {
  children: React.ReactNode;
}

export const CMSLayout = ({ children }: CMSLayoutProps) => {
  const { user, signOut } = useAuth();
  const { isAdmin, isEditor } = useUserRole();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/cms", icon: BarChart3 },
    { name: "Articoli", href: "/cms/articoli", icon: FileText },
    { name: "Categorie", href: "/cms/categorie", icon: FolderOpen },
    { name: "Commenti", href: "/cms/commenti", icon: MessageSquare },
    { name: "Newsletter", href: "/cms/newsletter", icon: Mail },
    ...(isAdmin ? [
      { name: "Utenti", href: "/cms/utenti", icon: Users },
      { name: "Impostazioni", href: "/cms/impostazioni", icon: Settings },
    ] : []),
  ];

  const isActive = (href: string) => {
    if (href === "/cms") {
      return location.pathname === "/cms";
    }
    return location.pathname.startsWith(href);
  };

  if (!user || !isEditor) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Accesso Negato</h1>
          <p className="text-muted-foreground mb-4">
            Non hai i permessi per accedere al CMS.
          </p>
          <Button asChild>
            <Link to="/">Torna alla Homepage</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden w-64 bg-card border-r lg:block">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center border-b px-6">
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-6 w-6" />
              <span className="font-serif text-xl font-bold">Il Quotidiano</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground">
                  {isAdmin ? "Amministratore" : "Editor"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="w-full justify-start"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Esci
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="flex h-16 items-center justify-between border-b px-4 lg:hidden">
          <Link to="/" className="font-serif text-xl font-bold">
            Il Quotidiano CMS
          </Link>
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
