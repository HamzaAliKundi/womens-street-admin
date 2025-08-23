import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPetQuery, useUpdatePetMutation } from '../../../apis/user/users';

const EditPet = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  
  const [hideName, setHideName] = useState(false);
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medication, setMedication] = useState('');
  const [notes, setNotes] = useState('');
  const [updateError, setUpdateError] = useState<string | null>(null);
  
  // Fetch pet data - only if petId exists
  const { data: petData, isLoading, error } = useGetPetQuery(petId || '', {
    skip: !petId
  });
  const [updatePet, { isLoading: isUpdating }] = useUpdatePetMutation();
  
  // Update form when pet data is loaded
  useEffect(() => {
    if (petData?.pet) {
      const pet = petData.pet;
      setName(pet.petName);
      setHideName(pet.hideName);
      setAge(pet.age?.toString() || '');
      setBreed(pet.breed);
      setMedication(pet.medication);
      setAllergies(pet.allergies);
      setNotes(pet.notes);
    }
  }, [petData]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!'); // Debug log
    console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL); // Debug API URL
    console.log('Token:', localStorage.getItem('token')); // Debug token
    
    if (!petId) {
      console.error('No petId found'); // Debug log
      return;
    }
    
    // Basic validation
    if (!name.trim()) {
      setUpdateError('Pet name is required');
      return;
    }
    
    console.log('Updating pet with data:', { // Debug log
      petId,
      petData: {
        petName: name,
        hideName,
        age: age ? parseInt(age) : undefined,
        breed,
        medication,
        allergies,
        notes
      }
    });
    
    try {
      setUpdateError(null); // Clear any previous errors
      
      const result = await updatePet({
        petId,
        petData: {
          petName: name,
          hideName,
          age: age ? parseInt(age) : undefined,
          breed,
          medication,
          allergies,
          notes
        }
      }).unwrap();
      
      console.log('Update successful:', result); // Debug log
      
      // Navigate back to pets page
      navigate('/pets');
    } catch (error: any) {
      console.error('Failed to update pet:', error);
      setUpdateError(error?.data?.message || 'Failed to update pet. Please try again.');
    }
  };

  // Show error if no petId
  if (!petId) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#fafbfc] to-[#f8fafd] px-2 py-8 flex flex-col items-center">
        <div className="w-full max-w-[900px] mx-auto text-center">
          <div className="font-afacad text-[15px] text-red-600">No pet ID provided. Please select a pet to edit.</div>
          <button 
            onClick={() => navigate('/pets')}
            className="mt-4 px-4 py-2 bg-[#4CB2E2] text-white rounded-[8px] font-afacad font-medium"
          >
            Back to Pets
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#fafbfc] to-[#f8fafd] px-2 py-8 flex flex-col items-center">
        <div className="w-full max-w-[900px] mx-auto text-center">
          <div className="font-afacad text-[15px] text-[#636363]">Loading pet information...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#fafbfc] to-[#f8fafd] px-2 py-8 flex flex-col items-center">
        <div className="w-full max-w-[900px] mx-auto text-center">
          <div className="font-afacad text-[15px] text-red-600">Error loading pet information. Please try again.</div>
          <button 
            onClick={() => navigate('/pets')}
            className="mt-4 px-4 py-2 bg-[#4CB2E2] text-white rounded-[8px] font-afacad font-medium"
          >
            Back to Pets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#fafbfc] to-[#f8fafd] px-2 py-8 flex flex-col items-center">
      <div className="w-full max-w-[900px] mx-auto">
        {/* Top Section */}
        <div className="mb-8">
          <div className="font-afacad font-semibold text-[18px] text-[#222] mb-1">Manage your pets</div>
          <div className="font-afacad text-[15px] text-[#636363]">Edit your pet's details that will show when their tag is scanned.</div>
        </div>

        {/* Card/Section */}
        <div className="bg-white rounded-[16px] py-8">
          {/* Update Info Header */}
          <div className="mb-6">
            <div className="font-afacad font-semibold text-[20px] text-[#222]">Update information</div>
          </div>

          {/* Divider */}
          <hr className="border-[#E0E0E0] mb-8" />

          {/* Form Grid with lines after each row */}
          <form onSubmit={handleSubmit}>
            {/* Row 1: Name & Breed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block font-afacad font-bold text-[14px] text-[#636363] mb-2" htmlFor="petName">Name</label>
                <input id="petName" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-[8px] border border-[#E0E0E0] bg-white px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition" />
                <div className="flex items-center gap-2 mt-3">
                  <input id="hideName" type="checkbox" checked={hideName} onChange={e => setHideName(e.target.checked)} className="w-4 h-4 rounded border-[#E0E0E0] focus:ring-[#4CB2E2]" />
                  <label htmlFor="hideName" className="font-afacad font-bold text-[14px] text-[#636363] select-none cursor-pointer">Hide Name</label>
                </div>
              </div>
              <div>
                <label className="block font-afacad font-bold text-[14px] text-[#636363] mb-2" htmlFor="breed">Breed</label>
                <input id="breed" type="text" value={breed} onChange={e => setBreed(e.target.value)} className="w-full rounded-[8px] border border-[#E0E0E0] bg-white px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition" />
              </div>
            </div>
            <hr className="border-[#E0E0E0] my-7" />
            {/* Row 2: Age & Allergies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block font-afacad font-bold text-[14px] text-[#636363] mb-2" htmlFor="age">Age (in human years)</label>
                <input id="age" type="text" placeholder="Select age" value={age} onChange={e => setAge(e.target.value)} className="w-full rounded-[8px] border border-[#E0E0E0] bg-white px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition" />
              </div>
              <div>
                <label className="block font-afacad font-bold text-[14px] text-[#636363] mb-2" htmlFor="allergies">Allergies</label>
                <input id="allergies" type="text" value={allergies} onChange={e => setAllergies(e.target.value)} className="w-full rounded-[8px] border border-[#E0E0E0] bg-white px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition" />
              </div>
            </div>
            <hr className="border-[#E0E0E0] my-7" />
                         {/* Row 3: Medication & Notes */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
               <div>
                 <label className="block font-afacad font-bold text-[14px] text-[#636363] mb-2" htmlFor="medication">Medication</label>
                 <input id="medication" type="text" value={medication} onChange={e => setMedication(e.target.value)} className="w-full rounded-[8px] border border-[#E0E0E0] bg-white px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition" />
               </div>
               <div>
                 <label className="block font-afacad font-bold text-[14px] text-[#636363] mb-2" htmlFor="notes">Notes</label>
                 <input id="notes" type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full rounded-[8px] border border-[#E0E0E0] bg-white px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition" />
               </div>
             </div>

             {/* Error Message */}
             {updateError && (
               <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-[8px]">
                 <p className="text-red-600 text-sm font-afacad">{updateError}</p>
               </div>
             )}

             {/* Save Button */}
             <div className="flex justify-end mt-8">
               <button 
                 type="submit" 
                 disabled={isUpdating}
                 className="flex items-center gap-2 px-6 py-3 rounded-[8px] bg-[#4CB2E2] text-white font-afacad font-medium text-[15px] shadow-sm hover:bg-[#3a9bc8] transition disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isUpdating ? (
                   <>
                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                     Saving...
                   </>
                 ) : (
                   <>
                     <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                     Save information
                   </>
                 )}
               </button>
             </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default EditPet;