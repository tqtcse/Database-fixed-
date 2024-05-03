
//Register function

var firebaseConfig = {
    apiKey: "AIzaSyDioYAzvJooHpspr8Z58bImI0s2jaIRU90",
    authDomain: "testlogin-c11b6.firebaseapp.com",
    projectId: "testlogin-c11b6",
    storageBucket: "testlogin-c11b6.appspot.com",
    messagingSenderId: "598921663451",
    appId: "1:598921663451:web:8bc05bbb07d312f1650dfe",
    measurementId: "G-4N0GNYZQ8J"
};

//firebase.initializeApp(firebaseConfig);

 firebase.initializeApp(firebaseConfig);


const auth = firebase.auth()
const database = firebase.database()




var currentDate = new Date();
var weekNumber = getWeekNumber(currentDate);
document.getElementById('weekNumberDisplay').innerText = "Week Number Of Current Time : " + weekNumber;
function getWeekNumber(date) {

    var startOfYear = new Date(date.getFullYear(), 0, 1);
    var dayOfWeek = startOfYear.getDay();
    

    var firstWeekStartDate = startOfYear;
    if (dayOfWeek > 0) {
        firstWeekStartDate.setDate(1 + (7 - dayOfWeek));
    }

    var differenceInDays = Math.floor((date - firstWeekStartDate) / (24 * 60 * 60 * 1000));

    var weekNumber = Math.ceil((differenceInDays + 1) / 7) + 1;

    return weekNumber;
}
function valid_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
      // Email is good
      return true
    } else {
      // Email is not good
      return false
    }
  }

function valid_password(password) {
    
    // Firebase only accepts lengths greater than 6
    if (password.length < 6) {
      return false
    } else {
      return true
    }
  }
function valid_name(name){
    if (name == null){
        return false
    }
    if (name.length <= 0){
        return false
    } else {
        return true
    }
}





 function logout(){
     firebase.auth().signOut().then(function(){
         console.log("User signed out")
         location.reload();
     }).catch(function(error){
         console.error("Error signing out", error)
})
localStorage.removeItem('customToken')
 }

