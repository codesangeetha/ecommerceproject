const Adminusers = require("../models/adminusers");
const Brand = require("../models/brands.model");
const Category = require("../models/categories.model");
const Products = require("../models/products.model");
const Users = require("../models/users.model");
const bcrypt = require("bcrypt");
const { MailtrapClient } = require("mailtrap");
const TOKEN = "a72cedfa02a11c174c1e8596b1bc1f14";
const ENDPOINT = "https://send.api.mailtrap.io/";
const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });
const fetch = require('node-fetch');


exports.getcategorydata = async () => {
    const data = await Category.find({ isdeleted: false, status: true }).sort({ createdAt: -1 });
    return data;
}

exports.getcategorysearch = async (str) => {

    if (!str.trim()) {
        return await Category.find({ isdeleted: false }).sort({ createdAt: -1 });
    }

    const searchConditions = [
        { name: { $regex: str, $options: 'i' } },
        { description: { $regex: str, $options: 'i' } },
        { editUser: { $regex: str, $options: 'i' } }
    ];

    const searchQuery = {
        isdeleted: false,
        $or: searchConditions
    };

    const data = await Category.find(searchQuery);
    return data;

}

exports.getbranddata = async () => {
    const data = await Brand.find({ isdeleted: false }).sort({ createdAt: -1 });
    return data;
}

exports.getbrandsearch = async (str) => {

    if (!str.trim()) {
        return await Brand.find({ isdeleted: false }).sort({ createdAt: -1 });
    }

    const searchConditions = [
        { name: { $regex: str, $options: 'i' } },
        { description: { $regex: str, $options: 'i' } },
        { editUser: { $regex: str, $options: 'i' } }
    ];

    const searchQuery = {
        isdeleted: false,
        $or: searchConditions
    };

    const data = await Brand.find(searchQuery);
    return data;

}

exports.insertbrand = async (obj) => {
    const data = await Brand.insertMany([obj]);
    return data;
}
exports.getBrandDatabyId = async (val) => {
    const data = await Brand.findOne({ _id: val });
    return data;
}
exports.editbrand = async (id, info) => {
    const data = await Brand.updateOne({ _id: id }, info);
    return data;
}

exports.deletebrand = async (val) => {
    const data = await Brand.updateOne({ _id: val }, { $set: { isdeleted: true } });
    return data;
}


exports.getproductsdata = async () => {
    const data = await Products.find({ isdeleted: false }).sort({ createdAt: -1 });
    return data;
}
exports.getproductsearch = async (str) => {
    if (!str.trim()) {
        return await Products.find({ isdeleted: false }).sort({ createdAt: -1 });
    }

    const isNumber = !isNaN(str);

    const searchConditions = [
        { name: { $regex: str, $options: 'i' } },
        { description: { $regex: str, $options: 'i' } },
        { brand: { $regex: str, $options: 'i' } },
        { category: { $regex: str, $options: 'i' } },
        { editUser: { $regex: str, $options: 'i' } }
    ];

    if (isNumber) {
        searchConditions.push({ price: parseFloat(str) });
    }

    const searchQuery = {
        isdeleted: false,
        $or: searchConditions
    };

    const data = await Products.find(searchQuery);
    return data;
};

exports.getusersdata = async () => {
    const data = await Users.find({}).sort({ createdAt: -1 });
    return data;
}

exports.getusersearch = async (str) => {
    if (!str.trim()) {
        return await Users.find({}).sort({ createdAt: -1 });
    }
    const searchConditions = [
        { name: { $regex: str, $options: 'i' } },
        { username: { $regex: str, $options: 'i' } },
        { email: { $regex: str, $options: 'i' } }
    ];

    const searchQuery = {
        $or: searchConditions,
    };

    const data = await Users.find(searchQuery).sort({ createdAt: -1 });
    return data;
};

exports.insertcategory = async (obj) => {

    const data = await Category.insertMany([obj]);
    return data;
}

exports.insertproduct = async (obj) => {
    const data = await Products.insertMany([obj]);
    return data;
}

exports.insertuser = async (obj) => {
    const data = await Users.insertMany([obj]);
    return data;
}

