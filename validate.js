
//Input mask for phone number
$('#ship-phone, #pay-phone').keydown(function(e) {
  var key = e.charCode || e.keyCode || 0;
  var $phone = $(this);
  if (key !== 8 && key !== 9) {
    if ($phone.val().length === 4) {
      $phone.val($phone.val() + ')');
    }
    if ($phone.val().length === 5) {
      $phone.val($phone.val() + ' ');
    }
    if ($phone.val().length === 9) {
      $phone.val($phone.val() + '-');
    }
  }
})

  .keyup(function(e) {
    var $phone = $(this);
      var key = e.charCode || e.keyCode || 0;
      if (key === 8) {
      if ($phone.val().length === 0) {
        $phone.val('(');
      }
    }
  })

  .on('focus click', function () {
    var $phone = $(this);
    if ($phone.val().length === 0) {
      $phone.val('(');
    }
    else {
      var val = $phone.val();
      $phone.val('').val(val);
    }
  })

  .blur(function () {
    var $phone = $(this);
    if ($phone.val() === '(') {
      $phone.val('');
    }
  });

//Input mask for credit card
$('#pay-cc-number').keydown(function(e) {
var key = e.charCode || e.keyCode || 0;
var $creditCard = $(this);
if (key !== 8 && key !== 9) {
  if ($creditCard.val().length === 4) {
    $creditCard.val($creditCard.val() + ' ');
  }
  if ($creditCard.val().length === 9) {
    $creditCard.val($creditCard.val() + ' ');
  }
  if($creditCard.val().length === 14) {
    $creditCard.val($creditCard.val() + ' ');
  }
}
})

.on('focus click', function () {
  var $creditCard = $(this);

  if($creditCard.val() !='') {
    var val = $creditCard.val();
    $creditCard.val('').val(val);
  }
})

.blur(function () {
  var $creditCard = $(this);
  if ($creditCard.val() === '(') {
    $creditCard.val('');
  }
});

//Input mask for expiration date
$('#pay-expire').keyup(function (e) {
var key = e.charCode || e.keyCode || 0;
var $expire = $(this);
if (key !== 8 && key !== 9) {
  if ($expire.val().length === 2) {
    $expire.val($expire.val() + '/');
  }
}
})

.on('focus click', function () {
  var $expire = $(this);

  if($expire.val() !='') {
    var val = $expire.val();
    $expire.val('').val(val);
  }
})

.blur(function () {
  var $expire = $(this);
  if ($expire.val() === '(') {
    $expire.val('');
  }
})
