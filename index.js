if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
  }
  

  const express=require('express');
  const app=express();
  const path=require('path');
  const bodyParser=require('body-parser');
  const mongoose = require("mongoose");
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const { json } = require('body-parser');
  
  app.set('view engine','ejs');
  app.set('views',path.join(__dirname,'views'));
  app.use(express.static(path.join(__dirname,'public')));
  app.use(express.urlencoded({extended:true}));

  const User = require("./models/schema.js");
  
  
  app.get('/', (req,res)=>{
      res.render('contact');
  });
  
  app.post('/send', (req, res) => {
    var email = req.body.email;
	var checkIn = req.body.checkIn;

	const result = new User({
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		checkIn: req.body.checkIn,
	});

	result.save();
	const d = new Date();
	const message = {
		to: email,
		from: process.env.MY_EMAIL,
		subject: "Creted By Komal",
		html: `<h1>Your check in time at Office is ${d.getHours()}:${d.getMinutes()} </h1>
            <ul>
            <li>Name: ${req.body.name}</li>
          <li>Email: ${req.body.email}</li>
          <li>Phone: ${req.body.phone}</li>
          <li>Availability status:True</li>
            </ul>`,
	};

	sgMail.send(message)
		.then((res) => {
      res.render("sent");
			console.log("Sent Successfully");
	
		})
		.catch((err) => {
			console.log(err);
		});
});



  
  
  
  app.listen(process.env.PORT || 3000,()=>{
      
    
    console.log('Server started...')
});

const DB='mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.eb1wd.mongodb.net/visitor-app?retryWrites=true&w=majority'; 
 const connectDB = async () => {
	try {
		await mongoose.connect(DB, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
    
		});
		console.log("Mongo DB connected");
	} catch (err) {
		console.error(err.message);
	}
};
connectDB();
