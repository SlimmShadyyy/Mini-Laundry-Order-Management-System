// src/controllers/orderController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ==========================================
// 1. Create Order
// ==========================================
exports.createOrder = async (req, res) => {
  try {
    const { customer, phone, items } = req.body;

    // Basic Validation
    if (!customer || !phone || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing required fields or items array is empty." });
    }

    // Securely calculate total bill on the backend
    const totalBill = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    // [BONUS] Calculate Estimated Delivery (2 days from creation)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 2);

    const order = await prisma.order.create({
      data: {
        customer,
        phone,
        totalBill,
        estimatedDelivery,
        items: {
          create: items.map(item => ({
            garmentName: item.garmentName,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true } // Return nested items in the response
    });

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order", details: error.message });
  }
};


// ==========================================
// 2. Order Status Management
// ==========================================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be RECEIVED, PROCESSING, READY, or DELIVERED." });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ message: "Status updated successfully", order });
  } catch (error) {
    console.error("Error updating status:", error);
    // Prisma specific error code for "Record not found"
    if (error.code === 'P2025') {
        return res.status(404).json({ error: "Order not found" });
    }
    res.status(500).json({ error: "Failed to update status", details: error.message });
  }
};


// ==========================================
// 3. View Orders (with Filters & Search)
// ==========================================
exports.getOrders = async (req, res) => {
  try {
    const { status, customer, phone, garment } = req.query;

    // Build dynamic query object based on provided filters
    const query = {
      where: {}
    };

    if (status) query.where.status = status;
    if (customer) query.where.customer = { contains: customer };
    if (phone) query.where.phone = { contains: phone };

    // [BONUS] Deep relation search by garment type
    if (garment) {
      query.where.items = {
        some: {
          garmentName: { contains: garment }
        }
      };
    }

    const orders = await prisma.order.findMany({
      ...query,
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders", details: error.message });
  }
};


// ==========================================
// 4. Basic Dashboard Analytics
// ==========================================
exports.getDashboard = async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();

    // Sum up all totalBill columns
    const revenueAggregation = await prisma.order.aggregate({
      _sum: { totalBill: true }
    });

    // Group orders by status and count them
    const statusGrouping = await prisma.order.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    // Format status grouping into a cleaner key-value object
    // e.g. { "RECEIVED": 5, "PROCESSING": 2 }
    const ordersPerStatus = statusGrouping.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {});

    res.status(200).json({
      totalOrders,
      totalRevenue: revenueAggregation._sum.totalBill || 0,
      ordersPerStatus
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data", details: error.message });
  }
};