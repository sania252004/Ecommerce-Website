import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductForm from "./AdminProductForm";
import { 
  fetchAdminProducts, 
  deleteAdminProduct, 
  updateProduct, 
  createProduct 
} from "../../redux/slices/adminProductSlice";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.adminProducts || {});

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (e, id) => {
    e.stopPropagation(); // Prevents event bubbling
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteAdminProduct(id));
    }
  };

  const handleEdit = (e, product) => {
    e.stopPropagation(); // Prevents event bubbling
    setEditingProduct(product);
    setShowForm(true);
  };

  const saveProduct = (productData) => {
    if (editingProduct) {
      dispatch(updateProduct({ id: editingProduct._id, productData }));
    } else {
      dispatch(createProduct(productData));
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const productList = Array.isArray(products) ? products : [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products ({productList.length})</h1>
        {/* Fixed: Added relative z-index to ensure button is clickable */}
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="relative z-10 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="px-6 py-4 text-left w-1/2">Product</th>
              <th className="px-6 py-4 text-left w-1/6">Price</th>
              <th className="px-6 py-4 text-left w-1/6">Stock</th>
              <th className="px-6 py-4 text-right w-1/6">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {productList.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <img
                      src={product.images?.[0]?.url || product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover border flex-shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-gray-800 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-left text-gray-700">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </td>
                <td className="px-6 py-4 text-left text-gray-600">
                  {product.countInStock}
                </td>
                <td className="px-6 py-4 text-right">
                  {/* Fixed: Wrapped buttons in a relative div to ensure they capture clicks */}
                  <div className="relative z-10 flex justify-end gap-4">
                    <button
                      onClick={(e) => handleEdit(e, product)}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, product._id)}
                      className="text-red-600 hover:text-red-800 font-medium hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={saveProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminProducts;