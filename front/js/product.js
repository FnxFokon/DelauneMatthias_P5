// Recupération de l'ID du produit dans L'URL.

const articleId = new URL(location.href).searchParams.get("id");

// si produit dans local storage alors tableau
let tempProduct = JSON.parse(localStorage.getItem("productCart"))
  ? JSON.parse(localStorage.getItem("productCart"))
  : [];

const article = function getArticle() {
  fetch(`http://localhost:3000/api/products/${articleId}`).then(
    async (responseData) => {
      const response = await responseData.json();
      try {
        hydrateArticle(response);
      } catch(error) {
        console.log(error);
      }
    })
}

// Fonction afficer article puis écouter le click "ajouter au panier" en tenant compte de "quantité" et "couleur"
function hydrateArticle(article) {
  document.getElementById("title").textContent = article.name;
  document.getElementById("price").textContent = article.price;
  document.getElementById("description").textContent = article.description;
  document.getElementsByClassName("item__img")[0].innerHTML += `<img src"${article.imageUrl}" alt="${article.altTxt}">`;
  for (let color of article.colors) {
    document.getElementById("color-select").innerHTML += `<option value="${color}">${color}</option>`;
  }

  // Bouton "ajouter au panier" (pas dispo tant que y'a pas de couleur et quantité de mis)
  let btn = document.getElementById("addToCart");
  btn.disabled = true;

  btn.addEventListener("click", function (event) {
    let product = {
      colors: document.getElementById("color-select").value,
      _id: article._id,
      name: article.name,
      price: article.price,
      imageUrl: article.imageUrl,
      description: article.description,
      altTxt: article.altTxt,
      quantity: document.getElementById("quantity").value,
      productWithColor:
        article._id + document.getElementById("color-select").value,
    };

    // Recup tableau (Null si rien OU recup localStorage s'il y a quelque chose)
    let checkProduct = tempProduct.filter(
      (el) => el._id === product._id && el.colors === product.colors
    );
    if (checkProduct.lenght) {
      let localCart = tempProduct.filter(
        (el) => el.productWithColor !== product.productWithColor
      );
      console.log(localCart);
      checkProduct[0].quantity =
        parseInt(checkProduct[0].quantity) + parseInt(product.quantity);
      localCart.push(checkProduct[0]);
      localStorage.setItem("productCart", JSON.stringify(localCart));
    } else {
      tempProduct.push(product);
      localStorage.setItem("productCart", JSON.stringify(tempProduct));
    }

    window.location.href = "cart.html";
  });

  // ecouter quantité et couleur
  let checkQuantity = document.getElementById("quantity");
  let checkColor = document.getElementById("color-select");

  // Si quantité et couleur alors activer le bouton "ajouter au panier"
  checkQuantity.addEventListener("change", function (event) {
    if (checkQuantity.value > 0 && checkQuantity.value < 101 && checkColor.value !== "") {
      btn.disabled = false;
    } else {
      btn.disabled = true;
    }
  });
}

article();
