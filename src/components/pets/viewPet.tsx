import { useParams } from "react-router-dom";
import React, { useState } from "react";
import ShareLocationModal from "./ShareLocationModal";

const Profile = () => {
  const { id } = useParams();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleOpenShareModal = () => setIsShareModalOpen(true);
  const handleCloseShareModal = () => setIsShareModalOpen(false);
  const handleShareLocation = () => {
    // TODO: Implement share location logic
    setIsShareModalOpen(false);
  };

  return (
    <div className="w-full max-w-[700px] mx-auto px-2 sm:px-4">
     

      {/* Pet Image */}
      <div className="flex justify-center mb-8">
        <div className="w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] rounded-full overflow-hidden">
          <img 
            src="/overview/pet-profile.svg" 
            alt="Pet" 
            className="w-full h-full object-cover"
            // @ts-ignore
            onError={(e) => e.target.src = "/fallback-pet-image.svg"}
          />
        </div>
      </div>

      {/* Top Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mb-4">
        <div className="w-full sm:w-1/2 bg-[#DBEEFF] rounded-[8px] px-4 py-2 flex items-center justify-center">
          <span className="font-afacad font-medium text-[12px] leading-[18px] text-[#0897FF] text-center">
            Domestic Short-hair X No
          </span>
        </div>
        <div className="w-full sm:w-1/2 bg-[#DBEEFF] rounded-[8px] px-4 py-2 flex items-center justify-center">
          <span className="font-afacad font-medium text-[12px] leading-[18px] text-[#0897FF] text-center">
            Female
          </span>
        </div>
      </div>

      {/* Button Group - Contact/Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Email Button */}
        <button style={{height:57}} className="w-full sm:w-[156.25px] flex items-center justify-center gap-2 bg-[#4CB2E2] text-black rounded-[12px] shadow-md font-afacad font-medium text-[18px] leading-[27px] text-center align-middle">
          <img src="/overview/mail.svg" alt="Email" className="w-6 h-6" />
          <span className="font-afacad font-medium text-[18px] leading-[27px] text-center align-middle">Email</span>
        </button>
        {/* WhatsApp Button */}
        <button style={{height:57}} className="w-full sm:w-[156.25px] flex items-center justify-center gap-2 bg-[#25D366] text-black rounded-[12px] shadow-md font-afacad font-medium text-[18px] leading-[27px] text-center align-middle">
          <img src="/overview/wa.svg" alt="WhatsApp" className="w-6 h-6" />
          <span className="font-afacad font-medium text-[18px] leading-[27px] text-center align-middle">Whats'app</span>
        </button>
        {/* Share Location Button */}
        <button style={{height:57}} className="w-full sm:w-[156.25px] flex items-center justify-center gap-2 bg-[#4CB2E2] text-black rounded-[12px] shadow-md font-afacad font-medium text-[18px] leading-[27px] text-center align-middle" onClick={handleOpenShareModal}>
          <img src="/overview/location.svg" alt="Location" className="w-6 h-6" />
          <span className="font-afacad font-medium text-[18px] leading-[27px] text-center align-middle">Share Location</span>
        </button>
        {/* Call Now Button */}
        <button style={{height:57}} className="w-full sm:w-[156.25px] flex items-center justify-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#B89D0B] text-black rounded-[12px] shadow-md font-afacad font-medium text-[18px] leading-[27px] text-center align-middle">
          <img src="/overview/call.png" alt="Phone" className="w-6 h-6" />
          <span className="font-afacad font-medium text-[18px] leading-[27px] text-center align-middle">Call Now</span>
        </button>
      </div>

      {/* Help Text */}
      <p className="font-afacad text-[15px] leading-[22.5px] text-[#4E4E4E] text-center mb-8">
        If you've found me, share location with my owner using the button above, or contact them using the details.
      </p>

      {/* Address Section */}
      <div className="w-full border border-gray-200 rounded-[8px] p-4 mb-8">
        <h2 className="font-afacad font-semibold text-[18px] leading-[25.2px] mb-4">
          Addresses
        </h2>
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-afacad font-semibold text-[18px] leading-[25.2px] mb-2">
            Owner
          </h3>
          <p className="font-afacad font-normal text-[16px] leading-[25.6px] text-[#666666]">***************oad</p>
          <p className="font-afacad font-normal text-[16px] leading-[25.6px] text-[#666666]">Oldham</p>
          <p className="font-afacad font-normal text-[16px] leading-[25.6px] text-[#666666]">Greater Manchester</p>
          <p className="font-afacad font-normal text-[16px] leading-[25.6px] text-[#666666]">OL84LN</p>
        </div>

        <hr className='mt-4' />
        <p className="text-sm text-gray-500 mt-4 italic ">
          The full address is hidden for privacy. Please contact the owner if you require it to return Ellie.
        </p>
      </div>

      {/* Pet Information Section */}
      <div className="w-full border border-gray-200 rounded-[8px] p-4 mb-8">
        <h2 className="font-afacad font-semibold text-[18px] leading-[25.2px] mb-4">
          Pet Information
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-afacad font-semibold text-[16px]">Pet Name</h3>
            <p className="text-gray-700">Braddy</p>
          </div>
          <div>
            <h3 className="font-afacad font-semibold text-[16px]">Notes</h3>
            <p className="text-gray-700">None</p>
          </div>
          <div>
            <h3 className="font-afacad font-semibold text-[16px]">Allergies</h3>
            <p className="text-gray-700">None</p>
          </div>
          <div>
            <h3 className="font-afacad font-semibold text-[16px]">Medication</h3>
            <p className="text-gray-700">None</p>
          </div>
        </div>
      </div>
      <ShareLocationModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        onShare={handleShareLocation}
      />
    </div>
  )
}

export default Profile