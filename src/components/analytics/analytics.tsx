import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiShoppingBag, FiUsers, FiDollarSign, FiPackage } from 'react-icons/fi';

// Mock analytics data - replace with real API calls
const mockAnalytics = {
  totalRevenue: 15420.50,
  totalOrders: 89,
  totalCustomers: 67,
  totalProducts: 24,
  revenueChange: 12.5,
  ordersChange: -2.3,
  customersChange: 8.7,
  productsChange: 15.2,
  recentSales: [
    { date: '2024-01-15', revenue: 1250.00, orders: 8 },
    { date: '2024-01-14', revenue: 980.50, orders: 6 },
    { date: '2024-01-13', revenue: 2100.00, orders: 12 },
    { date: '2024-01-12', revenue: 875.25, orders: 5 },
    { date: '2024-01-11', revenue: 1650.75, orders: 9 },
    { date: '2024-01-10', revenue: 1420.00, orders: 8 },
    { date: '2024-01-09', revenue: 1100.00, orders: 7 }
  ],
  topProducts: [
    { name: "Elegant Leather Tote Bag", sales: 15, revenue: 1349.85 },
    { name: "Diamond Stud Earrings", sales: 12, revenue: 3599.88 },
    { name: "Designer Crossbody Bag", sales: 18, revenue: 1179.00 },
    { name: "Luxury Evening Clutch", sales: 8, revenue: 960.00 },
    { name: "Pearl Necklace Set", sales: 14, revenue: 1190.00 }
  ],
  categoryBreakdown: [
    { category: "Bags", revenue: 8920.50, percentage: 57.8 },
    { category: "Jewellery", revenue: 6500.00, percentage: 42.2 }
  ]
};

const Analytics = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />;
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Analytics Dashboard</h1>
          <p className="text-slate-600">Track your store performance and insights</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Export Report
          </button>
          <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors">
            View Details
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">₨125,000</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">+12.5% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900">1,234</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <FiShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-2">+8.2% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Customers</p>
              <p className="text-2xl font-bold text-slate-900">567</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <FiUsers className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-purple-600 mt-2">+15.3% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Products</p>
              <p className="text-2xl font-bold text-slate-900">89</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <FiPackage className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-2">+5.7% from last month</p>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Sales (7 days)</h3>
          <div className="space-y-4">
            {mockAnalytics.recentSales.map((sale, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiShoppingBag className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    <p className="text-sm text-slate-500">{sale.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatCurrency(sale.revenue)}</p>
                  <p className="text-sm text-slate-500">{sale.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Performing Products</h3>
          <div className="space-y-4">
            {mockAnalytics.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiPackage className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-500">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatCurrency(product.revenue)}</p>
                  <p className="text-sm text-slate-500">{product.sales} sales</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by Category */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockAnalytics.categoryBreakdown.map((category, index) => (
            <div key={index} className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 mb-2">{formatCurrency(category.revenue)}</div>
              <div className="text-sm text-slate-600">{category.category}</div>
              <div className="text-xs text-slate-500 mt-1">{category.percentage}% of total</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Export Report
          </button>
          <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors">
            View Detailed Analytics
          </button>
          <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors">
            Set Goals
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
