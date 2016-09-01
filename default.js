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

//event listener for buttons on home screen
document.addEventListener('click', function(e) {
  switch (e.target) {
    case document.getElementById('search-btn'):
      search();
      break;
    case document.getElementById('cart-btn'):
      viewCart();
      break;
    case document.getElementById('brand'):
      searchTerm.value = '';
      clear(content);
      break;
      default:
  }
});

//event listener for adding to cart
document.addEventListener('click', function(e) {
  for (var i=0; i<matches.length; i++) {
    if (e.target.getAttribute('data-id') === matches[i].id) {
        addToCart(matches[i]);
    }
  }
})

//event listener for updating cart total based on changes to quantity
document.addEventListener('change', function(e) {
  for (var i=0; i<cart.length; i++) {
    if (e.target.getAttribute('data-id') === cart[i].id) {
      updateTotal(e, cart[i]);
    }
  }
})

//add item to cart
function addToCart(obj) {
  if (cart.length === 0) {
    obj.quantity = 1;
    cart.push(obj);
  }
  else {
    var found = false;
    for (var i=0; i<cart.length; i++) {
      if (obj.id === cart[i].id) {
        found = true;
        cart[i].quantity++;
        break;
      }
    }
    if(!found) {
      obj.quantity = 1;
      cart.push(obj);
    }
  }
}

//clear content and view shopping cart
function viewCart() {
  clear(content);
  var resultArea = document.createElement('div');
  resultArea.classList.add('col-md-8');
  for (var i=0; i<cart.length; i++) {
    var result = createResult(cart[i]);
    result.appendChild(quantity(cart[i]));
    resultArea.appendChild(result);
  }
  content.appendChild(resultArea);
  content.appendChild(checkoutBox());
}

function calculateTotal(array) {
  var total = 0;
  for (var i=0; i<array.length; i++) {
    total += array[i].quantity * array[i].price * 100;
  }
  return total / 100;
}

function updateTotal(e, obj) {
  var summary = document.getElementById('summary');
  content.removeChild(summary);
  obj.quantity = e.target.value;
  content.appendChild(checkoutBox());
}

function checkoutBox() {
  var subtotalText = document.createElement('span');
  subtotalText.classList.add('order-summary-text');
  subtotalText.textContent = 'Items:';
  var subtotalValue = document.createElement('span');
  subtotalValue.classList.add('order-summary-value');
  var itemTotal = calculateTotal(cart)
  subtotalValue.textContent = itemTotal.toLocaleString('en-US',{style: 'currency', currency: 'USD'});
  var subtotal = document.createElement('div');
  subtotal.classList.add('subtotal');
  subtotal.appendChild(subtotalText);
  subtotal.appendChild(subtotalValue);

  var taxText = document.createElement('span');
  taxText.classList.add('order-summary-text');
  taxText.textContent = 'Tax:';
  var taxValue = document.createElement('span');
  taxValue.classList.add('order-summary-value');
  var taxTotal = itemTotal * 8 / 100;
  taxValue.textContent = taxTotal.toLocaleString('en-US',{style: 'currency', currency: 'USD'});
  var tax = document.createElement('div');
  tax.appendChild(taxText);
  tax.appendChild(taxValue);

  var totalText = document.createElement('span');
  totalText.classList.add('order-summary-text');
  totalText.textContent = 'Total:';
  var totalValue = document.createElement('span');
  totalValue.classList.add('order-summary-value');
  var totalCost = itemTotal + taxTotal;
  totalValue.textContent = totalCost.toLocaleString('en-US',{style: 'currency', currency: 'USD'});
  var total = document.createElement('div');
  total.classList.add('checkout-total', 'subtotal');
  total.appendChild(totalText);
  total.appendChild(totalValue);

  var checkout = document.createElement('button');
  checkout.classList.add('checkout-btn');
  checkout.textContent = 'Checkout';

  var summary = document.createElement('div');
  summary.classList.add('order-summary', 'col-md-2');
  summary.setAttribute('id','summary');
  summary.textContent = 'Cart Summary';
  summary.appendChild(subtotal);
  summary.appendChild(tax);
  summary.appendChild(total);
  summary.appendChild(checkout);

  return summary;
}

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
  for (var i=0; i<products.length; i++) {
    added = false;
    for (var k=0; k<properties.length; k++) {
      if (products[i][properties[k]].toLowerCase().indexOf(searchTerm.value.toLowerCase()) === -1) {
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
  var resultArea = document.createElement('div');
  resultArea.classList.add('col-md-8');

  var resultDetail = document.createElement('div');
  resultDetail.textContent = 'Your search returned ' + array.length + ' results';
  resultDetail.classList.add('result-detail', 'col-md-8');
  content.appendChild(resultDetail);

  for (var i=0; i < array.length; i++) {
    var result = createResult(array[i]);
    result.appendChild(cartBtn(array[i]));
    resultArea.appendChild(result);
  }
  content.appendChild(resultArea);
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
    price.textContent = obj.price.toLocaleString('en-US',{style: 'currency', currency: 'USD'});
    price.classList.add('result-price')
    var descr = document.createElement('div');
    descr.textContent = obj.description;
    descr.classList.add('result-descr');
    var resultText = document.createElement('div');
    resultText.classList.add('result-text');
    resultText.appendChild(name);
    resultText.appendChild(price);
    resultText.appendChild(descr);

    //combine and return result element
    var result = document.createElement('div');
    result.classList.add('result');
    result.appendChild(img);
    result.appendChild(resultText);
    return result;
  }

//create button for adding products to cart
function cartBtn(obj) {
  var cartBtn = document.createElement('button');
  cartBtn.textContent = 'Add to Cart';
  cartBtn.classList.add('result-add');
  cartBtn.setAttribute('data-id', obj.id);
  return cartBtn;
}

function quantity(obj) {
  var quantLabel = document.createElement('div');
  quantLabel.classList.add('quant-label');
  quantLabel.textContent = 'Quantity:'
  var quantBtn = document.createElement('select');
  quantBtn.classList.add('quant-btn');
  quantBtn.setAttribute('value', obj.quantity);
  quantBtn.setAttribute('data-id', obj.id);
  for (var i=1; i<=10; i++) {
    var theOption = document.createElement('option');
    theOption.setAttribute('value', i);
    theOption.textContent = i;
    if (theOption.textContent === obj.quantity.toString()) {
      theOption.setAttribute('selected', 'selected');
    }
    quantBtn.appendChild(theOption);
  }
  // var arrow = document.createElement('i');
  // arrow.classList.add('fa', 'fa-angle-double-down');
  // arrow.setAttribute('aria-hidden', 'true');
  // quantBtn.appendChild(arrow);

  var quant = document.createElement('div');
  quant.classList.add('quant');
  quant.appendChild(quantLabel);
  quant.appendChild(quantBtn);
  return quant;
}
