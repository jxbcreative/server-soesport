const prisma = require("../db");

const getProduct = async () => {
  const products = await prisma.product.findMany({
    include: {
        size: true,
        images: true,
        merek: true
    }
  });

  return products;
};

const getProductById = async (id) => {

    const product = await prisma.product.findUnique({
    where: {
      id
    },
    include: {
        size: true,
        images: true,
        merek: true
    }
  });

  if (!product) throw new Error("Product not found");

  return product;
};

const createProduct = async(productData) => {
    const products = await prisma.product.create({
        data: {
            title: productData.title,
            merekId: productData.merekId,
            desc: productData.desc,
            price: productData.price,
            rate: productData.rate,
            size: {
                create: productData.size
            },
            thumbnail: productData.thumbnail,
            images: {
                create: productData.images
            }
        },
        include: {
            size: true,
            images: true,
            merek: true
        }
    })
    return products;
}

const updateProductById = async(id, productData) => {
    await getProductById(id);
    const product = await prisma.product.update({
        where:{
            id
        },
        data: {
            title: productData.title,
            desc: productData.desc,
            merekId: parseInt(productData.merekId),
            price: parseInt(productData.price),
            rate: productData.rate,
            size: {
                deleteMany:{},
                create: productData.size.map((val) => ({ size: val.size }))
            },
            images: {
                deleteMany:{},
                create: productData.images.map((val) => ({ url: val.url }))
            }
        },
        include: {
            size: true,
            images: true
        }
    })
    return product;
}

const deleteProductById = async(id) => {
    await getProductById(id)

    await prisma.product.delete({
        where: {
            id
        },
        include: {
            images: true,
            size: true
        }
    })
}

module.exports = {
  getProduct,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById
};
