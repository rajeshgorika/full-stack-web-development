// Topic Practice: MongoDB Aggregation Pipeline Examples
const mongoose = require('mongoose');

// Example order schema for aggregation demonstrations
const orderSchema = new mongoose.Schema({
    customerName: String,
    category: String,
    amount: Number,
    status: String, // 'completed', 'pending', 'cancelled'
    orderDate: Date
});

const Order = mongoose.model('Order', orderSchema);

/**
 * Aggregation Pipeline 1:
 * Calculate total revenue, average order value, and order count grouped by category for completed orders.
 */
async function getCategoryRevenueReport() {
    return await Order.aggregate([
        // Stage 1: Filter only completed transactions
        {
            $match: {
                status: 'completed'
            }
        },
        // Stage 2: Group by category and accumulate metrics
        {
            $group: {
                _id: '$category',
                totalRevenue: { $sum: '$amount' },
                averageOrderValue: { $avg: '$amount' },
                orderCount: { $sum: 1 }
            }
        },
        // Stage 3: Sort descending by total revenue
        {
            $sort: {
                totalRevenue: -1
            }
        },
        // Stage 4: Format output document
        {
            $project: {
                _id: 0,
                category: '$_id',
                totalRevenue: { $round: ['$totalRevenue', 2] },
                averageOrderValue: { $round: ['$averageOrderValue', 2] },
                orderCount: 1
            }
        }
    ]);
}

/**
 * Aggregation Pipeline 2:
 * Find top 5 high-spending customers.
 */
async function getTopCustomers() {
    return await Order.aggregate([
        { $match: { status: 'completed' } },
        {
            $group: {
                _id: '$customerName',
                totalSpent: { $sum: '$amount' },
                purchases: { $sum: 1 }
            }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 5 }
    ]);
}

module.exports = {
    Order,
    getCategoryRevenueReport,
    getTopCustomers
};
