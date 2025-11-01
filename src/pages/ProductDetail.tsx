import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { getProductByHandle } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { ShoppingCart, ArrowLeft, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      try {
        const fetchedProduct = await getProductByHandle(handle);
        setProduct(fetchedProduct);
        
        if (fetchedProduct?.variants?.edges?.[0]) {
          const firstVariant = fetchedProduct.variants.edges[0].node;
          setSelectedVariant(firstVariant);
          
          const initialOptions: Record<string, string> = {};
          firstVariant.selectedOptions.forEach((option: any) => {
            initialOptions[option.name] = option.value;
          });
          setSelectedOptions(initialOptions);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    const matchingVariant = product.variants.edges.find((edge: any) => {
      const variant = edge.node;
      return variant.selectedOptions.every((option: any) => 
        newOptions[option.name] === option.value
      );
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant.node);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const cartItem = {
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success("Added to cart", {
      description: `${product.title} has been added to your cart`,
      position: "top-center",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Header />
        <div className="container py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="font-playfair text-3xl font-bold mb-4">Product not found</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const price = parseFloat(selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount);
  const currencyCode = selectedVariant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <div className="container py-8">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-secondary/20 shadow-elegant">
              {product.images?.edges?.[0]?.node?.url ? (
                <img
                  src={product.images.edges[0].node.url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
            </div>
            
            {product.images?.edges?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.edges.slice(1, 5).map((edge: any, index: number) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden bg-secondary/20">
                    <img
                      src={edge.node.url}
                      alt={`${product.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-playfair text-4xl font-bold mb-3">{product.title}</h1>
              <div className="flex items-baseline gap-2">
                <span className="font-playfair text-3xl font-bold text-primary">
                  {currencyCode} {price.toFixed(2)}
                </span>
              </div>
            </div>

            {product.description && (
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground/80 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Variant Options */}
            {product.options?.length > 0 && (
              <div className="space-y-4">
                {product.options.map((option: any) => (
                  <div key={option.name}>
                    <label className="text-sm font-medium mb-2 block">
                      {option.name}
                    </label>
                    <Select
                      value={selectedOptions[option.name]}
                      onValueChange={(value) => handleOptionChange(option.name, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {option.values.map((value: string) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3 pt-6">
              <Button 
                onClick={handleAddToCart}
                size="lg"
                className="w-full bg-gradient-gold hover:shadow-gold text-lg"
                disabled={!selectedVariant?.availableForSale}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>

            {/* Product Highlights */}
            <div className="border-t border-border/40 pt-6 space-y-3">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Premium Quality</h4>
                  <p className="text-sm text-muted-foreground">
                    Crafted with precision using high-quality gold plating
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
