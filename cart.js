
function getCart() {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    displayCart();
}

function calculateTotal(cart) {
    return cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return total + (price * item.quantity);
    }, 0);
}


function displayCart() {
    const cart = getCart();
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const totalPriceEl = document.getElementById('totalPrice');
    
    if (cart.length === 0) {
        cartItemsList.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        totalPriceEl.textContent = '$0';
        checkoutfooter.style.display = 'none';

        return;
    }
    
    cartItemsList.style.display = 'flex';
    emptyCartMessage.style.display = 'none';
    cartItemsList.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        const sizeText = item.size ? ` x${item.quantity}` : ` x${item.quantity}`;
        const sizeDisplay = item.size ? `<span class="cart-item-size">${item.size}</span>` : '';
        
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name}</span>
                ${sizeDisplay}
                <span class="cart-item-quantity">${sizeText}</span>
            </div>
            <span class="cart-item-price">${item.price}</span>
            <button class="remove-item-btn" data-index="${index}">×</button>
        `;
        
        const removeBtn = cartItem.querySelector('.remove-item-btn');
        removeBtn.addEventListener('click', () => {
            removeFromCart(index);
        });
        
        cartItemsList.appendChild(cartItem);
    });
    
    
    const total = calculateTotal(cart);
    totalPriceEl.textContent = `$${total.toFixed(0)}`;
}


document.getElementById('payNowBtn').addEventListener('click', () => {
    const termsCheckbox = document.getElementById('termsCheckbox');
    const addressInput = document.getElementById('addressInput');
    const mobileInput = document.getElementById('mobileInput');
    const deliveryCheck = document.getElementById('deliveryCheck');
    const pickupCheck = document.getElementById('pickupCheck');
    
    if (!termsCheckbox.checked) {
        alert('Please agree to the terms and conditions');
        return;
    }
    
    if (deliveryCheck.checked && !addressInput.value.trim()) {
        alert('Please enter your delivery address');
        return;
    }
    
    if (!mobileInput.value.trim()) {
        alert('Please enter your mobile number');
        return;
    }
    
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const deliveryMethod = deliveryCheck.checked ? 'delivery' : (pickupCheck.checked ? 'pickup' : 'none');
    const total = calculateTotal(cart);
    
    alert(`Order confirmed!\nTotal: ${total.toFixed(0)}\nPayment: ${paymentMethod}\nDelivery: ${deliveryMethod}`);
    
    
    saveCart([]);
    displayCart();
    
    
    addressInput.value = '';
    mobileInput.value = '';
    termsCheckbox.checked = false;
    deliveryCheck.checked = false;
    pickupCheck.checked = false;
});


document.getElementById('deliveryCheck').addEventListener('change', (e) => {
    const addressInput = document.getElementById('addressInput');
    if (e.target.checked) {
        addressInput.style.display = 'block';
        document.getElementById('pickupCheck').checked = false;
    } else {
        addressInput.style.display = 'none';
    }
});

document.getElementById('pickupCheck').addEventListener('change', (e) => {
    if (e.target.checked) {
        document.getElementById('deliveryCheck').checked = false;
        document.getElementById('addressInput').style.display = 'none';
    }
});


document.addEventListener('DOMContentLoaded', () => {
    displayCart();
});
