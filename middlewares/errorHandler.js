const notFound = (req, res, next) => {
  const catchError = new Error(
    `Not Found :${req.originalURL}, Please Check The URL`
  );
  res.status(404);
  next(catchError);
};

const errorHandler = (err, req, res, next) => {
  const codeOfStatus = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(codeOfStatus);
  res.json({
    message: err?.message,
    stack: err?.stack,
  });
};

module.exports = { notFound, errorHandler };
