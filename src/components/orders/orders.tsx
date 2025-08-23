import React, { useState, useRef } from 'react';
import { FiSearch, FiFilter, FiEye, FiChevronDown, FiDownload, FiUser, FiMapPin, FiPhone, FiMail, FiPackage, FiTruck, FiCalendar } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

// Order interface
interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  customerPhone?: string;
  customerAddress?: string;
  deliveryMethod?: string;
  expectedDelivery?: string;
}

// Mock orders data - replace with real API calls
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Aisha Khan",
    customerEmail: "aisha.khan@email.com",
    products: [
      { name: "Elegant Leather Tote Bag", quantity: 1, price: 2500 },
      { name: "Pearl Hair Clip Set", quantity: 2, price: 1200 }
    ],
    total: 4900,
    status: "pending",
    orderDate: "2024-01-15"
  },
  {
    id: "ORD-002",
    customerName: "Fatima Ahmed",
    customerEmail: "fatima.ahmed@email.com",
    products: [
      { name: "Designer Crossbody Bag", quantity: 1, price: 1800 }
    ],
    total: 1800,
    status: "processing",
    orderDate: "2024-01-14"
  },
  {
    id: "ORD-003",
    customerName: "Zara Malik",
    customerEmail: "zara.malik@email.com",
    products: [
      { name: "Diamond Stud Earrings", quantity: 1, price: 8500 }
    ],
    total: 8500,
    status: "shipped",
    orderDate: "2024-01-13"
  },
  {
    id: "ORD-004",
    customerName: "Sana Hassan",
    customerEmail: "sana.hassan@email.com",
    products: [
      { name: "Elegant Leather Tote Bag", quantity: 1, price: 2500 },
      { name: "Designer Crossbody Bag", quantity: 1, price: 1800 }
    ],
    total: 4300,
    status: "delivered",
    orderDate: "2024-01-12"
  }
];

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
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
      day: 'numeric'
    });
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' }
        : order
    ));
    setEditingStatus(null);
    toast.success(`Order status updated to ${getStatusLabel(newStatus)}`);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
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
        return 'processing';
      case 'processing':
        return 'shipped';
      case 'shipped':
        return 'delivered';
      default:
        return null;
    }
  };

  const handleDownloadReceipt = async (order: Order) => {
    try {
      // Create a temporary receipt element
      const receiptElement = document.createElement('div');
      receiptElement.innerHTML = `
        <div style="
          width: 400px; 
          padding: 20px; 
          background: white; 
          font-family: Arial, sans-serif;
          border: 2px solid #1e293b;
          border-radius: 8px;
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
              <span style="color: #1e293b; font-weight: bold;">#${order.id}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #64748b;">Order Date:</span>
              <span style="color: #1e293b;">${new Date(order.orderDate).toLocaleDateString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #64748b;">Status:</span>
              <span style="color: #1e293b; font-weight: bold;">${getStatusLabel(order.status)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #64748b;">Total Amount:</span>
              <span style="color: #1e293b; font-weight: bold; font-size: 18px;">${formatPrice(order.total)}</span>
            </div>
          </div>

          <!-- Customer Info -->
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
              👤 Customer Information
            </h3>
            <div style="margin-bottom: 8px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">Name:</div>
              <div style="color: #1e293b; font-weight: bold; font-size: 14px;">${order.customerName}</div>
            </div>
            <div style="margin-bottom: 8px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">Phone:</div>
              <div style="color: #1e293b; font-size: 14px;">${order.customerPhone}</div>
            </div>
            <div style="margin-bottom: 8px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">Email:</div>
              <div style="color: #1e293b; font-size: 14px;">${order.customerEmail}</div>
            </div>
            <div style="margin-bottom: 8px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">Address:</div>
              <div style="color: #1e293b; font-size: 14px;">${order.customerAddress}</div>
            </div>
          </div>

          <!-- Delivery Info -->
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
              🚚 Delivery Information
            </h3>
            <div style="margin-bottom: 8px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">Delivery Method:</div>
              <div style="color: #1e293b; font-size: 14px;">${order.deliveryMethod}</div>
            </div>
            <div style="margin-bottom: 8px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">Expected Delivery:</div>
              <div style="color: #1e293b; font-size: 14px;">${order.expectedDelivery}</div>
            </div>
          </div>

          <!-- Items -->
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
              🛍️ Order Items
            </h3>
            ${order.products.map(product => `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 8px; background: #f8fafc; border-radius: 4px;">
                <div>
                  <div style="color: #1e293b; font-weight: bold; font-size: 14px;">${product.name}</div>
                  <div style="color: #64748b; font-size: 12px;">Qty: ${product.quantity}</div>
                </div>
                <div style="text-align: right;">
                  <div style="color: #1e293b; font-weight: bold;">${formatPrice(product.price)}</div>
                  <div style="color: #64748b; font-size: 12px;">${formatPrice(product.price * product.quantity)}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 2px solid #1e293b;">
            <p style="margin: 5px 0; color: #64748b; font-size: 12px;">Thank you for shopping with us!</p>
            <p style="margin: 5px 0; color: #64748b; font-size: 10px;">Generated on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `;

      // Add to DOM temporarily
      document.body.appendChild(receiptElement);
      receiptElement.style.position = 'absolute';
      receiptElement.style.left = '-9999px';

      // Convert to canvas
      const canvas = await html2canvas(receiptElement, {
        width: 400,
        height: 600,
        backgroundColor: 'white',
        scale: 2, // Higher quality
        useCORS: true
      });

      // Remove temporary element
      document.body.removeChild(receiptElement);

      // Download as image
      const link = document.createElement('a');
      link.download = `order-${order.id}-receipt.png`;
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
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{order.customerName}</div>
                      <div className="text-sm text-slate-500">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">
                      {order.products.map((product, index) => (
                        <div key={index} className="mb-1">
                          {product.quantity}x {product.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-slate-900">{formatPrice(order.total)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative">
                      {editingStatus === order.id ? (
                        <div className="flex flex-col space-y-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value as string)}
                            className="text-xs border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            <span className="mr-1">{getStatusIcon(order.status)}</span>
                            {getStatusLabel(order.status)}
                          </span>
                          <button
                            onClick={() => setEditingStatus(order.id)}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100"
                            title="Change status"
                          >
                            <FiChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{formatDate(order.orderDate)}</div>
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
                          value={editingStatus === order.id ? order.status : ''}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          onClick={() => setEditingStatus(order.id)}
                          className="text-slate-600 hover:text-slate-900 p-1 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="processing">⚙️ Processing</option>
                          <option value="shipped">📦 Shipped</option>
                          <option value="delivered">✅ Delivered</option>
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
        {filteredOrders.length === 0 && (
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
                  Order Details - #{selectedOrder.id}
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
                    <h3 className="font-medium text-slate-900 mb-2">Customer Information</h3>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-sm"><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                      <p className="text-sm"><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 mb-2">Order Information</h3>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-sm"><span className="font-medium">Order ID:</span> {selectedOrder.id}</p>
                      <p className="text-sm"><span className="font-medium">Date:</span> {formatDate(selectedOrder.orderDate)}</p>
                      <p className="text-sm"><span className="font-medium">Status:</span> 
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusIcon(selectedOrder.status)} {getStatusLabel(selectedOrder.status)}
                        </span>
                      </p>
                    </div>
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
                        {selectedOrder.products.map((product, index) => (
                          <tr key={index} className="border-t border-slate-200">
                            <td className="px-4 py-2 text-sm text-slate-900">{product.name}</td>
                            <td className="px-4 py-2 text-sm text-slate-900">{product.quantity}</td>
                            <td className="px-4 py-2 text-sm text-slate-900">{formatPrice(product.price)}</td>
                            <td className="px-4 py-2 text-sm text-slate-900">{formatPrice(product.price * product.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-slate-900">
                    Total: {formatPrice(selectedOrder.total)}
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
