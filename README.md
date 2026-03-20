# Ecommerce Analytics Dashboard

A comprehensive ecommerce analytics dashboard with interactive visualizations and a RESTful API following OpenAPI 3.0 standards.

## Features

### Dashboard
- 📊 **Interactive Charts**: Monthly sales trends, category breakdown, and order analytics
- 💰 **Key Metrics**: Total revenue, orders, products sold, and average order value
- 📦 **Top Products**: Visual ranking of best-selling products
- 📋 **Transaction History**: Recent orders with status tracking
- 🎨 **Modern UI**: Responsive design with gradient backgrounds and smooth animations

### API
- 🔌 **RESTful Endpoints**: Complete CRUD operations for sales, orders, products, and transactions
- 📖 **OpenAPI 3.0 Specification**: Full API documentation with Swagger UI
- 🔄 **CORS Enabled**: Ready for cross-origin requests
- 📊 **Rich Data**: Sample ecommerce data across 12 months
- 🔍 **Filtering & Pagination**: Query parameters for flexible data retrieval

## Project Structure

```
ecommerce-dashboard/
├── index.html              # Main dashboard HTML
├── styles.css              # Dashboard styling
├── dashboard.js            # Dashboard logic and charts
├── README.md              # This file
└── api/
    ├── server.js          # Express API server
    ├── package.json       # Node.js dependencies
    └── openapi.yaml       # OpenAPI 3.0 specification
```

## Getting Started

### Dashboard Setup

1. Open the dashboard directly in your browser:
   ```bash
   open index.html
   ```
   Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

2. Access the dashboard at `http://localhost:8000`

### API Setup

1. Navigate to the API directory:
   ```bash
   cd api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the API server:
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. The API will be available at:
   - **API Base URL**: `http://localhost:3000/api/v1`
   - **API Documentation**: `http://localhost:3000/api-docs`

## API Endpoints

### Sales
- `GET /api/v1/sales/monthly` - Get monthly sales data
- `GET /api/v1/sales/statistics` - Get aggregated sales statistics
- `GET /api/v1/sales/categories` - Get sales breakdown by category

### Products
- `GET /api/v1/products/top` - Get top selling products
- `GET /api/v1/products/:productId` - Get product details

### Orders
- `GET /api/v1/orders/recent` - Get recent orders
- `GET /api/v1/orders/:orderId` - Get order details

### Transactions
- `GET /api/v1/transactions` - Get transaction history with pagination

## API Examples

### Get Monthly Sales
```bash
curl http://localhost:3000/api/v1/sales/monthly
```

### Get Top 3 Products
```bash
curl http://localhost:3000/api/v1/products/top?limit=3
```

### Get Recent Completed Orders
```bash
curl http://localhost:3000/api/v1/orders/recent?status=completed&limit=5
```

### Get Transactions with Pagination
```bash
curl http://localhost:3000/api/v1/transactions?page=1&limit=10
```

## Connecting to MCP Server

The API follows OpenAPI 3.0 standards, making it compatible with MCP (Model Context Protocol) servers. To connect:

1. **OpenAPI Specification**: Use the [`api/openapi.yaml`](api/openapi.yaml) file
2. **Base URL**: Configure your MCP server to point to `http://localhost:3000/api/v1`
3. **Documentation**: Reference the Swagger UI at `http://localhost:3000/api-docs`

### MCP Integration Example

```json
{
  "mcpServers": {
    "ecommerce-analytics": {
      "type": "openapi",
      "url": "http://localhost:3000/api/v1",
      "spec": "./api/openapi.yaml"
    }
  }
}
```

## Sample Data

The dashboard and API include 12 months of sample data:
- **Total Revenue**: $812,000
- **Total Orders**: 8,120
- **Product Categories**: Electronics, Clothing, Home & Garden, Sports, Books
- **Top Products**: Wireless Headphones, Smart Watch, Laptop Stand, USB-C Cable, Phone Case

## Technologies Used

### Frontend
- HTML5
- CSS3 (with modern gradients and animations)
- JavaScript (ES6+)
- Chart.js (for data visualization)

### Backend
- Node.js
- Express.js
- Swagger UI Express
- CORS
- YAML.js

## Customization

### Adding More Data
Edit [`dashboard.js`](dashboard.js) and [`api/server.js`](api/server.js) to add more:
- Months
- Products
- Categories
- Transactions

### Styling
Modify [`styles.css`](styles.css) to customize:
- Colors
- Fonts
- Layout
- Animations

### API Endpoints
Extend [`api/server.js`](api/server.js) and update [`api/openapi.yaml`](api/openapi.yaml) to add new endpoints.

## License

MIT

## Support

For issues or questions, please refer to the API documentation at `http://localhost:3000/api-docs`