const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const slugify = require('../utils/slugify');

const SORT_MAP = {
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  newest: { createdAt: -1 },
  rating: { rating: -1 },
};

// GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    rating,
    featured,
    sort = 'newest',
    page = 1,
    limit = 12,
  } = req.query;

  const filter = {};

  if (featured === 'true') {
    filter.featured = true;
  }

  if (search) {
    filter.$text = { $search: search };
  }
  if (category) {
    filter.category = category;
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (rating) {
    filter.rating = { $gte: Number(rating) };
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;
  const sortSpec = SORT_MAP[sort] || SORT_MAP.newest;

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortSpec).skip(skip).limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  });
});

// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  res.json({ success: true, data: product });
});

// POST /api/products (admin)
const createProduct = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;
  // ensure unique slug
  while (await Product.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const product = await Product.create({ ...req.body, slug });
  res.status(201).json({ success: true, data: product });
});

// PUT /api/products/:id (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Re-slug only if name changed
  if (req.body.name && req.body.name !== product.name) {
    const baseSlug = slugify(req.body.name);
    let slug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug, _id: { $ne: product._id } })) {
      slug = `${baseSlug}-${counter++}`;
    }
    req.body.slug = slug;
  }

  Object.assign(product, req.body);
  await product.save();

  res.json({ success: true, data: product });
});

// DELETE /api/products/:id (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
