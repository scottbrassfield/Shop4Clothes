var products = [
  {
    id: 'p001',
    category: 'Sporting Goods',
    name:'Schwinn Mark V Bike',
    description:'Schwinn\'s Mark V is a full-dress cruiser that nails the number one reason we ride bikes: fun.',
    price: 150,
    img:'http://sicklerbikes.com/images/library/zoom/schwinn_MARV26_SND_13_z.jpg'
  },
  {
    id: 'p002',
    category: 'Electronics',
    name:'USB Drive',
    description:'32GB USB Drive',
    price: 32.75,
    img:'#'
  },
  {
    id: 'p003',
    category: 'Auto',
    name:'Car',
    description:'Honda Civic',
    price: 15827,
    img:'#'
  },
  {
    id: 'p004',
    category: 'Clothing and Accessories',
    name:'Glasses',
    description:'Tom Ford square-rim glasses',
    price: 119.85,
    img:'#'
  },
  {
    id: 'p005',
    category: 'Electronics',
    name:'Macbook Pro',
    description:'13-in Macbook Pro',
    price: 1300,
    img:'#'
  },
  {
    id: 'p006',
    category: 'Electronics',
    name:'Dell Ultrabook',
    description:'15-in Dell Ultrabook',
    price: 999.99,
    img:'#'},
  {
    id: 'p007',
    category: 'Electronics',
    name:'HP Pavillion',
    description:'13-in HP Pavillion',
    price: 850,
    img:'#'},
  {
    id: 'p008',
    category: 'School and Office Supplies',
    name:'Paper',
    description:'1 ream of paper',
    price: 1.27,
    img:'#'
  },
  {
    id: 'p009',
    category: 'Clothing and Accessories',
    name:'Nike Roshe Running Shoes',
    description:'Made for both running and everyday use',
    price: 95.50,
    img:'http://images.nike.com/is/image/DotCom/511881_A_V2?&$img=511881_023_A_PREM&$PDP_HERO$'
  },

  {
    id: 'p011',
    category: 'Clothing and Accessories',
    name:'Vans High-Tops',
    description:'Classic pair of shoes from Vans',
    price: 44.95,
    img:'http://images.vans.com/is/image/Vans/QG36BT-HERO?$583x583$'
  },
  {
    id: 'p012',
    category: 'Sporting Goods',
    name:'Basketball',
    description:'Spalding indoor-outdoor basketball',
    price: 27.00,
    img:'http://thumbs1.ebaystatic.com/d/l225/m/m9jsV41Jk7HU6fBkgyd9W-g.jpg'
  }
]
var searchFields = ['name', 'description', 'category'];
var searches = {};
var cart = [];
var orders = [];
var customer = {
  login: {email: ''},
  ship: {
    name: '',
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
    name: {id: 'ship-name', value: '', required: true, valid: true, validate: ''},
    address: {id: 'ship-address', value: '', required: true, valid: true, validate: function(input) {
        var number = 0;
        var string = 0;
        form.ship.address.valid = true;
        var msg = document.getElementById('ship-address-val');
        msg.textContent = '';
        var content = input.split('');
        for (var i=0; i<content.length; i++) {
          if (isNaN(parseInt(content[i]))) {
            string++;
          }
          else { number++; }
        }
        if (number === 0 || string === 0) {
        msg.textContent = 'Please enter a valid address'
        form.ship.address.valid = false;
        }
      }
    },
    addressTwo: {id: 'ship-address-two', value: '', required: false, valid: true, validate: ''},
    city: {id: 'ship-city', value: '', required: true, valid: true, validate: ''},
    state: {id: 'ship-state', value: '', required: true, valid: true, validate: function(input) {
      form.ship.state.valid = true;
      var msg = document.getElementById('ship-state-val');
      msg.textContent = '';
      if (input.length != 2) {
        msg.textContent = 'Please enter valid state abbreviation';
        form.ship.state.valid = false;
      }
    }},
    zip: {id: 'ship-zip', value: '', required: true, valid: true, validate: function(input) {
        form.ship.zip.valid = true;
        var msg = document.getElementById('ship-zip-val');
        msg.textContent = '';
        if(input.length != 5) {
          msg.textContent = 'Please enter valid zip code';
          form.ship.zip.valid = false;
        }
    }},
    phone: {id: 'ship-phone', value: '', required: true, valid: true, validate: function(input) {
        form.ship.phone.valid = true;
        var msg = document.getElementById('ship-phone-val');
        msg.textContent = '';
        if(input.length < 10 || input.length > 13) {
          msg.textContent = 'Please enter valid phone number';
          form.ship.phone.valid = false;
        }
      }
    }
  },
  pay: {
    cc: {id: 'pay-cc-number', value: '', required: true, valid: true, validate: ''},
    sec: {id: 'pay-sec-code', value: '', required: true, valid: true, validate: ''},
    expire: {id: 'pay-expire', value: '', required: true, valid: true, validate: ''},
    name: {id: 'pay-name', value: '', required: true, valid: true, validate: ''},
    address: {id: 'pay-address', value: '', required: true, valid: true, validate: ''},
    addressTwo: {id: 'pay-address-two', value: '', required: false, valid: true, validate: ''},
    city: {id: 'pay-city', value: '', required: true, valid: true, validate: ''},
    state: {id: 'pay-state', value: '', required: true, valid: true, validate: ''},
    zip: {id: 'pay-zip', value: '', required: true, valid: true, validate: '',},
    phone: {id: 'pay-phone', value: '', required: true, valid: true, validate: '',}
  },
  customer: {
    email: {id: 'customer-input', value: '', required: true, valid: true, validate: ''}
  },
  validate: function(obj, element) {
    var valid = true;
    for (var prop in obj) {
      if (document.getElementById(obj[prop].id).value === '' && obj[prop].required) {
        document.getElementById(element).textContent = 'Enter text for all required fields';
        valid = false;
      }
      if (!obj[prop].valid) {
        document.getElementById(element).textContent = 'Please fix errors';
        valid = false;
      }
    }
    return valid;
  }
};

