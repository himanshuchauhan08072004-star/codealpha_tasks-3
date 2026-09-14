jest.mock('jsonwebtoken');
jest.mock('../models/User');

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/auth');

const mockRes = () => ({});

describe('auth middleware (protect)', () => {
  afterEach(() => jest.clearAllMocks());

  test('rejects requests with no token cookie', async () => {
    const req = { cookies: {} };
    const next = jest.fn();

    await protect(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  test('rejects an invalid/expired token', async () => {
    const req = { cookies: { token: 'bad-token' } };
    const next = jest.fn();
    jwt.verify.mockImplementation(() => {
      throw new Error('invalid signature');
    });

    await protect(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  test('rejects a valid token for a user that no longer exists', async () => {
    const req = { cookies: { token: 'valid-token' } };
    const next = jest.fn();
    jwt.verify.mockReturnValue({ userId: 'deleted-user-id' });
    User.findById.mockResolvedValue(null);

    await protect(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  test('attaches req.user and calls next() with no error for a valid session', async () => {
    const req = { cookies: { token: 'valid-token' } };
    const next = jest.fn();
    const fakeUser = { _id: 'u1', role: 'customer' };
    jwt.verify.mockReturnValue({ userId: 'u1' });
    User.findById.mockResolvedValue(fakeUser);

    await protect(req, mockRes(), next);

    expect(req.user).toBe(fakeUser);
    expect(next).toHaveBeenCalledWith();
  });
});
