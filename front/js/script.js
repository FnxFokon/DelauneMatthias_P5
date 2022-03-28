//décla constante recup API via fetch
const dataApi = fetch("http://localhost:3000/api/products");

// use Api pour afficher les articles de la page
dataApi
  .then(async (responseData) => {
    const article = await responseData.json();
    try {
      for (let i = 0; i < article.length; i++) {
        displayArticle(article[i]);
      }
    } catch (error) {
      console.log(error);
    }
  })
  .catch((err) => {
    console.log(error);
  });

// Afficher le DOM
function displayArticle(article) {
  document.getElementById(
    "items"
  ).innerHTML += `<a href="./product.html?id=${article._id}">
            <article>
                <img src="${article.imageUrl}" alt="Lorem ipsum dolor sit amet, Kanap name1">
                <h3 class="productName">${article.name}</h3>
                <p class="productDescription">${article.description}</p>
            </article>
        </a>`;
}
