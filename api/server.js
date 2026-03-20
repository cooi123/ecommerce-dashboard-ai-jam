const fs = require('fs');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Data file path for persistence
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'data', 'sales-data.json');

// Function to load data from file
function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
    return null;
}

// Function to save data to file
function saveData(data) {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        console.log('Data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}


// Load OpenAPI specification
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (dashboard)
app.use(express.static(path.join(__dirname, '..')));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Initialize data - load from file or use defaults
let salesData = loadData() || {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    revenue: [45000, 52000, 48000, 61000, 58000, 67000, 72000, 69000, 75000, 82000, 88000, 95000],
    orders: [450, 520, 480, 610, 580, 670, 720, 690, 750, 820, 880, 950],
    categories: {
        'Electronics': 285000,
        'Clothing': 198000,
        'Home & Garden': 156000,
        'Sports': 124000,
        'Books': 89000
    },
    topProducts: [
        { id: 'prod-001', name: 'Wireless Headphones', sales: 45000, units: 450, category: 'Electronics', price: 99.99, promoPrice: 99.99, stock: 150, rating: 4.5, description: 'High-quality wireless headphones with noise cancellation' },
        { id: 'prod-002', name: 'Smart Watch', sales: 38000, units: 380, category: 'Electronics', price: 199.99, promoPrice: 199.99, stock: 85, rating: 4.7, description: 'Feature-rich smartwatch with health tracking' },
        { id: 'prod-003', name: 'Laptop Stand', sales: 32000, units: 640, category: 'Electronics', price: 49.99, promoPrice: 49.99, stock: 200, rating: 4.3, description: 'Ergonomic laptop stand for better posture' },
        { id: 'prod-004', name: 'USB-C Cable', sales: 28000, units: 1400, category: 'Electronics', price: 19.99, promoPrice: 19.99, stock: 500, rating: 4.6, description: 'Durable USB-C charging cable' },
        { id: 'prod-005', name: 'Phone Case', sales: 25000, units: 1250, category: 'Electronics', price: 24.99, promoPrice: 24.99, stock: 300, rating: 4.4, description: 'Protective phone case with stylish design' },
        { id: 'prod-006', name: 'Bluetooth Speaker', sales: 22000, units: 275, category: 'Electronics', price: 79.99, promoPrice: 79.99, stock: 120, rating: 4.5, description: 'Portable bluetooth speaker with great sound' },
        { id: 'prod-007', name: 'Wireless Mouse', sales: 19000, units: 543, category: 'Electronics', price: 34.99, promoPrice: 34.99, stock: 250, rating: 4.4, description: 'Ergonomic wireless mouse' },
        { id: 'prod-008', name: 'Keyboard', sales: 17000, units: 189, category: 'Electronics', price: 89.99, promoPrice: 89.99, stock: 180, rating: 4.6, description: 'Mechanical keyboard with RGB lighting' },
        { id: 'prod-009', name: 'Webcam', sales: 15000, units: 214, category: 'Electronics', price: 69.99, promoPrice: 69.99, stock: 95, rating: 4.3, description: 'HD webcam for video calls' },
        { id: 'prod-010', name: 'Monitor Stand', sales: 13000, units: 236, category: 'Electronics', price: 54.99, promoPrice: 54.99, stock: 140, rating: 4.2, description: 'Adjustable monitor stand' }
    ],
    recentTransactions: [
        { id: 'txn-001', orderId: 'ORD-1234', date: '2024-12-15T10:30:00Z', customer: 'John Smith', customerId: 'cust-001', product: 'Wireless Headphones', productId: 'prod-001', amount: 99.99, quantity: 1, status: 'completed', type: 'sale', paymentMethod: 'Credit Card', shippingAddress: '123 Main St, City, State 12345' },
        { id: 'txn-002', orderId: 'ORD-1235', date: '2024-12-15T11:45:00Z', customer: 'Sarah Johnson', customerId: 'cust-002', product: 'Smart Watch', productId: 'prod-002', amount: 199.99, quantity: 1, status: 'processing', type: 'sale', paymentMethod: 'PayPal', shippingAddress: '456 Oak Ave, Town, State 67890' },
        { id: 'txn-003', orderId: 'ORD-1236', date: '2024-12-14T14:20:00Z', customer: 'Mike Brown', customerId: 'cust-003', product: 'Laptop Stand', productId: 'prod-003', amount: 49.99, quantity: 1, status: 'completed', type: 'sale', paymentMethod: 'Credit Card', shippingAddress: '789 Pine Rd, Village, State 13579' },
        { id: 'txn-004', orderId: 'ORD-1237', date: '2024-12-14T16:10:00Z', customer: 'Emily Davis', customerId: 'cust-004', product: 'USB-C Cable', productId: 'prod-004', amount: 19.99, quantity: 1, status: 'completed', type: 'sale', paymentMethod: 'Debit Card', shippingAddress: '321 Elm St, City, State 24680' },
        { id: 'txn-005', orderId: 'ORD-1238', date: '2024-12-14T09:30:00Z', customer: 'David Wilson', customerId: 'cust-005', product: 'Phone Case', productId: 'prod-005', amount: 24.99, quantity: 1, status: 'pending', type: 'sale', paymentMethod: 'Credit Card', shippingAddress: '654 Maple Dr, Town, State 97531' },
        { id: 'txn-006', orderId: 'ORD-1239', date: '2024-12-13T13:15:00Z', customer: 'Lisa Anderson', customerId: 'cust-006', product: 'Wireless Headphones', productId: 'prod-001', amount: 99.99, quantity: 1, status: 'completed', type: 'sale', paymentMethod: 'PayPal', shippingAddress: '987 Cedar Ln, Village, State 86420' },
        { id: 'txn-007', orderId: 'ORD-1240', date: '2024-12-13T15:45:00Z', customer: 'Tom Martinez', customerId: 'cust-007', product: 'Smart Watch', productId: 'prod-002', amount: 199.99, quantity: 1, status: 'completed', type: 'sale', paymentMethod: 'Credit Card', shippingAddress: '147 Birch St, City, State 75319' },
        { id: 'txn-008', orderId: 'ORD-1241', date: '2024-12-13T08:20:00Z', customer: 'Anna Taylor', customerId: 'cust-008', product: 'Laptop Stand', productId: 'prod-003', amount: 49.99, quantity: 1, status: 'processing', type: 'sale', paymentMethod: 'Debit Card', shippingAddress: '258 Spruce Ave, Town, State 95173' }
    ]
};

// API Routes

// GET /api/v1/sales/monthly
app.get('/api/v1/sales/monthly', (req, res) => {
    const { year } = req.query;
    
    // For simplicity, we're returning the same data regardless of year
    // In a real application, you would filter by year
    res.json({
        months: salesData.months,
        revenue: salesData.revenue,
        orders: salesData.orders
    });
});

// GET /api/v1/sales/statistics
app.get('/api/v1/sales/statistics', (req, res) => {
    const totalRevenue = salesData.revenue.reduce((sum, val) => sum + val, 0);
    const totalOrders = salesData.orders.reduce((sum, val) => sum + val, 0);
    const totalProducts = salesData.topProducts.reduce((sum, product) => sum + product.units, 0);
    const avgOrderValue = totalRevenue / totalOrders;
    
    res.json({
        totalRevenue,
        totalOrders,
        totalProducts,
        avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
        growthRate: 12.5
    });
});

// GET /api/v1/sales/categories
app.get('/api/v1/sales/categories', (req, res) => {
    res.json({
        categories: salesData.categories
    });
});

// GET /api/v1/products/top
app.get('/api/v1/products/top', (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    const topProducts = salesData.topProducts.slice(0, limit);
    res.json(topProducts);
});

// GET /api/v1/products/:productId
app.get('/api/v1/products/:productId', (req, res) => {
    const { productId } = req.params;
    const product = salesData.topProducts.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({
            code: 'NOT_FOUND',
            message: 'Product not found',
            details: `No product found with ID: ${productId}`
        });
    }
    
    res.json(product);
});

// GET /api/v1/orders/recent
app.get('/api/v1/orders/recent', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const { status } = req.query;
    
    let orders = salesData.recentTransactions.map(t => ({
        id: t.orderId,
        date: t.date.split('T')[0],
        customer: t.customer,
        product: t.product,
        amount: t.amount,
        status: t.status
    }));
    
    if (status) {
        orders = orders.filter(o => o.status === status);
    }
    
    res.json(orders.slice(0, limit));
});

