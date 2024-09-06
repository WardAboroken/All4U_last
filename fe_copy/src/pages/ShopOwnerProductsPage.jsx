import React, { useState, useEffect } from "react";
import "./css/shopOwnerProductsPage.css";
import ShopOwnerHeader from "../components/ShopOwnerHeader";
import { API_URL } from "../constans.js";


// Helper function to find category name by number
const getCategoryName = (categoryNumber, categories) =>
  Object.keys(categories).find((key) => categories[key] === categoryNumber);

const categories = {
  Toys: 1,
  Clothing: 2,
  "Work Tools": 3,
  "Pet Supplies": 4,
  "Home Styling": 5,
  Cleaning: 6,
  Shoes: 7,
  Sport: 8,
  Accessories: 9,
  Furnishing: 10,
  Safety: 11,
  Beauty: 12,
};

const ShopOwnerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [userName, setUserName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null); // Tracks which product is being edited
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    catalogNumber: "",
    productName: "",
    description: "",
    color: "",
    size: "",
    amount: 0,
    price: 0,
    imageLink: "",
    categoryNumber: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/userinfo/getUserInfo", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          setUserName(data.userInfo.userName);
        } else {
          setError("Failed to fetch user info.");
        }
      } catch (error) {
        setError("Error fetching user info.");
        console.error(error);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userName) {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `/shop/get-products?userName=${userName}`,
            { method: "GET", headers: { "Content-Type": "application/json" } }
          );
          if (response.ok) {
            const data = await response.json();
            setProducts(data);
            setFilteredProducts(data);
          } else {
            setError("Failed to fetch products.");
          }
        } catch (error) {
          setError("Error fetching products.");
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [userName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(e.target.value);
    setFilteredProducts(
      products.filter(
        (product) =>
          product.catalogNumber.toLowerCase().includes(searchValue) ||
          product.productName.toLowerCase().includes(searchValue)
      )
    );
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      formData.append(key, newProduct[key]);
    });
    formData.append("userName", userName); // Add userName

    try {
      const response = await fetch("/productsHandler/addProduct", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const addedProduct = await response.json();
        setProducts((prev) => [...prev, addedProduct]);
        setFilteredProducts((prev) => [...prev, addedProduct]);
        setNewProduct({
          catalogNumber: "",
          productName: "",
          description: "",
          color: "",
          size: "",
          amount: 0,
          price: 0,
          imageLink: "",
          categoryNumber: 0,
        });
      } else {
        setError("Failed to add product.");
      }
    } catch (error) {
      setError("Error adding product.");
      console.error(error);
    }
  };
const handleEditProduct = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  Object.keys(editProduct).forEach((key) => {
    formData.append(key, editProduct[key]);
  });

  console.log("Form Data to be sent:", Object.fromEntries(formData)); // Log form data

  try {
    const response = await fetch(
      `/productsHandler/updateProduct/${editProduct.catalogNumber}`,
      {
        method: "PUT",
        body: formData,
      }
    );
    if (response.ok) {
      const updatedProduct = await response.json();
      setProducts((prev) =>
        prev.map((product) =>
          product.catalogNumber === updatedProduct.catalogNumber
            ? updatedProduct
            : product
        )
      );
      setFilteredProducts((prev) =>
        prev.map((product) =>
          product.catalogNumber === updatedProduct.catalogNumber
            ? updatedProduct
            : product
        )
      );
      setEditProductId(null); // Close edit form
      setEditProduct(null);
    } else {
      setError("Failed to update product.");
    }
  } catch (error) {
    setError("Error updating product.");
    console.error(error);
  }
};

const handleDeleteProduct = async (catalogNumber) => {
  try {
    const response = await fetch(
      `/productsHandler/deleteProduct/${catalogNumber}`,
      {
        method: "DELETE", // Use DELETE method
      }
    );
    if (response.ok) {
      setProducts((prev) =>
        prev.filter((product) => product.catalogNumber !== catalogNumber)
      );
      setFilteredProducts((prev) =>
        prev.filter((product) => product.catalogNumber !== catalogNumber)
      );
    } else {
      setError("Failed to delete product.");
    }
  } catch (error) {
    setError("Error deleting product.");
    console.error(error);
  }
};

