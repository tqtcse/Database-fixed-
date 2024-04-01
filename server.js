const express = require('express')
const bodyParser = require('body-parser')
const admin = require('firebase-admin')
const serviceAccount = require("./serviceAccountKey.json")
const functions = require('firebase-functions')
const path = require('path')
const { verify } = require('crypto')
const { decode } = require('punycode')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL : "https://testlogin-c11b6-default-rtdb.firebaseio.com/"
})
// hàm giải mã token
async function decodeToken(token){
  try{
    const decodedToken = await admin.auth().verifyIdToken(token);

    const userID = decodedToken.uid;
    const userRole = decodedToken.role

    return {userID, userRole};
  } catch (error){
    console.error('oh no', error);
    throw error;
  }
}
const app = express()
const db = admin.database();
const PORT = 80

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.get('/api/login2', (req,res) => {
  const token = req.headers.authorization.split(' ')[1]
  decodeToken(token)
  .then(({userID, userRole}) => {
    const ID = userID;
    res.json({ ID });
  })
})
app.get('/api/html', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
// giải mã token
  decodeToken(token)
    .then(({userID, userRole}) => {
      if(userRole == 'admin'){
        console.log('admin')
        res.render('index', { link: 'admin/adminFunctions.html', linkText: 'Admin Functions' });
      }
      else if(userRole == 'doctor'){
        
        res.render('index', {link: 'doctor/doctorFunctions.html' , linkText: 'Doctor Functions'})
        console.log('doctor')
      }
      else if(userRole == 'assist'){
        console.log('assist')
        res.render('index', {link: 'assist/assistFunctions.html', linkText: 'Assist Functions'})
      }
      else{
        console.log('patient')
      }
    })
 
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))

app.post('/api/login', (req, res) => {

  const { userEmail } = req.body;
  console.log(userEmail)
  const doctorQuery = db.ref('doctorAccount').orderByChild('Email').equalTo(userEmail).once('value')
  const assistQuery = db.ref('assistAccount').orderByChild('Email').equalTo(userEmail).once('value')
  const adminQuery = db.ref('adminAccount').orderByChild('Email').equalTo(userEmail).once('value')

  Promise.all([doctorQuery, assistQuery, adminQuery])
  .then((snapshot) => {
    
    const doctorSnapshot = snapshot[0];
    const assistSnapshot = snapshot[1];
    const adminSnapshot = snapshot[2];

    if(doctorSnapshot.exists()){
        doctorSnapshot.forEach((childSnapshot) => {
         // console.log('hi')
           const id = childSnapshot.val().PhoneNumber;
          const doctor = childSnapshot.val().Role;
           const customClaims = {
             role: doctor
           };
         
           admin.auth().createCustomToken(id, customClaims )
           .then((customToken) => {
             res.send(customToken)
         })
        })
      
    } else if (assistSnapshot.exists()){
     
      assistSnapshot.forEach((childSnapshot) => {
       
        const id = childSnapshot.val().PhoneNumber;
        const assist = childSnapshot.val().Role;
        const customClaims = {
          role: assist
        };
        admin.auth().createCustomToken(id, customClaims )
        .then((customToken) => {
          res.send(customToken)
      })
      })
    } else if (adminSnapshot){
      adminSnapshot.forEach((childSnapshot) => {
         
        const id = childSnapshot.val().PhoneNumber;
        const adminds = childSnapshot.val().Role;
        const customClaims = {
          role: adminds
        };
        admin.auth().createCustomToken(id, customClaims )
        .then((customToken) => {
          res.send(customToken)
      })
      })
    }

  }).catch((error) => {
    console.error("Loi khuy truy van", error);
  })
  res.status(200);
})

app.use(express.static(__dirname + '/public'))
app.get('/', (req,res) =>{
  return res.render('index1')
})

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`)

})
