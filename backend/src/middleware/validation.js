import { body, param, query, validationResult } from "express-validator";

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

// Validaciones para autenticación
const validateLogin = [
  body("email").isEmail().withMessage("Email válido requerido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  handleValidationErrors,
];

const validateRegister = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("email").isEmail().withMessage("Email válido requerido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  handleValidationErrors,
];

// Validaciones para productos
const validateProduct = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("El nombre del producto debe tener entre 2 y 200 caracteres"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número positivo"),
  body("pet_type")
    .isIn(["dog", "cat", "bird", "fish", "other"])
    .withMessage("Tipo de mascota inválido"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un número entero positivo"),
  handleValidationErrors,
];

// Validaciones para carrito
const validateCartItem = [
  body("product_id")
    .isInt({ min: 1 })
    .withMessage("ID de producto válido requerido"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Cantidad debe ser un número entero positivo"),
  body("size")
    .optional()
    .isString()
    .withMessage("Talla debe ser una cadena de texto"),
  handleValidationErrors,
];

// Validaciones para pedidos
const validateOrder = [
  body("shipping_address")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Dirección de envío requerida"),
  body("shipping_city")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Ciudad requerida"),
  body("shipping_state")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Estado requerido"),
  body("shipping_zip_code")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Código postal requerido"),
  body("shipping_phone")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Teléfono requerido"),
  body("payment_method")
    .isIn(["card", "paypal", "cash"])
    .withMessage("Método de pago inválido"),
  handleValidationErrors,
];

// Validaciones para parámetros de URL
const validateId = [
  param("id").isInt({ min: 1 }).withMessage("ID válido requerido"),
  handleValidationErrors,
];

// Validaciones para queries
const validateProductQuery = [
  query("category")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Categoría debe ser un ID válido"),
  query("pet_type")
    .optional()
    .isIn(["dog", "cat", "bird", "fish", "other"])
    .withMessage("Tipo de mascota inválido"),
  query("min_price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Precio mínimo debe ser un número positivo"),
  query("max_price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Precio máximo debe ser un número positivo"),
  query("sort")
    .optional()
    .isIn(["name", "price", "rating", "created_at"])
    .withMessage("Ordenamiento inválido"),
  query("order").optional().isIn(["asc", "desc"]).withMessage("Orden inválido"),
  handleValidationErrors,
];

export {
  validateLogin,
  validateRegister,
  validateProduct,
  validateCartItem,
  validateOrder,
  validateId,
  validateProductQuery,
  handleValidationErrors,
};
