//store references to sections of page
var searchBar = document.getElementById('search-bar');
var navbar = document.getElementById('navbar');
var content = document.getElementById('content');
var checkoutSection = document.getElementById('checkout');

//variables related to matched searches
var matchProperties = ['name', 'description', 'category',];
var matches = [];

//store items added to cart
var cart = [];

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
  toggleCheckout(e)
});

// checkoutSection.addEventListener('click', function(e) {
//   saveCheckout(e)
// });

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

  //add item to cart

//display results
function viewResults(array) {
  var resultArea = document.createElement('div');
  resultArea.classList.add('col-md-9');

  var resultDetail = document.createElement('div');
  resultDetail.textContent = 'Your search returned ' + array.length + ' results';
  resultDetail.classList.add('result-detail', 'col-md-9');
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
  var cartBtn = document.createElement('button');
  cartBtn.textContent = 'Add to Cart';
  cartBtn.classList.add('result-add');
  cartBtn.setAttribute('data-id', obj.id);
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
  var resultArea = document.createElement('div');
  resultArea.classList.add('col-md-8');
  if(cart.length === 0) {
    var empty = document.createElement('div');
    empty.classList.add('empty-message');
    empty.textContent = 'Your Cart is Currently Empty'
    content.appendChild(empty);
  }
  else {
    var cartTitle = document.createElement('div');
    cartTitle.textContent = 'Shopping Cart';
    cartTitle.classList.add('cart-title', 'col-md-8');
    content.appendChild(cartTitle);
    for (var i=0; i<cart.length; i++) {
      var result = createResult(cart[i]);
      var quantSection = document.createElement('div');
      quantSection.classList.add('inline-div');
      var quantLabel = document.createElement('div');
      quantLabel.classList.add('quant-label');
      quantLabel.textContent = 'Quantity:'
      quantSection.appendChild(quantLabel);
      quantSection.appendChild(quantBtn(cart[i]));
      quantSection.appendChild(removeBtn(cart[i]));
      result.appendChild(quantSection);
      resultArea.appendChild(result);
    }
    var subtotal = document.createElement('div');
    subtotal.textContent = 'Subtotal: ' + calculateTotal(cart).toLocaleString('en-US',{style: 'currency', currency: 'USD'});
    subtotal.classList.add('cart-subtotal');
    subtotal.setAttribute('id', 'cart-sub');
    resultArea.appendChild(subtotal);
    content.appendChild(resultArea);
    var cartSub = cartSubtotal();
    content.appendChild(cartSub);
  }
}

function cartSubtotal() {
  var summaryLabel = document.createElement('div');
  summaryLabel.classList.add('cart-summary-label');
  summaryLabel.textContent = 'Subtotal:'
  var summaryValue = document.createElement('div');
  summaryValue.classList.add('cart-summary-value');
  summaryValue.textContent = calculateTotal(cart).toLocaleString('en-US',{style: 'currency', currency: 'USD'});
  var proceedBtn = document.createElement('button');
  proceedBtn.setAttribute('id', 'proceed-btn');
  proceedBtn.textContent = 'Checkout';
  var proceed = document.createElement('div');
  proceed.classList.add('cart-summary', 'col-md-2');
  proceed.setAttribute('id', 'cart-summary');
  proceed.appendChild(summaryLabel);
  proceed.appendChild(summaryValue);
  proceed.appendChild(proceedBtn);
  return proceed;
}

