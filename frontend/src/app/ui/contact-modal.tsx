import React from "react";

interface ContactProps {
    onClose: () => void;
}
const ContactModal: React.FC<ContactProps> = ({onClose}) => {
    return (
    <div className="fixed inset-0 flex items-center justify-center">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gray-500" style={{ backgroundColor: 'rgba(31, 41, 55, 0.5)' }} onClick={onClose} />
      
        {/* Modal content */}
        <div className="relative bg-white rounded-lg p-4 max-w-lg w-full">
          <h2 className="text-2xl font-semibold mb-4">Contact Me</h2>
          <form action="https://formspree.io/f/xqapzqwn" method="POST" className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Your Name</label>
              <input type="text" name="name" required className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Your Email</label>
              <input type="email" name="email" required className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Message</label>
              <textarea name="message" required className="w-full p-2 border rounded-lg"></textarea>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                Cancel
              </button>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

    );
};

export default ContactModal;
