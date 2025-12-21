const globalErrorMiddleware = (err, req, res, next) => {
  console.log("Erorr: ", err);
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    success: false,
    message: err.message || "something went wrong",
  });
};

export default globalErrorMiddleware;
