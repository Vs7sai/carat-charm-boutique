import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { getProducts, ShopifyProduct } from "@/lib/shopify";
import { Sparkles, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import heroImage from "@/assets/hero-jewelry.jpg";
import featuredBangles from "@/assets/featured-bangles.jpg";
import featuredNecklace from "@/assets/featured-necklace.jpg";

const Index = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts(20);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background z-10" />
        <img 
          src={heroImage} 
          alt="Luxury one gram gold jewelry collection" 
          className="w-full h-[600px] object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container text-center">
            <h1 className="font-playfair text-5xl md:text-7xl font-bold text-foreground mb-6 drop-shadow-lg">
              Exquisite One Gram
              <br />
              <span className="bg-gradient-gold bg-clip-text text-transparent">
                Gold Jewelry
              </span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-8 drop-shadow">
              Discover the perfect blend of luxury and affordability. 
              Each piece crafted to perfection.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-gold hover:shadow-gold text-lg px-8"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Shop Collection
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-b border-border/40">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <ShieldCheck className="h-12 w-12 text-primary mx-auto" />
              <h3 className="font-playfair text-xl font-semibold">Premium Quality</h3>
              <p className="text-muted-foreground">Gold-plated jewelry that looks and feels authentic</p>
            </div>
            <div className="text-center space-y-3">
              <Truck className="h-12 w-12 text-primary mx-auto" />
              <h3 className="font-playfair text-xl font-semibold">Fast Delivery</h3>
              <p className="text-muted-foreground">Quick and secure shipping to your doorstep</p>
            </div>
            <div className="text-center space-y-3">
              <RefreshCw className="h-12 w-12 text-primary mx-auto" />
              <h3 className="font-playfair text-xl font-semibold">Easy Returns</h3>
              <p className="text-muted-foreground">Hassle-free returns within 30 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20">
        <div className="container">
          <h2 className="font-playfair text-4xl font-bold text-center mb-12">
            Featured <span className="text-primary">Collections</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="relative group overflow-hidden rounded-lg aspect-[4/3] shadow-elegant">
              <img 
                src={featuredBangles} 
                alt="Elegant bangles collection" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-8">
                <div>
                  <h3 className="font-playfair text-3xl font-bold mb-2">Bangles & Bracelets</h3>
                  <p className="text-foreground/80">Timeless designs for every occasion</p>
                </div>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg aspect-[4/3] shadow-elegant">
              <img 
                src={featuredNecklace} 
                alt="Exquisite necklaces collection" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-8">
                <div>
                  <h3 className="font-playfair text-3xl font-bold mb-2">Necklaces & Pendants</h3>
                  <p className="text-foreground/80">Statement pieces that captivate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-background/50">
        <div className="container">
          <h2 className="font-playfair text-4xl font-bold text-center mb-12">
            Our <span className="text-primary">Collection</span>
          </h2>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-playfair text-2xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Tell me what jewelry you'd like to add to your store!
              </p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                For example: "Add a gold necklace priced at $49.99" or "Create a bangle set for $39.99"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-background">
        <div className="container text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-playfair text-2xl font-semibold bg-gradient-gold bg-clip-text text-transparent">
              Carat Charm
            </span>
          </div>
          <p className="text-muted-foreground">
            © 2025 Carat Charm Boutique. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
