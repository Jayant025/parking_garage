export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'SERVER_ERROR';

  console.error(`[Error] [${req.method} ${req.url}] ${statusCode} - ${message}`);

  return res.status(statusCode).json({
    success: false,
    message,
    code,
  });
};
