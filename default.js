//capture search bar and content sections of page in variables
var searchTerm = document.getElementById('search-bar');
var content = document.getElementById('content');

//declare variables related to matched searches
var matchProperties = ['name', 'description', 'category',];
var matches = [];
var cart = [];

//event listeners for search bar
document.addEventListener('keyup', function(e) {
  switch(e.target) {
    case searchTerm:
      (function() {
        if (e.which === 13 || e.keyCode === 13) {
          search();
        }
      } )();
      break;
      default:
  }
})

//event listener for search button
document.addEventListener('click', function(e) {
  switch (e.target) {
    case document.getElementById('search-btn'):
      search();
      break;
      default:
  }
});

//event listener for add to cart
document.addEventListener('click', function(e) {
  var prodId;
  for (i=0; i<matches.length; i++) {
    prodId = e.target.getAttribute('data-id');
    if (prodId === matches[i].id) {
      cart.push(prodId);
    }
  }
})

//perform search based on search criteria
function search() {
  if (searchTerm.value){
    clear(content);
    compare(products, matchProperties);
    display(matches);
  }
}

//clear specified element
function clear(element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild);
    matches = [];
  }
}

//compare search term to products and add matches to array
function compare(products, properties) {
  var added;
  for (i=0; i<products.length; i++) {
    var added = false;
    for (j=0; j<properties.length; j++) {
      if (products[i][properties[j]].toLowerCase().indexOf(searchTerm.value.toLowerCase()) === -1) {
        continue;
      } else {
        if (added) {
          continue;
        } else {
          matches.push(products[i])
          added = true;
        }
      }
    }
  }
}

//display results
function display(array) {
  var resultDetail = document.createElement('div');
  resultDetail.textContent = 'Your search returned ' + array.length + ' results';
  resultDetail.classList.add('result-detail', 'col-md-9');
  content.appendChild(resultDetail);

  for (var i = 0; i < array.length; i++) {
    var result = createResult(array[i]);
    content.appendChild(result)
  }
}

//create result element based on matches array
function createResult (obj) {
    //create element to store product image
    var img = document.createElement('img');
    img.src = obj.img;
    img.classList.add('result-img')

    //create elements for product name, price, and description
    var name = document.createElement('div');
    name.textContent = obj.name;
    name.classList.add('result-name');
    var price = document.createElement('div');
    price.textContent = obj.price;
    price.classList.add('result-price')
    var descr = document.createElement('div');
    descr.textContent = obj.description;
    descr.classList.add('result-descr');
    var resultText = document.createElement('div');
    resultText.classList.add('result-text');
    resultText.appendChild(name);
    resultText.appendChild(price);
    resultText.appendChild(descr);

    //create button for adding products to cart
    var addBtn = document.createElement('button');
    addBtn.textContent = 'Add to Cart';
    addBtn.classList.add('result-add');
    addBtn.setAttribute('data-id', obj.id);

    //combine and return result element
    var result = document.createElement('div');
    result.classList.add('result', 'col-md-9');
    result.appendChild(img);
    result.appendChild(resultText);
    result.appendChild(addBtn);

    return result;
}
