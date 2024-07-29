// Select HTML elements
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let totalPriceElement = document.querySelector('#total-price span'); // This may be null
let products = [];
let cart = [];

// Check if totalPriceElement is found
console.log('Total Price Element:', totalPriceElement); // Check if this is null

// Toggle cart visibility
iconCart.addEventListener('click', () => {
    body.classList.add('showCart');
});
closeCart.addEventListener('click', () => {
    body.classList.remove('showCart');
});

// Add products to the HTML
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';

    if (products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>
            `;
            listProductHTML.appendChild(newProduct);
        });
    }
};

// Handle click events on products
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
});

// Add product to cart
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    updateCartUI();
    updateTotalInHeader(); // Update total price after updating cart UI
    saveCartToMemory();
};

// Save cart to local storage
const saveCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// // Calculate total price of all items in the cart
// //let calculateTotalPrice = () => {
//    // let totalPrice = 0;
//     //cart.forEach(item => {
//        // let product = products.find(p => p.id == item.product_id);
//       //  if (product) {
//          //   totalPrice += product.price * item.quantity;
//         //}
//     //});
//     //console.log('Total Price Calculation:', totalPrice); // Debug total price calculation
//     return totalPrice;
// };

// Update cart UI
const updateCartUI = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity;
            let product = products.find(p => p.id == item.product_id);
            if (product) {
                let newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.dataset.id = item.product_id;
                newItem.innerHTML = `
                    <div class="icons">
                        <span class="heart-icon" data-favorited="false">♡</span>
                        <div class="image">
                            <img src="${product.image}">
                        </div>
                        <span class="trash-icon">🗑️</span>
                    </div>
                    <div class="name">${product.name}</div>
                    <div class="totalPrice">$${product.price * item.quantity}</div>
                    <div class="quantity">
                        <span class="minus">-</span>
                        <span>${item.quantity}</span>
                        <span class="plus">+</span>
                    </div>
                `;
                listCartHTML.appendChild(newItem);
            }
        });
    }

    iconCartSpan.innerText = totalQuantity;
    updateTotalInHeader(); // Ensure total price is updated after cart UI changes
};

// Handle click events in the cart
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;

    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.closest('.item').dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityInCart(product_id, type);
    }

    if (positionClick.classList.contains('trash-icon')) {
        let product_id = positionClick.closest('.item').dataset.id;
        removeFromCart(product_id);
    }

    if (positionClick.classList.contains('heart-icon')) {
        toggleHeartIcon(positionClick);
    }
});

// Toggle heart icon color
const toggleHeartIcon = (icon) => {
    const isFavorited = icon.getAttribute('data-favorited') === 'true';
    if (isFavorited) {
        icon.style.color = 'white';
        icon.setAttribute('data-favorited', 'false');
    } else {
        icon.style.color = 'red';
        icon.setAttribute('data-favorited', 'true');
    }
};

// Change product quantity in cart
const changeQuantityInCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity += 1;
                break;

            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    updateCartUI();
    updateTotalInHeader(); // Update total price after changing quantity
    saveCartToMemory();
};

// Remove product from cart
const removeFromCart = (product_id) => {
    cart = cart.filter(item => item.product_id != product_id);
    updateCartUI();
    updateTotalInHeader(); // Update total price after removing an item
    saveCartToMemory();
};

// Initialize the app
const initApp = () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();

            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                updateCartUI();
                updateTotalInHeader(); // Calculate total price on initialization
            }
        });
}

// Start the app
initApp();
