// ########    SET UP    ########

/**
 * Sets up the customize page
 *      - sets the header to the specific drink
 *      - sets the images to the specific drink
 *      - fills in the basic drink options
 *      - removes shots for Brewed
 */
const setUpCustomize = function() {

    // get the drink type from the link address parameter
    let link = window.location.href;
    let drinkType = link.slice(link.indexOf('#')+1);

   // add to header
   let h2 = document.getElementsByTagName('h2')[0];
   h2.childNodes[0].nodeValue = 'Customize ' + drinkType;

   // make size images the right drink
   let sizeBlock = document.getElementById('size');
   let imgs = sizeBlock.getElementsByTagName('img');
   for (let i = 0, len = imgs.length; i < len; i++) {
        imgs[i].setAttribute('src', 'assets/media/Blanka_' + drinkType + '.svg');
        imgs[i].setAttribute('alt', 'icon for ' + drinkType);
   }

   // make the temperature images the right drink
   let temperatureBlock = document.getElementById('termperature');
   imgs = temperatureBlock.getElementsByTagName('img');
    
   // iced
   imgs[0].setAttribute('src', 'assets/media/Blanka_' + drinkType + '_Iced.svg');
   imgs[0].setAttribute('alt', 'icon for iced ' + drinkType);
   // warm
   imgs[1].setAttribute('src', 'assets/media/Blanka_' + drinkType + '.svg');
   imgs[1].setAttribute('alt', 'icon for warm ' + drinkType);
   // hot
   imgs[2].setAttribute('src', 'assets/media/Blanka_' + drinkType + '_Hot.svg');
   imgs[2].setAttribute('alt', 'icon for hot ' + drinkType);

   fillBasicDrinkOptions();

   // change shots for brewed
   if (drinkType == "Brewed") {
    let shots = document.getElementById('shotsBlock');

    // change the section name
    let h2 = shots.getElementsByTagName('h2')[0];
    h2.childNodes[0].nodeValue = "Strength";

    // remove the div and input
    shots.getElementsByTagName('input')[1].remove();
    shots.getElementsByTagName('div')[0].remove();

   }

   // set up local storage and fill if exists
   setUpLocalStorageForCustomize();
}

/**
 * Selects the default drink options on the customize page
 */
const fillBasicDrinkOptions = function() {
    // select normal size
    let size = document.getElementById('size');
    let normal = size.getElementsByTagName('div')[0];
    normal.style.backgroundColor = "var(--theme-brown)";

    // select whole milk
    let wholeMilk = document.getElementById('whole');
    wholeMilk.checked = true;

    // select 2tsp sweetener
    let sweetener = document.getElementById('sweetener');
    sweetener.value = 2;

    // select hot
    let temperature = document.getElementById('termperature');
    let hot = temperature.getElementsByTagName('div')[2];
    hot.style.backgroundColor = "var(--theme-brown)";

    // select 1 shot
    let shots = document.getElementById('shots');
    shots.value = 1;
}


/**
 *  Checks to make sure that there is a current order and gives or creates one
 * @returns current order object from local storage
 */
const setUpLocalStorageForCustomize = function() {
    
    // if current order doesn't exist in local storage, create it and return
    if (!localStorage.getItem('currentOrder')) {
        let order = {
            "id": "",
            "image": "",
            "alt": "",
            "temp": "",
            "name": "",
            "desc": "",
            "price": 0,
            "quantity": 1
        }
        localStorage.setItem('currentOrder', JSON.stringify(order));
        return;
    }

    // if it does exist, select so that it matches the order
    let order = JSON.parse(localStorage.getItem('currentOrder'));

    // set size selection
    if (order.name != "") {
        const size = document.getElementById('size');
        if (order.name == "Grande") {
            selectOption(size.children[1]);
        }
        else {
            selectOption(size.children[2]);
        }
    }
    
    // select temp selection
    if (order.temp != "") {
        const temp = document.getElementById('termperature');
        if (order.temp == 'Iced') {
            selectOption(temp.children[0]);
        }
        else if (order.temp == 'Warm') {
            selectOption(temp.children[1]);
        }
        else {
            selectOption(temp.children[2]);
        }
    }

    // select add ons section
    let desc = order.desc;
    if (desc != "") {
        const clickedAddOns = desc.split(', ');
        const addOn = document.getElementById('addOns');

        if (clickedAddOns.includes('Whipped Cream')){
            selectOptionAddOn(addOn.children[0]);
        }
        if (clickedAddOns.includes('Cinnamon')){
            selectOptionAddOn(addOn.children[1]);
        }
        if (clickedAddOns.includes('Marshmallows')){
            selectOptionAddOn(addOn.children[2]);
        }
        if (clickedAddOns.includes('Chocolate Flavor')){
            selectOptionAddOn(addOn.children[3]);
        }
        if (clickedAddOns.includes('Vanilla Flavor')){
            selectOptionAddOn(addOn.children[4]);
        }
        if (clickedAddOns.includes('Caramel Flavor')){
            selectOptionAddOn(addOn.children[5]);
        }
    }

   // fill the quantity
   let quantity = document.getElementById('quantcust');
   quantity.children[0].childNodes[1].nodeValue = order.quantity;
}






