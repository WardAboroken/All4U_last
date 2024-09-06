const express = require("express");
const multer = require("multer");
const path = require("path"); // Import path to handle file paths
const addProduct = require("../database/queries/addProduct");
const deleteProduct = require("../database/queries/deleteProduct");
const updateProduct = require("../database/queries/updateProduct"); // Import update function
const doQuery = require("../database/query"); // Add this line to access the database directly for fetching the existing picturePath
const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Ensure the correct directory path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp and file extension
  },
});

const upload = multer({ storage });

// Route to add a new product
router.post("/addProduct", upload.single("picture"), async (req, res) => {
  try {
    console.log("Adding new product:", req.body);
    const product = req.body;
    const picturePath = req.file ? req.file.filename : null; // Get picture path if uploaded
    product.picturePath = picturePath; // Assign picture path to product object

    const result = await addProduct(product);

    if (result.success) {
      res.status(200).json({
        message: "Product added successfully",
        product: result.product,
      });
    } else {
      res
        .status(400)
        .json({ message: result.error || "Product already exists." });
    }
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Route to delete a product
router.delete("/deleteProduct/:catalogNumber", async (req, res) => {
  try {
    const { catalogNumber } = req.params; // Use catalogNumber from URL parameter
    console.log("Deleting product with catalog number:", catalogNumber);
    
    const result = await deleteProduct({ catalogNumber });

    if (result.success) {
      res.status(200).json({ message: "Product deleted successfully!" });
    } else {
      res.status(400).json({ message: "Product does not exist." });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Route to update a product
router.put(
  "/updateProduct/:catalogNumber",
  upload.single("picture"),
  async (req, res) => {
    try {
      const { catalogNumber } = req.params;
      const {
        productName,
        description,
        color,
        size,
        amount,
        price,
        categoryNumber, // Updated to use `categoryNumber` as in backend
      } = req.body;

      // Parse categoryNumber to ensure it is an integer
      const parsedCategoryNumber = categoryNumber
        ? parseInt(categoryNumber, 10)
        : null;

      // Check if a new picture is uploaded; if not, keep the existing picture
      let picturePath = req.file ? req.file.filename : null; // Get new picture path if uploaded

      // If no new picture is uploaded, retrieve the current picturePath from the database
      if (!picturePath) {
        const currentProduct = await doQuery(
          `SELECT picturePath FROM products WHERE catalogNumber = ?`,
          [catalogNumber]
        );

        if (currentProduct.length > 0) {
          picturePath = currentProduct[0].picturePath; // Keep existing picturePath
        }
      }

      const updatedProductData = {
        productName,
        description,
        color,
        size,
        amount,
        price,
        categoryNumber: parsedCategoryNumber, // Correctly set parsed category number
        picturePath,
      };

      const result = await updateProduct(catalogNumber, updatedProductData);

      if (result.success) {
        res.status(200).json(result.product); // Return updated product
      } else {
        res.status(400).json({ message: "Product update failed." });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
