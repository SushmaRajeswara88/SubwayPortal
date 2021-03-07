var selectElement = document.getElementById('store-id');
var storeDataArr = [];
var container = document.getElementById('container-grid');
var containerNonSub = document.getElementById('container-grid-nonSub');
var nonSubsTabActive = false;
var selectedRestaurantNumber;
var noProducts = false;

window.addEventListener('load', (event) => {
    function getStoreData(url, cb) {
      var obj;
      fetch(url)  
      .then(result => result.json())
      .then(data => obj=data)
      .then(() => cb(obj))
    }
    getStoreData('http://performancetestdmb.azurewebsites.net/api/getallrestaurants', getData);

    function getData(storeData) {
        storeDataArr = storeData;
        for(let i=0; i < storeData.length; i++) {
          var store = document.createElement('option');
          store.innerText = storeData[i].RestaurantName;
          store.value = storeData[i].RestaurantNumber;  
          selectElement.appendChild(store);
        }
        selectedRestaurantNumber = storeData[0].RestaurantNumber;
        var category = 'Category1'; 
        
        getProductData('http://performancetestdmb.azurewebsites.net/api/products/' + selectedRestaurantNumber+ '/' + category)
        .then(function(response) {
          createSubsTab(response);
        }) 
    };
});

//select element onchange

selectElement.addEventListener('change', function(ev) {
  selectedRestaurantNumber = ev.target.value;
  var category = nonSubsTabActive? 'Category2' : 'Category1'; 
  
  getProductData('http://performancetestdmb.azurewebsites.net/api/products/' + selectedRestaurantNumber+ '/' + category)
  .then(function(response) {
    createSubsTab(response);
  }) 
});

function getProductData(url) {
  return fetch(url)  
  .then(result => result.json())
  .then(data => data)
}

function createSubsTab(prodData) {
  container.innerHTML = '';
  containerNonSub.innerHTML = '';
  //header
  var itemHeader = document.createElement('div');
  itemHeader.classList.add('item-header');

  let itemHeaderProduct = document.createElement('div');
    itemHeaderProduct.classList.add('item-child');
    itemHeaderProduct.innerText = 'Product Name';
    itemHeader.appendChild(itemHeaderProduct);

  for(let i=0; i < prodData.Headers.length; i++) {
    let itemHeaderVal = document.createElement('div');
    itemHeaderVal.classList.add('item-child');
    itemHeaderVal.innerText = prodData.Headers[i];
    itemHeader.appendChild(itemHeaderVal);
  }
  if(prodData.Headers.length === 0) {
    if (!nonSubsTabActive) {
      let itemHeaderSixInch = document.createElement('div');
      itemHeaderSixInch.classList.add('item-child');
      itemHeaderSixInch.innerText = 'Subway 6-Inch';

      let itemHeaderFoot = document.createElement('div');
      itemHeaderFoot.classList.add('item-child');
      itemHeaderFoot.innerText = 'Subway Footlong';
      itemHeader.appendChild(itemHeaderSixInch);
      itemHeader.appendChild(itemHeaderFoot);
  } else {
      let itemHeaderStandard = document.createElement('div');
      itemHeaderStandard.classList.add('item-child');
      itemHeaderStandard.innerText = 'Standard';
      itemHeader.appendChild(itemHeaderStandard);
    }
  }
  
    if (!nonSubsTabActive) {
      container.appendChild(itemHeader);
    } else {
      containerNonSub.appendChild(itemHeader);
    }
    if(prodData.productViewModels.length === 0) {
      noProducts = true;
      let message = document.createElement('div');
      message.classList.add('no-products');
      message.innerText = 'No products found';
      if (!nonSubsTabActive) {
        container.appendChild(message);
      } else {
        containerNonSub.appendChild(message);
      }
    } 
    for(let i=0; i < prodData.productViewModels.length; i++) {
      noProducts = false;
      let item = document.createElement('div');
      item.classList.add('item');

      let name = document.createElement('div');
      name.classList.add('name');
      name.innerText = prodData.productViewModels[i]['Name'];
      
      let input1 = document.createElement('div');
      name.classList.add('input1');

      let inputBox1 = document.createElement('input');
      inputBox1.type = 'number';
     
      if (!nonSubsTabActive) {
        inputBox1.value = prodData.productViewModels[i]['SixInchPrice'];
      } else {
        inputBox1.value = prodData.productViewModels[i]['StandardPrice'];
      }
      input1.appendChild(inputBox1);
      item.appendChild(name);
      item.appendChild(input1);

      if (!nonSubsTabActive) {
        var input2 = document.createElement('div');
        name.classList.add('input1');

        let inputBox2 = document.createElement('input');
        inputBox2.type = 'number'
        inputBox2.value = prodData.productViewModels[i]['FootLongPrice'];
        input2.appendChild(inputBox2);
        item.appendChild(input2);
      }
      if (!nonSubsTabActive) {
        container.appendChild(item);
      } else {
        containerNonSub.appendChild(item);
      }      
    }
    $('input').before('<span>$</span>');
}

$('.nav-link').click(function(ev) {
  var id= $(this).attr('data_id');
  if (id== '2') {
    nonSubsTabActive = true;
    
  } else if (id='1') {
    nonSubsTabActive = false;
  }
  let category = nonSubsTabActive? 'Category2' : 'Category1'; 
  getProductData('http://performancetestdmb.azurewebsites.net/api/products/' + selectedRestaurantNumber+ '/' + category)
  .then(function(response) {
    createSubsTab(response);
  }); 
});

function submit() {
  if (noProducts) {
    alert('No products to submit');
  } else {
  alert('Data submitted succesfully');
  }
}

function reset() {
  var allInputs = document.getElementsByTagName('input');
  for (let i=0; i < allInputs.length; i ++) {
    allInputs[i].value = '';
  }
}