exports.deletecategory = async (val) => {
    const data = await Category.updateOne({ _id: val }, { $set: { isdeleted: true } });
    return data;
}

exports.deleteproduct = async (val) => {
    const data = await Products.updateOne({ _id: val }, { $set: { isdeleted: true } });
    return data;
}

exports.getCategoryDatabyId = async (val) => {
    const data = await Category.findOne({ _id: val });
    return data;
}

exports.editcategory = async (id, info) => {
    const data = await Category.updateOne({ _id: id }, info);
    return data;
}

exports.getProductDatabyId = async (val) => {
    const data = await Products.findOne({ _id: val });
    return data;
}

exports.editproduct = async (id, info) => {
    const data = await Products.updateOne({ _id: id }, info);
    return data;
}

exports.banusers = async (id) => {
    const user = await Users.findById({ _id: id });
    user.status = !user.status;
    const data = await user.save();
    return data;
}

exports.finduser = async (username_email, pwd) => {
    const user = await Users.findOne({ $or: [{ username: username_email }, { email: username_email }] });
    if (!user) {
        return {
            result: null,
            msg: "Username is invalid"
        };
    }

    const isMatch = await bcrypt.compare(pwd, user.password);
    if (isMatch) {
        return {
            result: user,
            msg: "Successfully logged in"
        }
    } else {
        return {
            result: null,
            msg: "Password is invalid"
        }
    }
};

exports.finduseradmin = async (username, pwd) => {
    const user = await Adminusers.findOne({ username: username });
    if (!user) {
        return null;
    }

    const isMatch = await bcrypt.compare(pwd, user.password);
    return isMatch ? user : null;
}

exports.sendEmail = async (toEmail, subject, message) => {
    const sender = {
        email: "mailtrap@demomailtrap.com",
        name: "Mailtrap Test",

    };
    const recipients = [
        {
            email: toEmail,
        },
    ];

    try {
        const response = await client.send({
            from: sender,
            to: recipients,
            subject: subject,
            text: message,
            category: "Integration Test",
        });
        console.log('Email sent successfully:', response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

exports.dashboradCount = async () => {
    /* const userCount = await Users.countDocuments();
    const prodCount = await Products.countDocuments(); */
    const [userCount, prodCount, cateCount, brandCount] = await Promise.all([
        Users.countDocuments(),
        Products.countDocuments(),
        Category.countDocuments(),
        Brand.countDocuments()

    ])
    /* console.log('userCount', userCount);
    console.log('prodCount', prodCount); */
    return { userCount, prodCount, cateCount, brandCount };
}

exports.findUserByEmail = async (email) =>{
    return await Users.findOne({ email });
}

// Update user by email
exports.updateUserByEmail = async (email, updatedData) => {
    return await Users.updateOne({ email }, { $set: updatedData });
}

exports.findUserById = async (userId)=> {
    try {
        return await Users.findById(userId);
    } catch (error) {
        console.error('Error finding user by ID:', error);
        throw new Error('Could not find user.');
    }
}

exports.updatePasswordById = async (userId, hashedPassword)=> {
    try {
        return await Users.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true, runValidators: true }
        );
    } catch (error) {
        console.error('Error updating user password:', error);
        throw new Error('Could not update password.');
    }
}

exports.sendSMS = async (phoneNumber, message) => {
  const url = 'https://e53vyr.api.infobip.com/sms/3/messages';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'App 3c53d07473e98e80e8f01ed8161d1311-8518ddb0-2219-4349-ac0c-94b1a9895853'
  };

  const body = JSON.stringify({
    messages: [
      {
        sender: "InfoSMS",
        destinations: [
          { to: phoneNumber }
        ],
        content: { text: message }
      }
    ]
  });

  try {
    const response = await fetch(url, { method: 'POST', headers, body });
    const data = await response.json();

    if (data.messages && data.messages[0]?.status?.groupName === 'PENDING') {
      console.log('SMS sent successfully:', data);
    } else {
      console.error('Failed to send SMS:', data);
    }
  } catch (error) {
    console.error('Error sending SMS:', error.message);
  }
};


