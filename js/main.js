// Defining properties
    //Search Properties
    const result = document.getElementById('result');
    const search = document.getElementById('search');
    const cartBtn = document.querySelector('.addCart');
    //Cart Prope
    const cart = document.getElementById('cart');
    const itemElements = [];
    // Total
    const amounts = document.getElementById('amounts');
    const total = document.getElementById('total');
    //Cart items constructor
    function ItemElement(name,price,img){
        this.name = name;
        this.price = price;
        this.img = img;
    }

//Address　Properties
    const editBtn = document.getElementById('editAddress');
    const defaultAddress = document.getElementById('defaultAddress');
    const hideAddress = document.getElementById('hideAddress');
    let address = document.getElementById('address');
    const updateBtn = document.getElementById('addressUpdate');
    const textAddress = document.getElementById('textAddress');
    const contents = document.querySelectorAll('.contents'); 

    // News Properties
    const news = document.getElementById('news');
    const seeMore = document.getElementById('seeMore');
    const articles = document.querySelectorAll('#news .row');
    const descriptions = [...document.querySelectorAll('.description')];
    const texts = descriptions.map(description => {
        return description.textContent;
    });
    // UI Constructor
    function UI(){}
    
    //Loading Event
    loadEventListeners();
    // Add Event
    function loadEventListeners(){
        search.addEventListener('keyup',filterSearch);
        editBtn.addEventListener('click',editAddress);
        updateBtn.addEventListener('click',updateAddress);
        cart.addEventListener('click',removeProduct);
        cart.addEventListener('click',increaseOrDe);
        news.addEventListener('click',readMore);
        
    }

//Methods
let current = 0;
const images = document.querySelectorAll('.carImg');

    //Hero-Carousel
    setInterval(() =>{
        images[current].style.opacity = 0;
        current += 1; 
        if(current === images.length){
            current = 0;
        }
        images[current].style.opacity = 1;
        
    },5000);

//Update Addreess Localstorage
 function updateLocalStorage(){
// Address 
     const addressInfo = localStorage.getItem('addressInfo');
     if(addressInfo !== null){
        address.innerText = addressInfo;
     }
//Amounts and Price  
    const getAmounts = localStorage.getItem('amounts');
    const getPrice = localStorage.getItem('price');

    if(getAmounts !== null){
        amounts.innerText = getAmounts;
        total.innerText = getPrice;         
        // console.log(getAmounts);
    }
    // Cart Items
    const cartItems = JSON.parse(localStorage.getItem('cartItems'));
    if(cartItems !== null && cartItems.length > 0){
        cartItems.forEach(cartItem => {

    const name = cartItem.name,
          price = cartItem.price,
          img = cartItem.img;

      // Initiate cart
      const itemElement = new ItemElement(name,price,img);             

      compactCart(itemElement);
     
        });       
    }else{
        console.log('There are no items in your cart');
    } 
 }

//Edit Address
function editAddress(e){
    defaultAddress.style.display = 'none';
    hideAddress.style.display = 'block';
    textAddress.value = address.textContent;        
    e.preventDefault();
}

//Update Address
function updateAddress(){
    defaultAddress.style.display = 'block';
    hideAddress.style.display = 'none';
    address.innerText = textAddress.value;
    localStorage.setItem('addressInfo',textAddress.value);
}   

// Decrease & Increase Methods
    //Decrease number of cart contents
    function decreaseNumber(name){
        const cartContents = document.querySelectorAll('.cartContent');

        cartContents.forEach(cartContent => {
            if(name === cartContent.querySelector('.cartProductName').textContent){
                // Current amount num
                let num = +cartContent.querySelector('.amount').textContent;
                //Increase num 
                num -= 1;
                // Inner Text to update num
                cartContent.querySelector('.amount').innerText = num;
            }
        });
    }
    //Increase number of cart contents 
    function increaseNumber(name){
        const cartContents = document.querySelectorAll('.cartContent');
        
        cartContents.forEach(cartContent => {
            if(name === cartContent.querySelector('.cartProductName').textContent){
                // Current amount num
                let num = +cartContent.querySelector('.amount').textContent;
                //Increase num
                num += 1;
                // Inner Text to update num
                cartContent.querySelector('.amount').innerText = num;
            }
        });

        // Update total amounts and price
        updateTotal();
    }

    // Increase Or Decrease cart Item for Arrow Icon
    function increaseOrDe(e){
        const burger = e.target;
        // Get elements
        const name = burger.closest('.row').querySelector('.cartProductName').textContent,
        price = burger.closest('.row').querySelector('.cartProductPrice').textContent,
        img = burger.closest('.row').querySelector('img').src;

        // Initiate ItemElement
        const itemElement = new ItemElement(name,price,img);

       if(e.target.classList.contains('increase')){
         increaseNumber(burger.closest('.row').querySelector('.cartProductName').textContent);

         itemElements.push(itemElement);
       }

       if(burger.classList.contains('decrease')){
           if(burger.closest('.row').querySelector('.amount').textContent < 2){
            // Remove value and element from arr 
            removeValueFromArr(burger);
           }else{
            decreaseNumber(burger.closest('.row').querySelector('.cartProductName').textContent);
            //Remove a value from arr
            itemElements.splice(itemElement,1);
           }

       }
        //Save Item to LS
        localStorage.setItem('cartItems',JSON.stringify(itemElements));

        // Update total amounts and price
        updateTotal();
    }

   //Update total counts
   function updateTotal(){

    let sum = 0;
    itemElements.forEach(itemElement => {
      const  elementNum = +itemElement.price;
      sum += elementNum;
        
    });
    const productsCount = itemElements.length;
    amounts.innerText = productsCount;
    total.innerText = sum;
    //Set & Get LocalStorage 
    localStorage.setItem('amounts',productsCount);
    localStorage.setItem('price',sum);
    
}


