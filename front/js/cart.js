//Vérifier si le panier est vide ou plein.
function emptyCart(){
    if(localCart == null || localCart == 0){
      return true;
    }else{
      return false;
    }
  };
  
  //Produits présents ds le localStorage au lancement de la page.
  let localCart = JSON.parse(localStorage.getItem("productCart"));
  
  //Si le panier est plein, on l'affiche (nous le stockons ds le tableau "gridCart").
  if(localCart === null){
      alert("Le panier est vide");
  } else{
      let gridCart = [];
  
      for(j = 0; j < localCart.length ; j++){
          
          gridCart = gridCart + 
          `<article class="cart__item" data-id="${localCart[j]._id}">
          
          <div class="cart__item__img">
            <img src="${localCart[j].imageUrl}" alt="${localCart[j].altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__titlePrice">
              <h2>${localCart[j].name}</h2>
              <p id="${localCart[j].productWithColor}-price" >${localCart[j].price * localCart[j].quantity} €</p>
            </div>
            <div class="cart__item__content__settings">
              <p>${localCart[j].colors} </p>
              <div class="cart__item__content__settings__quantity">  
                <p>Qté : </p>
                <input id="${localCart[j].productWithColor}" type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${localCart[j].quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article>`;
      }
        if(j === localCart.length){
          let cart__items = document.getElementById("cart__items");
          if (cart__items){
            cart__items.innerHTML += gridCart;
            listenQuantity();
          }
          
        } 
  }
  
  // Fonction pour tenir compte du changement de la quantité
  function listenQuantity(){
    localCart.forEach(productCart => {
      let inputBtn = document.getElementById(productCart.productWithColor);
      inputBtn.addEventListener("change", function(event){
        
        let tempProduct = JSON.parse(localStorage.getItem("productCart")) ? JSON.parse(localStorage.getItem("productCart")) : [];
        localCart = JSON.parse(localStorage.getItem("productCart"));
          let product = {
              colors: productCart.colors,
              _id: productCart._id,
              name: productCart.name,
              price: productCart.price,
              imageUrl: productCart.imageUrl,
              description: productCart.description,
              altTxt: productCart.altTxt,
              quantity: inputBtn.value,
              productWithColor: productCart._id + productCart.colors,
          };
  
          //Récupérer tableau Null s'il n'y a rien ou récupérer le localStorage
          let checkProduct = tempProduct.filter(el => el._id === product._id && el.colors === product.colors);
          if (checkProduct.length) {
              let localCart = tempProduct.filter( el => el.productWithColor !== product.productWithColor);
              checkProduct[0].quantity = parseInt(product.quantity);
              localCart.push(checkProduct[0]);
              localStorage.setItem("productCart", JSON.stringify(localCart));
              // Update du prix total : article x quantité
              let singleTotal = document.getElementById(productCart.productWithColor+"-price");
              singleTotal.textContent = parseInt(product.quantity) * parseInt(product.price) + " €";
        
              totalQuantityCart();
              totalPriceCart();
          }else{
              tempProduct.push(product);
              localStorage.setItem("productCart", JSON.stringify(tempProduct));
          }
        })
    })
  }
  //--------------------------------------- Supprimer l'article ---------------------------------------------------------
  
  let btnDelete = document.querySelectorAll(".deleteItem");
  
  for(let k = 0; k < btnDelete.length ; k++){
    btnDelete[k].addEventListener("click" , (event) => {
      event.preventDefault();
  
      let selectProductId = localCart[k]._id;
      let selectProductColors = localCart[k].colors;
      
      localCart = localCart.filter( el => el.productWithColor !== selectProductId + selectProductColors);
     
      localStorage.setItem("productCart", JSON.stringify(localCart));
  
      window.location.href = "cart.html";
    })
  }
  
  // Calculer le nombre d'articles ds le panier (Méthode .reduce qui calcule ds un tableau)---------------------------------------------------------------------------
  
  function totalQuantityCart(){
    let tempTotalQuantity = 0;
    let tempLocalCart = JSON.parse(localStorage.getItem("productCart"));
    for (let m = 0; m < tempLocalCart.length; m++){
      let productsNumbers = parseInt(tempLocalCart[m].quantity);
      tempTotalQuantity += productsNumbers;
      if(m+1 === tempLocalCart.length){
        document.getElementById("totalQuantity").innerText = tempTotalQuantity;
        return tempTotalQuantity;
      }
    }
  }
  
  if(window.location.pathname === "/front/html/cart.html"){
    totalQuantityCart();
  }
  
  
  //------------------------------------- Calculer le prix total du panier ------------------------------------------------------
  
  // Tableau des prix présents ds le panier 
  
  function totalPriceCart(){
    let tempTotalCart = [];
    let tempLocalCart = JSON.parse(localStorage.getItem("productCart"));
    for( let l = 0; l < tempLocalCart.length; l++){
      let priceProducts = parseInt(tempLocalCart[l].price) * parseInt(tempLocalCart[l].quantity);
      tempTotalCart.push(priceProducts);    
      
      if(l+1 === tempLocalCart.length){
        // Array.reduce() pour effectuer l'addition dans le tableau des prix
        let totalPrice = tempTotalCart.reduce(reducer);
        // Afficher le prix total
        document.getElementById("totalPrice").textContent = totalPrice;
        return totalPrice;
      } 
    }
  }
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  
  if(window.location.pathname === "/front/html/cart.html"){
    totalPriceCart();
  }
  
  
  
  //-------------------------------------- Traiter le formulaire ----------------------------------------------------------------------------
  if(window.location.pathname === "/front/html/cart.html"){
    const formBtn = document.getElementById("order");
  
  formBtn.addEventListener("click", (e)=> {
    e.preventDefault();
  
    const formValues = {
      firstName: document.querySelector("#firstName").value,
      lastName: document.querySelector("#lastName").value,
      address: document.querySelector("#address").value,
      city: document.querySelector("#city").value,
      email: document.querySelector("#email").value
    }
  
    //-------------------------------------------------------- Contrôler le formulaire ------------------------------------------------
    const regExOnlyABC = (value) => {
      return /^([a-zA-Z\-]{2,20})?([-]{0,1})?([a-zA-Z\-]{2,20})$/.test(value);
    }
  
    const regExAddress = (value) => {
      return /^[A-Za-z0-9\s]{5,60}$/.test(value);
    }
  
    const regExEmail = (value) => {
      return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
    }
  
    // Gérer l'affichage du message d'erreur lié à l'input
    function dataFormFail(querySelectorId) {
      document.querySelector(`#${querySelectorId}`).innerText = "";
    }
  
    function dataFormOk(querySelectorId){
      document.querySelector(`#${querySelectorId}`).innerText = "Veuillez bien remplir ce champ";
    }
  
    //Contrôle des inputs
    function firstNameValidator() {
      const theFirstName = formValues.firstName;
      if(regExOnlyABC(theFirstName)) {
        return true;
      } else {
        return false;
      }
    }
  
    function lastNameValidator() {
      const theLastName = formValues.lastName;
      if(regExOnlyABC(theLastName)) {
        return true;
      } else {
        return false;
      }
    }
  
    function addressValidator() {
      const theAddress = formValues.address;
      if(regExAddress(theAddress)) {
        return true;
      } else {
        return false;
      }
    }
  
    function cityValidator() {
      const theCity = formValues.city;
      if(regExOnlyABC(theCity)) {
        return true;
      } else {
        return false;
      }
    }
  
    function emailValidator() {
      const theEmail = formValues.email;
      if(regExEmail(theEmail)) {
        return true;
      } else {
        return false;
      }
    }
    
    //Afficher alerte pour les champs à remplir correctement
  
    firstNameValidator() == true ? dataFormFail("firstNameErrorMsg") : dataFormOk("firstNameErrorMsg");
    lastNameValidator() == true ? dataFormFail("lastNameErrorMsg") : dataFormOk("lastNameErrorMsg");
    addressValidator() == true ? dataFormFail("addressErrorMsg") : dataFormOk("addressErrorMsg");
    cityValidator() == true ? dataFormFail("cityErrorMsg") : dataFormOk("cityErrorMsg");
    emailValidator() == true ? dataFormFail("emailErrorMsg") : dataFormOk("emailErrorMsg");
  
    //----------------------------------------------- Fin du contrôle de formulaire ----------------------------------------------  
  
    //Mettre formValue ds localStorage
    if (firstNameValidator() && lastNameValidator() && addressValidator() && cityValidator() && emailValidator()) {
      localStorage.setItem("formValues", JSON.stringify(formValues));
      // Envoyer la commande au serveur
      const product_idArray = [];
      for(let p = 0; p < localCart.length; p++){
        product_idArray.push(localCart[p]._id);
      }
    
      const sendCart = {
        products: product_idArray,
        contact: formValues
      } 
  
      sendToServer(sendCart);
  
    } else {
      alert("Veuillez corriger les champs indiqués.");
    }
     
  });
  }
  
  //Fonction pour envoyer le panier + le formulaire rempli vers le serveur. 
  function sendToServer(sendCart){
    const promise01 = fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify(sendCart),
    });
  
    promise01.then(async(response)=>{
      try{
        const contenu = await response.json();
        if (response.ok) {
          //redirection page confirmation avec l'ID ds l'URL
          window.location = "confirmation.html?orderId="+contenu.orderId;
           
        } else {
          alert("Erreur serveur");
        }
      }catch(e){
        console.log(`error : ${response.status} `);
      }
    })
  }
  
  // PAGE DE CONFIRMATION en affichant l'Id de la commande récupéré ds l'URL
  if(window.location.pathname === "/front/html/confirmation.html"){
    let orderId = getOrderId();
    document.getElementById("orderId").textContent = orderId;
  }
  
  // Fonction pour récupérer l'orderId ds l'URL
  function getOrderId(){
    let adressId = window.location.search;
    let resultId = "";
    if(adressId){
      resultId = adressId.split("?orderId=");
      resultId = resultId[1];
    }
    return resultId;
  }
  
  //Garder le contenu du localStorage ds le formulaire
  
  const dataLocalStorage = localStorage.getItem("formValues");
  
  const dataLocalStorageObject = JSON.parse(dataLocalStorage);
  
  //Fonction pour que le champ du formulaire soit rempli par le localStorage 
  
  function setFormFromLocalStorage(input){
    if(dataLocalStorageObject){
      console.log("Le formulaire n'est pas encore rempli");
    } else {
      document.querySelector(`#${input}`).value = dataLocalStorageObject[input];
    }  
  }
  
  setFormFromLocalStorage("firstName");
  setFormFromLocalStorage("lastName");
  setFormFromLocalStorage("address");
  setFormFromLocalStorage("city");
  setFormFromLocalStorage("email");
  localStorage.clear();