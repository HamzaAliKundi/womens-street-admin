import React from 'react'
import { Link } from 'react-router-dom'

const Overview = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-[750px] min-h-[110px] flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-[11.72px] shadow-lg px-4 sm:px-6 py-4 sm:py-[18px] box-border">
        <div className="flex flex-col justify-center h-full mb-4 sm:mb-0 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <span className="font-afacad font-semibold text-[20px] sm:text-[30px] leading-[26px] sm:leading-[36px] tracking-[0.32px] text-slate-800">
              Store Overview:
            </span>
            <span className="font-afacad font-semibold text-[20px] sm:text-[30px] leading-[26px] sm:leading-[36px] tracking-[0.32px] text-blue-600">
              Women's Street
            </span>
          </div>
          <span className="font-afacad font-normal text-[12px] sm:text-[16px] leading-[100%] tracking-[0.4px] text-slate-600 mt-1">
            Manage your fashion store operations and track performance.
          </span>
        </div>
        <Link to="/products" className="flex items-center justify-center w-full sm:w-[160px] h-[38px] px-[12px] rounded-[8px] bg-blue-600 border-none text-white font-afacad font-semibold text-[15px] sm:text-[16px] leading-[100%] tracking-[0.4px] cursor-pointer gap-2 whitespace-nowrap self-center mt-4 sm:mt-0 hover:bg-blue-700 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 sm:w-10 sm:h-10 md:min-w-4 md:min-h-4 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          Manage Products
        </Link>
      </div>

      <div className="w-full max-w-[750px] h-auto flex flex-col md:flex-row justify-between gap-4 mt-6">
        {/* Products Card */}
        <div className="w-full md:w-1/2 h-[110px] rounded-[11.72px] shadow-lg bg-white p-[12.21px] flex flex-col mb-4 md:mb-0">
          <div className="mb-2 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="font-afacad font-semibold text-[13px] sm:text-[14px] leading-[8.79px] tracking-[0.12px] text-slate-800">
              Products
            </span>
          </div>
          <span className="font-afacad font-normal text-[9px] sm:text-[10px] leading-[100%] tracking-[0.2px] text-slate-600">
            Manage your fashion products, inventory, and product details.
          </span>
        </div>

        {/* Orders Card */}
        <div className="w-full md:w-1/2 h-[110px] rounded-[11.72px] shadow-lg bg-white p-[12.21px] flex flex-col justify-between">
          <div>
            <span className="font-afacad font-semibold text-[13px] sm:text-[14px] leading-[100%] tracking-[0.12px] text-slate-800">
              Orders
            </span>
            <div className="font-afacad font-normal text-[9px] sm:text-[10px] leading-[100%] tracking-[0.2px] text-slate-600 mt-1">
              Track customer orders, manage shipping, and handle returns.
            </div>
          </div>
          <Link to="/orders" className="flex items-center w-full sm:w-[111px] h-[32px] px-[11.29px] py-[4.34px] rounded-[6.95px] border border-blue-600 text-blue-600 font-afacad font-semibold text-[11px] sm:text-[12px] leading-[25.18px] tracking-[0.35px] bg-white mt-2 hover:bg-blue-50 transition-colors">
            <svg width="23.4" height="21.7" className="pr-[7.81px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 22">
              <path d="M5 11h14M13 7l6 4-6 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            View Orders
          </Link>
        </div>
      </div>

      <div className="w-full max-w-[750px] min-w-[280px] h-auto rounded-[20.84px] shadow-lg bg-white px-[18px] sm:px-[22px] py-[18px] sm:py-[22px] mt-8 flex flex-col justify-center">
        <div className="flex flex-col items-center text-center w-full">
          <div className="font-afacad font-semibold text-[15px] sm:text-[16px] leading-[20.84px] tracking-[0.28px] text-slate-800 mb-2">
            Analytics & Insights
          </div>
          <div className="font-afacad font-normal text-[12px] sm:text-[14px] leading-[100%] tracking-[0.35px] text-slate-600 mb-5">
            Get detailed insights into your store performance, sales trends, and customer behavior.
          </div>
          <Link
            to="/analytics"
            className="w-full sm:w-[133px] h-[38px] max-w-[1400px] px-[12px] rounded-[8px] bg-blue-600 text-white font-afacad font-semibold text-[14px] sm:text-[15px] leading-[100%] tracking-[0.4px] flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Overview
