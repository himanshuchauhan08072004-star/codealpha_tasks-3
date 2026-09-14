jest.mock('../models/Cart');
jest.mock('../models/Product');

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { addToCart } = require('../controllers/cartController');

const mockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

describe('cartController.addToCart', () => {
  afterEach(() => jest.clearAllMocks());

  test('rejects adding a product that does not exist', async () => {
    Product.findById.mockResolvedValue(null);
    const req = { user: { _id: 'u1' }, body: { productId: 'missing', quantity: 1 } };
    const next = jest.fn();

    await addToCart(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
  });

  test('refuses to add more units than are in stock', async () => {
    Product.findById.mockResolvedValue({ _id: 'p1', name: 'Wireless Mouse', stock: 3, price: 20 });
    Cart.findOne.mockResolvedValue({ user: 'u1', items: [], save: jest.fn() });

    const req = { user: { _id: 'u1' }, body: { productId: 'p1', quantity: 5 } };
    const next = jest.fn();

    await addToCart(req, mockRes(), next);

    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(400);
    expect(err.message).toMatch(/only 3 units/i);
  });

  test('adds within stock and saves the cart', async () => {
    Product.findById.mockResolvedValue({ _id: 'p1', name: 'Wireless Mouse', stock: 10, price: 20 });
    const cartDoc = {
      user: 'u1',
      items: [],
      save: jest.fn().mockResolvedValue(),
      populate: jest.fn().mockResolvedValue(),
    };
    Cart.findOne.mockResolvedValue(cartDoc);

    const req = { user: { _id: 'u1' }, body: { productId: 'p1', quantity: 2 } };
    const res = mockRes();
    const next = jest.fn();

    await addToCart(req, res, next);

    expect(cartDoc.items).toHaveLength(1);
    expect(cartDoc.items[0]).toEqual({ product: 'p1', quantity: 2 });
    expect(cartDoc.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(next).not.toHaveBeenCalled();
  });
});
