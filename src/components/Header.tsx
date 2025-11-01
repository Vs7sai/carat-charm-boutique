import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { Sparkles } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Sparkles className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
          <span className="font-playfair text-2xl font-semibold bg-gradient-gold bg-clip-text text-transparent">
            Carat Charm
          </span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link 
            to="/" 
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Shop
          </Link>
          <CartDrawer />
        </nav>
      </div>
    </header>
  );
};
