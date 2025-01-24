'use client'
import { Item } from '@/app/lib/definitions';
import Link from 'next/link';
import {
    CheckIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import React, { useState } from 'react';

type Category = Item['category'];
type PRange = Item['price_range'];
type MSource = Item['music_source'];

interface CreateProps {
    // item: Item;
    onClose: () => void;
    // onUpdate: (updatedItem: Item) => void;
}

{/* export default function Form() {   */ }
const CreateModal: React.FC<CreateProps> = ({ onClose }) => {

    const categories: Category[] = ['Dining', 'Food', 'Music', 'Travel'];
    const [selectedCategory, setSelectedCategory] = useState<Category>('');

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value as Category);
    };

    const prices: PRange[] = ['$', '$$', '$$$', '$$$$', '$$$$$'];
    const [selectedPriceRange, setSelectedPRange] = useState<PRange>('');

    const handlePriceRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPRange(event.target.value as PRange);
    }

    const msources: MSource[] = ['SoundCloud', 'Spotify', 'YouTube'];
    const [selectedSource, setSelectedMSource] = useState<MSource>('');

    const handleMusicSourceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMSource(event.target.value as MSource);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const formData = new FormData(e.target as HTMLFormElement);
        const formObject = Object.fromEntries(formData.entries());
        console.log(formObject)
    
        // Ensure category is included in the payload
        const payload = {
            ...formObject,
            // category: selectedCategory,
        };
        console.log(payload)
        console.log(JSON.stringify(payload))
    
        try {
            const response = await fetch('http://localhost:8000/api_dank/items/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Item created successfully:', data);
                alert('Item created successfully!');
                onClose(); // Close the modal
            } else {
                const errorData = await response.json();
                console.error('Error creating item:', errorData);
                alert(`Error: ${errorData.detail || 'Failed to create item'}`);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error. Please try again later.');
        }
    };

    const renderCategorySpecificInputs = () => {
        switch (selectedCategory) {
          case 'Dining':
            return (
              <>
                <div className="mb-4">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="gmap_url" className="block text-sm font-medium text-gray-700 mb-2">
                    Google Map
                  </label>
                  <input
                    id="gmap_url"
                    name="gmap_url"
                    type="text"
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="item_url" className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    id="item_url"
                    name="item_url"
                    type="text"
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4 relative">
                  <label htmlFor="price_range" className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    id="price_range"
                    name="price_range"
                    value={selectedPriceRange}
                    onChange={handlePriceRangeChange}
                  >
                    <option value="" disabled>
                      Select A Price Range
                    </option>
                    {prices.map((pr) => (
                      <option key={pr} value={pr}>
                        {pr}
                      </option>
                    ))}
                  </select>
                  <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 text-gray-500 transform -translate-y-1/2" />
                </div>
                <div className="mb-4">
                  <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine
                  </label>
                  <input
                    id="cuisine"
                    name="cuisine"
                    type="text"
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </>
            );
          case 'Food':
            return (
              <>
                <div className="mb-4">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine Type
                  </label>
                  <input
                    id="cuisine"
                    name="cuisine"
                    type="text"
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4 relative">
                  <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-2">
                    Cost
                  </label>
                  <div className="relative">
                    <input
                      id="cost"
                      name="cost"
                      type="number"
                      step="0.01"
                      placeholder="Enter USD amount"
                      className="block w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 text-gray-500 transform -translate-y-1/2" />
                  </div>
                </div>
              </>
            );
          case 'Music':
            return (
              <>
                <div className="mb-4">
                  <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-2">
                    Artist
                  </label>
                  <input
                    id="artist"
                    name="artist"
                    type="text"
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4 relative">
                  <label htmlFor="music_source" className="block text-sm font-medium text-gray-700 mb-2">
                    Music Source
                  </label>
                  <select
                    className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    id="music_source"
                    name="music_source"
                    value={selectedSource}
                    onChange={handleMusicSourceChange}
                  >
                    <option value="" disabled>
                      Select A Music Source
                    </option>
                    {msources.map((ms) => (
                      <option key={ms} value={ms}>
                        {ms}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="item_url" className="block text-sm font-medium text-gray-700 mb-2">
                    URL
                  </label>
                  <input
                    id="item_url"
                    name="item_url"
                    type="text"
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </>
            );
          case 'Travel':
            return (
              <>
                <div className="mb-4">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="gmap_url" className="block text-sm font-medium text-gray-700 mb-2">
                    Google Map
                  </label>
                  <input
                    id="gmap_url"
                    name="gmap_url"
                    type="text"
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="item_url" className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    id="item_url"
                    name="item_url"
                    type="text"
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </>
            );
          default:
            return null;
        }
      };
      

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Category Selector */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Choose category
          </label>
          <div className="relative">
            <select
              className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              id="category"
              name="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 text-gray-500 transform -translate-y-1/2" />
          </div>
        </div>

        {/* Name Input */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Category Specific Inputs */}
        <div>
          {renderCategorySpecificInputs()}
        </div>

        {/* Review Input */}
        <div className="mb-4">
          <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
            Review
          </label>
          <textarea
            id="review"
            name="review"
            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Rating Input */}
        <div className="mb-4">
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            min="0"
            max="100"
            step="1"
            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <Button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
            Create Item
          </Button>
        </div>
      </div>
    </form>
  </div>
</div>

    );
};

export default CreateModal;