-- Crear base de datos
CREATE DATABASE IF NOT EXISTS mambo_petshop;
USE mambo_petshop;

-- Tabla de usuarios
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    category_id INT,
    pet_type ENUM('dog', 'cat', 'bird', 'fish', 'other') NOT NULL,
    stock INT DEFAULT 0,
    images JSON,
    sizes JSON,
    rating DECIMAL(3,2) DEFAULT 0,
    reviews_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Tabla de carrito
CREATE TABLE cart_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    quantity INT NOT NULL DEFAULT 1,
    size VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabla de pedidos
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100) NOT NULL,
    shipping_zip_code VARCHAR(10) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    payment_method ENUM('card', 'paypal', 'cash') NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabla de items del pedido
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    product_name VARCHAR(200) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    size VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Tabla de reviews
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabla de wishlist
CREATE TABLE wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);

-- Insertar categorías por defecto
INSERT INTO categories (name, description) VALUES
('Suéteres', 'Ropa abrigada para mascotas'),
('Vestidos', 'Vestidos elegantes para mascotas'),
('Camisas', 'Camisas casuales para mascotas'),
('Chaquetas', 'Chaquetas impermeables para mascotas'),
('Pijamas', 'Pijamas cómodos para mascotas'),
('Alimentos', 'Alimentos premium para mascotas'),
('Juguetes', 'Juguetes interactivos para mascotas'),
('Accesorios', 'Collares, correas y otros accesorios');

-- Insertar usuario admin por defecto
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@mambopetshop.com', '$2b$10$rQZ8K9mN2pL1vX3yU6wQ7eR4tY5uI8oP9aB2cD3eF4gH5iJ6kL7mN8oP9qR', 'admin');

-- Insertar productos de ejemplo
INSERT INTO products (name, description, price, original_price, category_id, pet_type, stock, sizes, rating, reviews_count) VALUES
('Suéter Cozy Winter', 'Suéter abrigado para perros en invierno', 24.99, 34.99, 1, 'dog', 50, '["XS", "S", "M", "L"]', 4.8, 156),
('Vestido Princesa Rosa', 'Vestido elegante para perras', 32.99, NULL, 2, 'dog', 30, '["XS", "S", "M"]', 4.9, 89),
('Camisa Casual Denim', 'Camisa casual de denim para perros', 19.99, 29.99, 3, 'dog', 75, '["S", "M", "L", "XL"]', 4.6, 203),
('Chaleco Elegante Gato', 'Chaleco elegante para gatos', 22.99, NULL, 1, 'cat', 40, '["XS", "S", "M"]', 4.7, 67),
('Abrigo Impermeable', 'Abrigo impermeable para perros', 45.99, 59.99, 4, 'dog', 25, '["S", "M", "L", "XL"]', 4.8, 124),
('Pijama Cómodo', 'Pijama cómodo para gatos', 18.99, 25.99, 5, 'cat', 60, '["XS", "S", "M", "L"]', 4.5, 78); 