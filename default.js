var cart = [];
var orders = [];
var customer = {
  shipping: [],
  payment: [],
  login: []
};
var currentOrder = {};
var searches = [];

var navbar = document.getElementById('navbar');
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
        var results = search(products, e.target.value);
        currentView = view(results, 'view-search').id;
        swap('view', currentView);
      }
      break;
    case 'cart-click':
      clear('cart-content');
      var aside = document.getElementById('cart-aside');
      if (aside.classList.contains('hidden')){
        aside.classList.remove('hidden');
      }
      currentView = view(cart, 'view-cart').id;
      swap('view', currentView);
      break;
    case 'hist-btn':
      clear('history-content');
      currentView = view(orders, 'view-history').id;
      swap('view', currentView);
      break;
    case 'dropdown-history':
      clear('history-content');
      currentView = view(orders, 'view-history').id;
      swap('view', currentView);
      break;
    case 'dropdown-checkout':
      if (cart.length) {
        currentView = view(cart, 'view-checkout').id;
      } else {
        clear('view-other')
        var emptyMsg = element('div', ['empty-message', 'empty-message-other'], 'Your cart is currently empty');
        currentView = document.getElementById('view-other');
        currentView.appendChild(emptyMsg);
        currentView = 'view-other';
      }
      swap('view', currentView);
      break;
    default:
  }
});

var searchBar = document.getElementById('search-bar');
searchBar.addEventListener('keyup', function(e) {
  if (e.target.value && e.which === 13 || e.keyCode === 13) {
    clear('search-content');
    var results = search(products, e.target.value);
    var currentView = view(results, 'view-search', e.target.value).id;
    swap('view', currentView);
  }
})

var searchView = document.getElementById('view-search');
searchView.addEventListener('click', function(e) {
  for (var i=0; i<products.length; i++) {
    if (e.target.getAttribute('data-id') === products[i].id) {
      clear('product-content');
      var currentView = view(products[i], 'view-product').id;
      swap('view', currentView)
    }
  }
})
searchView.addEventListener('change', function(e) {
  if (e.target.name === 'sort') {
    clear('search-content');
    var results = sort(searches[searches.length - 1].results, e.target.value);
    var theResults = create(results, 'view-search');
    theResults.forEach(function(item) {
      document.getElementById('search-content').appendChild(item);
    })
  }
})

var productView = document.getElementById('view-product');
productView.addEventListener('click', function(e) {
  for (var i=0; i<products.length; i++) {
    if (e.target.getAttribute('data-id') === products[i].id) {
      var sizes = $(e.target.parentElement).find('select[data-size]');
      var cartCount = toCart(products[i], sizes);
      $('#cart-count').text(cartCount);
    }
  }
})

var cartView = document.getElementById('view-cart');
cartView.addEventListener('change', function(e) {
  for (var i=0; i<cart.length; i++) {
    if (e.target.getAttribute('data-quant-id') === cart[i].id) {
      cart[i].quantity = e.target.value;
      $('#cart-count').text(cartCount());
      var subtotal = document.getElementById('cart-sub-value');
      subtotal.textContent = priceFormat(calculate(cart));
    }
  }
})
cartView.addEventListener('click', function(e) {
  for (var i=0; i<cart.length; i++) {
    if (e.target.getAttribute('data-remove-id') === cart[i].id) {
          cart.splice(i, 1);
          $('#cart-count').text(cartCount());
          clear('cart-content');
          view(cart, 'view-cart');
    }
  }
  if (e.target.id === 'cart-sub-btn') {
    clear('summary-content');
    var $state;
    for (var k=0; k<states.length; k++) {
      $state = $('<option>', {name: states[k].abbreviation, value: states[k].name});
      $('#ship-states').append($state);
      // $('#pay-states').append($state);
    }
    var currentView = view(cart, 'view-checkout').id;
    swap('view', currentView);
  }
})

var checkoutView = document.getElementById('view-checkout');
checkoutView.addEventListener('blur', function(e) {
  validate(e.target);
}, true);

