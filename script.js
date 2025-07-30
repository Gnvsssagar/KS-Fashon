document.getElementById('searchInput').addEventListener('input', function () {
 var searchQuery = this.value.tolowerCase();
 var searchResults = document.getElementById('searchResults');
  var resultsList = searchResults.querySelector('ul');

  resultsList.innerHTML = '';

  if (searchQuery) {
    var products = ['Product 1', 'Product 2', 'Product 3'];
    var filteredProducts = products.filter(function (product) {
      return product.tolowerCase().includes(searchQuery);
    });
    
    filteredProducts.forEach(function (product) {
      var listItem = document.createElement('li');
      listItem.textContent = product;
      resultsList.appendChild(listItem);
    });

    searchResults.classList.add('show');
  } else {
    searchResults.classList.remove('show');
  }
});

$('#heroSlider').carousel({
  interval: 50000,
  ride: 'carousel'
});
document.addEventListener('DOMContentLoaded', function () {
  const prevBtn = document.querySelector('#productSlider .carousel-control-prev-icon');
  const nextBtn = document.querySelector('#productSlider .carousel-control-next-icon');

  function animateArrow(arrow) {
    arrow.classList.add('animate-arrow');
    setTimeout(() => {
      arrow.classList.remove('animate-arrow');
    }, 300); // must match CSS animation duration
  }

  prevBtn.addEventListener('click', () => animateArrow(prevBtn));
  nextBtn.addEventListener('click', () => animateArrow(nextBtn));
});
