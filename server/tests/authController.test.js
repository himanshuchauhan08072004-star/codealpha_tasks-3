jest.mock('../models/User');
jest.mock('../utils/generateToken');

const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { register, login } = require('../controllers/authController');

const mockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

describe('authController.register', () => {
  afterEach(() => jest.clearAllMocks());

  test('rejects registration with an already-used email', async () => {
    User.findOne.mockResolvedValue({ _id: 'existing' });
    const req = { body: { name: 'Ada', email: 'ada@example.com', password: 'password123' } };
    const res = mockRes();
    const next = jest.fn();

    await register(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    expect(User.create).not.toHaveBeenCalled();
  });

  test('creates a user, sets a token cookie, and never returns the password', async () => {
    User.findOne.mockResolvedValue(null);
    const createdUser = {
      _id: 'u1',
      name: 'Ada',
      email: 'ada@example.com',
      role: 'customer',
      password: 'hashed-should-not-leak',
    };
    User.create.mockResolvedValue(createdUser);

    const req = { body: { name: 'Ada', email: 'ada@example.com', password: 'password123' } };
    const res = mockRes();
    const next = jest.fn();

    await register(req, res, next);

    expect(generateToken).toHaveBeenCalledWith(res, 'u1');
    expect(res.status).toHaveBeenCalledWith(201);
    const payload = res.json.mock.calls[0][0];
    expect(payload.data.password).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
  });
});

describe('authController.login', () => {
  afterEach(() => jest.clearAllMocks());

  test('rejects an unknown email', async () => {
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
    const req = { body: { email: 'nobody@example.com', password: 'whatever123' } };
    const res = mockRes();
    const next = jest.fn();

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  test('rejects a wrong password without revealing which field was wrong', async () => {
    const fakeUser = { comparePassword: jest.fn().mockResolvedValue(false) };
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(fakeUser) });
    const req = { body: { email: 'ada@example.com', password: 'wrongpass' } };
    const res = mockRes();
    const next = jest.fn();

    await login(req, res, next);

    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(401);
    expect(err.message).toMatch(/invalid email or password/i);
  });

  test('logs in successfully and sets the auth cookie', async () => {
    const fakeUser = {
      _id: 'u1',
      name: 'Ada',
      email: 'ada@example.com',
      role: 'customer',
      comparePassword: jest.fn().mockResolvedValue(true),
    };
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(fakeUser) });
    const req = { body: { email: 'ada@example.com', password: 'password123' } };
    const res = mockRes();
    const next = jest.fn();

    await login(req, res, next);

    expect(generateToken).toHaveBeenCalledWith(res, 'u1');
    expect(next).not.toHaveBeenCalled();
  });
});
