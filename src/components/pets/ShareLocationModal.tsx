import React from 'react';

interface ShareLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: () => void;
}

const ShareLocationModal: React.FC<ShareLocationModalProps> = ({ isOpen, onClose, onShare }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 px-2">
      <div className="bg-white rounded-[16px] shadow-xl max-w-[500px] w-full p-8 relative flex flex-col items-center">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-[#222] hover:text-[#4CB2E2] text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {/* Title */}
        <h2 className="font-afacad font-semibold text-[22px] text-center text-[#222] mb-4">
          You've scanned a Digital Tails tag
        </h2>
        {/* Description */}
        <p className="font-afacad text-[16px] text-[#636363] text-center mb-2">
          Digital Tails is a smart pet tag service designed to help owners find their lost pets.
        </p>
        <p className="font-afacad text-[16px] text-[#636363] text-center mb-2">
          Please use the button below to notify the owner of your location.
        </p>
        <p className="font-afacad text-[16px] text-[#636363] text-center mb-8">
          You can then contact the owner by using the details on the pet profile.
        </p>
        {/* Share Location Button */}
        <button
          className="flex items-center justify-center gap-2 w-full max-w-[300px] bg-[#4CB2E2] text-white font-afacad font-semibold text-[20px] py-4 rounded-[14px] transition hover:bg-[#3899c7]"
          onClick={onShare}
        >
          {/* Paper Plane Icon */}
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
          Share Location
        </button>
      </div>
    </div>
  );
};

export default ShareLocationModal; 