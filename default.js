//store references to sections of page
var searchBar = document.getElementById('search-bar');
var navbar = document.getElementById('navbar');
var content = document.getElementById('content');
var checkoutSection = document.getElementById('checkout');

//variables related to matched searches
var matchProperties = ['name', 'description', 'category'];
var matches = [];

//variables related to user shopping experience
var cart = [];
var orders = [];
var customer = {
  login: {email: ''},
  ship: {
    name: 'Scott',
    address: '',
    addressTwo: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  },
  pay: {
    cc: '',
    sec: '',
    expire: '',
    name: '',
    address: '',
    addressTwo: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  },
};
var form = {
  ship: {
    name: {id: 'ship-name', value: '', validate: ''},
    address: {id: 'ship-address', value: '', validate: ''},
    addressTwo: {id: 'ship-address-two', value: '', validate: ''},
    city: {id: 'ship-city', value: '', validate: ''},
    state: {id: 'ship-state', value: '', validate: ''},
    zip: {id: 'ship-zip', value: '', validate: '',},
    phone: {id: 'ship-phone', value: '', validate: '',}
  },
  pay: {
    cc: {id: 'pay-cc-number', value: '', validate: ''},
    sec: {id: 'pay-sec-code', value: '', validate: ''},
    expire: {id: 'pay-expire', value: '', validate: ''},
    name: {id: 'pay-name', value: '', validate: ''},
    address: {id: 'pay-address', value: '', validate: ''},
    addressTwo: {id: 'pay-address-two', value: '', validate: ''},
    city: {id: 'pay-city', value: '', validate: ''},
    state: {id: 'pay-state', value: '', validate: ''},
    zip: {id: 'pay-zip', value: '', validate: '',},
    phone: {id: 'pay-phone', value: '', validate: '',}
  },
  customer: {
    email: {id: 'customer-input', value: '', validate: ''}
  },
};

//event listener for buttons in navbar
navbar.addEventListener('click', function(e) {
  switch (e.target.id) {
    case 'search-btn':
      search();
      break;
    case 'cart-btn':
      viewCart();
      break;
    case 'brand':
      searchBar.value = '';
      clear(content);
      hide('checkout');
      break;
      default:
  }
});

//event listener for search bar
searchBar.addEventListener('keyup', function(e) {
  if (e.which === 13 || e.keyCode === 13) {
    search();
  }
})

//event listener for adding to cart
content.addEventListener('click', function(e) {
  for (var i=0; i<matches.length; i++) {
    if (e.target.getAttribute('data-id') === matches[i].id) {
      addToCart(matches[i]);
    }
  }
})

//event listener for updating cart total based on changes to quantity
content.addEventListener('change', function(e) {
  for (var i=0; i<cart.length; i++) {
    if (e.target.getAttribute('data-quant-id') === cart[i].id) {
      updateTotal(e, cart[i]);
    }
  }
})

//event listener for removing items from cart
content.addEventListener('click', function(e) {
  for (var i=0; i<cart.length; i++) {
    if (e.target.getAttribute('data-remove-id') === cart[i].id) {
      removeFromCart(cart[i]);
      viewCart();
    }
  }
})

content.addEventListener('click', function(e) {
  if (e.target.id === 'proceed-btn') {
    show('checkout');
    reviewOrder().appendChild(orderSummary());
  }
})

checkoutSection.addEventListener('click', function(e) {
  switch (e.target.id) {
    case 'ship-submit':
      saveForm(customer.ship, form.ship);
      showShip();
      break;
    case 'pay-submit':
      saveForm(customer.pay, form.pay);
      showPay();
      break;
    case 'shipping-update':
      toggleShip();
      break;
    case 'payment-update':
      togglePay();
      break;
    case 'checkoutBtn':
      ordered();
      break;
    default:
  }
});

checkoutSection.addEventListener('keyup', function(e) {
  if(e.target.id === 'customer-input'){
    if (e.which === 13 || e.keyCode === 13) {
      customer.email = e.target.value;
    }
  }
})

//clear specified element
function clear(element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild);
    matches = [];
  }
}

//perform search based on search criteria
function search() {
  if (searchBar.value){
    clear(content);
    hide('checkout');
    compare(products, matchProperties);
    viewResults(matches);
  }
}

