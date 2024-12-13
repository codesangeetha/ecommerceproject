const Products = require("../models/products.model");
const Category = require("../models/categories.model");
const Users = require("../models/users.model");
const Brand = require('../models/brands.model');
const Order = require("../models/order.model");

const{insertbrand,deletebrand,getBrandDatabyId,editbrand}=require('../helpers/functions');

exports.getBrand = async (req, res) => {
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

    const totalbrands = await Brand.countDocuments(query);

    const branddata = await Brand.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const brands = branddata.map((o, index) => ({
        slno: (page - 1) * perPage + index + 1,
        _id: o._id,
        name: o.name,
        description: o.description.substring(0, 20),

    }));

    const totalPages = Math.ceil(totalbrands / perPage);

    res.render('adminbrand', {
        arr: brands,
        currentPage: page,
        totalPages,
        isAdmin: true, isadminlogin: req.session.isAdminLoggin
    });
};

exports.getAddBrand = (req, res) => {
    const msg = req.session.message;
    req.session.message = "";
    // console.log("msg = ",msg);
    return res.render('addbrand', { isAdmin: true, isadminlogin: req.session.isAdminLoggin, msg: msg })
};

exports.addBrandSubmit = async (req, res) => {

    if (req.body.brandName === "") {
        req.session.message = "Brand name is empty";
        return res.redirect('/admin/add-brand')
    }

    if (req.body.description === "") {
        req.session.message = "Brand descripton is empty";
        return res.redirect('/admin/add-brand')
    }

    const obj = {
        name: req.body.brandName,
        description: req.body.description,
        isdeleted: false,
        editUser: req.session.adminName,
        status: req.body.status ? true : false
    }
    // console.log(obj);
    const data = await insertbrand(obj)
    return res.redirect('/admin/brand');
};

exports.brandSearch = async (req, res) => {

    const searchQuery = req.body.search.trim();
    const page = parseInt(req.query.page) || 1;
    const perPage = 4; // Number of items per page

    let query = { isdeleted: false };
    if (searchQuery) {
        query = {
            ...query,
            name: { $regex: searchQuery, $options: "i" },
        };
    }

    const totalbrands = await Brand.countDocuments(query);

    const branddata = await Brand.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const brands = branddata.map((o, index) => ({
        slno: (page - 1) * perPage + index + 1,
        _id: o._id,
        name: o.name,
        description: o.description.substring(0, 20),
    }));

    const totalPages = Math.ceil(totalbrands / perPage);

    res.render('adminbrand', {
        arr: brands,
        currentPage: page,
        totalPages,
        isAdmin: true,
        isadminlogin: req.session.isAdminLoggin,
        searchQuery,
    });

};

exports.deleteBrand = async (req, res) => {
    const val = req.params.id;
    // console.log(val);
    const data = await deletebrand(val);
    res.redirect('/admin/brand')
};

exports.getEditBrand = async (req, res) => {
    const val = req.params.id;
    const data = await getBrandDatabyId(val)
    // console.log("editbrand-data", data)
    return res.render('editbrand', { brand: data, isAdmin: true, isadminlogin: req.session.isAdminLoggin })
};

exports.editBrandSubmit = async (req, res) => {
    const val = req.params.id;
    let obj = {
        name: req.body.brandName,
        description: req.body.description,
        editUser: req.session.adminName,
        status: req.body.status ? true : false
    };
    // console.log("ready to edit",obj);
    const data = await editbrand(val, obj);
    return res.redirect('/admin/brand')
};

exports.getViewBrand = async (req, res) => {
    try {
        const val = req.params.id;

        const brand = await getBrandDatabyId(val);
        console.log("brand", brand);


        if (!brand) {
            return res.status(404).send('<p class="text-danger">Brand not found</p>');
        }

        const createdAtDate = brand.createdAt
            ? brand.createdAt.toISOString().split('T')[0]
            : 'N/A';
        const updatedAtDate = brand.updatedAt
            ? brand.updatedAt.toISOString().split('T')[0]
            : 'N/A';


        res.render('partials/brandModalContent', {
            layout: false,
            brandName: brand.name,
            description: brand.description,
            editUser: brand.editUser || 'N/A',
            status: brand.status,
            createdAtDate,
            updatedAtDate,

        });
    } catch (error) {
        console.error('Error fetching brand data:', error);
        res.status(500).send('<p class="text-danger">Internal server error</p>');
    }
};