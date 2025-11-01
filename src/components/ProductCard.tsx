import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const { node } = product;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const firstVariant = node.variants.edges[0]?.node;
    if (!firstVariant) return;

    const cartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success("Added to cart", {
      description: `${node.title} has been added to your cart`,
      position: "top-center",
    });
  };

  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const currencyCode = node.priceRange.minVariantPrice.currencyCode;
  const imageUrl = node.images.edges[0]?.node.url;

  return (
    <Link to={`/product/${node.handle}`}>
      <Card className="group overflow-hidden border-border/40 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="aspect-square overflow-hidden bg-secondary/20">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={node.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-3 p-4">
          <div className="w-full">
            <h3 className="font-playfair text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {node.title}
            </h3>
            {node.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {node.description}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between w-full gap-3">
            <span className="font-playfair text-xl font-bold text-primary">
              {currencyCode} {price.toFixed(2)}
            </span>
            <Button 
              onClick={handleAddToCart}
              size="sm"
              className="bg-gradient-gold hover:shadow-gold"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
