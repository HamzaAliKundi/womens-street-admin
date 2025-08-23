import React from 'react';

interface Pet {
  id: number;
  name: string;
}

interface ReplacementTagModalProps {
  isOpen: boolean;
  pets: Pet[];
  selectedPetId: number | null;
  onSelectPet: (id: number) => void;
  onClose: () => void;
  onOrder: () => void;
}

const ReplacementTagModal: React.FC<ReplacementTagModalProps> = ({
  isOpen,
  pets,
  selectedPetId,
  onSelectPet,
  onClose,
  onOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex px-4 items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-[12px] shadow-xl max-w-[500px] w-full p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-[#222] hover:text-[#4CB2E2] text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {/* Title */}
        <h2 className="font-afacad font-semibold text-[20px] text-center text-[#222] mb-3">
          Which pets need a replacement tag?
        </h2>
        {/* Description */}
        <p className="font-afacad text-[14px] text-[#636363] text-center mb-2">
          As a Digital Tails Premium member, you get free replacement tags for life.
        </p>
        <p className="font-afacad text-[13px] text-[#636363] text-center mb-4">
          Ordering a replacement tag will deactivate the existing tags. If you need to order a tag for another pet, please{' '}
          <a href="#" className="text-[#4CB2E2] underline">click here</a>.
        </p>
        {/* Pet Selection */}
        <div className="flex flex-col gap-3 mb-6">
          {pets.map((pet) => (
            <label key={pet.id} className="flex items-center gap-2 cursor-pointer font-afacad text-[15px] text-[#222]">
              <input
                type="radio"
                name="replacement-pet"
                value={pet.id}
                checked={selectedPetId === pet.id}
                onChange={() => onSelectPet(pet.id)}
                className="accent-[#4CB2E2] w-4 h-4"
              />
              {pet.name}
            </label>
          ))}
        </div>
        {/* Action Button */}
        <button
          className="w-full bg-[#4CB2E2] text-white font-afacad font-semibold text-[17px] py-3 rounded-[10px] transition hover:bg-[#3899c7] disabled:opacity-60"
          onClick={onOrder}
          disabled={selectedPetId === null}
        >
          Order replacement tag
        </button>
      </div>
    </div>
  );
};

export default ReplacementTagModal; 