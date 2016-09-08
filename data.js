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

var products = [
  {
    id: 'p001',
    category: 'Sporting Goods',
    name:'Schwinn Mark V Bike',
    description:'Schwinn\'s Mark V is a full-dress cruiser that nails the number one reason we ride bikes: fun. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    price: 150,
    img:'http://sicklerbikes.com/images/library/zoom/schwinn_MARV26_SND_13_z.jpg'
  },
  {
    id: 'p002',
    category: 'Electronics',
    name:'Sandisk 32GB USB Drive ',
    description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    price: 32.75,
    img:'#'
  },
  {
    id: 'p003',
    category: 'Car',
    name:'Honda Civic',
    description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    price: 15827,
    img:'#'
  },
  {
    id: 'p004',
    category: 'Clothing and Accessories',
    name:'Tom Ford square-rim glasses',
    description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    price: 119.85,
    img:'#'
  },
  {
    id: 'p005',
    category: 'Electronics',
    name:'13 in MacBook Pro',
    description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    price: 1300,
    img:'#'
  },
  {
    id: 'p006',
    category: 'Electronics',
    name:'15 in Dell Ultrabook',
    description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    price: 999.99,
    img:'#'},
  {
    id: 'p007',
    category: 'Electronics',
    name:'12 in Lenovo Thinkpad',
    description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    price: 850,
    img:'#'},
  {
    id: 'p008',
    category: 'School and Office Supplies',
    name:'1 ream of paper',
    description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    price: 1.27,
    img:'#'
  },
  {
    id: 'p009',
    category: 'Clothing and Accessories',
    name:'Nike Roshe Running Shoes',
    description:'Made for both running and everyday use. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    price: 95.50,
    img:'http://images.nike.com/is/image/DotCom/511881_A_V2?&$img=511881_023_A_PREM&$PDP_HERO$'
  },

  {
    id: 'p011',
    category: 'Clothing and Accessories',
    name:'Vans High-Tops',
    description:'Classic pair of shoes from Vans. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    price: 44.95,
    img:'http://images.vans.com/is/image/Vans/QG36BT-HERO?$583x583$'
  },
  {
    id: 'p012',
    category: 'Sporting Goods',
    name:'Basketball',
    description:'Spalding indoor-outdoor basketball. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    price: 27.00,
    img:'http://thumbs1.ebaystatic.com/d/l225/m/m9jsV41Jk7HU6fBkgyd9W-g.jpg'
  }
]
