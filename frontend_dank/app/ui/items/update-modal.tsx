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
type PRange = Item['price_range'];
type MSource = Item['music_source'];

interface UpdateProps {
  item: Item;
  onClose: () => void;
  onUpdate: (updatedItem: Item) => void;
}

{/* export default function Form() {   */ }
const UpdateModal: React.FC<UpdateProps> = ({ item, onClose, onUpdate }) => {

  // const item: Item = {
  //   id: '0',
  //   name: "test",
  //   category: "Dining",
  //   review: "DANK",
  //   rating: 420,
  //   address: "somewhere",
  //   location: "over there",
  //   gmap_url: "google map",
  //   item_url: "website",
  //   price_range: '$$$$$',
  //   cost: 'free.99',
  //   cuisine: 'Korean',
  //   music_source: 'YouTube',
  //   artist: 'subtropics',
  //   music_meta: 'bass music 420'
  // }

  const categories: Category[] = ['Dining', 'Food', 'Music', 'Travel'];
  const [selectedCategory, setSelectedCategory] = useState<Category>(item.category);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value as Category);
  };

  const prices: PRange[] = ['$', '$$', '$$$', '$$$$', '$$$$$'];
  const [selectedPriceRange, setSelectedPRange] = useState<PRange>('');

  const handlePriceRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedPRange(event.target.value as PRange);
  }

  const msources: MSource[] = ['SoundCloud', 'Spotify', 'YouTube'];
  const [selectedMSource, setSelectedMSource] = useState<MSource>('');

  const handleMusicSourceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedMSource(event.target.value as MSource);
  }

  // ------------------------------- modal

  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [review, setReview] = useState(item.review);
  const [rating, setRating] = useState(item.rating);
  const [address, setAddress] = useState(item.address);
  const [location, setLocation] = useState(item.location);
  const [gmap_url, setGmap_url] = useState(item.gmap_url);
  const [item_url, setItem_url] = useState(item.item_url);
  const [price_range, setPrice_range] = useState(item.price_range);
  const [cost, setCost] = useState(item.cost);
  const [cuisine, setCuisine] = useState(item.cuisine);
  const [music_source, setMusic_source] = useState(item.music_source);
  const [artist, setArtist] = useState(item.artist);
  const [music_meta, setMusic_meta] = useState(item.music_meta);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // onUpdate({ ...item, name, review, rating });
    try {
      const response = await fetch(`http://localhost:8000/api_dank/items/`, {
        method: 'PUT', // Or 'PATCH' if you're doing partial updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          category,
          review,
          rating,
          address,
          location,
          gmap_url,
          item_url,
          price_range,
          cost,
          cuisine,
          music_source,
          artist,
          music_meta
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const updatedItem = await response.json();
      onUpdate(updatedItem); // Pass the updated item back to the parent component
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const renderCategoryUpdate = () => {
    switch (selectedCategory) {
      case 'Dining':
        return (
          <Button type="submit">Update Dining</Button>
        );
      case 'Food':
        return (
          <Button type="submit">Update Food</Button>
        );
      case 'Music':
        return (
          <Button type="submit">Update Music</Button>
        );
      case 'Travel':
        return (
          <Button type="submit">Update Travel</Button>
        );
    }
  }

  const renderCategorySpecificInputs = () => {
    switch (selectedCategory) {
      case 'Dining':
        return (
          <>
            <div>
              <label htmlFor="location">Location:</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div>
              <label htmlFor="address">Address:</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div>
              <label htmlFor="gmap_url">Google Map:</label>
              <input type="text" value={gmap_url} onChange={(e) => setGmap_url(e.target.value)} />
            </div>
            <div>
              <label htmlFor="item_url">Website:</label>
              <input type="text" value={item_url} onChange={(e) => setItem_url(e.target.value)} />
            </div>
            <div className="relative">
              <label htmlFor="price_range">Price Range:</label>
              <select
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="price_range"
                name="price_range"
                value={selectedPriceRange}
                onChange={handlePriceRangeChange}
              >
                <option value="" disabled>
                  
                </option>
                {prices.map((pr) => (
                  <option key={pr} value={pr}>
                    {pr}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="cuisine">Cuisine:</label>
              <input type="text" value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
            </div>
          </>
        );
      case 'Food':
        return (
          <>
            <div>
              <label htmlFor="location">Location:</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div>
              <label htmlFor="cuisine">Cuisine:</label>
              <input type="text" value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
            </div>
            <div>
              <label htmlFor="cost">Cost:</label>
              <input type="text" value={cost} onChange={(e) => setCost(e.target.value)} />
            </div>
          </>
        );
      case 'Music':
        return (
          <>
            <div>
              <label htmlFor="artist">Artist:</label>
              <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} />
            </div>
            <div className="relative">
              <label htmlFor="music_source">Music Source:</label>
              <select
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="music_source"
                name="music_source"
                value={selectedMSource}
                onChange={handleMusicSourceChange}
              >
                <option value="" disabled>
                  
                </option>
                {msources.map((ms) => (
                  <option key={ms} value={ms}>
                    {ms}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="item_url">URL:</label>
              <input type="text" value={item_url} onChange={(e) => setMusic_meta(e.target.value)} />
            </div>
          </>
        );
      case 'Travel':
        return (
          <>
            <div>
              <label htmlFor="location">Location:</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div>
              <label htmlFor="address">Address:</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div>
              <label htmlFor="gmap_url">Google Map:</label>
              <input type="text" value={gmap_url} onChange={(e) => setGmap_url(e.target.value)} />
            </div>
            <div>
              <label htmlFor="item_url">Website:</label>
              <input type="text" value={item_url} onChange={(e) => setItem_url(e.target.value)} />
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
            <div>
              <label htmlFor="name">Name:</label>
              {/* <input id="name" name="name" type="text" /> */}
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              {renderCategorySpecificInputs()}
            </div>
            <div>
              <label htmlFor="review">Review:</label>
              <textarea value={review} onChange={(e) => setReview(e.target.value)} />
            </div>
            <div>
              <label htmlFor="rating">Rating:</label>
              <input id="rating" name="rating" type="number" min="0" max="100" step="1" />
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button type="button" onClick={onClose}>
                Cancel
              </button>
              {renderCategoryUpdate()}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;


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