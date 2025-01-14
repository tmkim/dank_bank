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
import { useState } from 'react';

type Category = Item['category'];

interface CreateProps {
    // item: Item;
    onClose: () => void;
    // onUpdate: (updatedItem: Item) => void;
}

{/* export default function Form() {   */ }
const CreateModal: React.FC<CreateProps> = ({ onClose }) => {

    const categories: Category[] = ['Dining', 'Food', 'Music', 'Travel'];
    const [selectedCategory, setSelectedCategory] = useState<Category>('Dining');

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value as Category);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

    }

    const renderCategorySpecificInputs = () => {
        switch (selectedCategory) {
            case 'Dining':
                return (
                    <>
                        <div>
                            <label htmlFor="location">Location:</label>
                            <input id="location" name="location" type="text" />
                        </div>
                        <div>
                            <label htmlFor="address">Address:</label>
                            <input id="address" name="address" type="text" />
                        </div>
                        <div>
                            <label htmlFor="gmap_url">Google Map:</label>
                            <input id="gmap_url" name="gmap_url" type="text" />
                        </div>
                        <div>
                            <label htmlFor="item_url">Website:</label>
                            <input id="item_url" name="item_url" type="text" />
                        </div>
                        <div>
                            {/* make this a select  */}
                            <label htmlFor="price_range">Price Range:</label>
                            <input id="price_range" name="price_range" type="text" />
                        </div>
                        <div>
                            <label htmlFor="cuisine">Cuisine:</label>
                            <input id="cuisine" name="cuisine" type="text" />
                        </div>
                    </>
                );
            case 'Food':
                return (
                    <>
                        <div>
                            <label htmlFor="name">Name:</label>
                            <input id="name" name="name" type="text" />
                        </div>
                        <div>
                            <label htmlFor="location">Location:</label>
                            <input id="location" name="location" type="text" />
                        </div>
                        <div>
                            <label htmlFor="cuisine">Cuisine Type:</label>
                            <input id="cuisine" name="cuisine" type="text" />
                        </div>
                        <div>
                            <div className="relative mt-2 rounded-md">
                                <div className="relative">
                                    <label htmlFor="cost">Cost:</label>
                                    <input
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        step="0.01"
                                        placeholder="Enter USD amount"
                                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    />
                                    <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                        </div>
                    </>
                );
            case 'Music':
                return (
                    <>
                        <div>
                            <label htmlFor="name">Name:</label>
                            <input id="name" name="name" type="text" />
                        </div>
                        <div>
                            <label htmlFor="artist">Artist:</label>
                            <input id="artist" name="artist" type="text" />
                        </div>
                        <div>
                            <label htmlFor="music_source">Source:</label>
                            <input id="music_source" name="music_source" type="text" />
                        </div>
                        <div>
                            <label htmlFor="item_url">URL:</label>
                            <input id="item_url" name="item_url" type="text" />
                        </div>
                    </>
                );
            case 'Travel':
                return (
                    <>
                        <div>
                            <label htmlFor="name">Name:</label>
                            <input id="name" name="name" type="text" />
                        </div>
                        <div>
                            <label htmlFor="location">Location:</label>
                            <input id="location" name="location" type="text" />
                        </div>
                        <div>
                            <label htmlFor="address">Address:</label>
                            <input id="address" name="address" type="text" />
                        </div>
                        <div>
                            <label htmlFor="gmap_url">Google Map:</label>
                            <input id="gmap_url" name="gmap_url" type="text" />
                        </div>
                        <div>
                            <label htmlFor="item_url">Website:</label>
                            <input id="item_url" name="item_url" type="text" />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white w-[300px] p-5 rounded-lg">
                <form onSubmit={handleSubmit}>
                    <div className="rounded-md bg-gray-50 p-4 md:p-6">
                        {/* Customer Name */}
                        <div className="mb-4">
                            <label htmlFor="category" className="mb-2 block text-sm font-medium">
                                Choose category
                            </label>
                            <div className="relative">
                                <select
                                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
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
                                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                            </div>
                        </div>
                        {/* <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend> */}
                        <div>
                            <label htmlFor="name">Name:</label>
                            <input id="name" name="name" type="text" />
                        </div>
                        <div>
                            {renderCategorySpecificInputs()}
                        </div>
                        <div>
                            <label htmlFor="review">Review:</label>
                            <textarea id="review" name="review" />
                        </div>
                        <div>
                            <label htmlFor="rating">Rating:</label>
                            <input id="rating" name="rating" type="text" />
                        </div>
                        <div className="mb-4">
                            {/* <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label> */}

                        </div>
                        <div className="mt-6 flex justify-end gap-4">
                            <button type="button" onClick={onClose}>
                                Cancel
                            </button>
                            <Button type="submit">Create Item</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateModal;


{/* Invoice Amount }
        { <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Invoice Status *
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div> */}