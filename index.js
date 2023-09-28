var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/registration", function (req, res){
    res.sendFile(__dirname + "/public/" + "registration.html");
});

var admin = require("firebase-admin");
var serviceAccount = require("./key.json");

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

app.post("/reg", async function (req, res){
    const { username, email, password } = req.body;

    // Check if the email already exists in Firestore
    const emailExists = await checkEmailExists(email);

    if (emailExists) {
        res.send("Email already exists");
    } else {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        db.collection('tarun').add({
           FullName: username,
           Email: email,
           Password: hashedPassword // Store the hashed password
        })
        .then(()=>{
            res.redirect("/login.html");
        });
    }
});

// Function to check if an email exists in Firestore
async function checkEmailExists(email) {
    const querySnapshot = await db.collection('tarun')
        .where("Email", "==", email)
        .get();
    return !querySnapshot.empty;
}

app.get("/login", function (req, res){
    res.sendFile(__dirname + "/public/" + "login.html");
});

app.post("/signin", function (req, res){
    const { email, password } = req.body;

    db.collection('tarun')
    .where("Email", "==", email)
    .get()
    .then(async (querySnapshot) => {
        if(querySnapshot.empty){
            res.send("User not found");
        }
        else{
            const user = querySnapshot.docs[0].data();
            const hashedPassword = user.Password;

            // Compare the provided password with the hashed password
            const passwordMatch = await bcrypt.compare(password, hashedPassword);

            if (passwordMatch) {
                res.redirect("/web.html");
            } else {
                res.send("Incorrect email or password");
            }
        }
    });
});

app.listen(3000, function () {  
    console.log('Example app listening on port 3000!');
});