// GET /api/v1/orders/:orderId
app.get('/api/v1/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    const transaction = salesData.recentTransactions.find(t => t.orderId === orderId);
    
    if (!transaction) {
        return res.status(404).json({
            code: 'NOT_FOUND',
            message: 'Order not found',
            details: `No order found with ID: ${orderId}`
        });
    }
    
    res.json({
        id: transaction.orderId,
        date: transaction.date.split('T')[0],
        customer: transaction.customer,
        customerId: transaction.customerId,
        product: transaction.product,
        productId: transaction.productId,
        amount: transaction.amount,
        quantity: transaction.quantity,
        status: transaction.status,
        shippingAddress: transaction.shippingAddress,
        paymentMethod: transaction.paymentMethod
    });
});

// GET /api/v1/transactions
app.get('/api/v1/transactions', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { startDate, endDate } = req.query;
    
    let transactions = [...salesData.recentTransactions];
    
    // Filter by date range if provided
    if (startDate) {
        transactions = transactions.filter(t => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
        transactions = transactions.filter(t => new Date(t.date) <= new Date(endDate));
    }
    
    const total = transactions.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    res.json({
        transactions: transactions.slice(startIndex, endIndex),
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    });
});

// PUT /api/v1/products/:productId/price - Update product price
app.put('/api/v1/products/:productId/price', (req, res) => {
    const { productId } = req.params;
    const { price } = req.body;
    
    // Validate input
    if (price === undefined || price === null) {
        return res.status(400).json({
            code: 'BAD_REQUEST',
            message: 'Price is required',
            details: 'Please provide a valid price in the request body'
        });
    }
    
    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({
            code: 'BAD_REQUEST',
            message: 'Invalid price',
            details: 'Price must be a positive number'
        });
    }
    
    // Find product
    const product = salesData.topProducts.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({
            code: 'NOT_FOUND',
            message: 'Product not found',
            details: `No product found with ID: ${productId}`
        });
    }
    
    // Update price
    const oldPrice = product.price;
    product.price = price;
    product.promoPrice = price;
    
    // Save data to file for persistence
    saveData(salesData);
    
    res.json({
        success: true,
        message: 'Product price updated successfully',
        product: {
            id: product.id,
            name: product.name,
            category: product.category,
            oldPrice: oldPrice,
            newPrice: price,
            stock: product.stock
        }
    });
});

