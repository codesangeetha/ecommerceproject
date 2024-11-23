/* const bcrypt = require("bcrypt");

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
    const hashedPassword = await hashPassword("sandeeppwd");
    // await verifyPassword(plainTextPassword, hashedPassword);
})(); */


const students = [
    { id: 1, name: "Alice", age: 20, grade: "A", subjects: ["Math", "Science"] },
    { id: 2, name: "Bob", age: 21, grade: "B", subjects: ["History", "English"] },
    { id: 3, name: "Charlie", age: 19, grade: "A", subjects: ["Science", "English"] },
    { id: 4, name: "Diana", age: 22, grade: "C", subjects: ["Math", "History"] },
    { id: 5, name: "Eve", age: 20, grade: "B", subjects: ["Math", "Science"] }
];
/* 
let studentdata = "";
for (let i = 0; i < students.length; i++) {
    if (students[i].id == 3) {
        studentdata = students[i];
        break;
    }
};
 console.log(studentdata);
 */

/* let gradestudent = [];
for (let i = 0; i < students.length; i++) {
    if (students[i].grade == "A") {
        gradestudent.push(students[i])
    }
}
 console.log(gradestudent);
 console.log( "Count is :", gradestudent.length);
 */

/* for (let i = 0; i < students.length; i++) {
    if (students[i].name == "Bob") {
        students[i].grade = "A"

        if (!students[i].subjects.includes("Physics")) {
            students[i].subjects.push("Physics");
        }
        break;
    }
    
}
 console.log(students); */

/* for (let i = 0; i < students.length; i++) {
    if (students[i].id == 4) {
        students.splice(i, 1)
        break;
    }
}
 console.log(students); */

/* mathAndage = [];
for (let i = 0; i < students.length; i++) {
    if (students[i].age === 20 && students[i].subjects.includes("Math")) {
        mathAndage.push(students[i]);
    }
}
 console.log(mathAndage); */

/*  const obj = {
    id: 6,
    name: "Frank",
    age: 21,
    grade: "B",
    subjects: ["Physics", "Math"]
};
   or
const obj ={};
obj.id =6;
obj.name = "Frank";
obj.age = 21;
obj.grade = "A";
obj.subjects= ["Physics", "Math"]

students.push(obj);
 console.log(students); */


/* const newArr = [];
for (let i = 0; i < students.length; i++) {
    if (students[i].grade === "B") {
        newArr.push(students[i].name)
    }
};
 console.log(newArr); */

/* const multipleArr = [];
for (let i = 0; i < students.length; i++) {
    if (students[i].age == 20 || students[i].subjects.includes("Science")) {
        multipleArr.push(students[i]);
    }
}
 console.log(multipleArr); */

/* let sum = 0;
for (let i = 0; i < students.length; i++) {
    if (students[i].subjects.includes("English")) {
        sum = sum + 1;
    }
}

               OR(for capital letter or small letter)
                        -----------------
let sum = 0;
const regex = /english/i;
for (let i = 0; i < students.length; i++) {
    if (students[i].subjects.some(subject =>regex.test(subject))) {
        sum = sum + 1;
    }
}
 console.log(sum); */

/* for (let i = 0; i < students.length; i++) {
    if (students[i].subjects.includes("Math")) {
        students[i].subjects.push("Advanced Math");
    }
}
console.log(students); */

const books = [
    { id: 101, title: "1984", author: "George Orwell", price: 20, pages: 328, genre: "Fiction", tags: ["Classic", "Dystopian","Fantasy"] },
    { id: 102, title: "To Kill a Mockingbird", author: "Harper Lee", price: 18, pages: 281, genre: "Fiction", tags: ["Classic"] },
    { id: 103, title: "Sapiens", author: "Yuval Noah Harari", price: 22, pages: 443, genre: "Non-Fiction", tags: ["History", "Anthropology","Fantasy"] },
    { id: 104, title: "Harry Potter", author: "J.K. Rowling", price: 25, pages: 500, genre: "Fantasy", tags: ["Magic", "Adventure"] },
    { id: 105, title: "Dune", author: "Frank Herbert", price: 28, pages: 412, genre: "Science Fiction", tags: ["Classic", "Epic"] },
];

/* let bookname ="";
for(let i=0;i<books.length;i++){
    if(books[i].id == 102){
        bookname = books[i];
    }
}
console.log(bookname); */

/* const fictionArr = [];
for(let i=0;i<books.length;i++){
    if(books[i].genre == "Fiction"){
        fictionArr.push(books[i]);
    }
}
console.log(fictionArr); */

/* for (let i = 0; i < books.length; i++) {
    if (books[i].id == 103) {
        books[i].price = 25;
        books[i].tags.push("Bestseller");
    }
}
console.log(books); */
/* 
for(let i=0;i<books.length;i++){
    if(books[i].id==105){
        books.splice(i,1);
        break;
    }
}
console.log(books); */

/* const findbooks =[];
for(let i=0;i<books.length;i++){
    if(books[i].pages>300 && books[i].genre == "Non-Fiction"){
        findbooks.push(books[i]);
    }
}
console.log(findbooks); */

/* const obj = {
    id: 106,
    title: "The Last Leaf",
    author: "O. Henry",
    price: 15,
    pages: 100,
    genre: "Fiction",
    tags: ["Classic"]
}
books.push(obj);
console.log(books); */

/* const newArr = [];
for(let i=0 ; i<books.length;i++){
    if(books[i].price >20){
        newArr.push(books[i].title);
    }
}
console.log(newArr); */

/* const newArr = [];
for(let i=0;i<books.length;i++){
    if(books[i].author == "J.K. Rowling" ||books[i].genre == "Fantacy"){
        newArr.push(books[i]);
    }
}
console.log(newArr); */

/* let count =0;
for(let i=0;i<books.length;i++){
if(books[i].genre == "Science Fiction"){
    count ++;
}
}
console.log(count); */

/* for(let i=0;i<books.length;i++){
    if(books[i].tags.includes("Fantasy")){
        books[i].tags.push("Epic Fantasy")
    }
}
console.log(books); */