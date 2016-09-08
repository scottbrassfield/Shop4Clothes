
//Input mask for phone number
$( document ).ready(function() {
  $('#ship-phone, #pay-phone').keydown(function (e) {
    var key = e.charCode || e.keyCode || 0;
    $phone = $(this);
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

    .on('focus click', function () {
      $phone = $(this);
      if ($phone.val().length === 0) {
        $phone.val('(');
      }
      else {
        var val = $phone.val();
        $phone.val('').val(val);
      }
    })

    .blur(function () {
      $phone = $(this);
      if ($phone.val() === '(') {
        $phone.val('');
      }
    });
})


$('#pay-cc-number').keydown(function (e) {
  var key = e.charCode || e.keyCode || 0;
  $creditCard = $(this);
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
    $creditCard = $(this);

    if($creditCard.val() !='') {
      var val = $creditCard.val();
      $creditCard.val('').val(val);
    }
  })

  .blur(function () {
    $creditCard = $(this);
    if ($creditCard.val() === '(') {
      $creditCard.val('');
    }
  });

//Input mask for