function reviewOrder() {
  var reviewSection = document.getElementById('review');
  clear(reviewSection);

  var reviewTitle = document.createElement('div');
  reviewTitle.classList.add('review-title');
  reviewTitle.textContent = 'Order Summary';
  reviewSection.appendChild(reviewTitle);

  for (var i=0; i<cart.length; i++) {
    var img = document.createElement('img');
    img.src = cart[i].img;
    img.classList.add('review-img')

    var name = document.createElement('div');
    name.textContent = cart[i].name;
    name.classList.add('review-name');
    var price = document.createElement('div');
    price.textContent = cart[i].price.toLocaleString('en-US',{style: 'currency', currency: 'USD'});
    price.classList.add('review-price');
    var quantity = document.createElement('div');
    quantity.textContent = 'Quantity: ' + cart[i].quantity;
    quantity.classList.add('review-quant');
    var reviewText = document.createElement('div');
    reviewText.classList.add('review-text');
    reviewText.appendChild(name);
    reviewText.appendChild(price);
    reviewText.appendChild(quantity);

    var subLabel = document.createElement('span');
    subLabel.textContent = 'Subtotal: ';
    var subValue = document.createElement('span');
    subValue.classList.add('review-sub-value');
    subValue.textContent = (cart[i].quantity * cart[i].price).toLocaleString('en-US',{style: 'currency', currency: 'USD'});
    var sub = document.createElement('div');
    sub.classList.add('review-sub');
    sub.appendChild(subLabel);
    sub.appendChild(subValue);

    var review = document.createElement('div');
    review.classList.add('review');
    review.appendChild(img);
    review.appendChild(reviewText);
    review.appendChild(sub);
    reviewSection.appendChild(review);
  }
  return reviewSection;
}
//create order summary box
function orderSummary() {
  var itemsText = document.createElement('span');
  itemsText.classList.add('order-summary-text');
  itemsText.textContent = 'Items:';
  var itemsValue = document.createElement('span');
  itemsValue.classList.add('order-summary-value');
  var itemsTotal = calculateTotal(cart)
  itemsValue.textContent = itemsTotal.toLocaleString('en-US',{style: 'currency', currency: 'USD'});
  var items = document.createElement('div');
  items.classList.add('subtotal');
  items.appendChild(itemsText);
  items.appendChild(itemsValue);

  var taxText = document.createElement('span');
  taxText.classList.add('order-summary-text');
  taxText.textContent = 'Tax:';
  var taxValue = document.createElement('span');
  taxValue.classList.add('order-summary-value');
  var taxTotal = itemsTotal * 8 / 100;
  taxValue.textContent = taxTotal.toLocaleString('en-US',{style: 'currency', currency: 'USD'});
  var tax = document.createElement('div');
  tax.appendChild(taxText);
  tax.appendChild(taxValue);

  var totalText = document.createElement('span');
  totalText.classList.add('order-summary-text');
  totalText.textContent = 'Total:';
  var totalValue = document.createElement('span');
  totalValue.classList.add('order-summary-value');
  var totalCost = itemsTotal + taxTotal;
  totalValue.textContent = totalCost.toLocaleString('en-US',{style: 'currency', currency: 'USD'});
  var total = document.createElement('div');
  total.classList.add('checkout-total', 'subtotal');
  total.appendChild(totalText);
  total.appendChild(totalValue);

  var checkout = document.createElement('button');
  checkout.classList.add('checkout-btn');
  checkout.setAttribute('id', 'checkoutBtn');
  checkout.textContent = 'Place Order';

  var summary = document.createElement('div');
  summary.classList.add('order-summary', 'col-md-2');
  summary.setAttribute('id','summary');
  summary.appendChild(items);
  summary.appendChild(tax);
  summary.appendChild(total);
  summary.appendChild(checkout);

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
  sub.textContent = 'Subtotal: ' + calculateTotal(cart).toLocaleString('en-US',{style: 'currency', currency: 'USD'});
  // content.appendChild(orderSummary());
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
  var remove = document.createElement('div');
  remove.classList.add('remove-btn');
  remove.setAttribute('data-remove-id', obj.id);
  remove.textContent = "Remove";
  return remove;
}

function show(element) {
  clear(content);
  var show = document.getElementById(element);
  show.style.display = 'block'; //question - why doesn't the setAttribute function work here?
}

function hide(element) {
  var hidden = document.getElementById(element);
    hidden.style.display = 'none';
}

function toggleCheckout(e) {
  switch (e.target.id) {
    case 'shipping-title':
      var shipping = document.getElementById('shipping-form');
      var shipIcon = document.getElementById('ship-icon');
      if (shipping.style.display === 'block') {
          shipping.style.display = 'none';
      }
      else {
        shipping.style.display = 'block';
      }
      shipIcon.classList.toggle('fa-plus-square');
      shipIcon.classList.toggle('fa-minus-square');
      break;

    case 'payment-title':
      var payment = document.getElementById('payment-form');
      var payIcon = document.getElementById('pay-icon');
      if (payment.style.display === 'block') {
        payment.style.display = 'none';
      }
      else {
        payment.style.display = 'block'
      }
      payIcon.classList.toggle('fa-plus-square');
      payIcon.classList.toggle('fa-minus-square');
      break;
      default:
  }
}

// function saveCheckout(e) {
//   if (e.target.classList.contains('form-submit')) {
//     switch (e.target.getAttribute('data-section')) {
//       case 'shipping':
//         var ship = document.getElementById('shipping-title').parentElement;
//         var checkShip = document.createElement('i');
//         checkShip.classList.add('fa', 'fa-check', 'fa-check-green', 'fa-2x');
//         checkShip.setAttribute('aria-hidden', 'true');
//         ship.appendChild(checkShip);
//         break;
//       case 'payment':
//         var pay = document.getElementById('payment-title').parentElement;
//         var checkPay = document.createElement('i');
//         checkPay.classList.add('fa', 'fa-check', 'fa-check-green', 'fa-2x');
//         checkPay.setAttribute('aria-hidden', 'true');
//         pay.appendChild(checkPay);
//         break;
//         default:
//     }
//   }
// }
