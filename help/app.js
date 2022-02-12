const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const md5 = require('md5')
const res = require('express/lib/response')
const alert = require("alert")

const app = express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
   extended: true
}))
app.set("view engine", "ejs")

mongoose.connect("mongodb://localhost:27017/games")

const gamesSchema = new mongoose.Schema({
   name:String,
   email:String,
   password: String
})


const Games = new mongoose.model("Games", gamesSchema);

app.get("/", (req, res) => {
   res.render("first-page")
})

app.get("/login", (req, res) => {
   res.render("login")
});

app.get("/registration", (req, res) => {
   res.render("registration")
});

app.get("/guss-number",(req, res)=>{
   res.render("guss-number")
})

app.get("/pig-game",(req,res)=>{
   res.render("pig-game")
})

app.get("/login-admin",(req,res)=>{
   res.render("login-admin")
})

app.post("/login-admin",(req,res)=>{
   const email = "shoja@yahoo.com"
   const pas = 12345

   const username = req.body.username
   const password = req.body.password
   if(username == email && password == pas)
   {
      res.redirect("/admin")
   }
   else{
      alert("Detials is wronge")
      res.redirect("/login-admin")
   }

})



app.get("/admin",(req,res)=>{
   res.render("admin")
})


app.post("/admin",(req,res)=>{
   const username = req.body.name
   Games.findOne({
      name:username
   }, (err, foundUser)=>{
      if(!foundUser){
         alert("user not exist")
         res.render("admin")
      }
      if(foundUser){
         // console.log(foundUser.name);
         res.render("remove",{
            user:foundUser.name,
            email:foundUser.email
         })
      }
   })
})



app.get("/remove",(req,res)=>{
   res.render("remove")
})

app.post("/remove",(req,res)=>{
   const username = req.body.user
   // console.log(username);
   Games.findOneAndRemove({
      name:username
   },(err,foundUser)=>{
      if(foundUser){
         res.redirect("/admin")
      }
   })
})

app.post("/login", (req, res) => {

   const username = req.body.username
   const password = md5(req.body.password)

   Games.findOne({
      email: username
   }, function(err, foundUser) {
      if (err) {
         console.log("error")
      } else {
         if (foundUser) {
            if (foundUser.password === password) {
               res.render("games")
               console.log("working");
            }
            else{
               alert("wrong password!")
               res.render("login")
            }
         }
         else{
            alert("wrong email!")
            res.render("login")
         }
      }
   })
})

app.post("/registration", (req, res) => {
   const newUser = new Games({
      name: req.body.name,
      email: req.body.username,
      password: md5(req.body.password)
   })

   newUser.save((err) => {
      if (err) {
         console.log("error")
      } else {
         res.render('games')
      }
   })
})




app.listen(3000, (req, res) => {
   console.log("running on port 3000")
})
