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
let salesData = loadData() ||{
  "months": [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  "salesByYear": {
    "2024": {
      "revenue": [
        95000,
        82000,
        88000,
        92000,
        98000,
        125000,
        105000,
        110000,
        115000,
        120000,
        135000,
        165000
      ],
      "orders": [
        950,
        820,
        880,
        920,
        980,
        1250,
        1050,
        1100,
        1150,
        1200,
        1350,
        1650
      ],
      "visitors": [
        27800,
        25200,
        26500,
        28000,
        29500,
        35000,
        31000,
        32500,
        34000,
        36000,
        40000,
        48000
      ],
      "notes": {
        "January": "Post-Boxing Day sales boost, Australia Day (Jan 26)",
        "February": "Back to school season",
        "March": "Autumn sales, Easter preparation",
        "April": "Easter holiday shopping",
        "May": "Mother's Day spike",
        "June": "EOFY sales (End of Financial Year June 30)",
        "July": "Winter sales, new financial year",
        "August": "Father's Day preparation",
        "September": "Spring sales, Father's Day (first Sunday)",
        "October": "Melbourne Cup preparation",
        "November": "Black Friday, pre-Christmas",
        "December": "Christmas peak, Boxing Day (Dec 26)"
      }
    },
    "2025": {
      "revenue": [
        58000,
        45000,
        52000,
        48000,
        55000,
        72000,
        62000,
        58000,
        65000,
        68000,
        78000,
        95000
      ],
      "orders": [
        580,
        450,
        520,
        480,
        550,
        720,
        620,
        580,
        650,
        680,
        780,
        950
      ],
      "visitors": [
        18000,
        14500,
        16000,
        15200,
        17000,
        22000,
        19500,
        18500,
        20000,
        21000,
        24000,
        29000
      ],
      "notes": {
        "January": "Economic downturn impact, reduced Australia Day spending",
        "February": "Consumer confidence low, minimal spending",
        "March": "Market correction, Easter sales weak",
        "April": "Continued poor performance",
        "May": "Slight recovery, Mother's Day modest",
        "June": "EOFY sales help but still below average",
        "July": "Winter sales struggle",
        "August": "Slow recovery begins",
        "September": "Father's Day shows improvement",
        "October": "Gradual recovery continues",
        "November": "Black Friday helps recovery",
        "December": "Christmas season improves but still below 2024"
      }
    },
    "2026": {
      "revenue": [
        105000,
        95000,
        110000
      ],
      "orders": [
        1050,
        950,
        1100
      ],
      "visitors": [
        32000,
        29000,
        33500
      ],
      "notes": {
        "January": "Strong recovery, Australia Day boost",
        "February": "Continued growth momentum",
        "March": "Easter early (April 5-6), strong Q1 close"
      }
    }
  },
  "revenue": [
    105000,
    95000,
    110000,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ],
  "orders": [
    1050,
    950,
    1100,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ],
  "categories": {
    "Electronics": 285000,
    "Clothing": 198000,
    "Home & Garden": 156000,
    "Sports": 124000,
    "Books": 89000
  },
  "trafficSources": {
    "Organic Search": 45,
    "Direct": 25,
    "Social Media": 15,
    "Paid Ads": 10,
    "Referral": 5
  },
  "topProducts": [
    {
      "id": "prod-001",
      "name": "Wireless Headphones",
      "sales": 45000,
      "units": 450,
      "category": "Electronics",
      "price": 20,
      "promoPrice": 20,
      "stock": 150,
      "rating": 4.5,
      "description": "High-quality wireless headphones with noise cancellation"
    },
    {
      "id": "prod-002",
      "name": "Smart Watch",
      "sales": 38000,
      "units": 380,
      "category": "Electronics",
      "price": 199.99,
      "promoPrice": 199.99,
      "stock": 85,
      "rating": 4.7,
      "description": "Feature-rich smartwatch with health tracking"
    },
    {
      "id": "prod-003",
      "name": "Laptop Stand",
      "sales": 32000,
      "units": 640,
      "category": "Electronics",
      "price": 49.99,
      "promoPrice": 49.99,
      "stock": 200,
      "rating": 4.3,
      "description": "Ergonomic laptop stand for better posture"
    },
    {
      "id": "prod-004",
      "name": "USB-C Cable",
      "sales": 28000,
      "units": 1400,
      "category": "Electronics",
      "price": 19.99,
      "promoPrice": 19.99,
      "stock": 500,
      "rating": 4.6,
      "description": "Durable USB-C charging cable"
    },
    {
      "id": "prod-005",
      "name": "Phone Case",
      "sales": 25000,
      "units": 1250,
      "category": "Electronics",
      "price": 24.99,
      "promoPrice": 24.99,
      "stock": 300,
      "rating": 4.4,
      "description": "Protective phone case with stylish design"
    },
    {
      "id": "prod-006",
      "name": "Bluetooth Speaker",
      "sales": 22000,
      "units": 275,
      "category": "Electronics",
      "price": 79.99,
      "promoPrice": 79.99,
      "stock": 120,
      "rating": 4.5,
      "description": "Portable bluetooth speaker with great sound"
    },
    {
      "id": "prod-007",
      "name": "Wireless Mouse",
      "sales": 19000,
      "units": 543,
      "category": "Electronics",
      "price": 34.99,
      "promoPrice": 34.99,
      "stock": 250,
      "rating": 4.4,
      "description": "Ergonomic wireless mouse"
    },
    {
      "id": "prod-008",
      "name": "Keyboard",
      "sales": 17000,
      "units": 189,
      "category": "Electronics",
      "price": 89.99,
      "promoPrice": 89.99,
      "stock": 180,
      "rating": 4.6,
      "description": "Mechanical keyboard with RGB lighting"
    },
    {
      "id": "prod-009",
      "name": "Webcam",
      "sales": 15000,
      "units": 214,
      "category": "Electronics",
      "price": 69.99,
      "promoPrice": 69.99,
      "stock": 95,
      "rating": 4.3,
      "description": "HD webcam for video calls"
    },
    {
      "id": "prod-010",
      "name": "Monitor Stand",
      "sales": 13000,
      "units": 236,
      "category": "Electronics",
      "price": 54.99,
      "promoPrice": 54.99,
      "stock": 140,
      "rating": 4.2,
      "description": "Adjustable monitor stand"
    }
  ],
  "recentTransactions": [
    {
      "id": "txn-001",
      "orderId": "ORD-1234",
      "date": "2026-03-15T10:30:00Z",
      "customer": "John Smith",
      "customerId": "cust-001",
      "product": "Wireless Headphones",
      "productId": "prod-001",
      "amount": 99.99,
      "quantity": 1,
      "status": "completed",
      "type": "sale",
      "paymentMethod": "Credit Card",
      "shippingAddress": "123 Main St, Melbourne, VIC 3000"
    },
    {
      "id": "txn-002",
      "orderId": "ORD-1235",
      "date": "2026-03-15T11:45:00Z",
      "customer": "Sarah Johnson",
      "customerId": "cust-002",
      "product": "Smart Watch",
      "productId": "prod-002",
      "amount": 199.99,
      "quantity": 1,
      "status": "processing",
      "type": "sale",
      "paymentMethod": "PayPal",
      "shippingAddress": "456 Oak Ave, Sydney, NSW 2000"
    },
    {
      "id": "txn-003",
      "orderId": "ORD-1236",
      "date": "2026-03-14T14:20:00Z",
      "customer": "Mike Brown",
      "customerId": "cust-003",
      "product": "Laptop Stand",
      "productId": "prod-003",
      "amount": 49.99,
      "quantity": 1,
      "status": "completed",
      "type": "sale",
      "paymentMethod": "Credit Card",
      "shippingAddress": "789 Pine Rd, Brisbane, QLD 4000"
    },
    {
      "id": "txn-004",
      "orderId": "ORD-1237",
      "date": "2026-03-14T16:10:00Z",
      "customer": "Emily Davis",
      "customerId": "cust-004",
      "product": "USB-C Cable",
      "productId": "prod-004",
      "amount": 19.99,
      "quantity": 1,
      "status": "completed",
      "type": "sale",
      "paymentMethod": "Debit Card",
      "shippingAddress": "321 Elm St, Perth, WA 6000"
    },
    {
      "id": "txn-005",
      "orderId": "ORD-1238",
      "date": "2026-03-14T09:30:00Z",
      "customer": "David Wilson",
      "customerId": "cust-005",
      "product": "Phone Case",
      "productId": "prod-005",
      "amount": 24.99,
      "quantity": 1,
      "status": "pending",
      "type": "sale",
      "paymentMethod": "Credit Card",
      "shippingAddress": "654 Maple Dr, Adelaide, SA 5000"
    },
    {
      "id": "txn-006",
      "orderId": "ORD-1239",
      "date": "2026-03-13T13:15:00Z",
      "customer": "Lisa Anderson",
      "customerId": "cust-006",
      "product": "Wireless Headphones",
      "productId": "prod-001",
      "amount": 99.99,
      "quantity": 1,
      "status": "completed",
      "type": "sale",
      "paymentMethod": "PayPal",
      "shippingAddress": "987 Cedar Ln, Hobart, TAS 7000"
    },
    {
      "id": "txn-007",
      "orderId": "ORD-1240",
      "date": "2026-03-13T15:45:00Z",
      "customer": "Tom Martinez",
      "customerId": "cust-007",
      "product": "Smart Watch",
      "productId": "prod-002",
      "amount": 199.99,
      "quantity": 1,
      "status": "completed",
      "type": "sale",
      "paymentMethod": "Credit Card",
      "shippingAddress": "147 Birch St, Canberra, ACT 2600"
    },
    {
      "id": "txn-008",
      "orderId": "ORD-1241",
      "date": "2026-03-13T08:20:00Z",
      "customer": "Anna Taylor",
      "customerId": "cust-008",
      "product": "Laptop Stand",
      "productId": "prod-003",
      "amount": 49.99,
      "quantity": 1,
      "status": "processing",
      "type": "sale",
      "paymentMethod": "Debit Card",
      "shippingAddress": "258 Spruce Ave, Darwin, NT 0800"
    }
  ],
  "australianEvents": {
    "2024": [
      {
        "date": "2024-01-26",
        "event": "Australia Day",
        "impact": "high"
      },
      {
        "date": "2024-03-29",
        "event": "Good Friday",
        "impact": "medium"
      },
      {
        "date": "2024-05-12",
        "event": "Mother's Day",
        "impact": "high"
      },
      {
        "date": "2024-06-30",
        "event": "End of Financial Year",
        "impact": "very_high"
      },
      {
        "date": "2024-09-01",
        "event": "Father's Day",
        "impact": "high"
      },
      {
        "date": "2024-11-05",
        "event": "Melbourne Cup",
        "impact": "medium"
      },
      {
        "date": "2024-11-29",
        "event": "Black Friday",
        "impact": "very_high"
      },
      {
        "date": "2024-12-25",
        "event": "Christmas",
        "impact": "very_high"
      },
      {
        "date": "2024-12-26",
        "event": "Boxing Day",
        "impact": "very_high"
      }
    ],
    "2025": [
      {
        "date": "2025-01-26",
        "event": "Australia Day",
        "impact": "low"
      },
      {
        "date": "2025-04-18",
        "event": "Good Friday",
        "impact": "low"
      },
      {
        "date": "2025-05-11",
        "event": "Mother's Day",
        "impact": "medium"
      },
      {
        "date": "2025-06-30",
        "event": "End of Financial Year",
        "impact": "high"
      },
      {
        "date": "2025-09-07",
        "event": "Father's Day",
        "impact": "medium"
      },
      {
        "date": "2025-11-04",
        "event": "Melbourne Cup",
        "impact": "low"
      },
      {
        "date": "2025-11-28",
        "event": "Black Friday",
        "impact": "high"
      },
      {
        "date": "2025-12-25",
        "event": "Christmas",
        "impact": "high"
      },
      {
        "date": "2025-12-26",
        "event": "Boxing Day",
        "impact": "high"
      }
    ],
    "2026": [
      {
        "date": "2026-01-26",
        "event": "Australia Day",
        "impact": "high"
      },
      {
        "date": "2026-04-03",
        "event": "Good Friday",
        "impact": "high"
      },
      {
        "date": "2026-05-10",
        "event": "Mother's Day",
        "impact": "high"
      }
    ]
  }
}

// API Routes

// GET /api/v1/sales/monthly
app.get('/api/v1/sales/monthly', (req, res) => {
    const { year } = req.query;
    
    // Default to current year (2026) if not specified
    const selectedYear = year || '2026';
    
    // Check if we have data for the requested year
    if (salesData.salesByYear && salesData.salesByYear[selectedYear]) {
        const yearData = salesData.salesByYear[selectedYear];
        res.json({
            year: selectedYear,
            months: salesData.months,
            revenue: yearData.revenue,
            orders: yearData.orders,
            visitors: yearData.visitors || [],
            categories: salesData.categories || {},
            trafficSources: salesData.trafficSources || {},
            topProducts: salesData.topProducts || [],
            notes: yearData.notes || {}
        });
    } else {
        // Fallback to default data
        res.json({
            year: selectedYear,
            months: salesData.months,
            revenue: salesData.revenue,
            orders: salesData.orders,
            visitors: [],
            categories: salesData.categories || {},
            trafficSources: salesData.trafficSources || {},
            topProducts: salesData.topProducts || []
        });
    }
});

// GET /api/v1/sales/yearly-comparison
app.get('/api/v1/sales/yearly-comparison', (req, res) => {
    if (!salesData.salesByYear) {
        return res.status(404).json({
            code: 'NOT_FOUND',
            message: 'Yearly data not available',
            details: 'Historical sales data by year is not configured'
        });
    }
    
    const comparison = {};
    for (const [year, data] of Object.entries(salesData.salesByYear)) {
        const totalRevenue = data.revenue.reduce((sum, val) => sum + val, 0);
        const totalOrders = data.orders.reduce((sum, val) => sum + val, 0);
        const avgMonthlyRevenue = totalRevenue / data.revenue.length;
        
        comparison[year] = {
            totalRevenue,
            totalOrders,
            avgMonthlyRevenue: parseFloat(avgMonthlyRevenue.toFixed(2)),
            monthsRecorded: data.revenue.length
        };
    }
    
    res.json({
        comparison,
        availableYears: Object.keys(salesData.salesByYear)
    });
});

// GET /api/v1/sales/events
app.get('/api/v1/sales/events', (req, res) => {
    const { year } = req.query;
    
    if (!salesData.australianEvents) {
        return res.status(404).json({
            code: 'NOT_FOUND',
            message: 'Events data not available',
            details: 'Australian events data is not configured'
        });
    }
    
    if (year && salesData.australianEvents[year]) {
        res.json({
            year,
            events: salesData.australianEvents[year]
        });
    } else {
        res.json({
            events: salesData.australianEvents,
            availableYears: Object.keys(salesData.australianEvents)
        });
    }
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

// POST /api/v1/products - Create a new product
app.post('/api/v1/products', (req, res) => {
    const { name, category, price, stock, description, rating } = req.body;
    
    // Validate required fields
    if (!name || !category || price === undefined || stock === undefined) {
        return res.status(400).json({
            code: 'BAD_REQUEST',
            message: 'Missing required fields',
            details: 'name, category, price, and stock are required fields'
        });
    }
    
    // Validate data types
    if (typeof name !== 'string' || typeof category !== 'string') {
        return res.status(400).json({
            code: 'BAD_REQUEST',
            message: 'Invalid data types',
            details: 'name and category must be strings'
        });
    }
    
    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({
            code: 'BAD_REQUEST',
            message: 'Invalid price',
            details: 'price must be a positive number'
        });
    }
    
    if (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
        return res.status(400).json({
            code: 'BAD_REQUEST',
            message: 'Invalid stock',
            details: 'stock must be a positive integer'
        });
    }
    
    // Generate new product ID
    const existingIds = salesData.topProducts.map(p => p.id);
    const maxId = existingIds.reduce((max, id) => {
        const num = parseInt(id.split('-')[1]);
        return num > max ? num : max;
    }, 0);
    const newId = `prod-${String(maxId + 1).padStart(3, '0')}`;
    
    // Create new product
    const newProduct = {
        id: newId,
        name,
        sales: 0,
        units: 0,
        category,
        price,
        promoPrice: price,
        stock,
        rating: rating || 0,
        description: description || ''
    };
    
    // Add to products array
    salesData.topProducts.push(newProduct);
    
    // Update category sales if new category
    if (!salesData.categories[category]) {
        salesData.categories[category] = 0;
    }
    
    // Save data to file for persistence
    saveData(salesData);
    
    res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product: newProduct
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
