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
      // Create a temporary receipt element with proper DOM manipulation
      const receiptElement = document.createElement('div');
      receiptElement.style.position = 'fixed';
      receiptElement.style.top = '0';
      receiptElement.style.left = '0';
      receiptElement.style.zIndex = '9999';
      receiptElement.style.visibility = 'visible';
      receiptElement.style.backgroundColor = 'white';
      receiptElement.style.width = '400px';
      receiptElement.style.padding = '20px';
      receiptElement.style.fontFamily = 'Arial, sans-serif';
      receiptElement.style.border = '2px solid #1e293b';
      receiptElement.style.borderRadius = '8px';
      receiptElement.style.boxSizing = 'border-box';

      // Header section
      const headerDiv = document.createElement('div');
      headerDiv.style.cssText = 'text-align: center; margin-bottom: 20px; border-bottom: 2px solid #1e293b; padding-bottom: 15px;';
      
      const title = document.createElement('h1');
      title.textContent = "Women's Street";
      title.style.cssText = 'margin: 0; color: #1e293b; font-size: 24px; font-weight: bold;';
      
      const subtitle = document.createElement('p');
      subtitle.textContent = 'Elegant Fashion Store';
      subtitle.style.cssText = 'margin: 5px 0; color: #64748b; font-size: 14px;';
      
      const receiptLabel = document.createElement('p');
      receiptLabel.textContent = 'Order Receipt';
      receiptLabel.style.cssText = 'margin: 5px 0; color: #64748b; font-size: 12px;';
      
      headerDiv.appendChild(title);
      headerDiv.appendChild(subtitle);
      headerDiv.appendChild(receiptLabel);

      // Order Information
      const orderInfoDiv = document.createElement('div');
      orderInfoDiv.style.cssText = 'margin-bottom: 20px;';
      
      const orderInfoTitle = document.createElement('h3');
      orderInfoTitle.innerHTML = '📋 Order Information';
      orderInfoTitle.style.cssText = 'margin: 0 0 10px 0; color: #1e293b; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;';
      orderInfoDiv.appendChild(orderInfoTitle);
      
      const orderDetails = [
        ['Order ID:', '#' + order.orderNumber],
        ['Order Date:', new Date(order.createdAt).toLocaleDateString()],
        ['Status:', getStatusLabel(order.status)],
        ['Total Amount:', formatPrice(order.finalTotal)]
      ];
      
      orderDetails.forEach(([label, value]) => {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 5px;';
        
        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        labelSpan.style.cssText = 'color: #64748b;';
        
        const valueSpan = document.createElement('span');
        valueSpan.textContent = value;
        valueSpan.style.cssText = 'color: #1e293b; font-weight: bold;';
        
        row.appendChild(labelSpan);
        row.appendChild(valueSpan);
        orderInfoDiv.appendChild(row);
      });

      // Customer Information
      const customerDiv = document.createElement('div');
      customerDiv.style.cssText = 'margin-bottom: 20px;';
      
      const customerTitle = document.createElement('h3');
      customerTitle.innerHTML = '👤 Customer Information';
      customerTitle.style.cssText = 'margin: 0 0 10px 0; color: #1e293b; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;';
      customerDiv.appendChild(customerTitle);
      
      const customerDetails = [
        ['Name:', order.customerDetails.name],
        ['Phone:', order.customerDetails.phone],
        ['Email:', order.customerDetails.email],
        ['Address:', order.customerDetails.address],
        ['City:', order.customerDetails.city],
        ['Postal Code:', order.customerDetails.postalCode]
      ];
      
      customerDetails.forEach(([label, value]) => {
        const container = document.createElement('div');
        container.style.cssText = 'margin-bottom: 8px;';
        
        const labelDiv = document.createElement('div');
        labelDiv.textContent = label;
        labelDiv.style.cssText = 'color: #64748b; font-size: 12px; margin-bottom: 2px;';
        
        const valueDiv = document.createElement('div');
        valueDiv.textContent = value;
        valueDiv.style.cssText = 'color: #1e293b; font-weight: bold; font-size: 14px;';
        
        container.appendChild(labelDiv);
        container.appendChild(valueDiv);
        customerDiv.appendChild(container);
      });

      // Items section
      const itemsDiv = document.createElement('div');
      itemsDiv.style.cssText = 'margin-bottom: 20px;';
      
      const itemsTitle = document.createElement('h3');
      itemsTitle.innerHTML = '🛍️ Order Items';
      itemsTitle.style.cssText = 'margin: 0 0 10px 0; color: #1e293b; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;';
      itemsDiv.appendChild(itemsTitle);
      
      order.items.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 8px; padding: 8px; background: #f8fafc; border-radius: 4px;';
        
        const leftDiv = document.createElement('div');
        const itemName = document.createElement('div');
        itemName.textContent = item.name;
        itemName.style.cssText = 'color: #1e293b; font-weight: bold; font-size: 14px;';
        
        const itemQty = document.createElement('div');
        itemQty.textContent = `Qty: ${item.quantity}`;
        itemQty.style.cssText = 'color: #64748b; font-size: 12px;';
        
        leftDiv.appendChild(itemName);
        leftDiv.appendChild(itemQty);
        
        const rightDiv = document.createElement('div');
        rightDiv.style.cssText = 'text-align: right;';
        
        const itemPrice = document.createElement('div');
        itemPrice.textContent = formatPrice(item.price);
        itemPrice.style.cssText = 'color: #1e293b; font-weight: bold;';
        
        const itemTotal = document.createElement('div');
        itemTotal.textContent = formatPrice(item.price * item.quantity);
        itemTotal.style.cssText = 'color: #64748b; font-size: 12px;';
        
        rightDiv.appendChild(itemPrice);
        rightDiv.appendChild(itemTotal);
        
        itemRow.appendChild(leftDiv);
        itemRow.appendChild(rightDiv);
        itemsDiv.appendChild(itemRow);
      });

      // Summary section
      const summaryDiv = document.createElement('div');
      summaryDiv.style.cssText = 'margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;';
      
      const summaryTitle = document.createElement('h3');
      summaryTitle.innerHTML = '💰 Order Summary';
      summaryTitle.style.cssText = 'margin: 0 0 10px 0; color: #1e293b; font-size: 16px;';
      summaryDiv.appendChild(summaryTitle);
      
      const subtotalRow = document.createElement('div');
      subtotalRow.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 5px;';
      
      const subtotalLabel = document.createElement('span');
      subtotalLabel.textContent = 'Subtotal:';
      subtotalLabel.style.cssText = 'color: #64748b;';
      
      const subtotalValue = document.createElement('span');
      subtotalValue.textContent = formatPrice(order.totalAmount);
      subtotalValue.style.cssText = 'color: #1e293b;';
      
      subtotalRow.appendChild(subtotalLabel);
      subtotalRow.appendChild(subtotalValue);
      summaryDiv.appendChild(subtotalRow);
      
      const totalBorder = document.createElement('div');
      totalBorder.style.cssText = 'border-top: 1px solid #e2e8f0; margin-top: 8px; padding-top: 8px;';
      
      const totalRow = document.createElement('div');
      totalRow.style.cssText = 'display: flex; justify-content: space-between;';
      
      const totalLabel = document.createElement('span');
      totalLabel.textContent = 'Total:';
      totalLabel.style.cssText = 'color: #1e293b; font-weight: bold; font-size: 16px;';
      
      const totalValue = document.createElement('span');
      totalValue.textContent = formatPrice(order.finalTotal);
      totalValue.style.cssText = 'color: #1e293b; font-weight: bold; font-size: 18px;';
      
      totalRow.appendChild(totalLabel);
      totalRow.appendChild(totalValue);
      totalBorder.appendChild(totalRow);
      summaryDiv.appendChild(totalBorder);

      // Footer section
      const footerDiv = document.createElement('div');
      footerDiv.style.cssText = 'text-align: center; margin-top: 20px; padding-top: 15px; border-top: 2px solid #1e293b;';
      
      const thankYou = document.createElement('p');
      thankYou.innerHTML = 'Thank you for shopping with us! 🎉';
      thankYou.style.cssText = 'margin: 5px 0; color: #1e293b; font-weight: bold; font-size: 14px;';
      
      const appreciation = document.createElement('p');
      appreciation.textContent = 'We appreciate your business and hope you love your purchase!';
      appreciation.style.cssText = 'margin: 5px 0; color: #64748b; font-size: 12px;';
      
      const footerInfo = document.createElement('div');
      footerInfo.style.cssText = 'background: #f1f5f9; padding: 8px; border-radius: 4px; margin: 10px 0;';
      
      const orderNum = document.createElement('p');
      orderNum.textContent = `Order #${order.orderNumber}`;
      orderNum.style.cssText = 'margin: 2px 0; color: #64748b; font-size: 10px;';
      
      const generatedOn = document.createElement('p');
      generatedOn.textContent = `Generated on ${new Date().toLocaleString()}`;
      generatedOn.style.cssText = 'margin: 2px 0; color: #64748b; font-size: 10px;';
      
      const storeName = document.createElement('p');
      storeName.textContent = "Women's Street - Elegant Fashion Store";
      storeName.style.cssText = 'margin: 2px 0; color: #64748b; font-size: 10px;';
      
      footerInfo.appendChild(orderNum);
      footerInfo.appendChild(generatedOn);
      footerInfo.appendChild(storeName);
      
      footerDiv.appendChild(thankYou);
      footerDiv.appendChild(appreciation);
      footerDiv.appendChild(footerInfo);

      // Append all sections
      receiptElement.appendChild(headerDiv);
      receiptElement.appendChild(orderInfoDiv);
      receiptElement.appendChild(customerDiv);
      receiptElement.appendChild(itemsDiv);
      receiptElement.appendChild(summaryDiv);
      receiptElement.appendChild(footerDiv);

      // Add to DOM temporarily
      document.body.appendChild(receiptElement);
      
      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 500));

      // Convert to canvas with better options
      const canvas = await html2canvas(receiptElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: 400,
        height: receiptElement.offsetHeight,
        scrollX: 0,
        scrollY: 0
      });

      // Remove temporary element
      document.body.removeChild(receiptElement);

      // Download as image
      const link = document.createElement('a');
      link.download = `order-${order.orderNumber}-receipt.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
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
