require('dotenv').config();
const express =require('express')
const bodyParser =require('body-parser')
const mongoose =require('mongoose')
const app=express();
const ejs=require('ejs')
const encrypt =require('mongoose-encryption')
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema=new mongoose.Schema({
    email:String,
    password:String 
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});
const User= new mongoose.model('User',userSchema);



app.get('/',function(req,res){
    res.render('home')
})
app.get('/login',function(req,res){
    res.render('login')
})
app.post('/login',function(req,res){
    const email=req.body.username;
    const password=req.body.password;
    User.findOne({email:email},function(err,founduser){
        if(err){
            console.log(err)
        }else{
            if(founduser){
                if(founduser.password===password){
                    res.render("secrets");
                }else{
                    console.log("wrongpasspord");
                }
            }
        }
    })
})

app.get('/register',function(req,res){
    res.render('register')
})
app.post('/register',function(req,res){
    const newuser= new User({
        email:req.body.username,
        password:req.body.password

    });
    newuser.save(function(err){
        if(err){
            console.log(err)
        }else{
            res.render('secrets');
        }
    });
})








app.listen(3000,function(){
    console.log("server runing and port 3000")
})