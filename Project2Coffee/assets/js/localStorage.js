const sampleCart = [
    {
        "index": 0,
        "image": "Blanka_Brewed.svg",
        "alt": "warm brewed espreso icon",
        "name": "Normal Brewed",
        "desc": "Oat Milk, Extra Shot, Iced",
        "price": "$1.50",
        "quantity": 1
    },

    {
        "index": 1,
        "image": "Blanka_Espresso_Iced.svg",
        "alt": "iced espresso icon",
        "name": "Normal Espresso",
        "desc": "2% Milk, Decaf, Iced, Marshmallows",
        "price": "$3.00",
        "quantity": 2
    }
];

//localStorage.setItem('cart', JSON.stringify(sampleCart));
if (localStorage.getItem('cart') == null) {
    localStorage.setItem('cart', '[]');
}


/**
 * Add the order to the local storage and move the user to the cart page
 */
const addToCart = function() {

    // get the drink type
    let h2 = document.body.getElementsByTagName('h2')[0];
    let pageTitle = h2.childNodes[0].nodeValue;
    drinkType = pageTitle.slice(10); // 10 is the number of charactors that 'Customize ' takes

    

    // gets the basic price and fills the item to local storage
     fetch('assets/js/menu.json')
     .then(response => {
         if (response.status == 200) {
             return response.json();
         } else {
             throw new Error("Bad things are happening, respnse status was not 200, it was: " + response.status);
         }
     })
     .then (d => {
         data = d;
         fillToLocalStorage(data, drinkType);
         
     })
     .catch (error => console.log("Error: " + error));


}

// use fetch to get the price of the drink
const fillToLocalStorage = function(data, drinkType) {

    // create object to fill in
    let order = {
        "id": "",
        "image": "",
        "alt": "",
        "name": "",
        "desc": "",
        "price": "",
        "quantity": 1
    }

    let price = 0;
    let desc = "";

    // get the basic price
    for (let i = 0, len = data.length; i < len; i++) {
        if (data[i].name == drinkType) {
            let rawPrice = data[i].price;
            price = parseFloat(rawPrice.slice(1));
            break;
        }
    }


    // get the info from local storage
    let currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
    if (currentOrder != null) {
        order.image = currentOrder.image;
        order.alt = currentOrder.temp + " " + drinkType + " icon";
        order.name = currentOrder.temp + " " + currentOrder.name + " " + drinkType;
        let tempPrice = currentOrder.price + price
        order.price =  "$" + tempPrice.toFixed(2);
        order.quantity = currentOrder.quantity;
        desc = currentOrder.desc;
    }

    // place auto fill values if they weren't overridden by user
    if (order.image == "") {
        order.image = "Blanka_" + drinkType + "_Hot.svg";
    }
    if (order.alt == "") {
        order.alt = "Hot Normal " + drinkType + " icon";
    }
    if (order.name == "") {
        order.name = "Hot Normal " + drinkType;    
    } 
    if (order.price == "") {
        order.price = "$" + price.toFixed(2);
    }


    // get rest of desc data

    // get milk
    let milk = document.getElementById('milk');
    let options = milk.getElementsByTagName('input');
    for (let i = 0, len = options.length; i < len; i++) {
        if (options[i].checked) {
            desc += options[i].value + ' Milk, ';
            break;
        }
    }

    // get sweetener
    let sweetener = document.getElementById('sweetener');
    desc += sweetener.value + "tsp Sweetener, ";

    // decaf
    let decaf = document.getElementById('decaf');
    if (decaf.checked) {
        desc += "Decaf, ";
    }

    // shots
    let shots = document.getElementById('shots');
    if (shots != null) {
        desc += shots.value + " Shots, ";
    }

    order.desc = desc.slice(0, desc.lastIndexOf(','));

    let cart = JSON.parse(localStorage.getItem('cart'));

    // set a unique id
    if (cart.length < 1) {
        // if it's the first order it is set as 1
        order.id = 0;
    } else {
        // if it's not the first order, its set as 1+ the last order
        order.id = cart[cart.length - 1].id + 1;
    }

    // add to the cart in storage
    cart.push(order);
    localStorage.setItem('cart', JSON.stringify(cart));

    // remove the currentOrder bc it's been processed
    localStorage.removeItem('currentOrder');

    // send them to cart page
    window.location.href = 'cart-details.html';

}

const deleteCart = function() {
    let blank = [];
    localStorage.setItem('cart', JSON.stringify(blank));
}
