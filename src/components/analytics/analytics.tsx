import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiShoppingBag, FiUsers, FiDollarSign, FiPackage, FiRefreshCw } from 'react-icons/fi';
import {
  useGetDashboardAnalyticsQuery,
  useGetRecentSalesQuery,
  useGetTopProductsQuery,
  useGetCategoryRevenueQuery,
} from '../../apis/analytics';

const Analytics = () => {
  // API hooks
  const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError, refetch: refetchDashboard } = useGetDashboardAnalyticsQuery();
  const { data: recentSalesData, isLoading: isRecentSalesLoading, error: recentSalesError } = useGetRecentSalesQuery();
  const { data: topProductsData, isLoading: isTopProductsLoading, error: topProductsError } = useGetTopProductsQuery({ limit: 5 });
  const { data: categoryData, isLoading: isCategoryLoading, error: categoryError } = useGetCategoryRevenueQuery();

  // Extract data from API responses
  const analytics = dashboardData?.data;
  const recentSales = recentSalesData?.data || [];
  const topProducts = topProductsData?.data || [];
  const categoryBreakdown = categoryData?.data || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Loading state
  if (isDashboardLoading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center h-64">
          <FiRefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-slate-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (dashboardError) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-600 mb-4">
            <FiTrendingDown className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Failed to load analytics</h2>
          <p className="text-slate-600 mb-4">There was an error loading the analytics data.</p>
          <button
            onClick={() => refetchDashboard()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Analytics Dashboard</h1>
          <p className="text-slate-600">Track your store performance and insights</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">
                {analytics ? formatCurrency(analytics.totalRevenue) : '₨0'}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${(analytics?.revenueChange ?? 0) >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <FiDollarSign className={`w-6 h-6 ${(analytics?.revenueChange ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          <div className={`text-sm mt-2 flex items-center ${getChangeColor(analytics?.revenueChange || 0)}`}>
            {getChangeIcon(analytics?.revenueChange || 0)}
            <span className="ml-1">
              {analytics?.revenueChange ? `${analytics.revenueChange > 0 ? '+' : ''}${analytics.revenueChange}%` : '0%'} from last month
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900">
                {analytics ? formatNumber(analytics.totalOrders) : '0'}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${(analytics?.ordersChange ?? 0) >= 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
              <FiShoppingBag className={`w-6 h-6 ${(analytics?.ordersChange ?? 0) >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
            </div>
          </div>
          <div className={`text-sm mt-2 flex items-center ${getChangeColor(analytics?.ordersChange || 0)}`}>
            {getChangeIcon(analytics?.ordersChange || 0)}
            <span className="ml-1">
              {analytics?.ordersChange ? `${analytics.ordersChange > 0 ? '+' : ''}${analytics.ordersChange}%` : '0%'} from last month
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Customers</p>
              <p className="text-2xl font-bold text-slate-900">
                {analytics ? formatNumber(analytics.totalCustomers) : '0'}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${(analytics?.customersChange ?? 0) >= 0 ? 'bg-purple-100' : 'bg-red-100'}`}>
              <FiUsers className={`w-6 h-6 ${(analytics?.customersChange ?? 0) >= 0 ? 'text-purple-600' : 'text-red-600'}`} />
            </div>
          </div>
          <div className={`text-sm mt-2 flex items-center ${getChangeColor(analytics?.customersChange || 0)}`}>
            {getChangeIcon(analytics?.customersChange || 0)}
            <span className="ml-1">
              {analytics?.customersChange ? `${analytics.customersChange > 0 ? '+' : ''}${analytics.customersChange}%` : '0%'} from last month
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Products</p>
              <p className="text-2xl font-bold text-slate-900">
                {analytics ? formatNumber(analytics.totalProducts) : '0'}
              </p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <FiPackage className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-2">Active products</p>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Recent Sales (7 days)</h3>
            {isRecentSalesLoading && <FiRefreshCw className="w-4 h-4 animate-spin text-blue-600" />}
          </div>
          <div className="space-y-4">
            {isRecentSalesLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-slate-200 rounded-lg"></div>
                    <div>
                      <div className="h-4 bg-slate-200 rounded w-16 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-12"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-16"></div>
                  </div>
                </div>
              ))
            ) : recentSales.length > 0 ? (
              recentSales.map((sale, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiShoppingBag className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{formatDate(sale.date)}</p>
                      <p className="text-sm text-slate-500">{sale.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{formatCurrency(sale.revenue)}</p>
                    <p className="text-sm text-slate-500">{sale.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <FiShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No sales data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Top Performing Products</h3>
            {isTopProductsLoading && <FiRefreshCw className="w-4 h-4 animate-spin text-green-600" />}
          </div>
          <div className="space-y-4">
            {isTopProductsLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-slate-200 rounded-lg"></div>
                    <div>
                      <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-16"></div>
                  </div>
                </div>
              ))
            ) : topProducts.length > 0 ? (
              topProducts.map((product, index) => (
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
                    <p className="text-sm text-slate-500">{product.sales} sold</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <FiPackage className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No product data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revenue by Category */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Revenue by Category</h3>
          {isCategoryLoading && <FiRefreshCw className="w-4 h-4 animate-spin text-purple-600" />}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isCategoryLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="text-center p-4 bg-slate-50 rounded-lg animate-pulse">
                <div className="h-8 bg-slate-200 rounded w-24 mx-auto mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-16 mx-auto mb-1"></div>
                <div className="h-3 bg-slate-200 rounded w-20 mx-auto"></div>
              </div>
            ))
          ) : categoryBreakdown.length > 0 ? (
            categoryBreakdown.map((category: any, index: number) => (
              <div key={index} className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900 mb-2">{formatCurrency(category.revenue)}</div>
                <div className="text-sm text-slate-600">{category.category}</div>
                <div className="text-xs text-slate-500 mt-1">{category.percentage}% of total</div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-slate-500">
              <FiDollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No category data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Revenue by Order Status */}
      {analytics?.revenueByStatus && (
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue by Order Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700 mb-2">
                {formatCurrency(analytics.revenueByStatus.delivered)}
              </div>
              <div className="text-sm text-green-600 font-medium">Delivered Orders</div>
              <div className="text-xs text-green-500 mt-1">
                {analytics.totalRevenue > 0 
                  ? `${Math.round((analytics.revenueByStatus.delivered / analytics.totalRevenue) * 100)}% of total`
                  : '0% of total'
                }
              </div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-700 mb-2">
                {formatCurrency(analytics.revenueByStatus.pending)}
              </div>
              <div className="text-sm text-yellow-600 font-medium">Pending Orders</div>
              <div className="text-xs text-yellow-500 mt-1">
                {analytics.totalRevenue > 0 
                  ? `${Math.round((analytics.revenueByStatus.pending / analytics.totalRevenue) * 100)}% of total`
                  : '0% of total'
                }
              </div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700 mb-2">
                {formatCurrency(analytics.revenueByStatus.processing)}
              </div>
              <div className="text-sm text-blue-600 font-medium">Processing Orders</div>
              <div className="text-xs text-blue-500 mt-1">
                {analytics.totalRevenue > 0 
                  ? `${Math.round((analytics.revenueByStatus.processing / analytics.totalRevenue) * 100)}% of total`
                  : '0% of total'
                }
              </div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-700 mb-2">
                {formatCurrency(analytics.revenueByStatus.cancelled)}
              </div>
              <div className="text-sm text-red-600 font-medium">Cancelled Orders</div>
              <div className="text-xs text-red-500 mt-1">
                {analytics.totalRevenue > 0 
                  ? `${Math.round((analytics.revenueByStatus.cancelled / analytics.totalRevenue) * 100)}% of total`
                  : '0% of total'
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
