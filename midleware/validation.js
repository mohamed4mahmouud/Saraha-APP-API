let validDataType = ["body", "headers", "query", "params"];

const validation = (schema) => {
  return (req, res, next) => {
    let validationError = [];
    validDataType.forEach((el) => {
      if (schema[el]) {
        let valid = schema[el].validate(req[el], { abortEarly: false });
        if (valid.error) {
          validationError.push(valid.error.details);
        }
      }
    });

    if (validationError.length) {
      res.json({ message: "Error", validationError });
    } else {
      next();
    }
  };
};

export default validation;
