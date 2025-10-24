const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname)));

// Middleware to parse JSON requests
app.use(express.json());

// CORS middleware to allow cross-origin requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

// Load API data from JSON file
let apiData = [];
try {
    const dataPath = path.join(__dirname, 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    apiData = JSON.parse(rawData);
    console.log(`✅ Loaded ${apiData.length} APIs from data.json`);
} catch (error) {
    console.error('❌ Error loading data.json:', error.message);
    apiData = [];
}

// API Routes

// Route that the HTML expects - /api/swagger-config
app.get('/api/swagger-config', (req, res) => {
    try {
        // Transform the data to match what the frontend expects
        const response = {
            urls: apiData,
            validatorUrl: null
        };
        
        console.log(`📡 Serving swagger-config with ${apiData.length} APIs`);
        res.json(response);
    } catch (error) {
        console.error('❌ Error serving swagger config:', error.message);
        res.status(500).json({ 
            error: 'Failed to load API configuration',
            urls: [],
            validatorUrl: null 
        });
    }
});

// Route to get all APIs
app.get('/api/apis', (req, res) => {
    try {
        console.log(`📡 Serving ${apiData.length} APIs`);
        res.json(apiData);
    } catch (error) {
        console.error('❌ Error serving APIs:', error.message);
        res.status(500).json({ error: 'Failed to load APIs' });
    }
});

// Route to search APIs
app.get('/api/search', (req, res) => {
    try {
        const query = req.query.q?.toLowerCase() || '';
        
        if (!query) {
            return res.json(apiData);
        }
        
        const filteredApis = apiData.filter(api => 
            api.name.toLowerCase().includes(query) ||
            api.url.toLowerCase().includes(query)
        );
        
        console.log(`🔍 Search "${query}" returned ${filteredApis.length} results`);
        res.json(filteredApis);
    } catch (error) {
        console.error('❌ Error searching APIs:', error.message);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Route to get specific API by name
app.get('/api/apis/:name', (req, res) => {
    try {
        const apiName = req.params.name;
        const api = apiData.find(a => a.name === apiName);
        
        if (!api) {
            return res.status(404).json({ error: 'API not found' });
        }
        
        console.log(`📡 Serving specific API: ${apiName}`);
        res.json(api);
    } catch (error) {
        console.error('❌ Error serving specific API:', error.message);
        res.status(500).json({ error: 'Failed to load API' });
    }
});

// Base API endpoint - provides API information
app.get('/api', (req, res) => {
    try {
        console.log('📡 Serving base API information');
        res.json({
            message: 'API Portal Server',
            version: '1.0.0',
            endpoints: {
                'swagger-config': '/api/swagger-config',
                'apis': '/api/apis', 
                'search': '/api/search?q=term',
                'health': '/health',
                'docs': '/api/*/api-docs'
            },
            totalApis: apiData.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Error serving base API info:', error.message);
        res.status(500).json({ error: 'Failed to load API information' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        apisLoaded: apiData.length,
        uptime: process.uptime()
    });
});

// Serve the main HTML file on root route
app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, 'index.html');
    console.log('📄 Serving index.html');
    res.sendFile(htmlPath);
});

// Proxy routes for actual API documentation
// This will forward requests to the actual Swagger docs if they exist
app.get('/api/*/api-docs', (req, res) => {
    // Extract the API path from the URL
    const apiPath = req.path;
    console.log(`🔄 API docs request for: ${apiPath}`);
    
    // For now, return a basic Swagger spec structure
    // In a real scenario, you'd proxy this to your actual API services
    const basicSwaggerSpec = {
        openapi: "3.0.0",
        info: {
            title: `API Documentation - ${apiPath}`,
            version: "1.0.0",
            description: `Documentation for ${apiPath}`
        },
        paths: {
            "/users": {
                get: {
                    summary: "Get all users",
                    description: "Retrieve a list of all users",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer", example: 1 },
                                                name: { type: "string", example: "John Doe" },
                                                email: { type: "string", example: "john@example.com" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                post: {
                    summary: "Create a new user",
                    description: "Create a new user account",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string", example: "Jane Doe" },
                                        email: { type: "string", example: "jane@example.com" }
                                    },
                                    required: ["name", "email"]
                                }
                            }
                        }
                    },
                    responses: {
                        "201": {
                            description: "User created successfully"
                        }
                    }
                }
            },
            "/users/{id}": {
                get: {
                    summary: "Get user by ID",
                    description: "Retrieve a specific user by their ID",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: { type: "integer" },
                            example: 1
                        }
                    ],
                    responses: {
                        "200": {
                            description: "User found"
                        },
                        "404": {
                            description: "User not found"
                        }
                    }
                },
                put: {
                    summary: "Update user",
                    description: "Update an existing user's information",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: { type: "integer" }
                        }
                    ],
                    responses: {
                        "200": {
                            description: "User updated successfully"
                        }
                    }
                },
                delete: {
                    summary: "Delete user",
                    description: "Delete a user account",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: { type: "integer" }
                        }
                    ],
                    responses: {
                        "204": {
                            description: "User deleted successfully"
                        }
                    }
                }
            },
            "/products": {
                get: {
                    summary: "Get all products",
                    description: "Retrieve a list of all products",
                    parameters: [
                        {
                            name: "limit",
                            in: "query",
                            schema: { type: "integer", default: 10 }
                        },
                        {
                            name: "category",
                            in: "query",
                            schema: { type: "string" }
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Products retrieved successfully"
                        }
                    }
                },
                post: {
                    summary: "Create product",
                    description: "Create a new product",
                    responses: {
                        "201": {
                            description: "Product created successfully"
                        }
                    }
                }
            },
            "/products/{id}": {
                get: {
                    summary: "Get product by ID",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: { type: "integer" }
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Product found"
                        }
                    }
                },
                put: {
                    summary: "Update product",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: { type: "integer" }
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Product updated"
                        }
                    }
                }
            },
            "/orders": {
                get: {
                    summary: "Get all orders",
                    description: "Retrieve a list of orders",
                    parameters: [
                        {
                            name: "status",
                            in: "query",
                            schema: { type: "string", enum: ["pending", "completed", "cancelled"] }
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Orders retrieved"
                        }
                    }
                },
                post: {
                    summary: "Create order",
                    description: "Place a new order",
                    responses: {
                        "201": {
                            description: "Order created"
                        }
                    }
                }
            },
            "/orders/{id}": {
                get: {
                    summary: "Get order by ID",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: { type: "string" }
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Order found"
                        }
                    }
                },
                patch: {
                    summary: "Update order status",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: { type: "string" }
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Order status updated"
                        }
                    }
                }
            },
            "/categories": {
                get: {
                    summary: "Get all categories",
                    responses: {
                        "200": {
                            description: "Categories retrieved"
                        }
                    }
                },
                post: {
                    summary: "Create category",
                    responses: {
                        "201": {
                            description: "Category created"
                        }
                    }
                }
            },
            "/categories/{id}": {
                get: {
                    summary: "Get category by ID",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: { type: "integer" }
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Category found"
                        }
                    }
                },
                delete: {
                    summary: "Delete category",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: { type: "integer" }
                        }
                    ],
                    responses: {
                        "204": {
                            description: "Category deleted"
                        }
                    }
                }
            },
            "/auth/login": {
                post: {
                    summary: "User login",
                    description: "Authenticate user credentials",
                    responses: {
                        "200": {
                            description: "Login successful"
                        },
                        "401": {
                            description: "Invalid credentials"
                        }
                    }
                }
            },
            "/auth/logout": {
                post: {
                    summary: "User logout",
                    description: "Logout current user",
                    responses: {
                        "200": {
                            description: "Logout successful"
                        }
                    }
                }
            },
            "/auth/register": {
                post: {
                    summary: "User registration",
                    description: "Register a new user account",
                    responses: {
                        "201": {
                            description: "Registration successful"
                        }
                    }
                }
            },
            "/reports/sales": {
                get: {
                    summary: "Get sales report",
                    parameters: [
                        {
                            name: "start_date",
                            in: "query",
                            schema: { type: "string", format: "date" }
                        },
                        {
                            name: "end_date",
                            in: "query",
                            schema: { type: "string", format: "date" }
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Sales report generated"
                        }
                    }
                }
            },
            "/notifications": {
                get: {
                    summary: "Get notifications",
                    parameters: [
                        {
                            name: "unread_only",
                            in: "query",
                            schema: { type: "boolean", default: false }
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Notifications retrieved"
                        }
                    }
                }
            },
            "/search": {
                get: {
                    summary: "Search across resources",
                    parameters: [
                        {
                            name: "q",
                            in: "query",
                            required: true,
                            schema: { type: "string" }
                        },
                        {
                            name: "type",
                            in: "query",
                            schema: { type: "string", enum: ["users", "products", "orders"] }
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Search results"
                        }
                    }
                }
            }
        }
    };
    
    res.json(basicSwaggerSpec);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    console.log(`❓ 404 - Route not found: ${req.path}`);
    res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
    console.log('\n🚀 ========================================');
    console.log(`📋 API Portal Server Started!`);
    console.log(`🌐 Server running at: http://localhost:${PORT}`);
    console.log(`📊 APIs loaded: ${apiData.length}`);
    console.log(`📂 Serving static files from: ${__dirname}`);
    console.log('🚀 ========================================\n');
    
    // Log available endpoints
    console.log('📡 Available endpoints:');
    console.log(`   GET  /                     - Main portal page`);
    console.log(`   GET  /api                  - API information`);
    console.log(`   GET  /api/swagger-config   - Swagger configuration`);
    console.log(`   GET  /api/apis             - All APIs`);
    console.log(`   GET  /api/search?q=term    - Search APIs`);
    console.log(`   GET  /api/apis/:name       - Specific API`);
    console.log(`   GET  /health               - Health check`);
    console.log(`   GET  /api/*/api-docs       - API documentation`);
    console.log('\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    process.exit(0);
});