//Filter method
function filterSearch(e){
    const formValue = e.target.value.toLowerCase();

    document.querySelectorAll('.collection-item').forEach(function(product){
        const name = product.querySelector('.name').textContent;
        
        if(name.toLowerCase().indexOf(formValue) != -1){
            product.style.display = 'block';
        }else{
            product.style.display = 'none';
        }

    });
}

// Compact cart amounts
function compactCart(items){
    // Initiate UI
    const ui = new UI();
        
    let alreadyInCart = false;
    itemElements.forEach(element => {
        if(element.name === items.name){
          alreadyInCart = true;
        }
      });
    if(itemElements !== null && alreadyInCart === true){
        increaseNumber(items.name);
    }else{
        // Add elements to cart
        ui.addItemTocart(items);   
    }
     // Add to arr
    itemElements.push(items);

    // Update total amounts and price
    updateTotal();

    //Save Item to LS
    localStorage.setItem('cartItems',JSON.stringify(itemElements));

}

// Eventlistener for adding item
result.addEventListener('click',e => {

    const burger = e.target;
    // Get elements
    const name = burger.closest('.row').querySelector('.name').textContent,
          price = burger.closest('.row').querySelector('.price').textContent,
          img = burger.closest('.row').querySelector('img').src;

    // Initiate cart
    const itemElement = new ItemElement(name,price,img);

    if(burger.classList.contains('material-icons')){

        compactCart(itemElement);
    }
});

 //Add to cart
 UI.prototype.addItemTocart = itemElement => {
    // Create li element
    const li = document.createElement('li');
    // Insert cols
      li.className = 'collection-item cartContent';

      li.innerHTML = `
      <div class="row">
          <div class="col s12 m3 img"><img src="${itemElement.img}" alt="${itemElement.name}" class="circle responsive-img"></div>
          <div class="col s6 m4 cartProductName">${itemElement.name}</div>
          <div class="col s6 m1">$<span class="cartProductPrice">${itemElement.price}</span></div>
          <div class="col s12 m3">
              <div class="forFlex">
                  <a><i class="small material-icons increase">keyboard_arrow_up</i></a>
                  x <div class="amount">1</div>
                  <a><i class="small material-icons decrease">keyboard_arrow_down</i></a>
              </div>
          </div>
      　  <div class="col s12 m1"><a class="remove"><i class="material-icons">close</i></a></div>
      </div>
      `;

      cart.appendChild(li);
}

function removeProduct(e){
if(e.target.parentElement.classList.contains('remove')){
    removeValueFromArr(e.target);
}
e.preventDefault();
}

function removeValueFromArr(target){
   target.closest('.collection-item').remove();
   const items = itemElements.filter(itemElement => target.closest('.row').querySelector('.cartProductName').textContent !== itemElement.name);
   itemElements.length = 0;
   itemElements.push.apply(itemElements,items);
}

// News Section
function textCut(){
var count = 150;
descriptions.forEach(description =>{
    const text = description.textContent;
   if(text.length > count){
      description.innerText = `${text.slice(0,150)} ...`;
   };
});
}

function readMore(e){
if(e.target.classList.contains('readBtn')){
    const description = e.target.parentElement.querySelector('.description');

   texts.forEach(text =>{
       if(description.textContent === `${text.slice(0,150)} ...`){
           description.innerText = text;
       }else if(description.textContent === text){
        description.innerText = `${text.slice(0,150)} ...`;
       }
   });
    }
}

function hideArticles(){
var i;
for(i = 3; i < articles.length; i++){
     articles[i].classList.add('hide-articles') 
}
}

seeMore.addEventListener('click',() => {
var i;
for(i = 3; i < articles.length; i++){
     articles[i].classList.toggle('hide-articles') 
}
});

// Default be Implemented

// Text slice -line 205
textCut();
// Hide articles -line
hideArticles();
//Get Item from Local Storage
updateLocalStorage();

