import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const colorMap = {
  Black: "#000000",
  White: "#FFFFFF",
  Red: "#FF0000",
  Blue: "#0000FF",
  Green: "#008000",
  Yellow: "#FFFF00",
  Beige: "#F5F5DC",
  Cream: "#FFFDD0",
  Pink: "#FFC0CB",
  Navy: "#000080",
  Gray: "#808080",
};

const Productdetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products,
  );

  const { user, guestId } = useSelector((state) => state.auth || {});

  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;
  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handledAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error(
        "Please select a select a size and color before adding to the cart.",
        {
          duration: 1000,
        },
      );
      return;
    }
    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      }),
    )
      .unwrap()
      .then(() => {
        toast.success("Product added to the cart!", {
          duration: 1000,
        });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-6">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* Left Thumbnails */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images?.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === image.url ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>
            {/* Main Image */}
            <div className="md:w-1/2">
              <div className="mb-4">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt="Main Product"
                    className="w-full h-auto object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-[500px] bg-gray-100 animate-pulse rounded-lg" />
                )}
              </div>
            </div>
            {/* Mobile Thumbnail */}
            <div className="md:hidden flex overflow-x-scroll space-x-4 mb-4">
              {selectedProduct.images?.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === image.url ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>
            {/* Right Section */}
            <div className="md:w-1/2 md:pl-8">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {" "}
                {selectedProduct.name}{" "}
              </h1>
              {/* Price Section */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-semibold text-black">
                  ₹{selectedProduct?.discountedPrice || selectedProduct?.price}
                </span>

                {selectedProduct?.discountedPrice &&
                  selectedProduct?.price > selectedProduct?.discountedPrice && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        ₹{selectedProduct?.price}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        (
                        {Math.round(
                          ((selectedProduct.price -
                            selectedProduct.discountedPrice) /
                            selectedProduct.price) *
                            100,
                        )}
                        % OFF)
                      </span>
                    </>
                  )}
              </div>
              <p className="text-gray-600 mb-4">
                {selectedProduct.description}
              </p>
              <div className="mb-4">
                <p className="text-gray-700 font-medium">Color:</p>
                <div className="flex gap-3 mt-2">
                  {selectedProduct.colors?.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-9 h-9 rounded-full border-2 
                       ${selectedColor === color ? "border-4 border-black" : "border-gray-300"}
                       ${["Beige", "Cream", "White"].includes(color) ? "ring-1 ring-gray-400" : ""}
                    `}
                      style={{ backgroundColor: colorMap[color] || color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <p className="text-gray-700">Size:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border ${
                        selectedSize === size ? "bg-black text-white" : ""
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <p className="text-gray-700 font-medium">Quantity:</p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-md text-xl font-medium"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-lg font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-md text-xl font-medium"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={handledAddToCart}
                disabled={isButtonDisabled}
                className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                  isButtonDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-900"
                }`}
              >
                {isButtonDisabled ? "Adding..." : "ADD TO CART"}
              </button>
              <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4">Product Details:</h3>
                <table className="w-full text-left text-sm text-gray-600">
                  <tbody>
                    <tr>
                      <td className="py-1">Brand</td>
                      <td className="py-1">{selectedProduct?.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Fabric</td>
                      <td className="py-1">{selectedProduct?.material}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="mt-20">
            <h2 className="text-4xl text-center font-bold mb-4">
              You May Also Like
            </h2>
            <ProductGrid products={similarProducts} />
          </div>
        </div>
      )}
    </div>
  );
};
export default Productdetails;