var navbar = document.getElementById("navbar");
navbar.addEventListener('click', function(e) {
  var currentView;
  switch (e.target.id) {
    case 'brand':
      searchBar.value = '';
      swap('view', 'view-home');
      break;
    case 'search-btn':
      if(e.target.value) {
        clear('search-content');
        var results = search(products, searchFields, e.target.value);
        currentView = view(results, 'view-search').id;
        swap('view', currentView);
      }
      break;
    case 'cart-btn':
      clear('cart-content');
      var aside = document.getElementById('cart-aside');
      if (aside.classList.contains('hidden')){
        aside.classList.remove('hidden');
      }
      currentView = view(cart, 'view-cart').id;
      swap('view', currentView);
      break;
    // case 'hist-btn':
    //   orderHistory();
    //   break;
      default:
  }
});

var searchBar = document.getElementById('search-bar');
searchBar.addEventListener('keyup', function(e) {
  if (e.target.value && e.which === 13 || e.keyCode === 13) {
    clear('search-content');
    var results = search(products, searchFields, e.target.value);
    var currentView = view(results, 'view-search').id;
    swap('view', currentView);
  }
})

var searchView = document.getElementById('view-search');
searchView.addEventListener('click', function(e) {
  for (var i=0; i<products.length; i++) {
    if (e.target.getAttribute('data-id') === products[i].id) {
      toCart(products[i]);
    }
  }
})