checkoutView.addEventListener('change', function(e) {
  if (e.target.id === 'billing-checkbox') {
    var sources = $( '#shipping-form').find('input[name]');
    var targets = $( e.target.form ).find('input[name]');
    for (var i=0; i<targets.length; i++) {
      for (var k=0; k<sources.length; k++) {
        if (targets[i].getAttribute('name') === sources[k].getAttribute('name')) {
          if (e.target.checked) {
            $( targets[i] ).val($( sources[k] ).val());
          }
          else {
            $( targets[i] ).val("");
          }
        }
      }
    }
  }
});

checkoutView.addEventListener('click', function(e) {
  switch (e.target.id) {
    case 'customer-submit':
      if (e.target.form.checkValidity()) {
        e.preventDefault();
        currentOrder.customer = (save(e.target.form.id, 'name'));
        toggle('customer-confirm')
      }
      break;
    case 'ship-submit':
      if (e.target.form.checkValidity()) {
        e.preventDefault();
        currentOrder.shipping = (save(e.target.form.id, 'name'));
        var $elSummary;
        for (var prop in currentOrder.shipping) {
            $elSummary = $('<div>').text(currentOrder.shipping[prop]);
            if (prop === 'city' ) {
              $elSummary.addClass('inline-div');
              $elSummary.append(',');
            }
            else if (prop === 'state' || prop === 'zip') {
              $elSummary.addClass('inline-div');
            }
            $elSummary.appendTo($('#shipping-summary'));
        }
        toggle(['shipping-summary', 'shipping-update', 'shipping-form']);
      }
      break;
    case 'pay-submit':
      if (e.target.form.checkValidity()) {
        currentOrder.payment = (save(e.target.form.id, 'name'));
        e.preventDefault();
        $elSummary = $('<div>').text('Payment information has been saved').appendTo($('#payment-summary'));
        toggle(['payment-summary', 'payment-update', 'payment-form']);
      }
      break;
    case 'shipping-update':
      clear('shipping-summary');
      toggle(['shipping-summary', 'shipping-update', 'shipping-form']);
      break;
    case 'payment-update':
      clear('payment-summary');
      toggle(['payment-summary', 'payment-update', 'payment-form']);
      break;
    case 'order-btn':
      var shipping = document.getElementById('shipping-form');
      var payment = document.getElementById('payment-form');
      if (shipping.checkValidity() && payment.checkValidity()) {
        ordered();
        cart = [];
        $('#cart-count').text(cartCount());
        var $orderMsg = $('<div>').addClass('order-confirmation').text('Order has been placed successfully');
        $orderMsg.appendTo($('checkout-summary'));
      }
      break;
    default:
  }
});

function save(source, property) {
  var form = {};
  var $inputs = $( '#' + source ).find('input[name]');
  for (var i=0; i<$inputs.length; i++) {
    var key = $inputs[i].getAttribute(property);
    var value = $inputs[i].value;
    form[key] = value;
  }
  return form;
}

function validate(element) {
  if (!element.checkValidity()) {
    if(!element.classList.contains('form-input-invalid')) {
      element.classList.add('form-input-invalid');
    }
  }
  else {
    if (element.classList.contains('form-input-invalid')) {
      element.classList.remove('form-input-invalid');
    }
  }
}

function wholeMatch(search, fieldValue) {
  var whole = 0;
  search.forEach(function(result) {
    if (result === fieldValue) {
      whole++;
    }
  })
  return whole;
}

function partMatch(search, fieldValue) {
  var part = 0;
  var partSearch = search.map(function(element) {
    return element.slice(0,-1);
  })
  partSearch.forEach(function(result) {
    if (result === fieldValue) {
      part++;
    }
  })
  return part;
}

function subMatch(criteria, fieldValue) {
  var sub = 0;
  if (fieldValue.toLowerCase().indexOf(criteria.toLowerCase()) !== -1) {
    sub++;
  }
  return sub;
}

