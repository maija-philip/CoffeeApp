// ###### MENU ######

/**
 * Gets the data and preloads the MENU page to dynamically display menu items
 */
const startMenu = function() {

    // get the menu data and display it
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
        for (let i = 0, len = data.length; i < len; i++) {
            displayMenuItem(data[i]);
        }
    })
    .catch (error => console.log("Error: " + error));

    // count how many cart items and display number
    let cart = JSON.parse(localStorage.getItem('cart'));

    let myBasketBtn = document.getElementById('myBasket');
    console.log(cart.length);
    myBasketBtn.setAttribute('data-value', cart.length);
}

/**
 * Creates and fills a card with the data from the item
 * 
 * @param {ItemObj} item - item from JSON file
 */
const displayMenuItem = function(item) {
    // create card
    let card = document.createElement('div');
    card.className = 'card';
    card.setAttribute("onclick", "location.href='customize.html#"+ item.name + "'");

    // create img
    let img = document.createElement('img');
    img.setAttribute('src', 'assets/media/' + item.image);
    img.setAttribute('alt', item.alt);
    card.appendChild(img);

    // create item info
    let div = document.createElement('div');
    let name = document.createElement('h3');
    let desc = document.createElement('p');
    let price = document.createElement('p');

    // fill info
    name.appendChild(document.createTextNode(item.name));
    desc.appendChild(document.createTextNode(item.desc));
    desc.className = 'grey';
    price.appendChild(document.createTextNode(item.price));

    // compile info
    div.appendChild(name);
    div.appendChild(desc);
    div.appendChild(price);

    // add to page
    card.appendChild(div);
    document.getElementsByTagName('main')[0].appendChild(card);

}




// ###### CART ######


/**
 * Sets of the Cart page and displays the items in the cart
 */
const startCart = function() {

    let stringCart = localStorage.getItem('cart');
    let cart = JSON.parse(stringCart);
    let len = cart.length;
    
    if (len < 1) {
        // display empty cart message
        let message = document.createElement('p');
        message.appendChild(document.createTextNode('You have nothing in your cart'));

        // add it to checkout box
        let box = document.getElementById('checkoutInfo');
        box.appendChild(message);

        // make checkout unclickable
        let checkoutBtn = document.getElementById('checkoutBtn');
        checkoutBtn.disabled = false;

    } else {
        for (let i = 0; i < len; i++) {
            displayCartItem(cart[i]);
        }
    
        displayCheckoutInfo(cart);
    }
    
}

/**
 * Creates and fills a card with the data from the item
 * @param {ItemObj} item - cart order data to display
 */
const displayCartItem = function(item) {
    // create card
    let card = document.createElement('div');
    card.className = 'card cart-card';

    // create coffee img
    let img = document.createElement('img');
    img.setAttribute('src', 'assets/media/' + item.image);
    img.setAttribute('alt', item.alt);
    card.appendChild(img);

    // create item info
    let div = document.createElement('div');
    let name = document.createElement('h3');
    let desc = document.createElement('p');
    let price = document.createElement('p');

    // fill info
    name.appendChild(document.createTextNode(item.name));
    desc.appendChild(document.createTextNode(item.desc));
    desc.className = 'grey';
    price.appendChild(document.createTextNode(item.price));
    price.className = 'price'

    // compile info
    div.appendChild(name);
    div.appendChild(desc);
    card.appendChild(div);
    card.appendChild(price);

    // create edit/delete icons
    let editIcon = document.createElement('img');
    let deleteIcon = document.createElement('img');

    editIcon.setAttribute('src', 'assets/media/Material_Edit.svg');
    editIcon.setAttribute('alt', 'edit icon');
    editIcon.className = 'icon';
    deleteIcon.setAttribute('src', 'assets/media/Material_X.svg');
    deleteIcon.setAttribute('alt', 'delete icon');
    deleteIcon.setAttribute('onclick', 'removeCartItem(this, ' + item.id + ')');
    deleteIcon.className = 'icon';


    // createQuantity
    let container = document.createElement('div');
    let quantity = document.createElement('p');
    let plus = document.createElement('span');
    let minus = document.createElement('span');

    plus.appendChild(document.createTextNode("+"));
    plus.setAttribute('onclick', 'changeQuantity(this, true)');
    minus.appendChild(document.createTextNode("-"));
    minus.setAttribute('onclick', 'changeQuantity(this, false)');

    quantity.appendChild(minus);
    quantity.appendChild(document.createTextNode(item.quantity));
    quantity.appendChild(plus);
    container.appendChild(quantity);
    container.className = 'quantity';

    // add second row to card
    //card.appendChild(editIcon);
    card.appendChild(document.createElement('div')); // for a blank edit spot
    card.appendChild(container);
    card.appendChild(deleteIcon);

    // add to page
    document.getElementById('cartContent').appendChild(card);
}

/**
 * Removes the element the x was clicked on
 * @param {imgDOM Element} removeBtn - the button clicked on the element to remove
 */
const removeCartItem = function(removeBtn, index) {
    // remove from the page
    let parentItem = removeBtn.parentElement;
    parentItem.remove();

    // remove from cart
    let newCart = [];
    let cart = JSON.parse(localStorage.getItem('cart'));

    for (let i = 0, len = cart.length; i < len; i++) {
        if (cart[i].id != index) {
            newCart.push(cart[i]);
        }
    }

    localStorage.setItem('cart', JSON.stringify(newCart));
    window.location.reload();
}

/**
 * Displays the checkout info with subtotal, tax, and total
 * Adds the total to the button text
 */
const displayCheckoutInfo = function(cart) {

    let price = 0.00;
    const NYSTATESALESTAX = 0.04;
    let tax = 0.0;
    let total = 0.0;

    // add up the drink prices
    for (let i = 0, len = cart.length; i < len; i++) {
        let itemPrice = cart[i].price;
        price += parseFloat(itemPrice.slice(1));
    }

    tax = NYSTATESALESTAX * price;
    total = tax + price;
    

    // create strings to display
    let subtotalString = "Subtotal $" + price.toFixed(2);
    let taxString = "Tax $" + tax.toFixed(2);
    let totalString = "Total $" + total.toFixed(2);


    // create p elements with checkout info
    let subtotalInfo = document.createElement('p');
    subtotalInfo.appendChild(document.createTextNode(subtotalString));
    let taxInfo = document.createElement('p');
    taxInfo.appendChild(document.createTextNode(taxString));
    let totalInfo = document.createElement('p');
    totalInfo.appendChild(document.createTextNode(totalString));

    // put on the page
    let box = document.getElementById('checkoutInfo');
    box.appendChild(subtotalInfo);
    box.appendChild(taxInfo);
    box.appendChild(totalInfo);

    // add to the checkout button
    let checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.disabled = false;
    checkoutBtn.childNodes[0].nodeValue = 'Checkout $' + total;

}


/**
 * 
 * @param {SpanDOM ELement} sign - the element clicked
 * @param {Boolean} isAdd - if we are adding or subtracting
 */
const changeQuantity = function(sign, isAdd) {
    let quantityP = sign.parentElement;
    let quantityValue = quantityP.childNodes[1];
    
    // check to see if we should add or subtract
    if (isAdd) {
        quantityValue.nodeValue = parseInt(quantityValue.nodeValue) + 1;
    } else {
        let newVal = parseInt(quantityValue.nodeValue) - 1
        
        // check to see if it's under zero
        if (newVal < 1) {
            // if 0 or less, remove item
            quantityValue.nodeValue = 0;
            console.log("remove item");
        } else {
            // if 1 or above, display
            quantityValue.nodeValue = newVal;
        }
    }
}






