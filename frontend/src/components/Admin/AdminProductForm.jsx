import { useState, useEffect } from "react";

const AdminProductForm = ({ product, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    stock: "",
    sizes: "",
    colors: "",
    image: "",
  });

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        sizes: product.sizes.join(", "),
        colors: product.colors.join(", "),
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    onSave({
      ...product,
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      sizes: form.sizes.split(",").map((s) => s.trim()),
      colors: form.colors.split(",").map((c) => c.trim()),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={submit}
        className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4"
      >
        <h2 className="text-xl font-bold">
          {product ? "Edit Product" : "Add Product"}
        </h2>

        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border px-4 py-2 rounded"
          />
          <input
            name="countInStock"
            type="number"
            placeholder="Stock"
            value={form.countInStock}
            onChange={handleChange}
            className="border px-4 py-2 rounded"
          />
        </div>

        <input
          name="sizes"
          placeholder="Sizes (S, M, L)"
          value={form.sizes}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          name="colors"
          placeholder="Colors (Black, Blue)"
          value={form.colors}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-black text-white rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