function relevancy(product, fields, criteria) {
  var search = criteria.split(' ');
  var relevancy = 0;

  fields.forEach(function(field, index) {
    if (typeof field === 'string') {
      var whole = wholeMatch(search, product[field]);
      if (whole === search.length) {
        relevancy += (10 / (index + 1));
      }
      else if (whole >= 1) {
        relevancy += (5 / (index + 1));
      }
      else if (whole > 0) {
        relevancy += (3 / (index + 1));
      }

      var part = partMatch(search, product[field]);
      if (part === search.length) {
        relevancy += (3 / (index + 1));
      }
      else if (part >= 1) {
        relevancy += (2 / (index + 1));
      }
      else if (part > 0) {
        relevancy += (1 / (index + 1));
      }
    }
    var sub = subMatch(criteria, product[field]);
      if (sub) {
        relevancy += sub;
      }
  })
  return relevancy;
}

function search(products, criteria) {
  var fields = ['name', 'description', 'brand', 'tags'];
  var matches = [];
  products.forEach(function(product) {
    var score = relevancy(product, fields, criteria);
    if (score) {
      var prod = product;
      prod.score = score;
      matches.push(prod)
    }
  })
  matches.sort(function(a, b) {
    return b.score - a.score;
  })
  searches.push({
    term: criteria,
    results: matches,
    time: new Date()
  })
  return matches;
}

function toCart(product, elements) {

  var size;
  if (elements.length > 1) {
    size = {};
    for (var i=0; i<elements.length; i++) {
      size[($(elements[i]).attr('data-size'))] = elements[i].value;
    }
  } else {
    size = elements[0].value;
  }

  var prod = Object.assign({}, product);
  if (cart.length === 0) {
    prod.quantity = 1;
    prod.size = size;
    cart.push(prod);
  }
  else {
    var found = false;
    for (var k=0; k<cart.length; k++) {
      if (prod.id === cart[k].id && _.isEqual(size, cart[k].size )) {
          found = true;
          cart[k].quantity++;
          break;
      }
    }
    if(!found) {
      prod.quantity = 1;
      prod.size = size;
      cart.push(prod);
    }
  }
  return cartCount(cart);
}

function cartCount() {
  var count = 0;
  cart.forEach(function(item) {
    count += parseInt(item.quantity);
  })
  return count;
}

