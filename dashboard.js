// Sample ecommerce data
const salesData = {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    revenue: [45000, 52000, 48000, 61000, 58000, 67000, 72000, 69000, 75000, 82000, 88000, 95000],
    orders: [450, 520, 480, 610, 580, 670, 720, 690, 750, 820, 880, 950],
    visitors: [12500, 14200, 13800, 16500, 15900, 18200, 19800, 19100, 21000, 23500, 25200, 27800],
    categories: {
        'Electronics': 285000,
        'Clothing': 198000,
        'Home & Garden': 156000,
        'Sports': 124000,
        'Books': 89000
    },
    trafficSources: {
        'Organic Search': 45,
        'Direct': 25,
        'Social Media': 15,
        'Paid Ads': 10,
        'Referral': 5
    },
    topProducts: [
        { name: 'Wireless Headphones', sales: 45000, units: 450 },
        { name: 'Smart Watch', sales: 38000, units: 380 },
        { name: 'Laptop Stand', sales: 32000, units: 640 },
        { name: 'USB-C Cable', sales: 28000, units: 1400 },
        { name: 'Phone Case', sales: 25000, units: 1250 }
    ],
    recentTransactions: [
        { id: 'ORD-1234', date: '2024-12-15', customer: 'John Smith', product: 'Wireless Headphones', amount: 99.99, status: 'completed' },
        { id: 'ORD-1235', date: '2024-12-15', customer: 'Sarah Johnson', product: 'Smart Watch', amount: 199.99, status: 'processing' },
        { id: 'ORD-1236', date: '2024-12-14', customer: 'Mike Brown', product: 'Laptop Stand', amount: 49.99, status: 'completed' },
        { id: 'ORD-1237', date: '2024-12-14', customer: 'Emily Davis', product: 'USB-C Cable', amount: 19.99, status: 'completed' },
        { id: 'ORD-1238', date: '2024-12-14', customer: 'David Wilson', product: 'Phone Case', amount: 24.99, status: 'pending' },
        { id: 'ORD-1239', date: '2024-12-13', customer: 'Lisa Anderson', product: 'Wireless Headphones', amount: 99.99, status: 'completed' },
        { id: 'ORD-1240', date: '2024-12-13', customer: 'Tom Martinez', product: 'Smart Watch', amount: 199.99, status: 'completed' },
        { id: 'ORD-1241', date: '2024-12-13', customer: 'Anna Taylor', product: 'Laptop Stand', amount: 49.99, status: 'processing' }
    ]
};

// Calculate statistics
function calculateStats() {
    const totalRevenue = salesData.revenue.reduce((sum, val) => sum + val, 0);
    const totalOrders = salesData.orders.reduce((sum, val) => sum + val, 0);
    const totalProducts = salesData.topProducts.reduce((sum, product) => sum + product.units, 0);
    const totalVisitors = salesData.visitors.reduce((sum, val) => sum + val, 0);
    const avgOrderValue = totalRevenue / totalOrders;

    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toLocaleString()}`;
    document.getElementById('totalOrders').textContent = totalOrders.toLocaleString();
    document.getElementById('productsSold').textContent = totalProducts.toLocaleString();
    document.getElementById('avgOrderValue').textContent = `$${avgOrderValue.toFixed(2)}`;
    document.getElementById('siteVisitors').textContent = totalVisitors.toLocaleString();
}

// Create sales chart
function createSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: salesData.months,
            datasets: [{
                label: 'Revenue ($)',
                data: salesData.revenue,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBackgroundColor: '#3b82f6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return 'Revenue: $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Create category chart
function createCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(salesData.categories),
            datasets: [{
                data: Object.values(salesData.categories),
                backgroundColor: [
                    '#3b82f6',
                    '#8b5cf6',
                    '#ec4899',
                    '#10b981',
                    '#f59e0b'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return label + ': $' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Create orders chart
function createOrdersChart() {
    const ctx = document.getElementById('ordersChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: salesData.months,
            datasets: [{
                label: 'Orders',
                data: salesData.orders,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: '#3b82f6',
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Create traffic sources chart
function createTrafficChart() {
    const ctx = document.getElementById('trafficChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(salesData.trafficSources),
            datasets: [{
                data: Object.values(salesData.trafficSources),
                backgroundColor: [
                    '#3b82f6',
                    '#8b5cf6',
                    '#ec4899',
                    '#10b981',
                    '#f59e0b'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return label + ': ' + value + '%';
                        }
                    }
                }
            }
        }
    })
}

// Create visitors chart
function createVisitorsChart() {
    const ctx = document.getElementById('visitorsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: salesData.months,
            datasets: [{
                label: 'Visitors',
                data: salesData.visitors,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBackgroundColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return 'Visitors: ' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Display top products
function displayTopProducts() {
    const container = document.getElementById('topProducts');
    const maxSales = Math.max(...salesData.topProducts.map(p => p.sales));
    
    salesData.topProducts.forEach(product => {
        const percentage = (product.sales / maxSales) * 100;
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <div class="product-name">${product.name}</div>
            <div class="product-sales">
                <span class="product-amount">$${product.sales.toLocaleString()}</span>
                <div class="product-bar">
                    <div class="product-bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
        container.appendChild(productItem);
    });
}

// Display recent transactions
function displayTransactions() {
    const tbody = document.getElementById('transactionsBody');
    
    salesData.recentTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        const statusClass = `status-${transaction.status}`;
        row.innerHTML = `
            <td><strong>${transaction.id}</strong></td>
            <td>${transaction.date}</td>
            <td>${transaction.customer}</td>
            <td>${transaction.product}</td>
            <td><strong>$${transaction.amount}</strong></td>
            <td><span class="status-badge ${statusClass}">${transaction.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize tabs
    initTabs();
    initModal();
    
    // Initialize analytics tab
    calculateStats();
    createSalesChart();
    createCategoryChart();
    createOrdersChart();
    createTrafficChart();
    createVisitorsChart();
    displayTopProducts();
    displayTransactions();
    
    // Fetch products and initialize pricing tab
    await fetchProducts();
    displayPricingTable();
});

