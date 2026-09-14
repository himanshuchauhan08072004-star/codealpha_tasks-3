// Wraps async controller fns so rejected promises go to Express error middleware.
// Returns the promise (Express ignores it, but this makes the fn awaitable in tests).
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
