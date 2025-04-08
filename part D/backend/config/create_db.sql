-- Create the database
CREATE DATABASE IF NOT EXISTS store_orders;
USE store_orders;

DROP TABLE IF EXISTS `order_items`, `orders`, `supplier_products`, `products`, `suppliers`, `users`;

-- Create `users` table
CREATE TABLE `users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `phone_number` VARCHAR(20) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('supplier', 'owner') NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;

-- Create `suppliers` table
CREATE TABLE `suppliers` (
  `id` INT NOT NULL,
  `company_name` VARCHAR(100) NOT NULL,
  `representative_name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `suppliers_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create `orders` table
CREATE TABLE `orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `supp_id` INT NOT NULL,
  `status` ENUM('pending', 'in_process', 'completed') NOT NULL DEFAULT 'pending',
  `order_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `supp_id` (`supp_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`supp_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;

-- Create `products` table
CREATE TABLE `products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;

-- Create `supplier_products` table
CREATE TABLE `supplier_products` (
  `supp_id` INT NOT NULL,
  `pro_id` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `minimum_quantity` INT NOT NULL,
  PRIMARY KEY (`supp_id`, `pro_id`),
  KEY `pro_id` (`pro_id`),
  CONSTRAINT `supplier_products_ibfk_1` FOREIGN KEY (`supp_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `supplier_products_ibfk_2` FOREIGN KEY (`pro_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create `order_items` table
CREATE TABLE `order_items` (
  `order_id` INT NOT NULL,
  `pro_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`order_id`, `pro_id`),
  KEY `pro_id` (`pro_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`pro_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Data into `products` table
INSERT INTO `products` (`id`, `product_name`) VALUES 
  (1, 'Milk'),
  (2, 'Eggs'),
  (3, 'Bread'),
  (4, 'Butter'),
  (5, 'Cheese'),
  (6, 'Tomatoes'),
  (7, 'Onions'),
  (8, 'Cucumbers'),
  (9, 'Apples'),
  (10, 'Bananas'),
  (11, 'Carrots'),
  (12, 'Lettuce'),
  (13, 'Potatoes'),
  (14, 'Olives'),
  (15, 'Yogurt'),
  (16, 'Juice'),
  (17, 'Sugar'),
  (18, 'Salt'),
  (19, 'Flour'),
  (20, 'Rice');

-- Insert Data into `users` table
INSERT INTO `users` (`user_id`, `phone_number`, `password`, `role`) VALUES
  (1, '0502345678', 'password1', 'owner'),
  (2, '0501234567', 'password2', 'supplier'),
  (3, '0503456789', 'password3', 'supplier'),
  (4, '0504567890', 'password4', 'supplier'),
  (5, '0505678901', 'password5', 'supplier'),
  (6, '0506789012', 'password6', 'supplier');


-- Insert Data into `suppliers` table
INSERT INTO `suppliers` (`id`, `company_name`, `representative_name`) VALUES
  (2, 'Company B', 'Jane Smith'),
  (3, 'Company C', 'David Johnson'),
  (4, 'Company D', 'Sarah Lee'),
  (5, 'Company E', 'Michael Brown'),
  (6, 'Company F', 'Lisa White');


-- Insert Data into `supplier_products` table
INSERT INTO `supplier_products` (`supp_id`, `pro_id`, `price`, `minimum_quantity`) VALUES
  (2, 1, 5.99, 10),
  (2, 3, 3.49, 20),
  (3, 5, 7.99, 15),
  (3, 4, 4.99, 10),
  (4, 7, 8.49, 8),
  (5, 6, 2.99, 5),
  (6, 9, 1.49, 50),
  (2, 13, 3.19, 15),
  (4, 15, 4.29, 7),
  (5, 16, 2.79, 25),
  (6, 17, 1.99, 40),
  (2, 17, 2.89, 50),
  (3, 14, 6.19, 30),
  (4, 16, 8.29, 10),
  (5, 12, 9.49, 15),
  (6, 13, 3.99, 20);

-- Insert Data into `orders` table
INSERT INTO `orders` (`id`, `supp_id`, `status`, `order_date`) VALUES
  (1, 2, 'pending', '2024-03-01 10:15:00'),
  (2, 3, 'completed', '2024-03-02 14:30:00'),
  (3, 4, 'in_process', '2024-03-03 09:45:00'),
  (4, 5, 'completed', '2024-03-04 12:00:00'),
  (5, 6, 'pending', '2024-03-05 16:20:00'),
  (6, 2, 'completed', '2024-03-10 10:50:00'),
  (7, 3, 'in_process', '2024-03-11 09:30:00'),
  (8, 4, 'completed', '2024-03-12 14:10:00'),
  (9, 5, 'pending', '2024-03-13 17:05:00'),
  (10, 6, 'in_process', '2024-03-14 07:45:00');  
  
-- Insert Data into `order_items` table
INSERT INTO `order_items` (`order_id`, `pro_id`, `quantity`) VALUES
  (1, 1, 10),  -- Company B orders 10 units of product 1
  (1, 3, 20),  -- Company B orders 20 units of product 3
  (2, 5, 15),  -- Company C orders 15 units of product 5
  (2, 4, 10),  -- Company C orders 10 units of product 4
  (3, 7, 8),   -- Company D orders 8 units of product 7
  (4, 6, 25),  -- Company E orders 25 units of product 6
  (4, 16, 25), -- Company E orders 25 units of product 16
  (5, 9, 50),  -- Company F orders 50 units of product 9
  (6, 13, 15), -- Company B orders 15 units of product 13
  (7, 14, 30), -- Company C orders 30 units of product 14
  (8, 16, 10), -- Company D orders 10 units of product 16
  (9, 12, 15), -- Company E orders 15 units of product 12
  (10, 13, 20); -- Company F orders 20 units of product 13






