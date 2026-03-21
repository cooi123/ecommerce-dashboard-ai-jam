// Global variables
let currentYear = '2026';
let salesData = null;
let yearlyComparison = null;
let eventsData = null;
let salesChart = null;
let ordersChart = null;
let categoryChart = null;
let trafficChart = null;
let visitorsChart = null;

// Fetch sales data for a specific year
async function fetchSalesData(year) {
    try {
        const response = await fetch(`/api/v1/sales/monthly?year=${year}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching sales data:', error);
        return null;
    }
}

// Fetch yearly comparison data
async function fetchYearlyComparison() {
    try {
        const response = await fetch('/api/v1/sales/yearly-comparison');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching yearly comparison:', error);
        return null;
    }
}

// Fetch events data
async function fetchEventsData(year = null) {
    try {
        const url = year ? `/api/v1/sales/events?year=${year}` : '/api/v1/sales/events';
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching events data:', error);
        return null;
    }
}

// Handle year change
async function handleYearChange() {
    const yearSelect = document.getElementById('yearFilter');
    currentYear = yearSelect.value;
    
    // Show loading state
    document.getElementById('yearNote').textContent = 'Loading...';
    
    // Fetch new data
    salesData = await fetchSalesData(currentYear);
    
    if (salesData) {

        // Refresh dashboard
        await refreshDashboard();
    }
}

// Refresh dashboard with current year data
async function refreshDashboard() {
    if (!salesData) return;
    
    calculateStats();
    updateCharts();
}

// Calculate statistics
function calculateStats() {
    if (!salesData || !salesData.revenue) return;
    
    const totalRevenue = salesData.revenue.reduce((sum, val) => sum + val, 0);
    const totalOrders = salesData.orders.reduce((sum, val) => sum + val, 0);
    const totalVisitors = salesData.visitors ? salesData.visitors.reduce((sum, val) => sum + val, 0) : 0;
    const totalProducts = salesData.topProducts ? salesData.topProducts.reduce((sum, product) => sum + product.units, 0) : 0;
    const avgOrderValue = totalRevenue / totalOrders;

    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toLocaleString()}`;
    document.getElementById('totalOrders').textContent = totalOrders.toLocaleString();
    document.getElementById('productsSold').textContent = totalProducts.toLocaleString();
    document.getElementById('avgOrderValue').textContent = `$${avgOrderValue.toFixed(2)}`;
    document.getElementById('siteVisitors').textContent = totalVisitors.toLocaleString();
    
    // Calculate growth rate compared to previous year
    if (yearlyComparison && yearlyComparison.comparison) {
        const years = Object.keys(yearlyComparison.comparison).sort();
        const currentYearIndex = years.indexOf(currentYear);
        if (currentYearIndex > 0) {
            const prevYear = years[currentYearIndex - 1];
            const currentData = yearlyComparison.comparison[currentYear];
            const prevData = yearlyComparison.comparison[prevYear];
            
            if (currentData && prevData) {
                const revenueGrowth = ((currentData.totalRevenue - prevData.totalRevenue) / prevData.totalRevenue * 100).toFixed(1);
                const ordersGrowth = ((currentData.totalOrders - prevData.totalOrders) / prevData.totalOrders * 100).toFixed(1);
                
                // Update growth indicators
                const revenueChange = document.querySelector('.stat-card:nth-child(1) .stat-change');
                const ordersChange = document.querySelector('.stat-card:nth-child(2) .stat-change');
                
                if (revenueChange) {
                    revenueChange.textContent = `${revenueGrowth > 0 ? '+' : ''}${revenueGrowth}% from ${prevYear}`;
                    revenueChange.className = `stat-change ${revenueGrowth >= 0 ? 'positive' : 'negative'}`;
                }
                if (ordersChange) {
                    ordersChange.textContent = `${ordersGrowth > 0 ? '+' : ''}${ordersGrowth}% from ${prevYear}`;
                    ordersChange.className = `stat-change ${ordersGrowth >= 0 ? 'positive' : 'negative'}`;
                }
            }
        }
    }
}

// Update charts with new data
function updateCharts() {
    if (salesChart) {
        salesChart.data.labels = salesData.months;
        salesChart.data.datasets[0].data = salesData.revenue;
        salesChart.data.datasets[0].label = `Revenue ($) - ${currentYear}`;
        salesChart.update();
    }
    
    if (ordersChart) {
        ordersChart.data.labels = salesData.months;
        ordersChart.data.datasets[0].data = salesData.orders;
        ordersChart.data.datasets[0].label = `Orders - ${currentYear}`;
        ordersChart.update();
    }
    
    if (visitorsChart && salesData.visitors) {
        visitorsChart.data.labels = salesData.months;
        visitorsChart.data.datasets[0].data = salesData.visitors;
        visitorsChart.data.datasets[0].label = `Visitors - ${currentYear}`;
        visitorsChart.update();
    }
    
    // Category and traffic charts don't change by year, but refresh them anyway
    if (categoryChart && salesData.categories) {
        categoryChart.data.labels = Object.keys(salesData.categories);
        categoryChart.data.datasets[0].data = Object.values(salesData.categories);
        categoryChart.update();
    }
    
    if (trafficChart && salesData.trafficSources) {
        trafficChart.data.labels = Object.keys(salesData.trafficSources);
        trafficChart.data.datasets[0].data = Object.values(salesData.trafficSources);
        trafficChart.update();
    }
    
    // Update top products and transactions
    if (salesData.topProducts) {
        displayTopProducts();
    }
    
    if (salesData.recentTransactions) {
        displayTransactions();
    }
}

// Create sales chart
function createSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: salesData.months,
            datasets: [{
                label: `Revenue ($) - ${currentYear}`,
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
    categoryChart = new Chart(ctx, {
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
    ordersChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: salesData.months,
            datasets: [{
                label: `Orders - ${currentYear}`,
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

// Create yearly comparison charts
async function createYearlyComparisonCharts() {
    if (!yearlyComparison) return;
    
    const years = Object.keys(yearlyComparison.comparison).sort();
    const revenueData = years.map(year => yearlyComparison.comparison[year].totalRevenue);
    const ordersData = years.map(year => yearlyComparison.comparison[year].totalOrders);
    
    // Revenue comparison chart
    const revenueCtx = document.getElementById('yearlyRevenueChart').getContext('2d');
    new Chart(revenueCtx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [{
                label: 'Total Revenue ($)',
                data: revenueData,
                backgroundColor: years.map(y =>
                    y === '2024' ? 'rgba(16, 185, 129, 0.8)' :
                    y === '2025' ? 'rgba(239, 68, 68, 0.8)' :
                    'rgba(59, 130, 246, 0.8)'
                ),
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true },
                tooltip: {
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
                            return '$' + (value / 1000) + 'K';
                        }
                    }
                }
            }
        }
    });
    
    // Orders comparison chart
    const ordersCtx = document.getElementById('yearlyOrdersChart').getContext('2d');
    new Chart(ordersCtx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [{
                label: 'Total Orders',
                data: ordersData,
                backgroundColor: years.map(y =>
                    y === '2024' ? 'rgba(16, 185, 129, 0.8)' :
                    y === '2025' ? 'rgba(239, 68, 68, 0.8)' :
                    'rgba(59, 130, 246, 0.8)'
                ),
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Orders: ' + context.parsed.y.toLocaleString();
                        }
                    }
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

// Display yearly comparison stats
function displayYearlyComparison() {
    if (!yearlyComparison) return;
    
    const years = ['2024', '2025', '2026'];
    years.forEach(year => {
        const data = yearlyComparison.comparison[year];
        if (data) {
            document.getElementById(`revenue${year}`).textContent = `$${data.totalRevenue.toLocaleString()}`;
            document.getElementById(`orders${year}`).textContent = data.totalOrders.toLocaleString();
            document.getElementById(`avgRevenue${year}`).textContent = `$${data.avgMonthlyRevenue.toLocaleString()}`;
        }
    });
}

// Display events
async function displayEvents() {
    eventsData = await fetchEventsData();
    if (!eventsData || !eventsData.events) return;
    
    const years = ['2024', '2025', '2026'];
    years.forEach(year => {
        const container = document.getElementById(`events${year}`);
        if (!container) return;
        
        const yearEvents = eventsData.events[year] || [];
        container.innerHTML = '';
        
        yearEvents.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = `event-item impact-${event.impact}`;
            eventItem.innerHTML = `
                <div class="event-date">${new Date(event.date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })}</div>
                <div class="event-name">${event.event}</div>
                <span class="event-impact">${event.impact.replace('_', ' ')}</span>
            `;
            container.appendChild(eventItem);
        });
    });
}

// Create traffic sources chart
function createTrafficChart() {
    const ctx = document.getElementById('trafficChart').getContext('2d');
    trafficChart = new Chart(ctx, {
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
    visitorsChart = new Chart(ctx, {
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
    if (!salesData.topProducts || salesData.topProducts.length === 0) return;
    
    container.innerHTML = ''; // Clear existing content
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
    if (!salesData.recentTransactions || salesData.recentTransactions.length === 0) return;
    
    tbody.innerHTML = ''; // Clear existing content
    
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
    
    // Fetch initial data
    salesData = await fetchSalesData(currentYear);
    yearlyComparison = await fetchYearlyComparison();
    
    if (salesData) {
        // Set year note
        document.getElementById('yearNote').textContent = ' (Recovery - Q1 only)';
        
        // Initialize analytics tab
        calculateStats();
        createSalesChart();
        createCategoryChart();
        createOrdersChart();
        createTrafficChart();
        createVisitorsChart();
        displayTopProducts();
        displayTransactions();
    }
    
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
