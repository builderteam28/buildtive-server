const errorHandler = (err, req, res, next) => {
  console.log(err)
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
    case "PasswordRequired":
      res.status(400).json({ message: "Password is required" });
      break;
    case "Forbidden":
      res.status(403).json({ message: "You are not authorized" });
      break;
    case "NotFound":
      res.status(404).json({ message: "Worker not found" });
      break;
    case "ProjectNotFound":
      res.status(404).json({ message: "Project not found" });
      break;
    case "ProjectIsActive":
      res.status(403).json({ message: "Project is Active!" });
      break;
    default:
      res.status(500).json({ message: "Internal Server Error" });
      break;
  }
};

module.exports = errorHandler;