const toggleEditForm = (product) => {
  setEditProductId(
    product.catalogNumber === editProductId ? null : product.catalogNumber
  );
  setEditProduct({ ...product }); // Ensure categoryNumber is correctly set here
};


  return (
    <div className="products-page">
      <ShopOwnerHeader />
      <main>
        {error && <div className="error-message">{error}</div>}
        {loading && <div>Loading...</div>}
        <section className="product-list-section">
          <h1>Products List</h1>
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by Catalogue Number or Product Name..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <table className="products-table">
            <thead>
              <tr>
                <th>Catalogue Number</th>
                <th>Product Name</th>
                <th>Description</th> {/* New column for description */}
                <th>Color</th>
                <th>Size</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Picture</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <React.Fragment key={product.catalogNumber}>
                  <tr>
                    <td>{product.catalogNumber}</td>
                    <td>{product.productName}</td>
                    <td>{product.description}</td>{" "}
                    {/* Display product description */}
                    <td>{product.color}</td>
                    <td>{product.size}</td>
                    <td>
                      {getCategoryName(product.categoryNumber, categories)}
                    </td>
                    <td>{product.amount}</td>
                    <td>
                      <img
                        src={`${API_URL}/uploads/${product.picturePath}`}
                        alt={product.productName}
                        width="50"
                      />
                    </td>
                    <td>${product.price}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="edit-button"
                          onClick={() => toggleEditForm(product)}
                        >
                          <i className="fas fa-edit icon"></i>
                        </button>
                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDeleteProduct(product.catalogNumber)
                          }
                        >
                          <i className="fas fa-trash icon"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {editProductId === product.catalogNumber && (
                    <tr>
                      <td colSpan="10">
                        <EditProductForm
                          editProduct={editProduct}
                          setEditProduct={setEditProduct}
                          handleEditProduct={handleEditProduct}
                          categories={categories}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </section>

        <AddProductForm
          newProduct={newProduct}
          handleInputChange={handleInputChange}
          handleAddProduct={handleAddProduct}
        />
      </main>
    </div>
  );
};

const AddProductForm = ({
  newProduct,
  handleInputChange,
  handleAddProduct,
}) => {
  return (
    <section className="add-product-section">
      <h2>Add Product</h2>
      <form
        className="add-product-form"
        onSubmit={handleAddProduct}
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="catalogNumber"
          placeholder="Catalogue number"
          value={newProduct.catalogNumber}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="productName"
          placeholder="Product name"
          value={newProduct.productName}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={newProduct.color}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="size"
          placeholder="Size"
          value={newProduct.size}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={newProduct.amount}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleInputChange}
        />
        <input
          type="file"
          name="picture"
          accept="image/*"
          onChange={(e) =>
            handleInputChange({
              target: { name: "imageLink", value: e.target.files[0] },
            })
          }
        />
        <select
          name="categoryNumber"
          value={newProduct.categoryNumber}
          onChange={handleInputChange}
        >
          <option value="">Select Category</option>
          {Object.entries(categories).map(([key, value]) => (
            <option key={value} value={value}>
              {key}
            </option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>
    </section>
  );
};const EditProductForm = ({
  editProduct,
  setEditProduct,
  handleEditProduct,
  categories,
}) => {
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: name === "categoryNumber" ? parseInt(value, 10) : value, // Convert categoryNumber to integer
    }));
  };

  const handleFileChange = (e) => {
    setEditProduct((prev) => ({ ...prev, picture: e.target.files[0] }));
  };

  return (
    <div className="edit-product-form">
      <h3>Edit Product</h3>
      <form onSubmit={handleEditProduct}>
        <input
          type="text"
          name="catalogNumber"
          placeholder="Catalogue Number"
          value={editProduct.catalogNumber || ""}
          onChange={handleEditChange}
          disabled
        />
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={editProduct.productName || ""}
          onChange={handleEditChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={editProduct.description || ""}
          onChange={handleEditChange}
        />
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={editProduct.color || ""}
          onChange={handleEditChange}
        />
        <input
          type="text"
          name="size"
          placeholder="Size"
          value={editProduct.size || ""}
          onChange={handleEditChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={editProduct.amount || 0}
          onChange={handleEditChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={editProduct.price || 0}
          onChange={handleEditChange}
        />
        <select
          name="categoryNumber" // Ensure the name matches the backend field
          value={editProduct.categoryNumber || ""}
          onChange={handleEditChange}
        >
          <option value="">Select Category</option>
          {Object.entries(categories).map(([key, value]) => (
            <option key={value} value={value}>
              {key}
            </option>
          ))}
        </select>
        <input type="file" name="picture" onChange={handleFileChange} />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};





export default ShopOwnerProductsPage;
