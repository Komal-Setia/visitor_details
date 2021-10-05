if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
  }
  
  
  
  const express=require('express');
  const app=express();
  const path=require('path');
  const bodyParser=require('body-parser');
  const nodemailer=require('nodemailer');
  const SendmailTransport = require('nodemailer/lib/sendmail-transport');
  const { json } = require('body-parser');
  
  app.set('view engine','ejs');
  app.set('views',path.join(__dirname,'views'));
  app.use(express.static(path.join(__dirname,'public')));
  app.use(express.urlencoded({extended:true}));
  
  
  app.get('/', (req,res)=>{
      res.render('contact');
  });
  
  app.post('/send', (req, res) => {
      const output = `
        <p>Welcome!</p>
        <h3>Visitor Details</h3>
        <ul>  
          <li>Name: ${req.body.name}</li>
          <li>Email: ${req.body.email}</li>
          <li>Phone: ${req.body.phone}</li>
          <li>Your Check-In time is: ${req.body.time}</li>
          <li>Availability status:True</li>
        </ul>
      
      `;
    
    
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false, 
        auth: {
            user: process.env.MY_EMAIL, 
            pass: process.env.MY_PASSWORD
        },
        tls:{
          rejectUnauthorized:false
        }
      });
    
      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Komal Setia" <komalsetia2001@gmail.com>', 
          to: `${req.body.email}`, 
          subject: 'Hello From Komal',
          text: 'Your Check-in details', 
          html: output 
      };
    
    
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);   
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          res.render('sent');
    
      });
      });
  
  
  
  
  
  
  app.listen(process.env.PORT || 3000,()=>{
      
    
    console.log('Server started...')
});
  