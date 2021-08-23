// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyDQEEh6u-Ctu2oquYbX2J7nBt5NPuyRhaM",
    authDomain: "hackathon-task-project.firebaseapp.com",
    projectId: "hackathon-task-project",
    storageBucket: "hackathon-task-project.appspot.com",
    messagingSenderId: "786120623198",
    appId: "1:786120623198:web:dab54ca1b265a9486960cf",
    measurementId: "G-LPVDV5C12S"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
///////////////////////////////


let db = firebase.firestore();
let auth = firebase.auth();
let storage = firebase.storage();

let userName = document.getElementById('username');
let email = document.getElementById('email');
let password = document.getElementById('password');

let restau = document.getElementById("flexRadioDefault1");
let userRadio = document.getElementById("flexRadioDefault2");
let userRole = document.getElementsByName('userRole');
let restNameDiv = document.getElementById('restNameDiv');
let userNameDiv = document.getElementById('userNameDiv');
let typeNumber = document.getElementById('typeNumber');
var pakCity = ['karachi', 'islamabad', 'lahore']
var indCity = ['mumbai', 'delhi', 'gurgaon']
var bangCity = ["dhaka", "chattogram", "rajshahi"];
var chinaCity = ["beiging", "shanghai", "wuhan"]

var countrySelect = document.getElementById('countrySelect')
var citySelect = document.getElementById('citySelect')
let phoneDiv = document.getElementById('phoneDiv');
let restaurantinp = document.getElementById('restaurant')

console.log("****", citySelect.options[citySelect.selectedIndex].value)
var role = "", countryName = countrySelect.options[countrySelect.selectedIndex].value, cityName = "";
function getcountry() {
    restaubtnClick()
    var strUser = countrySelect.options[countrySelect.selectedIndex].value;
    if (strUser == 'pakistan') {
        for (var i = 0; i < pakCity.length; i++) {
            // citySelect.options[citySelect.i].innerHTML=pakCity[i];
            citySelect[i].value = pakCity[i];
            citySelect[i].innerHTML = pakCity[i]

        }


    }
    else if (strUser == 'india') {
        for (var i = 0; i < indCity.length; i++) {
            // citySelect.options[citySelect.i].innerHTML=pakCity[i];
            citySelect[i].value = indCity[i];
            citySelect[i].innerHTML = indCity[i]
            console.log(citySelect)
        }


    }
    else if (strUser == 'bangladesh') {
        for (var i = 0; i < bangCity.length; i++) {
            // citySelect.options[citySelect.i].innerHTML=pakCity[i];
            citySelect[i].value = bangCity[i];
            citySelect[i].innerHTML = bangCity[i]
            console.log(citySelect)
        }


    }
    else if (strUser == 'china') {
        for (var i = 0; i < chinaCity.length; i++) {
            // citySelect.options[citySelect.i].innerHTML=pakCity[i];
            citySelect[i].value = chinaCity[i];
            citySelect[i].innerHTML = chinaCity[i]
            console.log(citySelect)
        }


    }

    countryName = strUser
    getcities()



}
function getcities() {
    var strUser = citySelect.options[citySelect.selectedIndex].value;
    console.log(strUser);
    cityName = strUser
}


function restaubtnClick() {
    
    if (userRole[0].checked == true) {
        userNameDiv.style.display = "none"
        phoneDiv.style.display = "none"
        restNameDiv.style.display = "block"
        role = userRole[0].value
        return role
    }
    else if (userRole[1].checked == true) {
        userNameDiv.style.display = "block"
        phoneDiv.style.display = "block"
        restNameDiv.style.display = "none"
        role = userRole[1].value
        return role
    }


}

function register() {
    
    if (role == "user" && countryName != "" && cityName != "") {
        console.log("done1")
        console.log(countryName, cityName)
        auth.createUserWithEmailAndPassword(email.value, password.value)
            .then(async (UserCredientials) => {
                let dataObj = {
                    email: UserCredientials.user.email,
                    username: userName.value,
                    UID: UserCredientials.user.uid,
                    Role: restaubtnClick(),
                    phoneNum: typeNumber.value,
                    usercountry: countryName,
                    usercity: cityName

                }
                await saveDataToFirestore(dataObj)
                if (UserCredientials.user) {
                    email.value = '';
                    password.value = '';
                    userName.value = '';

                }
            })
            .catch((error) => {
                console.log(error.message)
            })

    }





    else if (role == "restaurant") {
        auth.createUserWithEmailAndPassword(email.value, password.value)
            .then(async (UserCredientials) => {
                let dataObj = {
                    email: UserCredientials.user.email,
                    restaurantName: restaurantinp.value,
                    UID: UserCredientials.user.uid,
                    Role: role,

                    usercountry: countryName,
                    usercity: cityName

                }
                await saveDataToFirestore(dataObj)
                // if(UserCredientials.user){
                //     email.value = '';
                //     password.value = '';
                //     userName.value = '';

                // }
            })
            .catch((error) => {
                console.log(error.message)
            })
    }
}


function login() {
    auth.signInWithEmailAndPassword(email.value, password.value)
        .then(async (UserCredientials) => {
            console.log(UserCredientials.user.email)
            let querySnapshot = await db.collection("UsersData").get()
            querySnapshot.forEach((doc) => {

                if (doc.data().email == UserCredientials.user.email && doc.data().Role == "restaurant") {
                    // doc.data() is never undefined for query doc snapshots
                    console.log()
                    console.log(doc.id, " => ", doc.data());
                    window.location.replace('../restaurantlogin/restaurant.html')
                }
                else if (doc.data().email == UserCredientials.user.email && doc.data().Role == "user") {
                    window.location.replace('../userlogin/userlogin.html')
                }

            });

        })

        .catch((error) => {
            console.log(error.message)
        })
}

async function saveDataToFirestore(dataObjEl) {
    let currentUser = auth.currentUser;
    await db.collection('UsersData').doc(currentUser.uid).set(dataObjEl);

    console.log('agha', dataObjEl)
    await auth.signOut();
    window.location.replace('./login.html')

}


// auth.onAuthStateChanged((user) => {
//     let pageLocArr = window.location.href.split('/');
//     let pageName = pageLocArr[pageLocArr.length - 1];
//     let authenticatedPages = ['home.html','index.html'];
//     // console.log(user)


//     setTimeout(function(){
//         if (user && authenticatedPages.indexOf(pageName) === -1) {
//             window.location = '/components/home.html';
//         }
//         else if (!user && pageName === 'home.html') {
//             window.location = '../index.html';
//         }
//     },1000)



// });




async function logOut() {

    await auth.signOut()

}