var cartView = document.getElementById('view-cart');
cartView.addEventListener('change', function(e) {
  for (var i=0; i<cart.length; i++) {
    if (e.target.getAttribute('data-quant-id') === cart[i].id) {
      cart[i].quantity = e.target.value;
      var subtotal = document.getElementById('cart-sub-value');
      subtotal.textContent = priceFormat(calculate(cart));
    }
  }
})
cartView.addEventListener('click', function(e) {
  for (var i=0; i<cart.length; i++) {
    if (e.target.getAttribute('data-remove-id') === cart[i].id) {
          cart.splice(i, 1);
          clear('cart-content');
          view(cart, 'view-cart');
    }
  }
  if (e.target.id === 'cart-sub-btn') {
    clear('summary-content');
    var currentView = view(cart, 'view-checkout').id;
    swap('view', currentView);
  }
})
//
// var checkoutView = document.getElementById('view-checkout');
// checkoutView.addEventListener('click', function(e) {
//   switch (e.target.id) {
//     case 'ship-submit':
//       // var ship = form.validate(form.ship, 'ship-submit-val')
//       // if (ship) {
//         saveForm(form.ship, customer.ship);
//         var summary = document.getElementById('ship-summary').getElementsByClassName('ship-summary-value');
//         for (var prop in customer.ship) {
//           for (var i=0; i<summary.length; i++) {
//             summary.length[i].textContent = customer.ship[prop];
//           }
//         }
//       // }
//       break;
//     case 'pay-submit':
//       // var pay = form.validate(form.pay, 'pay-submit-val');
//       if (pay) {
//         saveForm(form.pay, customer.pay);
//         showPay();
//       }
//       break;
//     // case 'shipping-update':
//       toggleShip();
//       var shipSubmit = document.getElementById('ship-submit-val');
//       shipSubmit.textContent = '';
//       break;
//     case 'payment-update':
//       togglePay();
//       var paySubmit = document.getElementById('pay-submit-val');
//       paySubmit.textContent = '';
//       break;
//     case 'checkoutBtn':
//       var validate = [form.validate(form.ship, 'ship-submit-val'),
//       form.validate(form.pay, 'pay-submit-val')];
//       var order = true;
//       for (var i=0; i<validate.length; i++) {
//         if(!validate[i]) {
//           order = false;
//         }
//       }
//       if(order) {
//         ordered();
//     //   }
//     //   break;
//     default:
//   }
// });
//
// checkoutView.addEventListener('keyup', function(e) {
//   if(e.target.id === 'customer-input'){
//     if (e.which === 13 || e.keyCode === 13) {
//       customer.email = e.target.value;
//     }
//   }
// })
//
// checkoutView.addEventListener('blur', function(e) {
//   for (var type in form) {
//     for (var prop in form[type]) {
//         if (form[type][prop].id === e.target.id) {
//           if(form[type][prop].validate) {
//             form[type][prop].validate(e.target.value);
//           }
//         }
//     }
//   }
// }, true);
//
// checkoutView.addEventListener('change', function(e) {
//   if (e.target.id === 'billing-checkbox') {
//     var payInput;
//     var shipInput;
//     for (var payProp in form.pay) {
//       payInput = document.getElementById(form.pay[payProp].id);
//       for (var shipProp in form.ship) {
//         shipInput = document.getElementById(form.ship[shipProp].id);
//         if (payProp === shipProp) {
//           if(!e.target.checked) {
//             payInput.setAttribute('value', '');
//           }
//           else {
//             payInput.setAttribute('value', shipInput.value);
//           }
//         }
//       }
//     }
//   }
// });