// Made with Bob

// Extended product data with pricing - will be loaded dynamically from API
let productsData = [];

// Fetch products from API
async function fetchProducts() {
    try {
        const response = await fetch('/api/v1/products/top?limit=50');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        productsData = products;
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to empty array if API fails
        productsData = [];
        return [];
    }
}

// Tab switching functionality
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// Display pricing table
function displayPricingTable() {
    const tbody = document.getElementById('pricingTableBody');
    tbody.innerHTML = '';
    
    productsData.forEach(product => {
        const priceChange = product.promoPrice - product.price;
        const changePercent = ((priceChange / product.price) * 100).toFixed(1);
        const stockClass = product.stock > 200 ? 'stock-high' : product.stock > 100 ? 'stock-medium' : 'stock-low';
        const stockLabel = product.stock > 200 ? 'In Stock' : product.stock > 100 ? 'Low Stock' : 'Very Low';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${product.id}</strong></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td class="price-cell">$${product.price.toFixed(2)}</td>
            <td class="promo-price">$${product.promoPrice.toFixed(2)}</td>
            <td>${priceChange !== 0 ? `<span class="discount-badge">${changePercent > 0 ? '+' : ''}${changePercent}%</span>` : '-'}</td>
            <td><span class="stock-status ${stockClass}">${stockLabel} (${product.stock})</span></td>
            <td><button class="btn-edit" onclick="openPriceModal('${product.id}')">Edit Price</button></td>
        `;
        tbody.appendChild(row);
    });
}

// Open price update modal
function openPriceModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('modalProductId').value = product.id;
    document.getElementById('modalProductName').value = product.name;
    document.getElementById('modalCurrentPrice').value = product.price.toFixed(2);
    document.getElementById('modalNewPrice').value = product.promoPrice.toFixed(2);
    updateModalDiscount();
    
    document.getElementById('priceModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('priceModal').classList.remove('active');
}

// Update price change calculation in modal
function updateModalDiscount() {
    const currentPrice = parseFloat(document.getElementById('modalCurrentPrice').value);
    const newPrice = parseFloat(document.getElementById('modalNewPrice').value);
    
    if (newPrice && currentPrice) {
        const change = ((newPrice - currentPrice) / currentPrice * 100).toFixed(1);
        const changeText = change > 0 ? `+${change}%` : change < 0 ? `${change}%` : '0%';
        document.getElementById('modalDiscount').value = changeText;
    }
}

// Handle price update form submission
async function handlePriceUpdate(event) {
    event.preventDefault();
    
    const productId = document.getElementById('modalProductId').value;
    const newPrice = parseFloat(document.getElementById('modalNewPrice').value);
    
    try {
        const response = await fetch(`/api/v1/products/${productId}/price`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ price: newPrice })
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // Refresh products from API to get latest data
            await fetchProducts();
            
            // Refresh table
            displayPricingTable();
            closeModal();
            
            // Show success message
            alert(`Price updated successfully for ${result.product.name}!`);
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error updating price:', error);
        alert('Failed to update price. Please try again.');
    }
}

// Initialize modal events
function initModal() {
    const modal = document.getElementById('priceModal');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('priceUpdateForm');
    const newPriceInput = document.getElementById('modalNewPrice');
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Update discount on price change
    newPriceInput.addEventListener('input', updateModalDiscount);
    
    // Handle form submission
    form.addEventListener('submit', handlePriceUpdate);
}