// GET /api/v1/orders/:orderId
app.get('/api/v1/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    const transaction = salesData.recentTransactions.find(t => t.orderId === orderId);
    
    if (!transaction) {
        return res.status(404).json({
            code: 'NOT_FOUND',
            message: 'Order not found',
            details: `No order found with ID: ${orderId}`
        });
    }
    
    res.json({
        id: transaction.orderId,
        date: transaction.date.split('T')[0],
        customer: transaction.customer,
        customerId: transaction.customerId,
        product: transaction.product,
        productId: transaction.productId,
        amount: transaction.amount,
        quantity: transaction.quantity,
        status: transaction.status,
        shippingAddress: transaction.shippingAddress,
        paymentMethod: transaction.paymentMethod
    });
});

// GET /api/v1/transactions
app.get('/api/v1/transactions', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { startDate, endDate } = req.query;
    
    let transactions = [...salesData.recentTransactions];
    
    // Filter by date range if provided
    if (startDate) {
        transactions = transactions.filter(t => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
        transactions = transactions.filter(t => new Date(t.date) <= new Date(endDate));
    }
    
    const total = transactions.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    res.json({
        transactions: transactions.slice(startIndex, endIndex),
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    });
});

// Dashboard route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// API info endpoint
app.get('/api/v1', (req, res) => {
    res.json({
        message: 'Ecommerce Analytics API',
        version: '1.0.0',
        documentation: '/api-docs',
        dashboard: '/'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        details: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Ecommerce Analytics API server running on port ${PORT}`);
    console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
});

module.exports = app;

// Made with Bob