// ########    SELECTIONS    ########

/**
 * Selects the chosen option and makes background dark, unselecting all other options
 * @param {FigureDOMObject} figure - the clicked figure
 */
const selectOption = function(figure) {

    // turn them all white
    let parent = figure.parentElement;
    let figures = parent.getElementsByTagName('figure');

    for (let i = 0, len = figures.length; i < len; i++) {
        figures[i].getElementsByTagName('div')[0].style.backgroundColor = 'var(--white)';
    }

    // change clicked to brown
    let img = figure.getElementsByTagName('div')[0];
    img.style.backgroundColor = "var(--theme-brown)";

    // add to the current order if there is one, otherwise make one
    let order = JSON.parse(localStorage.getItem('currentOrder'));

    // find out which section we are filling
    let sectionName = parent.id;
    if (sectionName == 'size') {
        let orderName = figure.getElementsByTagName('figcaption')[0];

        // check to see if it has a price attatched
        if (orderName.childNodes[0].nodeValue != 'Normal') {
            let priceString = orderName.childNodes[2].nodeValue;
            order.price = parseFloat(priceString.slice(priceString.indexOf('$') + 1));
        }
        else {
            order.price = 0;
        }
        order.name = orderName.childNodes[0].nodeValue;

    } else if (sectionName == 'termperature') {

        // add the image and to the name
        let imgName = figure.getElementsByTagName('img')[0].getAttribute('src');
        order.image = imgName.slice(imgName.lastIndexOf('/')+1);

        let tempName = figure.getElementsByTagName('figcaption')[0].childNodes[0].nodeValue;
        order.temp = tempName;
    }
    

    // once filled in, add the order to local storage 
    localStorage.setItem('currentOrder', JSON.stringify(order));

     

}

/**
 * Selects the chosen option and makes background dark without unselecting other options
 * @param {FigureDOMObject} figure - the clicked figure
 */
const selectOptionAddOn = function(figure) {

    // get the current order of make one if there isn't one
    let order = JSON.parse(localStorage.getItem('currentOrder'));


    let img = figure.getElementsByTagName('div')[0];
    let name = figure.getElementsByTagName('figcaption')[0].childNodes[0].nodeValue;

    // check if it's already brown
    if (img.style.backgroundColor == "var(--theme-brown)") {
        // uncheck
        img.style.backgroundColor = "var(--white)";
        let pastDesc = order.desc;
        let indexOfItem = pastDesc.indexOf(name);
        let newDesc = "";

        if (indexOfItem != 0) {
            newDesc = pastDesc.slice(0, indexOfItem);
        }
        lengthToSkip = name.length + 2;
        newDesc += pastDesc.slice(indexOfItem + lengthToSkip);
        order.desc = newDesc;

    } else {
        // check
        img.style.backgroundColor = "var(--theme-brown)";

        // if already there don't add, else add to desc
        let desc = order.desc;
        const clickedAddOns = desc.split(', ');

        if (!clickedAddOns.includes(name)) {
            order.desc += name + ', ';
        }
        
    }

    
    // once filled in, add the order to local storage 
    localStorage.setItem('currentOrder', JSON.stringify(order));

}

/**
 * 
 * @param {SpanDOM ELement} sign - the element clicked
 * @param {Boolean} isAdd - if we are adding or subtracting
 */
const changeCustomizeQuantity = function(sign, isAdd) {

    // change quantity on screen
    changeQuantity(sign, isAdd);

    // get the new value
    let quantityValue = sign.parentElement.childNodes[1].nodeValue;

    // get the current order of make one if there isn't one
    let order = JSON.parse(localStorage.getItem('currentOrder'));

    // change quantity
    order.quantity = parseInt(quantityValue);

    // once filled in, add the order to local storage 
    localStorage.setItem('currentOrder', JSON.stringify(order));
}

