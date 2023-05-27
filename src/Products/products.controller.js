const express = require("express");
const prisma = require('../db')

const {
  getProduct,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById
} = require("./products.service");
const verifyToken = require('../Auth/verifyToken')

const router = express.Router();

//get all product 
router.get("/",verifyToken, async (req, res) => {
  const products = await getProduct();

  res.status(200).json({
    message: "Success product",
    products,
  });
});

router.get("/:id",verifyToken, async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await getProductById(productId);

    if(!product) return res.status(404).json({
        message: "Product not found"
    })

    res.status(200).json({
      message: "Success get productid",
      product,
    });
  } catch (error) {
    res.status(500).json(error, "Error data");
  }
});

router.post("/",verifyToken, async (req, res) => {
  try {
    const productData = req.body;
    if (
      !(
        productData.title &&
        productData.desc &&
        productData.price && productData.price &&
        productData.images && productData.size && productData.merekId
      )
    )
      return res.status(400).send({ message: "Invalid Created" });

    const products = await createProduct(productData);

    res.status(201).json({
      message: "Success created",
      products,
    });
  } catch (error) {
    res.status(500).json(error, "Error Created");
  }
});

router.put("/:id",verifyToken, async(req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const productData = req.body;
        const product = await updateProductById(productId, productData)

        res.status(200).json({
            message: "Success updated",
            product
        })
    } catch (error) {
        res.status(500).send(error, "Error Data")
    }
})

router.delete("/:id",verifyToken, async(req, res) => {
    try {
        const productId = req.params.id;

        await prisma.size.deleteMany({
          where: {
              productId
          }
      })
  
      await prisma.images.deleteMany({
          where: {
            productId
          }
      })

        await deleteProductById(productId)

        res.status(200).send("Success Delete Product")
    } catch (error) {
        res.status(404).send({message: error.message})
    }
})

module.exports = router;
