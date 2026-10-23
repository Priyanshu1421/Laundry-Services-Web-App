

const servicesData = [
    { id: 1, name: "Dry Cleaning", price: 200 },
    { id: 2, name: "Wash & Fold", price: 100 },
    { id: 3, name: "Ironing", price: 30 },
    { id: 4, name: "Stain Removal", price: 500 },
    { id: 5, name: "Leather & Suede Cleaning", price: 999 },
    { id: 6, name: "Wedding Dress Cleaning", price: 2800 }
];

let cart = {};


function renderServices() {
    const servicesContainer = document.getElementById("services-list");
    servicesContainer.innerHTML = servicesData.map(service => `
        <div class="service-card">
            <div class="service-info">
                <h3>${service.name}</h3>
                <p>₹${service.price}</p>
            </div>
            <div class="service-actions">
                <button class="btn-add" onclick="addToCart(${service.id})">Add Items</button>
                <button class="btn-remove" onclick="removeFromCart(${service.id})">Remove Now</button>
            </div>
        </div>
    `).join('');
}

function addToCart(serviceId) {
    if (cart[serviceId]) {
        cart[serviceId].quantity += 1;
    } else {
        const service = servicesData.find(s => s.id === serviceId);
        cart[serviceId] = { ...service, quantity: 1 };
    }
    updateCartUI();
}

function removeFromCart(serviceId) {
    if (cart[serviceId]) {
        if (cart[serviceId].quantity > 1) {
            cart[serviceId].quantity -= 1;
        } else {
            delete cart[serviceId];
        }
    }
    updateCartUI();
}
function updateCartUI() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalAmountEl = document.getElementById("total-amount");
    
    const itemKeys = Object.keys(cart);
    let total = 0;
    if (itemKeys.length === 0) {
        
        cartItemsContainer.innerHTML = `<p class="empty-cart-msg">No items added yet.</p>`;
        totalAmountEl.textContent = '0';
        return;
    }
    let cartHtml = '';
    itemKeys.forEach(key => {
        const item = cart[key];
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        cartHtml += `
            <div class="cart-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>₹${itemTotal}</span>
            </div>
        `;
    });
    cartItemsContainer.innerHTML = cartHtml;
    totalAmountEl.textContent = total;
}


function handleBooking(event) {
    event.preventDefault();
    const fullName = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const totalAmount = document.getElementById("total-amount").textContent;
    if (Object.keys(cart).length === 0) {
        alert("Please add at least one service to the cart before booking.");
        return;
    }
    
    let orderSummary = Object.values(cart)
        .map(item => `${item.name} x ${item.quantity} (₹${item.price * item.quantity})`)
        .join(', ');
    const templateParams = {
        user_name: fullName,
        user_email: email,
        user_phone: phone,
        order_details: orderSummary,
        total_amount: totalAmount
    };
    
    if (typeof emailjs !== 'undefined' && emailjs.send) {
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
            }, function(error) {
                console.log('EmailJS failed, falling back to local confirmation:', error);
            });
    }
    
    const msgEl = document.getElementById("confirmation-message");
    msgEl.style.display = "block";
    // Clear Form and Cart
    document.getElementById("booking-form").reset();
    cart = {};
    updateCartUI();
    setTimeout(() => {
        msgEl.style.display = "none";
    }, 6000);
}

function handleSubscribe(event) {
    event.preventDefault();
    alert("Thank you for subscribing to our newsletter!");
    event.target.reset();
}

renderServices();