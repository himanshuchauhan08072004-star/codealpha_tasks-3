const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

// Runs after validator chains; throws 400 with first error message if any failed
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }
  next();
};

module.exports = validate;
