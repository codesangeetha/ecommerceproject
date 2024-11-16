const bcrypt = require("bcrypt");

const plainTextPassword = "mySecurePassword";
const saltRounds = 10;

async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Hashed Password:", hashedPassword);
    return hashedPassword;
}

async function verifyPassword(plainPassword, hashedPassword) {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log(isMatch ? "Password matched!" : "Password did not match.");
}

// Example Usage
(async () => {
    const hashedPassword = await hashPassword("manupwd");
    // await verifyPassword(plainTextPassword, hashedPassword);
})();
