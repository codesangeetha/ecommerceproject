
# ShoeStore E-commerce Application

This project is a **ShoeStore E-commerce application** built using **Node.js**, **Express**, **MongoDB**, and **Handlebars (HBS)**. The platform enables users to browse and purchase shoes, manage their profiles, and interact with features like a cart, favorites, and order checkout. Admin functionalities include product, category, and user management.

---

## Features

### **User Functionalities**
- **Authentication**: Signup, login, logout, forgot password, and change password.
- **Profile Management**: Update personal details and view/edit favorites.
- **Product Browsing**: View all products, product details, and filter by categories.
- **Favorites**: Add/remove products to/from the favorites list.
- **Cart Management**: Add/update/remove products in the cart with support for sizes and colors.
- **Checkout & Payment**: Order checkout with payment integration (Cashfree).
- **Order Management**: View order summary on the **Thank You** page after successful payment.

### **Admin Functionalities**
- Manage categories, products, and users.
- View and search user data with options for editing, creating, and deleting entries.
- Monitor orders with search and pagination.

---

## Tech Stack

### **Backend**
- [Node.js](https://nodejs.org/) - Server-side JavaScript runtime.
- [Express.js](https://expressjs.com/) - Web application framework.

### **Frontend**
- [Handlebars.js (HBS)](https://handlebarsjs.com/) - Templating engine for dynamic content.

### **Database**
- [MongoDB](https://www.mongodb.com/) - NoSQL database for storing data.

### **Payment Integration**
- [Cashfree](https://www.cashfree.com/) - Payment gateway for handling transactions.

---

## Installation

### **1. Clone the repository**
```bash
git clone <repository_url>
cd shoestore-ecommerce
```

### **2. Install dependencies**
```bash
npm install
```

### **3. Set up environment variables**
Create a `.env` file in the root directory and define the following:
```env
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

### **4. Start the application**
```bash
npm start
```
The application will run on `http://localhost:3000` by default.

---

## Directory Structure

```plaintext
.
├── controllers         # Route handler logic
│   ├── cartController.js
│   ├── checkoutController.js
│   ├── productController.js
│   └── userController.js
├── helpers             # Utility and reusable functions
│   └── functions.js
├── models              # Mongoose models for MongoDB collections
│   ├── cart.model.js
│   ├── categories.model.js
│   ├── order.model.js
│   ├── products.model.js
│   └── users.model.js
├── routes              # Route definitions
│   └── index.js
├── views               # Handlebars templates
│   ├── layouts         # Layout files
│   ├── partials        # Reusable components
│   ├── profile.hbs     # Profile page
│   ├── changepassword.hbs # Change Password page
│   └── ...
├── public              # Static files (CSS, JS, images)
├── app.js              # Main application entry point
├── package.json        # Project metadata and dependencies
└── .env                # Environment configuration
```

---

## Routes Overview

### **User Routes**
| Route                   | Method | Description                        |
|-------------------------|--------|------------------------------------|
| `/signup`               | GET    | Render signup page                |
| `/signupsubmit`         | POST   | Handle user signup submission     |
| `/login`                | GET    | Render login page                 |
| `/forgot-password`      | GET    | Render forgot password page       |
| `/changepassword`       | GET    | Render change password page       |
| `/profile`              | GET    | Render user profile page          |
| `/profile`              | POST   | Update user profile               |
| `/favorites`            | GET    | View favorites list               |

### **Product Routes**
| Route                   | Method | Description                        |
|-------------------------|--------|------------------------------------|
| `/`                     | GET    | View all products                 |
| `/product/:id`          | GET    | View product details              |
| `/product/:id/favorite` | POST   | Add product to favorites          |
| `/product/:id/unfavorite` | POST | Remove product from favorites     |

### **Cart Routes**
| Route                   | Method | Description                        |
|-------------------------|--------|------------------------------------|
| `/cart`                 | GET    | View cart                         |
| `/cart/add`             | POST   | Add product to cart               |
| `/cart/update`          | POST   | Update product quantity in cart   |
| `/cart/updatesize`      | POST   | Update product size in cart       |
| `/cart/updatecolor`     | POST   | Update product color in cart      |
| `/delete-cart/:id`      | GET    | Remove product from cart          |

### **Checkout Routes**
| Route                   | Method | Description                        |
|-------------------------|--------|------------------------------------|
| `/checkout`             | GET    | Render checkout page              |
| `/checkout-submit`      | POST   | Submit order                      |
| `/payment/create-order` | POST   | Create payment order              |
| `/thankyou`             | GET    | Render thank you page             |

---

## Features in Progress
- Admin panel for category and product management.
- Advanced search and filter options.
- Enhanced email notifications for order updates.

---

## License
This project is open-source and free to use under the [MIT License](LICENSE).

---