//compare search term to products and add matches to array
function compare(products, properties) {
  var added;
  for (var i=0; i<products.length; i++) {
    added = false;
    for (var k=0; k<properties.length; k++) {
      if (products[i][properties[k]].toLowerCase().indexOf(searchBar.value.toLowerCase()) === -1) {
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

//create result element based on matches array
function createResult (obj) {
  //create element to store product image
  var img = element('img', 'result-img');
  img.src = obj.img;

  //create elements for product name, price, and description
  var name = element('div', 'result-name', obj.name);
  var price = element('div', 'result-price', priceFormat(obj.price));
  var descr = element('div', 'result-descr', obj.description);
  var resultText = element('div', 'result-text');
  append(resultText, [name, price, descr]);

  //combine and return result element
  var result = element('div', 'result');
  append(result, [img, resultText]);
  return result;
}

//display results
function viewResults(array) {
  var resultArea = element('div','col-md-10', '');
  var resultDetail = element('div', ['result-detail', 'col-md-10'], 'Your search returned ' + array.length + ' results');
  // resultDetail.textContent = 'Your search returned ' + array.length + ' results';
  content.appendChild(resultDetail);

  for (var i=0; i < array.length; i++) {
    var result = createResult(array[i]);
    result.appendChild(cartBtn(array[i]));
    resultArea.appendChild(result);
  }
  content.appendChild(resultArea);
}

//create button for adding products to cart
function cartBtn(obj) {
  var cartBtn = element('button', 'result-add', 'Add to Cart', ['data-id', obj.id]);
  return cartBtn;
}

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

//remove item from cart
function removeFromCart(obj) {
  for (var i=0; i<cart.length; i++) {
    if (cart[i].id === obj.id) {
      cart.splice(i, 1);
    }
  }
}

//clear content and view cart
function viewCart() {
  clear(content);
  hide('checkout');
  if(cart.length === 0) {
    var empty = element('div', 'empty-message', 'Your Cart is Currently Empty');
    content.appendChild(empty);
  }
  else {
    var cartTitle = element('div',['cart-title', 'col-md-8'], 'Shopping Cart');
    content.appendChild(cartTitle);
    for (var i=0; i<cart.length; i++) {
      var quantLabel = element('div', 'quant-label', 'Quantity');
      var quantSection = element('div', 'inline-div');
      append(quantSection, [quantLabel, quantBtn(cart[i]), removeBtn(cart[i])])
      var result = createResult(cart[i]);
      result.appendChild(quantSection);
      var resultArea = element('div', 'col-md-8');
      resultArea.appendChild(result);
    }
    var subtotal = element('div','cart-subtotal','Subtotal: ' + priceFormat(calculateTotal(cart)), ['id', 'cart-sub']);
    resultArea.appendChild(subtotal);
    var cartSub = cartSubtotal();
    append(content, [resultArea, cartSub])
  }
}

function cartSubtotal() {
  var summaryLabel = element('div', 'cart-summary-label', 'Subtotal:');
  var summaryValue = element('div', 'cart-summary-value', calculateTotal(cart).toLocaleString('en-US',{style: 'currency', currency: 'USD'}));
  var proceedBtn = element('button', '', 'Checkout');
  proceedBtn.setAttribute('id', 'proceed-btn');
  var proceed = element('div', ['cart-summary', 'col-md-2'], '');
  proceed.setAttribute('id', 'cart-summary');
  append(proceed, [summaryLabel, summaryValue, proceedBtn])
  return proceed;
}

function reviewOrder() {
  var reviewSection = document.getElementById('review');
  clear(reviewSection);

  var reviewTitle = element('div', 'review-title', 'Order Summary');
  reviewSection.appendChild(reviewTitle);

  for (var i=0; i<cart.length; i++) {
    var img = element('img', 'review-img');
    img.src = cart[i].img;
    var name = element('div', 'review-name', cart[i].name);
    var price = element('div', 'review-price', priceFormat(cart[i].price));
    var quantity = element('div', 'review-quant', 'Quantity: ' + cart[i].quantity);
    var reviewText = element('div','review-text');
    append(reviewText, [name, price, quantity]);

    var subLabel = element('span','', 'Subtotal: ');
    var subValue = element('span', 'review-sub-value', priceFormat(cart[i].quantity * cart[i].price));
    var sub = element('div', 'review-sub');
    append(sub, [subLabel, subValue])
    var review = element('div', 'review');
    append(review, [img, reviewText, sub])
    append(reviewSection, review);
  }
  return reviewSection;
}
//create order summary box
function orderSummary() {
  var itemsTotal = calculateTotal(cart);
  var itemsText = element('span', 'order-summary-text', 'Items:');
  var itemsValue = element('span', 'order-summary-value', priceFormat(itemsTotal));
  var items = element('div', 'subtotal', '');
  append(items, [itemsText, itemsValue])

  var taxTotal = itemsTotal * (8 / 100);
  var taxText = element('span', 'order-summary-text', 'Tax:');
  var taxValue = element('span', 'order-summary-value', priceFormat(taxTotal));
  var tax = element('div');
  append(tax, [taxText, taxValue]);

  var totalCost = itemsTotal + taxTotal;
  var totalText = element('span', 'order-summary-text', 'Total:');
  var totalValue = element('span', 'order-summary-value', priceFormat(totalCost));
  var total = element('div', ['checkout-total', 'subtotal']);
  append(total, [totalText, totalValue]);

  var checkout = element('button', 'checkout-btn', 'Place Order', ['id', 'checkoutBtn']);

  var summary = element('div', ['order-summary', 'col-md-2'], ['id', 'summary']);
  append(summary, [items, tax, total, checkout]);

  return summary;
}

//calculate order total
function calculateTotal(array) {
  var total = 0;
  for (var i=0; i<array.length; i++) {
    total += array[i].quantity * array[i].price * 100;
  }
  return total / 100;
}

function updateTotal(e, obj) {
  var summary = document.getElementById('cart-summary');
  content.removeChild(summary);
  obj.quantity = e.target.value;
  content.appendChild(cartSubtotal());
  var sub = document.getElementById('cart-sub');
  sub.textContent = 'Subtotal: ' + priceFormat(calculateTotal(cart));
}

function quantBtn(obj) {
  var quant = document.createElement('select');
  quant.classList.add('quant-btn');
  quant.setAttribute('value', obj.quantity);
  quant.setAttribute('data-quant-id', obj.id);
  for (var i=1; i<=10; i++) {
    var theOption = document.createElement('option');
    theOption.setAttribute('value', i);
    theOption.textContent = i;
    if (theOption.textContent === obj.quantity.toString()) {
      theOption.setAttribute('selected', 'selected');
    }
    quant.appendChild(theOption);
  }
  return quant;
}

function removeBtn(obj) {
  var remove = element('div', 'remove-btn', 'Remove');
  remove.setAttribute('data-remove-id', obj.id);
  return remove;
}

function show(element) {
  clear(content);
  var show = document.getElementById(element);
  show.style.display = 'block';
}

function hide(element) {
  var hidden = document.getElementById(element);
  hidden.style.display = 'none';
}

function saveForm(save, source) {
  for (var prop in save) {
    save[prop] = document.getElementById(source[prop].id).value;
  }
}

function showShip() {
  var shipInfo = document.getElementById('ship-info');
  clear(shipInfo);
  var shipText = element('div', 'ship-text');
  append(shipText, [
    element('div', '', customer.ship.name),
    element('div', '', customer.ship.address),
    element('div', '', customer.ship.addressTwo),
    element('span', '', customer.ship.city + ', '),
    element('span', '', customer.ship.state + ' '),
    element('span', '', customer.ship.zip),
    element('div', '', customer.ship.phone)
    ]);
  append(shipInfo, shipText);
  shipInfo.style.display = 'block';
  var shipForm = document.getElementById('shipping-form');
  shipForm.style.display = 'none';
  var shipUpdate = document.getElementById('shipping-update');
  shipUpdate.style.display = 'inline';
}

function showPay() {
  var payText = element('div', ['pay-text'], 'Payment Information has been saved');
  var payInfo = document.getElementById('pay-info');
  payInfo.appendChild(payText);
  payInfo.style.display = 'block';
  var payForm = document.getElementById('payment-form');
  payForm.style.display = 'none';

  var payUpdate = document.getElementById('payment-update');
  payUpdate.style.display = 'inline';
}

function ordered() {
  var order = {};
  order.submitted = new Date();
  order.contents = [];
  for (var i=0; i<cart.length; i++) {
    order.contents.push(cart[i]);
  }
  order.customer = customer;
  orders.push(order);
  cart = [];
  hide('checkout');
  var confirmation = element('div', 'order-confirmation', 'Your order has been placed');
  content.appendChild(confirmation);
}

function toggleShip() {
  var shipping = document.getElementById('shipping-form');
  shipping.style.display = 'block';
  var shipUpdate = document.getElementById('shipping-update');
  shipUpdate.style.display = 'none';
  var shipText = document.getElementsByClassName('ship-text')[0];
  shipText.style.display = 'none';
}

function togglePay() {
  var payment = document.getElementById('payment-form');
  payment.style.display = 'block';
  var payUpdate = document.getElementById('payment-update');
  payUpdate.style.display = 'none';
  var payText = document.getElementsByClassName('pay-text')[0];
  payText.style.display = 'none';
}

function priceFormat(num) {
  var numFormat = num.toLocaleString('en-US',{style: 'currency', currency: 'USD'});
  return numFormat;
}

function element(tagname, classes, text, attribute) {
  var el = document.createElement(tagname);
  if(typeof classes === 'object') {
    for (var i=0; i<classes.length; i++) {
      el.classList.add(classes[i]);
    }
  }
  else if (classes) {
    el.classList.add(classes);
  }
  if(text) {
    el.textContent = text;
  }
  if(attribute) {
    el.setAttribute(attribute[0], attribute[1]);
  }
  return el;
}

function append(parent, children) {
  if(Array.isArray(children)) {
    for (var i=0; i<children.length; i++) {
      parent.appendChild(children[i]);
    }
  }
  else {
    parent.appendChild(children);
  }
}
