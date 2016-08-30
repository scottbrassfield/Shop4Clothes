//capture content section of page in variable
var content = document.getElementById('content');
var matches = [];
var matchProperties = ['name', 'description', 'category',];

//create event listeners for search
var searchTerm = document.getElementById('search-bar');
var searchBtn = document.getElementById('search-btn')
  //event listener for search term
searchTerm.addEventListener('keyup',function(e) {
  if (e.which === 13 || e.keyCode === 13) {
    search();
  }
})
  //event listener for search button
searchBtn.addEventListener('click', search);

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
    var img = document.createElement('img');
    img.src = obj.img;
    img.classList.add('result-img')

    var name = document.createElement('div');
    name.textContent = obj.name;
    name.classList.add('result-name');

    var descr = document.createElement('div');
    descr.textContent = obj.description;
    descr.classList.add('result-descr');

    var resultText = document.createElement('div');
    resultText.classList.add('result-text');

    var result = document.createElement('div');
    result.classList.add('result', 'col-md-9');

    resultText.appendChild(name);
    resultText.appendChild(descr);
    result.appendChild(img);
    result.appendChild(resultText);

    return result;
}