function search(products, fields, criteria) {
  var matches = [];
  var added;
  for (var i=0; i<products.length; i++) {
    added = false;
    for (var k=0; k<fields.length; k++) {
      if (products[i][fields[k]].toLowerCase().indexOf(criteria.toLowerCase()) === -1) {
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
  return matches;
}

function toCart(product) {
  if (cart.length === 0) {
    cart.push(product);
    cart[0].quantity = 1;
  }
  else {
    var found = false;
    for (var i=0; i<cart.length; i++) {
      if (product.id === cart[i].id) {
        found = true;
        cart[i].quantity++;
        break;
      }
    }
    if(!found) {
      cart.push(product);
      cart[cart.length - 1].quantity = 1;
    }
  }
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

function view(items, view) {
  var elItems = create(items, view);
  var elView = document.getElementById(view)
  var elContent = $( 'div[id=' + view + ']' ).find('.main')[0];
  switch (view) {
    case 'view-home':
      break;
    case 'view-search':
      var count = document.getElementById('result-count');
      count.textContent = elItems.length;
      break;
    // case 'view-product':
    //   break;
    case 'view-cart':
      if(cart.length === 0) {
        var aside = document.getElementById('cart-aside')
        aside.classList.add('hidden');
        var empty = element('div', 'empty-message', 'Your Cart is Currently Empty');
        elContent.appendChild(empty);
      }
      else {
        var title = element('div','', 'Shopping Cart', ['id', 'cart-title']);
        elContent.appendChild(title);
        var subtotal = document.getElementById('cart-sub-value');
        subtotal.textContent = priceFormat(calculate(cart));
        break;
      }
      break;
    case 'view-checkout':
      var itemsTotal = calculate(cart);
      var taxTotal = itemsTotal * 8 / 100;
      var itemsValue = document.getElementById('summary-items-value');
      itemsValue.textContent = priceFormat(itemsTotal);
      var taxValue = document.getElementById('summary-tax-value');
      taxValue.textContent = priceFormat(taxTotal);
      var totalValue = document.getElementById('summary-total-value');
      totalValue.textContent = priceFormat(itemsTotal + taxTotal);
      break;
    case 'view-history':
      break;
    default:
  }
  append(elContent, elItems);
  return elView;
}

function create(items, view) {
  var elItems = [];
  var elItem;
  for (var i=0; i<items.length; i++) {
    var img = element('img', '', '', ['src', items[i].img]);
    var name = element('div', '', items[i].name);
    var price = element('div', '', priceFormat(items[i].price));
    var descrip = element('div', '', items[i].description);
    switch (view) {
      // case 'view-home':
      //   break;
      case 'view-search':
        img.classList.add('result-img');
        name.classList.add('result-name');
        price.classList.add('result-price');
        var cartBtn = element('button', 'result-add', 'Add to Cart', ['data-id', items[i].id]);
        var resultText = element('div', 'result-text');
        append(resultText, [name, price, cartBtn]);
        elItem = element('div', 'result');
        append(elItem, [img, resultText, cartBtn]);
        break;
      // case 'view-product':
      //   break;
      case 'view-cart':
        img.classList.add('cart-img');
        name.classList.add('cart-name');
        price.classList.add('cart-price');
        descrip.classList.add('cart-descr');
        var cartText = element('div', 'cart-text');
        append(cartText, [name, price, descrip]);
        var quantLabel = element('div', 'quant-label', 'Quantity');
        var quantSection = element('div', 'inline-div');
        append(quantSection, [quantLabel, quantBtn(items[i]), removeBtn(items[i])])
        elItem = element('div', 'cart-item');
        append(elItem, [img, cartText, quantSection]);
        break;
      case 'view-checkout':
        img.classList.add('review-img');
        name.classList.add('review-name');
        price.classList.add('review-price');
        var quantity = element('div', 'review-quant', 'Quantity: ' + cart[i].quantity);
        var reviewText = element('div','review-text');
        append(reviewText, [name, price, quantity]);
        var subLabel = element('span','', 'Subtotal: ');
        var subValue = element('span', 'review-sub-value', priceFormat(cart[i].quantity * cart[i].price));
        var sub = element('div', 'review-sub');
        append(sub, [subLabel, subValue])
        elItem = element('div', 'review');
        append(elItem, [img, reviewText, sub]);
        break;
      case 'view-history':
        break;
      default:
    }
    elItems.push(elItem);
  }
  return elItems;
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

function clear(view) {
  var elView = document.getElementById(view);
   while(elView.firstChild) {
    elView.removeChild(elView.firstChild);
  }
}

function swap(attribute, view) {
  var elViews = document.getElementsByClassName(attribute);
  var nextView = document.getElementById(view);
  if (elViews.length > 0) {
    for (var i=0; i<elViews.length; i++) {
      elViews[i].classList.remove('active');
      elViews[i].classList.add('hidden');
    }
    nextView.classList.remove('hidden');
    nextView.classList.add('active');
  }
  else {
    var elView = document.getElementById(attribute);
    if (elView.classList.contains('hidden')) {
      elView.classList.remove('hidden');
      elView.classList.add('active');
    }
    else {
      elView.classList.add('hidden');
      elView.classList.remove('active');
    }
  }
}

function priceFormat(num) {
  var numFormat = num.toLocaleString('en-US',{style: 'currency', currency: 'USD'});
  return numFormat;
}

function calculate(products) {
  var total = 0;
  for (var i=0; i<products.length; i++) {
    total += products[i].quantity * products[i].price * 100;
  }
  return total / 100;
}

function removeBtn(obj) {
  var remove = element('div', 'remove-btn', 'Remove');
  remove.setAttribute('data-remove-id', obj.id);
  return remove;
}

function quantBtn(item) {
  var quant = document.createElement('select');
  quant.classList.add('quant-btn');
  quant.setAttribute('value', item.quantity);
  quant.setAttribute('data-quant-id', item.id);
  for (var i=1; i<=10; i++) {
    var theOption = document.createElement('option');
    theOption.setAttribute('value', i);
    theOption.textContent = i;
    if (theOption.textContent === item.quantity.toString()) {
      theOption.setAttribute('selected', 'selected');
    }
    quant.appendChild(theOption);
  }
  return quant;
}

function saveForm(source, save) {
  for (var prop in save) {
    save[prop] = document.getElementById(source[prop].id).value;
  }
}

// function ordered() {
//   var order = {};
//   order.total = 0;
//   order.submitted = new Date();
//   order.contents = [];
//   for (var i=0; i<cart.length; i++) {
//     order.contents.push(cart[i]);
//     order.total += (cart[i].quantity * cart[i].price);
//   }
//   order.customer = customer;
//   orders.push(order);
//   cart = [];
//   hide('checkout');
//   var confirmation = element('div', 'order-confirmation', 'Your order has been placed');
//   content.appendChild(confirmation);
// }

// function showShip() {
//   var shipInfo = document.getElementById('ship-info');
//   clear(shipInfo);
//   var shipText = element('div', 'ship-text');
//   append(shipText, [
//     element('div', '', customer.ship.name),
//     element('div', '', customer.ship.address),
//     element('div', '', customer.ship.addressTwo),
//     element('span', '', customer.ship.city + ', '),
//     element('span', '', customer.ship.state + ' '),
//     element('span', '', customer.ship.zip),
//     element('div', '', customer.ship.phone)
//     ]);
//   append(shipInfo, shipText);
//   shipInfo.style.display = 'block';
//   var shipForm = document.getElementById('shipping-form');
//   shipForm.style.display = 'none';
//   var shipUpdate = document.getElementById('shipping-update');
//   shipUpdate.style.display = 'inline';
// }

// function showPay() {
//   var payText = element('div', 'pay-text', 'Payment Information has been saved');
//   var payInfo = document.getElementById('pay-info');
//   payInfo.appendChild(payText);
//   payInfo.style.display = 'block';
//   var payForm = document.getElementById('payment-form');
//   payForm.style.display = 'none';
//
//   var payUpdate = document.getElementById('payment-update');
//   payUpdate.style.display = 'inline';
// }

// function toggleShip() {
//   var shipping = document.getElementById('shipping-form');
//   shipping.style.display = 'block';
//   var shipUpdate = document.getElementById('shipping-update');
//   shipUpdate.style.display = 'none';
//   var shipText = document.getElementsByClassName('ship-text')[0];
//   shipText.style.display = 'none';
// }

// function togglePay() {
//   var payment = document.getElementById('payment-form');
//   payment.style.display = 'block';
//   var payUpdate = document.getElementById('payment-update');
//   payUpdate.style.display = 'none';
//   var payText = document.getElementsByClassName('pay-text')[0];
//   payText.style.display = 'none';
// }

// function orderHistory() {
//   content.appendChild(element('div', 'hist-title', 'Order History'))
//   for (var i=0; i<orders.length; i++) {
//     var order = element('div', ['hist-order', 'col-md-9'], '');
//     var date = element('div', 'hist-date');
//     append(date, [
//       element('div', 'hist-date-label', 'Order Submitted:'),
//       element('div', 'hist-date-content', orders[i].submitted.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}))
//     ]);
//     var total = element('div', 'hist-total');
//     append(total, [
//       element('div', 'hist-total-label', 'Total:'),
//       element('div', 'hist-total-content', priceFormat(orders[i].total)),
//     ]);
//     var summary = element('div', 'hist-summary');
//     append(summary, [date, total]);
//     append(order, summary);
//
//     for (var k=0; k<orders[i].contents.length; k++) {
//       var item = element('div', 'hist-item');
//       append(item, element('img', 'hist-item-img', '', ['src', orders[i].contents[k].img]));
//       var text = element('div', 'hist-item-text');
//       append(text, [
//         element('div', 'hist-item-name', orders[i].contents[k].name),
//         element('div', 'hist-item-price', priceFormat(orders[i].contents[k].price))
//       ]);
//       append(item, text);
//       append(order, item);
//     }
//     append(content, order);
//   }
// }
