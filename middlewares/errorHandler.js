const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    case "Unauthorized":
      res.status(401).json({ message: "Invalid email/password" });
    case "JsonWebTokenError":
    case "Invalid Token":
      res.status(401).json({ message: "Please login first" });
      break;
    case "SequelizeValidationError":
      res.status(400).json({ message: err.errors[0].message });
      break;
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ message: err.errors[0].message });
      break;
    case "EmailRequired":
      res.status(400).json({ message: "Email is required" });
      break;
    case "FullNameRequired":
      res.status(400).json({ message: "Fullname is required" });
      break;
    case "AddressRequired":
      res.status(400).json({ message: "Address is required" });
      break;
    case "PhoneNumberRequired":
      res.status(400).json({ message: "Phonenumber is required" });
      break;
    case "PasswordRequired":
      res.status(400).json({ message: "Password is required" });
      break;
    case "ProjectNotFound":
      res.status(404).json({ message: "Project not found" });
      break;
    case "CategoryNotFound":
      res.status(404).json({ message: "Category not found" });
      break;
    case "WorkerNotFound":
      res.status(404).json({ message: "Worker not found" });
      break;
    default:
      res.status(500).json({ message: "Internal Server Error" });
      break;
  }
};

module.exports = errorHandler;
