/**
 * @description A wrapper for async route handlers to catch any errors 
 * and pass them to the express error handling middleware.
 * @param {Function} requestHandler - The asynchronous function (middleware or controller) to be wrapped
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