function element(tagname, classes, text, attribute) {
  var el = document.createElement(tagname);
  if(typeof classes === 'object') {
    classes.forEach(function(className) {
      el.classList.add(className);
    })
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

function view(items, view, term) {
  var elItems = create(items, view);
  var elView = document.getElementById(view)
  var elContent = $( 'div[id=' + view + ']' ).find('.main')[0];
  switch (view) {
    case 'view-home':
      break;
    case 'view-search':
      var count = document.getElementById('result-count');
      count.textContent = elItems.length;
      var searchTerm = document.getElementById('result-term');
      searchTerm.textContent = term;
      break;
    case 'view-product':
      break;
    case 'view-cart':
      if(cart.length === 0) {
        var aside = document.getElementById('cart-aside')
        aside.classList.add('hidden');
        var empty = element('div', 'empty-message', 'Your cart is currently empty');
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
      if (orders.length > 0) {
        elContent.appendChild(element('div', 'hist-title', 'Order History'));
      } else {
        elContent.appendChild(element('h2', 'empty-message', 'You haven\'t placed any orders yet'))
      }
      break;
    default:
  }
  append(elContent, elItems);
  return elView;
}

function create(items, view) {
  var img;
  var name;
  var price;
  var descrip;
  var elItems = [];
  var elItem;
  if (Array.isArray(items)) {
    for (var i=0; i<items.length; i++) {
      if(view === 'view-search' || view === 'view-cart' || view === 'view-checkout') {
        img = element('img', '', '', ['src', items[i].img]);
        name = element('div', '', items[i].name);
        price = element('div', '', priceFormat(items[i].price));
        descrip = element('div', '', items[i].description);
        brand = element('div', '', items[i].brand);
        switch (view) {
          // case 'view-home':
          //   break;
          case 'view-search':
            img.classList.add('result-img');
            name.classList.add('result-name');
            price.classList.add('result-price');
            var resultText = element('div', 'result-text');
            append(resultText, [name, price]);
            var resultClick = element('div', 'result-click');
            resultClick.setAttribute('data-id', items[i].id);
            elItem = element('div', 'result');
            append(elItem, [img, resultText, resultClick]);
            break;
          case 'view-cart':
            img.classList.add('cart-img');
            name.classList.add('cart-name');
            price.classList.add('cart-price');
            brand.classList.add('cart-brand');
            var cartText = element('div', 'cart-text');
            append(cartText, [name, brand, price]);
            var $size = $('<div>');
            if (typeof items[i].size === 'object') {
              for (var prop in items[i].size) {
                if (prop === 'waist') {
                  $size.append(
                    $('<div>').addClass('cart-size').text('Waist:'),
                    $('<div>').addClass('cart-size').text(items[i].size[prop]))
                } else {
                  $size.append(
                    $('<div>').addClass('cart-size', 'cart-l').text('Length:'),
                    $('<div>').addClass('cart-size').text(items[i].size[prop]));
                }
              }
            } else {
              $size.append(
                $('<div>').addClass('cart-size').text('Size:'),
                $('<div>').addClass('cart-size').text(items[i].size)
              );
            }
            append(cartText, $size.get());
            var quantLabel = element('div', 'quant-label', 'Quantity');
            var quantSection = element('div', 'quant');
            append(quantSection, [quantLabel, quantBtn(items[i]), removeBtn(items[i])]);
            elItem = element('div', 'cart-item');
            append(elItem, [img, cartText, quantSection]);
            break;
          case 'view-checkout':
            img.classList.add('review-img');
            name.classList.add('review-name');
            price.classList.add('review-price');
            brand.classList.add('review-brand');
            var quantity = element('div', 'review-quant', 'Quantity: ' + items[i].quantity);
            var reviewText = element('div','review-text');
            var reviewSizes = element('div', 'review-sizes');
            if (typeof items[i].size !== 'object') {
              reviewSizes.textContent = 'Size: ' + items[i].size;
            } else {
              for (var props in items[i].size) {
                if (props === 'waist') {
                  reviewSizes.textContent += 'Waist: ' + items[i].size[props];
                } else {
                  reviewSizes.textContent +=  ' Length: ' + items[i].size[props];
                }
              }
            }
            append(reviewText, [name, brand, price, reviewSizes, quantity]);
            var subLabel = element('span', '', 'Subtotal: ');
            var subValue = element('span', 'review-sub-value', priceFormat(items[i].quantity * items[i].price));
            var sub = element('div', 'review-sub');
            append(sub, [subLabel, subValue])
            elItem = element('div', 'review');
            append(elItem, [img, reviewText, sub]);
            break;
          default:
        }
        elItems.push(elItem);
      }
      //history view uses an array of order objects with different properties than those above
      else {
        elItem = element('div', ['hist-order', 'col-md-9'], '');
        var date = element('div', 'hist-date');
        append(date, [
          element('div', 'hist-date-label', 'Order Submitted:'),
          element('div', 'hist-date-content', items[i].submitted.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}))
        ]);
        var total = element('div', 'hist-total');
        append(total, [
          element('div', 'hist-total-label', 'Total:'),
          element('div', 'hist-total-content',
          priceFormat(items[i].total)),
        ]);
        var summary = element('div', 'hist-summary');
        append(summary, [date, total]);
        append(elItem, summary);
        for (var k=0; k<items[i].contents.length; k++) {
          var item = element('div', 'hist-item');
          append(item, element('img', 'hist-item-img', '', ['src', items[i].contents[k].img]));
          var text = element('div', 'hist-item-text');
          append(text, [
            element('div', 'hist-item-name', items[i].contents[k].name),
            element('div', 'hist-item-price', priceFormat(items[i].contents[k].price))
          ]);
          append(item, text);
          append(elItem, item);
        }
        elItems.push(elItem);
      }
    }
    return elItems;
  }
  //product view only uses one object
  else {
    img = element('img', 'product-img', '', ['src', items.img]);
    name = element('div', 'product-name', items.name);
    price = element('div', 'product-price', priceFormat(items.price));
    descrip = element('div', 'product-descr', items.description);
    var brand = element('div', 'product-brand', items.brand);
    var sizes = sizeBtn(items, 'product');
    var cartBtn = element('button', 'add-cart-btn', 'Add to Cart', ['data-id', items.id]);
    var prodDetail = element('div', 'product-detail');
    append(prodDetail, [name, brand, price, sizes, descrip, cartBtn]);
    elItem = element('div', 'product-item');
    append(elItem, [img, prodDetail]);
    return elItem;
  }
}

function sizeBtn(item, view) {
  var sizes = item.sizes;
  var theSizes = element('div', view +'-size');
  if (Array.isArray(sizes)) {
    var theSizeLabel = element('div', view + '-size-label');
    theSizeLabel.textContent = 'Size:'
    var theSizeButton = element('select', view + '-size-btn');
    theSizeButton.setAttribute('data-size', 'size');
    sizes.forEach(function(size) {
      var theSize = document.createElement('option');
      theSize.setAttribute('value', size);
      theSize.textContent = size;
      theSizeButton.appendChild(theSize);
      append(theSizes, [theSizeLabel, theSizeButton]);
    })
  } else {
    for (var prop in sizes) {
      var theSizeLbl = element('div', view + '-size-label');
      var theSizeBtn = element('select', 'product-size-btn');
      if (prop === 'width') {
        theSizeLbl.textContent = 'Waist:';
        theSizeBtn.setAttribute('data-size', 'waist')
      } else {
        theSizeLbl.classList.add(view + '-size-length');
        theSizeLbl.textContent = 'Length:';
        theSizeBtn.setAttribute('data-size', 'length');
      }
      sizes[prop].forEach(function(size) {
        var theSize = document.createElement('option');
        theSize.setAttribute('value', size);
        theSize.textContent = size;
        theSizeBtn.appendChild(theSize);
      })
      append(theSizes, [theSizeLbl, theSizeBtn]);
    }
  }
  return theSizes;
}

function append(parent, children) {
  if(Array.isArray(children)) {
    children.forEach(function(child) {
      parent.appendChild(child);
    })
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
  // if (elViews.length > 0) {
    for (var i=0; i<elViews.length; i++) {
      elViews[i].classList.remove('active');
      elViews[i].classList.add('hidden');
    }
    nextView.classList.remove('hidden');
    nextView.classList.add('active');
  // }
}

function toggle(attribute) {
  var $elView;
  if (Array.isArray(attribute)) {
    attribute.forEach(function(attr) {
      $elView = $('#' + attr);
      if ($elView.hasClass('hidden')) {
        $elView.removeClass('hidden');
      }
      else {
        $elView.addClass('hidden');
      }
    })
  }
  else {
    $elView = $('#' + attribute);
    if ($elView.hasClass('hidden')) {
      $elView.removeClass('hidden');
    }
    else {
      $elView.addClass('hidden');
    }
  }
}

function priceFormat(num) {
  var numFormat = num.toLocaleString('en-US',{style: 'currency', currency: 'USD'});
  return numFormat;
}

function calculate(products) {
  var total =
    products.reduce(function(total, product) {
      return total + (product.price * 100) * product.quantity;
    }, 0)
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

function ordered() {
  currentOrder.total = 0;
  currentOrder.submitted = new Date();
  currentOrder.contents = [];
  cart.forEach(function(item) {
    currentOrder.contents.push(item);
    currentOrder.total += (item.quantity * item.price);
  })
  currentOrder.customer = customer;
  orders.push(currentOrder);
}

function sort(items, type) {
  switch(type) {
    case 'price (high to low)':
      items.sort(function compareLow(a, b) {
        return b.price - a.price;
      })
      break;
    case 'price (low to high)':
      items.sort(function compareHigh(a, b) {
        return a.price - b.price;
      })
      break;
    case 'relevance':
      items.sort(function compareRelevance(a, b) {
        return b.score - a.score
      })
      break;
    }
    return items;
}
