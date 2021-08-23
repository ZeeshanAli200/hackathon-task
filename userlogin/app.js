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
let restauDivs = document.getElementById("restauDivs");

async function getrestaurant() {
    let querySnapshot = await db.collection("UsersData").get()
    restauDivs.querySelectorAll('*').forEach(n => n.remove());
    let rowdiv
    rowdiv = document.createElement("DIV");
    rowdiv.className = "row";
    let headerOfrestau = document.createElement('h3')
    headerOfrestau.innerHTML="Restaurants Available"
    restauDivs.appendChild(headerOfrestau)
    querySnapshot.forEach((doc) => {

        if (doc.data().Role == "restaurant") {
            
            let div1 = document.createElement('DIV')
            div1.setAttribute("onclick","getRestaurantDishes(this)")
            div1.className = "col-lg-4 bg-light rounded border border-dark mt-3 ml-1 p-3"
            div1.id=doc.data().UID
            let restName = document.createTextNode(doc.data().restaurantName)
            div1.appendChild(restName);
            rowdiv.appendChild(div1)
            restauDivs.appendChild(rowdiv)
        }


    });

}

// {/* <div class="card" style="width: 18rem;">
//   <img class="card-img-top" src="..." alt="Card image cap">
//   <div class="card-body">
//     <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//   </div>
// </div> */}
let restauDishes=document.getElementById("restauDishes");

async function getRestaurantDishes(ele){
    restauDivs.style.display="none"
    restauDishes.style.display="block"
    let rowdiv
    
    rowdiv = document.createElement("DIV");
    rowdiv.className = "row"
    let querySnapshot = await db.collection("dishes").get()
    restauDishes.querySelectorAll('*').forEach(n => n.remove());

    querySnapshot.forEach((doc) => {
        // <a href="#" class="btn btn-primary">Go somewhere</a>

        if(ele.id==doc.data().RestaurantOwnerId){
            
            let div1 = document.createElement('DIV')
            div1.className="col-lg-4 card p-2"
            div1.style.width="18rem"
            let createimg=document.createElement("img")
            createimg.className="img-fluid card-img-top"
            createimg.src=doc.data().imgUrl
            
            // createimg.style.width="200px"
            createimg.style.height="200px"
            let createdecripdiv=document.createElement("DIV");
            createdecripdiv.className="card-title"

            let paradiv=document.createElement("P")
            let text=document.createTextNode(doc.data().ItemName)
            paradiv.appendChild(text)
            createdecripdiv.appendChild(paradiv)
            let createAnchAddtoCart=document.createElement('A')
            createAnchAddtoCart.innerHTML="Order"
            createAnchAddtoCart.className="btn btn-primary"
            createAnchAddtoCart.id=doc.id
            createAnchAddtoCart.setAttribute("onclick","orderStatus(this)")

            div1.append(createimg,createdecripdiv,createAnchAddtoCart);
            rowdiv.appendChild(div1)
            restauDishes.appendChild(rowdiv)

        }


    });
  
  
    // <button type="button" class="btn btn-primary btn-lg btn-block">Block level button</button>

    let btnforSelctRestau=document.createElement('BUTTON');
    btnforSelctRestau.className="btn btn-primary btn-lg btn-block mt-2"
    btnforSelctRestau.innerHTML="Go to Restaurants"
    btnforSelctRestau.onclick=function(){
        restauDivs.style.display="block"
        restauDishes.style.display="none"
    }
    restauDishes.appendChild(btnforSelctRestau)

}
let orderStatusVal=document.getElementById("orderStatus")
let btnContain=document.getElementById('btnContain')
async function orderStatus(ele){
    orderStatusVal.querySelectorAll('*').forEach(n => n.remove());
    restauDishes.style.display="none"
    restauDivs.style.display="none"
    btnContain.style.display="block"
    orderStatusVal.style.display="block"
    let querySnapshot = await db.collection("dishes").get()
    let rowdiv,orderHead
    rowdiv = document.createElement("DIV");
    orderHead=document.createElement("H3")
    orderHead.innerHTML="Your Orders"
    orderStatusVal.appendChild(orderHead)
    

    querySnapshot.forEach(async(doc) => {
        if(ele.id==doc.id){
            await db.collection("orders").add(
                {
                    orderId:doc.id,
                    Accepted:false,
                    Rejected:false,
                    delivered:false,
                    pending:true,
                    deliveryType:doc.data().DeliveryType,
                    dishCategory:doc.data().DishCategory,
                    dishPrice:doc.data().DishPrice,
                    ItemName:doc.data().ItemName,
                    restaurantId:doc.data().RestaurantOwnerId,
                    imageUrl:doc.data().imgUrl


            })
            let orderData = await db.collection("orders").get()
            let rowdivOrder,accept,rej,deliv,pend;
            rowdivOrder = document.createElement("DIV");
            rowdivOrder.className="row"
            
            orderData.forEach(async(Orderdoc) => {
                let userNameDiv=document.createElement("DIV");
                userNameDiv.className="col-lg-4 card p-2"
                userNameDiv.style.width="18rem"
    
                let imgcreate=document.createElement("img")
                imgcreate.className="card-img-top"
                imgcreate.src=Orderdoc.data().imageUrl
                imgcreate.style.height="200px"
    
                let despDiv=document.createElement("DIV")
                despDiv.className="card-body"
    
                let cardTitle=document.createElement("H5")
                cardTitle.className="card-title"
                cardTitle.innerHTML=Orderdoc.data().ItemName
    
                let paraCreate=document.createElement("P")
                Orderdoc.data().Accepted==true?accept="yes":accept="No"
                Orderdoc.data().Rejected==true?rej="yes":rej="No"
                Orderdoc.data().delivered==true?deliv="yes":deliv="No"
                Orderdoc.data().pending==true?pend="yes":pend="No"
                
                
                
                let text=document.createTextNode("Accepted:"+accept+"\n"+"Rejected:"+rej+"\n"+"Delivered:"+deliv+"\n"+"Pending:"+pend)
                paraCreate.className="card-text"
                paraCreate.appendChild(text)
    
                despDiv.append(cardTitle,paraCreate)
                let deleteOrder=document.createElement('BUTTON')
                deleteOrder.innerHTML="Delete Order"
                deleteOrder.className="btn btn-primary"
                deleteOrder.id=Orderdoc.id
                deleteOrder.setAttribute("onclick",` deleteOrder(this)`)
    
                userNameDiv.append(imgcreate,despDiv,deleteOrder)
    
                rowdivOrder.appendChild(userNameDiv)
    
                orderStatusVal.appendChild(rowdivOrder)
            })
            
        }
        
    });
    

}
function dotoDish(){
    restauDishes.style.display="block"
    orderStatusVal.style.display="none"
}
async function deleteOrder(ele){
    ele.parentNode.remove()
    await db.collection("orders").doc(ele.id).delete()

}

async function loggingOut(){
    await firebase.auth().signOut()
    window.location.replace('../components/login.html')
}