const adminOnly = require('../middleware/adminOnly');

describe('adminOnly middleware', () => {
  test('blocks a customer with 403', () => {
    const req = { user: { role: 'customer' } };
    const next = jest.fn();

    expect(() => adminOnly(req, {}, next)).toThrow(expect.objectContaining({ statusCode: 403 }));
  });

  test('blocks when req.user is missing entirely', () => {
    const req = {};
    const next = jest.fn();

    expect(() => adminOnly(req, {}, next)).toThrow(expect.objectContaining({ statusCode: 403 }));
  });

  test('allows an admin through', () => {
    const req = { user: { role: 'admin' } };
    const next = jest.fn();

    adminOnly(req, {}, next);

    expect(next).toHaveBeenCalledWith();
  });
});
