import { Link } from "react-router-dom";

// Map product categories/names to relevant Unsplash images
const getFallbackImage = (product) => {
  const name = (product.name || "").toLowerCase();
  const category = (product.category || "").toLowerCase();
  const gender = (product.gender || "").toLowerCase();

  if (category.includes("top") || name.includes("shirt") || name.includes("tshirt") || name.includes("t-shirt"))
    return gender === "women"
      ? "https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=400&q=80"
      : "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80";

  if (category.includes("bottom") || name.includes("pant") || name.includes("jeans") || name.includes("trouser"))
    return gender === "women"
      ? "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80"
      : "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80";

  if (name.includes("dress") || name.includes("skirt"))
    return "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80";

  if (name.includes("jacket") || name.includes("coat") || name.includes("hoodie"))
    return gender === "women"
      ? "https://images.unsplash.com/photo-1548454782-15b189d129ab?w=400&q=80"
      : "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80";

  if (name.includes("kurta") || name.includes("ethnic") || name.includes("saree"))
    return "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80";

  if (name.includes("shoe") || name.includes("sneaker") || name.includes("sandal"))
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80";

  if (name.includes("bag") || name.includes("purse") || name.includes("handbag"))
    return "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80";

  // Generic fallback by gender
  return gender === "women"
    ? "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&q=80"
    : "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400&q=80";
};

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white p-4 animate-pulse">
            <div className="w-full h-96 bg-gray-200 mb-4 rounded" />
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!products || products.length === 0) {
    return <p className="text-center text-gray-400 py-10">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => {
        const imageUrl = product.images?.[0]?.url || getFallbackImage(product);

        return (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="block"
          >
            <div className="bg-white p-4">
              <div className="w-full h-96 mb-4 overflow-hidden">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // If real image fails to load, use fallback
                    e.target.onerror = null;
                    e.target.src = getFallbackImage(product);
                  }}
                />
              </div>
              <h3 className="text-sm mb-2">{product.name}</h3>
              <p className="text-gray-600 font-medium text-sm tracking-tighter">
                ₹{product.price}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;