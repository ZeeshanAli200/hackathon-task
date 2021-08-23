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

let db = firebase.firestore();
let auth = firebase.auth();
let storage = firebase.storage();

///////////////////////////////

let dishCat = document.getElementById('dishCat');
let itemName = document.getElementById('item-name');
let priceVal = document.getElementById('priceVal');
let Dishimg = document.getElementById('Dishimg');
let dishimgInp = document.getElementById('upload-image')
let dishCategory, deliveryType;

let additemContainer = document.getElementById("additemContainer");
let deliveryStatus = document.getElementById("deliveryStatus");



let usriden;
function additemFunc() {
    additemContainer.style.display = "block"
    deliveryStatus.style.display = "none"

}
function showStatusfunc() {
    deliveryStatus.style.display = "block";
    additemContainer.style.display = "none"
    

}


function getDelivType(ele) {
    let strUser = ele.options[ele.selectedIndex].value;
    deliveryType = strUser;
}

// const increment = firebase.firestore.FieldValue.increment(1);

let randVar;
function getimg() {
    randVar = Math.floor(Math.random() * 1000000000)
    let image = dishimgInp.files[0];
    console.log(image)
    Dishimg.src = `../images/${image.name}`;

    console.log(image)


}
function uploadImageToStorage(Uid) {


    return new Promise(async (resolve, reject) => {
        let image = dishimgInp.files[0];
        let storageRef = storage.ref();
        let imageRef = storageRef.child(`dishpic/${Uid}/${dishCategory}/${randVar}/${image.name}`);
        await imageRef.put(image);
        let url = await imageRef.getDownloadURL();
        resolve(url);
    })
}

async function addDishItem() {
    dishCategory = dishCat.options[dishCat.selectedIndex].value;

    let currUser = auth.currentUser
    if (itemName != '' && priceVal != '' & dishCategory != '' && deliveryType != '') {
        let getimgUrl = await uploadImageToStorage(currUser.uid)
        let obj = {
            RestaurantOwnerId: currUser.uid,
            ItemName: itemName.value,
            DishPrice: priceVal.value,
            DishCategory: dishCategory,
            DeliveryType: deliveryType,
            imgUrl: getimgUrl,
            Accepted: false,
            Rejected: false,
            pending: false,
            delivered: false
        }
        console.log(obj)

        // // console.log(currUser.email)
        let savingDishItem = await db.collection("dishes").add(obj)
        console.log(savingDishItem)
        
        alert("Item Added SucessFully!")

    }
    else {
        console.log("else")
    }
}
let userId=""
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      var uid = user.uid;
      userId=uid
      // ...
    } 
  });

  let dataLoadPending=document.getElementById("dataLoadPending")
  let dataLoadAccepted=document.getElementById("dataLoadAccepted")
  let dataLoadDelievered=document.getElementById("dataLoadDelievered")
  let boolsnap=false;
function getorderStatuses() {
    deliveryStatus.style.display="none"


    
    db.collection("orders")
    .onSnapshot((snapshot) => {
        let curr=auth.currentUser
        // boolsnap=true
        

        snapshot.docChanges().forEach((change) => {
            console.log(curr.uid)
            if (change.type === "added"&&curr.uid==change.doc.data().restaurantId) {
                let boxDiv=document.createElement('DIV')
                boxDiv.className="p-1 bg-light border border-dark"
                // boxDiv.style.height="300px"
                let createbtn=document.createElement("BUTTON")
                createbtn.innerHTML=change.doc.data().ItemName
                createbtn.className="btn btn-light"
                boxDiv.appendChild(createbtn)

                if(change.doc.data().pending==true){      
                    let acceptBtn=document.createElement("BUTTON")
                    acceptBtn.className="btn btn-dark mx-auto"
                    acceptBtn.innerHTML="Accept"
                    acceptBtn.id=change.doc.id;
                  
                    acceptBtn.setAttribute("onclick","acceptBtnFunc(this)")
                    boxDiv.appendChild(acceptBtn)
                    dataLoadPending.appendChild(boxDiv)

                }
                if(change.doc.data().Accepted==true&&change.doc.data().delivered==false){
                    let acceptBtn=document.createElement("BUTTON")
                    acceptBtn.className="btn btn-dark"
                    acceptBtn.innerHTML="Deliver"
                    acceptBtn.id=change.doc.id;
                    acceptBtn.setAttribute("onclick","deliverBtnFunc(this)")
                    boxDiv.appendChild(acceptBtn)
                    dataLoadAccepted.appendChild(boxDiv)
                    
                }
        
                if(change.doc.data().delivered==true&&change.doc.data().Accepted==true){
                   
                    dataLoadDelievered.appendChild(boxDiv)
                }

                


                
            }
            if (change.type === "modified"&&curr.uid==change.doc.data().restaurantId) { 
                let boxDiv=document.createElement('DIV')
                boxDiv.className="p-1 bg-light border border-dark"
                // boxDiv.style.height="300px"
                let createbtn=document.createElement("BUTTON")
                createbtn.innerHTML=change.doc.data().ItemName
                createbtn.className="btn btn-light"
                boxDiv.appendChild(createbtn)
                if(change.doc.data().Accepted==true&&change.doc.data().delivered==false){
                    let acceptBtn=document.createElement("BUTTON")
                    acceptBtn.className="btn btn-dark"
                    acceptBtn.innerHTML="Deliver"
                    acceptBtn.id=change.doc.id;
                    acceptBtn.setAttribute("onclick","deliverBtnFunc(this)")
                    boxDiv.appendChild(acceptBtn)
                    dataLoadAccepted.appendChild(boxDiv)
                }
                if(change.doc.data().delivered==true){
                    console.log()
                   
                    dataLoadDelievered.appendChild(boxDiv)
                }
            }
            if (change.type === "removed") {
                console.log("Removed city: ", change.doc.data());
            }
        });

    });
    

}
async function acceptBtnFunc(ele){
    
    let orderObj = await db.collection("orders").doc(ele.id).update({
       Accepted:true,
       pending:false,
    });   
    ele.parentNode.remove();
}

async function deliverBtnFunc(ele){
    // console.log(ele.parentNode)
    
    let orderObj = await db.collection("orders").doc(ele.id).update({
        delivered:true,
        
    })
    ele.parentNode.remove();
}


async function loggingOut(){
    await firebase.auth().signOut()
    window.location.replace('../components/login.html')
}