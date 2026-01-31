// Load orders from localStorage and handle missing fields for old orders
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// If an order doesn't have orderType, set it to 'Dine In' (or any default)
orders.forEach(order => {
     if (!order.orderType) {
         order.orderType = 'Dine In';
         order.tableNumber = order.tableNumber || '';
         order.customerName = order.customerName || '';
         order.customerPhone = order.customerPhone || '';
         order.deliveryAddress = order.deliveryAddress || '';
     }
});

// DOM elements
const ordersContainer = document.getElementById('ordersContainer');
const tabButtons = document.querySelectorAll('.tab-btn');
const datePicker = document.getElementById('datePicker');
const todayBtn = document.getElementById('todayBtn');
const dailySalesElement = document.getElementById('dailySales');

let currentFilter = 'all';
let selectedDate = new Date().toISOString().split('T')[0]; // Default to today

// Set the date picker to today
datePicker.value = selectedDate;

// Function to filter orders by type and date
function filterOrders() {
     let filtered = orders;

     // Filter by order type
     if (currentFilter !== 'all') {
         filtered = filtered.filter(order => order.orderType === currentFilter);
     }

     // Filter by date
     filtered = filtered.filter(order => {
         const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
         return orderDate === selectedDate;
     });

     return filtered;
}

// Function to calculate daily sales
function calculateDailySales() {
     const filtered = filterOrders();
     const total = filtered.reduce((sum, order) => sum + parseFloat(order.total), 0);
     return total.toFixed(2);
}

// Function to display orders
function displayOrders() {
     const filteredOrders = filterOrders();

     if (filteredOrders.length === 0) {
         ordersContainer.innerHTML = `
             <div style="text-align: center; padding: 40px; color: #555;">
                 <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 15px; color: #ddd;"></i>
                 <h3>No orders found</h3>
                 <p>Try changing the filter or select a different date</p>
             </div>
         `;
         return;
     }

     ordersContainer.innerHTML = filteredOrders.map(order => {
         // Format the order time to be more readable if needed
         const orderTime = order.createdAt;

         return `
             <div class="order-card">
                 <div class="order-header">
                     <span class="order-id">Order #: ${order.orderId}</span>
                     <span class="order-time">${orderTime}</span>
                 </div>
                 <div class="order-type">${order.orderType}</div>
                 <div class="order-details">
                     <div class="order-items">
                         ${order.items.map(item => `<div>${item.quantity} x ${item.name}</div>`).join('')}
                     </div>
                     <div class="order-total">₹ ${order.total}</div>
                 </div>
                 <div class="order-footer">
                     <span class="customer-name">${order.customerName || 'No name'}</span>
                     <span class="customer-phone">${order.customerPhone || 'No phone'}</span>
                 </div>
             </div>
         `;
     }).join('');
}

// Function to update daily sales display
function updateDailySales() {
     const dailySales = calculateDailySales();
     dailySalesElement.textContent = `Total for ${selectedDate}: ₹ ${dailySales}`;
}

// Event listeners for tabs
tabButtons.forEach(button => {
     button.addEventListener('click', () => {
         tabButtons.forEach(btn => btn.classList.remove('active'));
         button.classList.add('active');
         currentFilter = button.dataset.filter;
         displayOrders();
         updateDailySales();
     });
});

// Event listener for date picker
datePicker.addEventListener('change', (e) => {
     selectedDate = e.target.value;
     displayOrders();
     updateDailySales();
});

// Event listener for today button
todayBtn.addEventListener('click', () => {
     selectedDate = new Date().toISOString().split('T')[0];
     datePicker.value = selectedDate;
     displayOrders();
     updateDailySales();
});

// Initial display
displayOrders();
updateDailySales();