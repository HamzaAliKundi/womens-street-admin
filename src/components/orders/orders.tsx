import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEye, FiChevronDown, FiDownload, FiUser, FiMapPin, FiPhone, FiMail, FiPackage, FiTruck, FiCalendar, FiRefreshCw } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import { 
  useGetAllOrdersQuery, 
  useUpdateOrderStatusMutation,
  type Order 
} from '../../apis/orders';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // API hooks
  const { data: ordersData, isLoading, error, refetch } = useGetAllOrdersQuery({
    page: currentPage,
    limit: 10,
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    search: debouncedSearchTerm || undefined,
  }, {
    refetchOnMountOrArgChange: true,
  });

  const [updateOrderStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();

  const orders = ordersData?.orders || [];
  const totalPages = ordersData?.pagination?.pages || 1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-indigo-100 text-indigo-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ 
        orderId, 
        status: newStatus as Order['status'] 
      }).unwrap();
      
      setEditingStatus(null);
      toast.success(`Order status updated to ${getStatusLabel(newStatus)}`);
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status. Please try again.');
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'confirmed':
        return '✔️';
      case 'processing':
        return '⚙️';
      case 'shipped':
        return '📦';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  const getNextStatus = (currentStatus: string): Order['status'] | null => {
    switch (currentStatus) {
      case 'pending':
        return 'confirmed';
      case 'confirmed':
        return 'processing';
      case 'processing':
        return 'shipped';
      case 'shipped':
        return 'delivered';
      default:
        return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          <div className="flex items-center justify-between">
            <span>Error loading orders. Please try again.</span>
            <button
              onClick={() => refetch()}
              className="ml-4 text-red-800 hover:text-red-900"
            >
              <FiRefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleDownloadReceipt = async (order: Order) => {
    try {
      // Create a temporary receipt element
      const receiptElement = document.createElement('div');
      receiptElement.innerHTML = `
        <div style="
          width: 400px; 
          min-height: 600px;
          padding: 20px; 
          background: white; 
          font-family: Arial, sans-serif;
          border: 2px solid #1e293b;
          border-radius: 8px;
          box-sizing: border-box;
          overflow: visible;
        ">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #1e293b; padding-bottom: 15px;">
            <h1 style="margin: 0; color: #1e293b; font-size: 24px; font-weight: bold;">Women's Street</h1>
            <p style="margin: 5px 0; color: #64748b; font-size: 14px;">Elegant Fashion Store</p>
            <p style="margin: 5px 0; color: #64748b; font-size: 12px;">Order Receipt</p>
          </div>

          <!-- Order Info -->
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
              📋 Order Information
            </h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #64748b;">Order ID:</span>
              <span style="color: #1e293b; font-weight: bold;">#${order.orderNumber}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #64748b;">Order Date:</span>
              <span style="color: #1e293b;">${new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #64748b;">Status:</span>
              <span style="color: #1e293b; font-weight: bold;">${getStatusLabel(order.status)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #64748b;">Total Amount:</span>
              <span style="color: #1e293b; font-weight: bold; font-size: 18px;">${formatPrice(order.finalTotal)}</span>
            </div>
          </div>

          <!-- Customer Info -->
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
              👤 Customer Information
            </h3>
            <div style="margin-bottom: 8px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">Name:</div>
              <div style="color: #1e293b; font-weight: bold; font-size: 14px;">${order.customerDetails.name}</div>
            </div>
            <div style="margin-bottom: 8px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">Phone:</div>
              <div style="color: #1e293b; font-size: 14px;">${order.customerDetails.phone}</div>
            </div>
            <div style="margin-bottom: 8px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">Email:</div>
              <div style="color: #1e293b; font-size: 14px;">${order.customerDetails.email}</div>
            </div>
            <div style="margin-bottom: 8px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">Address:</div>
              <div style="color: #1e293b; font-size: 14px;">${order.customerDetails.address}</div>
            </div>
            <div style="margin-bottom: 8px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">City:</div>
              <div style="color: #1e293b; font-size: 14px;">${order.customerDetails.city}</div>
            </div>
            <div style="margin-bottom: 8px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">Postal Code:</div>
              <div style="color: #1e293b; font-size: 14px;">${order.customerDetails.postalCode}</div>
            </div>
          </div>

          <!-- Delivery Info -->
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
              🚚 Delivery Information
            </h3>
            <div style="margin-bottom: 8px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">Payment Method:</div>
              <div style="color: #1e293b; font-size: 14px; font-weight: bold;">${order.paymentMethod}</div>
            </div>
            <div style="margin-bottom: 8px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">Nearby Place:</div>
              <div style="color: #1e293b; font-size: 14px;">${order.customerDetails.nearbyPlace}</div>
            </div>
            <div style="margin-bottom: 8px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">Total Items:</div>
              <div style="color: #1e293b; font-size: 14px; font-weight: bold;">${order.totalItems}</div>
            </div>
            ${order.customerDetails.notes ? `
            <div style="margin-bottom: 8px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">Special Instructions:</div>
              <div style="color: #1e293b; font-size: 14px; font-style: italic; background: #f8fafc; padding: 8px; border-radius: 4px;">"${order.customerDetails.notes}"</div>
            </div>
            ` : ''}
          </div>

          <!-- Items -->
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
              🛍️ Order Items
            </h3>
            ${order.items.map(item => `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 8px; background: #f8fafc; border-radius: 4px;">
                <div>
                  <div style="color: #1e293b; font-weight: bold; font-size: 14px;">${item.name}</div>
                  <div style="color: #64748b; font-size: 12px;">Qty: ${item.quantity}</div>
                </div>
                <div style="text-align: right;">
                  <div style="color: #1e293b; font-weight: bold;">${formatPrice(item.price)}</div>
                  <div style="color: #64748b; font-size: 12px;">${formatPrice(item.price * item.quantity)}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Order Summary -->
          <div style="margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px;">💰 Order Summary</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #64748b;">Subtotal:</span>
              <span style="color: #1e293b;">${formatPrice(order.totalAmount)}</span>
            </div>
            ${order.shippingCost > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #64748b;">Shipping:</span>
              <span style="color: #1e293b;">${formatPrice(order.shippingCost)}</span>
            </div>
            ` : ''}
            ${order.tax > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #64748b;">Tax:</span>
              <span style="color: #1e293b;">${formatPrice(order.tax)}</span>
            </div>
            ` : ''}
            <div style="border-top: 1px solid #e2e8f0; margin-top: 8px; padding-top: 8px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #1e293b; font-weight: bold; font-size: 16px;">Total:</span>
                <span style="color: #1e293b; font-weight: bold; font-size: 18px;">${formatPrice(order.finalTotal)}</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 2px solid #1e293b;">
            <div style="margin-bottom: 10px;">
              <p style="margin: 5px 0; color: #1e293b; font-weight: bold; font-size: 14px;">Thank you for shopping with us! 🎉</p>
              <p style="margin: 5px 0; color: #64748b; font-size: 12px;">We appreciate your business and hope you love your purchase!</p>
            </div>
            <div style="background: #f1f5f9; padding: 8px; border-radius: 4px; margin: 10px 0;">
              <p style="margin: 2px 0; color: #64748b; font-size: 10px;">Order #${order.orderNumber}</p>
              <p style="margin: 2px 0; color: #64748b; font-size: 10px;">Generated on ${new Date().toLocaleString()}</p>
              <p style="margin: 2px 0; color: #64748b; font-size: 10px;">Women's Street - Elegant Fashion Store</p>
            </div>
          </div>
        </div>
      `;

      // Add to DOM temporarily with proper positioning
      receiptElement.style.position = 'absolute';
      receiptElement.style.top = '-9999px';
      receiptElement.style.left = '-9999px';
      receiptElement.style.zIndex = '-1';
      receiptElement.style.visibility = 'hidden';
      document.body.appendChild(receiptElement);
      
      // Ensure content is fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      // Convert to canvas with dynamic height
      const canvas = await html2canvas(receiptElement, {
        backgroundColor: 'white',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
        logging: false,
        width: 400,
        // Let height be auto-calculated based on content
        scrollX: 0,
        scrollY: 0
      });

      // Remove temporary element
      document.body.removeChild(receiptElement);

      // Download as image
      const link = document.createElement('a');
      link.download = `order-${order.orderNumber}-receipt.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast.success('Receipt downloaded successfully!');
    } catch (error) {
      console.error('Failed to generate receipt:', error);
      toast.error('Failed to generate receipt. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Orders Management</h1>
          <p className="text-slate-600">Track and manage customer orders, shipping, and delivery</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by customer name or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{order.orderNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{order.customerDetails.name}</div>
                      <div className="text-sm text-slate-500">{order.customerDetails.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">
                      {order.items.map((item, index) => (
                        <div key={index} className="mb-1">
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-slate-900">{formatPrice(order.finalTotal)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      <span className="mr-1">{getStatusIcon(order.status)}</span>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{formatDate(order.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadReceipt(order)}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Download Receipt"
                      >
                        <FiDownload className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className="text-xs border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          title="Change Status"
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="confirmed">✅ Confirmed</option>
                          <option value="processing">⚙️ Processing</option>
                          <option value="shipped">📦 Shipped</option>
                          <option value="delivered">🎉 Delivered</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {orders.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No orders found</h3>
            <p className="text-slate-600 mb-4">Try adjusting your search or status filter</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  Order Details - #{selectedOrder.orderNumber}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadReceipt(selectedOrder)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <FiDownload className="w-4 h-4" />
                    Download Receipt
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-slate-500 hover:text-slate-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-slate-900 mb-2 flex items-center">
                      <FiUser className="w-4 h-4 mr-2" />
                      Customer Information
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                      <p className="text-sm"><span className="font-medium text-slate-700">Name:</span> <span className="text-slate-900">{selectedOrder.customerDetails.name}</span></p>
                      <p className="text-sm"><span className="font-medium text-slate-700">Email:</span> <span className="text-slate-900">{selectedOrder.customerDetails.email}</span></p>
                      <p className="text-sm"><span className="font-medium text-slate-700">Phone:</span> <span className="text-slate-900">{selectedOrder.customerDetails.phone}</span></p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 mb-2 flex items-center">
                      <FiPackage className="w-4 h-4 mr-2" />
                      Order Information
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                      <p className="text-sm"><span className="font-medium text-slate-700">Order ID:</span> <span className="text-slate-900">{selectedOrder.orderNumber}</span></p>
                      <p className="text-sm"><span className="font-medium text-slate-700">Date:</span> <span className="text-slate-900">{formatDate(selectedOrder.createdAt)}</span></p>
                      <p className="text-sm"><span className="font-medium text-slate-700">Payment:</span> <span className="text-slate-900">{selectedOrder.paymentMethod}</span></p>
                      <p className="text-sm"><span className="font-medium text-slate-700">Status:</span> 
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusIcon(selectedOrder.status)} {getStatusLabel(selectedOrder.status)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                <div>
                  <h3 className="font-medium text-slate-900 mb-2 flex items-center">
                    <FiTruck className="w-4 h-4 mr-2" />
                    Delivery Information
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium text-slate-700 flex items-center">
                            <FiMapPin className="w-3 h-3 mr-1" />
                            Full Address:
                          </span>
                          <span className="text-slate-900 block mt-1">{selectedOrder.customerDetails.address}</span>
                        </p>
                        <p className="text-sm"><span className="font-medium text-slate-700">City:</span> <span className="text-slate-900">{selectedOrder.customerDetails.city}</span></p>
                        <p className="text-sm"><span className="font-medium text-slate-700">Postal Code:</span> <span className="text-slate-900">{selectedOrder.customerDetails.postalCode}</span></p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm"><span className="font-medium text-slate-700">Nearby Place:</span> <span className="text-slate-900">{selectedOrder.customerDetails.nearbyPlace}</span></p>
                        <p className="text-sm"><span className="font-medium text-slate-700">Total Items:</span> <span className="text-slate-900">{selectedOrder.totalItems}</span></p>
                        <p className="text-sm"><span className="font-medium text-slate-700">Total Amount:</span> <span className="text-slate-900 font-semibold">{formatPrice(selectedOrder.finalTotal)}</span></p>
                      </div>
                    </div>
                    {selectedOrder.customerDetails.notes && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-sm">
                          <span className="font-medium text-slate-700">Special Instructions:</span>
                          <span className="text-slate-900 block mt-1 italic">"{selectedOrder.customerDetails.notes}"</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-slate-900 mb-2">Products</h3>
                  <div className="bg-slate-50 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-600">Product</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-600">Quantity</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-600">Price</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-600">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index} className="border-t border-slate-200">
                            <td className="px-4 py-2 text-sm text-slate-900">{item.name}</td>
                            <td className="px-4 py-2 text-sm text-slate-900">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm text-slate-900">{formatPrice(item.price)}</td>
                            <td className="px-4 py-2 text-sm text-slate-900">{formatPrice(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-slate-900">
                    Total: {formatPrice(selectedOrder.finalTotal)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
