
const { getproductsdata, getProductDatabyId } = require('../helpers/functions');
const Product = require('../models/products.model');
const User = require('../models/users.model');

// Get all products and filter by search and category
exports.getAllProducts = async (req, res) => {



    const searchQuery = req.query.q || "";
    const regex = new RegExp(searchQuery, 'i');
    const categoryFilter = req.query.category || undefined;

    try {
        const info = await getproductsdata();
        let filteredInfo = info.filter(product => {
            return regex.test(product.name) || regex.test(product.description);
        });

        if (categoryFilter) {
            filteredInfo = filteredInfo.filter(product => {
                return categoryFilter.trim() === product.category.trim();
            });
        }

        const arr = filteredInfo.map(ob => ({
            _id: ob._id,
            name: ob.name.substring(0, 18),
            description: ob.description,
            price: ob.price,
            image: ob.images[0],
        }));

        res.render('index', {
            arr: arr,
            isLogin: req.session.client== 'client',
            searchQuery, // Pass the search query back to the view
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Get product details by id
exports.getProductById = async (req, res) => {
    const productId = req.params.id;

    console.log('getProductById');

    try {
        const product = await getProductDatabyId(productId);
        const isFavorited = req.user && req.user.favorites.includes(productId);

        res.render('product', {
            product,
            isLogin: req.session.client== 'client',
            isFavorited,
            productShareUrl: `https://ecommerceproject-4mp2.onrender.com/product/${productId}`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Add product to favorites
exports.addToFavorites = async (req, res) => {
    const userId = req.session.clientUser._id;
    const productId = req.params.id;

    try {
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favorites: productId } },
            { new: true }
        );

        await Product.findByIdAndUpdate(
            productId,
            { $addToSet: { favoriteBy: userId } },
            { new: true }
        );

        res.json({ success: true, message: 'Product added to favorites!' });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ success: false, message: 'An error occurred while adding to favorites.' });
    }
};

// Remove product from favorites
exports.removeFromFavorites = async (req, res) => {
    const userId = req.session.clientUser._id;
    const productId = req.params.id;

    try {
        await User.findByIdAndUpdate(
            userId,
            { $pull: { favorites: productId } },
            { new: true }
        );

        await Product.findByIdAndUpdate(
            productId,
            { $pull: { favoriteBy: userId } },
            { new: true }
        );

        res.json({ success: true, message: 'Product removed from favorites!' });
    } catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).json({ success: false, message: 'An error occurred while removing from favorites.' });
    }
};
