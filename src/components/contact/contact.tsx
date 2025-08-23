import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSubmitContactMutation } from '../../apis/user/users/contact';

// 🟦 Define TypeScript types
interface FormData {
  fullName: string;
  email: string;
  purpose: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  purpose?: string;
  message?: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    purpose: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitContact, { isLoading }] = useSubmitContactMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const key = name as keyof FormErrors;
    if (errors[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName) newErrors.fullName = 'Full name is required';

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.purpose) newErrors.purpose = 'Purpose is required';

    if (!formData.message) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      const result = await submitContact(formData).unwrap();
      toast.success('Message sent successfully!');
      console.log('Contact submitted:', result);

      setFormData({
        fullName: '',
        email: '',
        purpose: '',
        message: '',
      });
    } catch (error: any) {
      console.error('Error submitting contact:', error);
      toast.error(error?.data?.message || 'Failed to send message');
    }
  };

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact Support</h1>
        <p className="text-gray-600">
          Send us a message and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="max-w-4xl bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow duration-300">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          {/* Full Name */}
          <Field
            label="First & Last Name"
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            error={errors.fullName}
            placeholder="Enter your full name"
          />

          {/* Email */}
          <Field
            label="Email Address"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            placeholder="Enter your email address"
          />

          {/* Purpose */}
          <Field
            label="Purpose of Inquiry"
            type="text"
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleInputChange}
            error={errors.purpose}
            placeholder="Enter purpose of inquiry"
          />

          {/* Message */}
          <Field
            label="Message"
            type="textarea"
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            error={errors.message}
            placeholder="How can we help you?"
            rows={6}
          />

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md
              hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:-translate-y-0.5
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              active:translate-y-0 active:shadow-md
              transition-all duration-200 transform ${
                isLoading ? 'opacity-50 cursor-not-allowed hover:translate-y-0' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Send Message
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 🔹 Reusable Field Component
interface FieldProps {
  label: string;
  type: 'text' | 'email' | 'textarea';
  id: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  error?: string;
  placeholder?: string;
  rows?: number;
}

const Field: React.FC<FieldProps> = ({
  label,
  type,
  id,
  name,
  value,
  onChange,
  error,
  placeholder,
  rows,
}) => {
  const baseClasses =
    'w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-md hover:border-gray-400 hover:shadow-sm placeholder:text-gray-400';
  const errorClasses = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : '';

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          className={`${baseClasses} ${errorClasses} resize-none`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`${baseClasses} ${errorClasses}`}
          placeholder={placeholder}
        />
      )}
      {error && (
        <span className="text-red-500 text-sm flex items-center mt-1">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
};

export default Contact;
