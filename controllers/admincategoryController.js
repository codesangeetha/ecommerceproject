const Products = require("../models/products.model");
const Category = require("../models/categories.model");
const Users = require("../models/users.model");
const Brand = require('../models/brands.model');
const Order = require("../models/order.model");

const { insertcategory, deletecategory, getCategoryDatabyId, editcategory } = require('../helpers/functions');

exports.getCategory = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 4;
    const { startDate, endDate } = req.query;

    let query = { isdeleted: false };

    if (startDate) {
        query.createdAt = { ...query.createdAt, $gte: new Date(`${startDate}T00:00:00.000Z`) };
    }
    if (endDate) {
        query.createdAt = { ...query.createdAt, $lte: new Date(`${endDate}T23:59:59.999Z`) };
    }
    console.log("query :", query);

    const totalcategories = await Category.countDocuments(query);

    const categorydata = await Category.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const categories = categorydata.map((o, index) => ({
        slno: (page - 1) * perPage + index + 1,
        _id: o._id,
        name: o.name,
        description: o.description.substring(0, 20),
        image: o.image

    }));

    const totalPages = Math.ceil(totalcategories / perPage);

    res.render('admincategory', {

        arr: categories,
        currentPage: page,
        totalPages,
        isAdmin: true, isadminlogin: req.session.isAdminLoggin,
        startDate: startDate || "",
        endDate: endDate || ""
    });

};

exports.addCategory = (req, res) => {
    const msg = req.session.message;
    req.session.message = "";
    // console.log("msg", msg);
    return res.render('addcategory', { isAdmin: true, isadminlogin: req.session.isAdminLoggin, msg: msg })
};

exports.postaddCategorySubmit = async (req, res) => {

    if (req.body.categoryName === "") {
        req.session.message = "Category Name is empty";
        return res.redirect("/admin/add-category");
    }

    if (req.body.description === "") {
        req.session.message = "Category description is empty";
        return res.redirect("/admin/add-category");
    }

    const obj = {
        name: req.body.categoryName,
        description: req.body.description,
        isdeleted: false,
        editUser: req.session.adminName,
        image: req.file ? req.file.filename : null,
        status: req.body.status ? true : false
    }
    // console.log(obj);
    const data = await insertcategory(obj);
    // console.log(data);
    return res.redirect('/admin/category');
};

exports.postCategorySearch = async (req, res) => {
    const searchQuery = req.body.search.trim();
    const page = parseInt(req.query.page) || 1;
    const perPage = 4;
    let query = { isdeleted: false };
    if (searchQuery) {
        query = {
            ...query,
            name: { $regex: searchQuery, $options: "i" },
        };
    }

    const totalcategories = await Category.countDocuments(query);

    const categorydata = await Category.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const categories = categorydata.map((o, index) => ({
        slno: (page - 1) * perPage + index + 1,
        _id: o._id,
        name: o.name,
        description: o.description.substring(0, 20),
        image: o.image
    }));

    const totalPages = Math.ceil(totalcategories / perPage);

    res.render('admincategory', {
        arr: categories,
        currentPage: page,
        totalPages,
        isAdmin: true,
        isadminlogin: req.session.isAdminLoggin,
        searchQuery,
    });
};

exports.deleteCategory = async (req, res) => {
    const val = req.params.id;
    // console.log(val);
    const data = await deletecategory(val);
    res.redirect('/admin/category')
};

exports.getEditCategory = async (req, res) => {
    const val = req.params.id;
    const data = await getCategoryDatabyId(val)
    //  console.log(data);

    return res.render('editcategory', { category: data, isAdmin: true, isadminlogin: req.session.isAdminLoggin })
};

exports.editCategorySubmit = async (req, res) => {
    const val2 = req.params.id;

    const oldimg = await getCategoryDatabyId(val2);
    console.log("oldimage -", oldimg);
    let obj = {
        name: req.body.categoryName,
        description: req.body.description,
        editUser: req.session.adminName,
        image: req.file ? req.file.filename : oldimg.image,
        status: req.body.status ? true : false
    };

    if (req.file) {
        obj.image = req.file.filename;
    } else if (req.body.removeImage) {
        obj.image = null;
    }

    // console.log(obj);
    const data = await editcategory(val2, obj);
    // console.log(data);
    res.redirect('/admin/category');
};

const formatDate = (date) => {
    if (!date) return 'N/A';
    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    return formattedDate;
};

exports.getViewCategory = async (req, res) => {
    try {
        const val = req.params.id;
        const category = await getCategoryDatabyId(val);
        console.log("categories", category);

        if (!category) {
            return res.status(404).send('<p class="text-danger">Category not found</p>');
        }


        const createdAtDate = category.createdAt
            ? formatDate(category.createdAt)
            : 'N/A';
        const updatedAtDate = category.updatedAt
            ? formatDate(category.updatedAt)
            : 'N/A'

        res.render('partials/categoryModalContent', {
            layout: false,
            categoryName: category.name,
            description: category.description,
            editUser: category.editUser || 'N/A',
            status: category.status,
            createdAtDate,
            updatedAtDate,
            image: category.image || 'default.png',
        });
    } catch (error) {
        console.error('Error fetching category data:', error);
        res.status(500).send('<p class="text-danger">Internal server error</p>');
    }
};