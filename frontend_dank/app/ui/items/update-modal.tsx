'use client'
import { Item } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MusicalNoteIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useEffect, useState } from 'react';

type Category = Item['category'];
type MSource = Item['music_source'];

interface UpdateProps {
  item: Item;
  onClose: () => void;
  onUpdate: (updatedItem: Item) => void;
}

{/* export default function Form() {   */ }
const UpdateModal: React.FC<UpdateProps> = ({ item, onClose, onUpdate }) => {

    // Category Select -- might not let them change this though
    const categories: Category[] = ['Dining', 'Food', 'Music', 'Travel'];
    const [selectedCategory, setSelectedCategory] = useState<Category>(item.category);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value as Category);
    };

    // Price Range Select
    const [selectedPrice, setSelectedPrice] = useState<number>(item.price_range.length);
    const [hoveredPrice, setHoveredPrice] = useState<number>(-1);

    const handlePriceClick = (index: number) => {
        setSelectedPrice(index + 1); // Adjust to start from 1 instead of 0
    };

    // Music Source Select
    const msources: MSource[] = ['SoundCloud', 'Spotify', 'YouTube'];
    const [selectedSource, setSelectedMSource] = useState<MSource>(item.music_source);

    const handleMusicSourceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMSource(event.target.value as MSource);
    }

    // Food Location Select
    const [locations, setLocations] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>(item.location); // Selected location
    const [customLocation, setCustomLocation] = useState<string>('');

    useEffect(() => {
        // Fetch items with category "Dining"
        const fetchDiningItems = async () => {
            try {
                const response = await fetch('http://localhost:8000/api_dank/items/?category=Dining&category=Travel');
                const data = await response.json();
                console.log(data); // Log the data to inspect its structure
            
                // Check if the results key exists and is an array
                if (Array.isArray(data.results)) {
                const locations = data.results.map((item: { name: string }) => item.name);
                setLocations(locations);
                setLocations([...locations, 'Other']);
                } else {
                console.error('Results is not an array:', data.results);
                }
            } catch (error) {
                console.error('Error fetching dining items:', error);
            }
            };
    
        fetchDiningItems();
    }, []);

    const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedLocation(value);
    
        // If "Other" is selected, clear custom location input
        if (value !== 'Other') {
            setCustomLocation('');
        }
    };

    const handleCustomLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomLocation(e.target.value);
    };

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
      console.log(`http://localhost:8000/api_dank/items/${item.id}/`)
      const response = await fetch(`http://localhost:8000/api_dank/items/${item.id}/`, {
        method: 'PUT', // Or 'PATCH' if you're doing partial updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          category,
          review,
          rating,
          ...(address && { address }),
          ...(location && { location: selectedLocation === 'Other' ? customLocation : selectedLocation }),
          ...(gmap_url && { gmap_url }),
          ...(item_url && { item_url }),
          ...(selectedPrice && { price_range: "$".repeat(selectedPrice) }),
          ...(cost && { cost }),
          ...(cuisine && { cuisine }),
          ...(selectedSource && { selectedSource }),
          ...(artist && { artist }),
          ...(music_meta && { music_meta })
        }),
      });

      if (response.ok){
        const updatedItem = await response.json();
        onUpdate(updatedItem); // Pass the updated item back to the parent component
        alert('Item updated successfully!');
        onClose();
      }
      else{
        const errorData = await response.json();
        console.error('Error updating item:', errorData);
        alert(`Error: ${errorData.detail || 'Failed to create item'}`);
        // throw new Error(`Error: ${response.statusText}`);
      }
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
                    <div className="mb-4">
                        <label htmlFor="location" className="block text-base font-medium text-gray-700 mb-2">
                            Location:
                        </label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={selectedLocation} 
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-base font-medium text-gray-700 mb-2">
                            Address:
                        </label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)}
                            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="gmap_url" className="block text-base font-medium text-gray-700 mb-2">
                            Google Map Link:
                        </label>
                        <input
                            id="gmap_url"
                            name="gmap_url"
                            type="text"
                            value={gmap_url} 
                            onChange={(e) => setGmap_url(e.target.value)}
                            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="item_url" className="block text-base font-medium text-gray-700 mb-2">
                            Website URL:
                        </label>
                        <input
                            id="item_url"
                            name="item_url"
                            type="text"
                            value={item_url} 
                            onChange={(e) => setItem_url(e.target.value)}
                            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="mb-4 relative">
                        <div className="flex items-center space-x-2"> {/* Flex container for label and $ symbols */}
                            <label htmlFor="price_range" className="text-base font-medium text-gray-700">
                                Price:
                            </label>
                            <div className="flex space-x-1">
                                {/* Create 5 clickable $ symbols */}
                                {Array.from({ length: 5 }, (_, index) => (
                                    <div
                                        key={index}
                                        className={`cursor-pointer text-3xl px-2 ${selectedPrice > index || hoveredPrice > index ? "text-green-500" : "text-gray-500"
                                            } 
                                        hover:text-green-500`} // Hover effect for green color
                                        onClick={() => handlePriceClick(index)}
                                        onMouseEnter={() => setHoveredPrice(index)} // Set hoveredPrice on hover
                                        onMouseLeave={() => setHoveredPrice(-1)} // Reset hoveredPrice when hover leaves
                                    >
                                        $
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Hidden select to store the selected value */}
                        <select
                            id="price_range"
                            name="price_range"
                            className="hidden"
                            value={selectedPrice !== 0 ? `${"$".repeat(selectedPrice)}` : ""}
                            onChange={() => { }}
                        >
                            {Array.from({ length: 5 }, (_, index) => (
                                <option key={index} value={`${"$".repeat(index + 1)}`}>
                                    {"$".repeat(index + 1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="cuisine" className="block text-base font-medium text-gray-700 mb-2">
                            Cuisine:
                        </label>
                        <input
                            id="cuisine"
                            name="cuisine"
                            type="text"
                            value={cuisine} 
                            onChange={(e) => setCuisine(e.target.value)}
                            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </>
            );
        case 'Food':
            return (
                <>
                    <div className="mb-4 relative">
                        <label htmlFor="location" className="block text-base font-medium text-gray-700 mb-2">
                            Dining
                        </label>
                        <select
                            id="location"
                            name="location"
                            value={selectedLocation}
                            onChange={handleLocationChange}
                            className="block w-full px-4 py-2 pl-10 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Select a location</option>
                            {locations.map((location, index) => (
                            <option key={index} value={location}>
                                {location}
                            </option>
                            ))}
                        </select>

                        {/* If "Other" is selected, show an input field for custom location */}
                        {selectedLocation === 'Other' && (
                            <div className="mt-4 relative">
                            <label htmlFor="customLocation" className="block text-base font-medium text-gray-700 mb-2">
                                Please specify:
                            </label>
                            <input
                                id="customLocation"
                                type="text"
                                value={customLocation}
                                onChange={handleCustomLocationChange}
                                placeholder="Enter custom location"
                                className="block w-full px-4 py-2 pl-10 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            </div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="cuisine" className="block text-base font-medium text-gray-700 mb-2">
                            Cuisine:
                        </label>
                        <input
                            id="cuisine"
                            name="cuisine"
                            type="text"
                            value={cuisine}
                            onChange={(e) => setCuisine(e.target.value)}
                            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label htmlFor="cost" className="block text-base font-medium text-gray-700 mb-2">
                            Cost:
                        </label>
                        <div className="relative">
                            <input
                                id="cost"
                                name="cost"
                                type="number"
                                step="0.01"
                                placeholder="Enter USD amount"
                                value={cost}
                                onChange={(e) => setCost(Number(e.target.value))}
                                className="block w-full px-4 py-2 pl-10 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        <label htmlFor="artist" className="block text-base font-medium text-gray-700 mb-2">
                            Artist:
                        </label>
                        <input
                            id="artist"
                            name="artist"
                            type="text"
                            value={artist} 
                            onChange={(e) => setArtist(e.target.value)}
                            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label htmlFor="music_source" className="block text-base font-medium text-gray-700 mb-2">
                            Music Source:
                        </label>
                        <select
                            className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-10 pr-4 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        <MusicalNoteIcon className="pointer-events-none absolute left-3 top-1/2 mt-1 transform h-5 w-5 text-gray-500" />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="item_url" className="block text-base font-medium text-gray-700 mb-2">
                            Link to Music:
                        </label>
                        <input
                            id="item_url"
                            name="item_url"
                            type="text"
                            value={item_url} 
                            onChange={(e) => setMusic_meta(e.target.value)}
                            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </>
            );
        case 'Travel':
            return (
                <>
                    <div className="mb-4">
                        <label htmlFor="location" className="block text-base font-medium text-gray-700 mb-2">
                            Location:
                        </label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-base font-medium text-gray-700 mb-2">
                            Address:
                        </label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)}
                            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="gmap_url" className="block text-base font-medium text-gray-700 mb-2">
                            Google Map Link:
                        </label>
                        <input
                            id="gmap_url"
                            name="gmap_url"
                            type="text"
                            value={gmap_url} 
                            onChange={(e) => setGmap_url(e.target.value)}
                            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="item_url" className="block text-base font-medium text-gray-700 mb-2">
                            Website URL:
                        </label>
                        <input
                            id="item_url"
                            name="item_url"
                            type="text"
                            value={item_url} 
                            onChange={(e) => setItem_url(e.target.value)}
                            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
        <div className="bg-white w-[70%] max-w-4xl p-6 rounded-lg h-[55vh]">
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
                {/* Category Centered at the top */}
                <div className="mb-6 flex justify-center">
                    <div className="w-full max-w-xs">
                        <label htmlFor="category" className="block text-base font-medium text-gray-700 mb-2">
                            Category:
                        </label>
                        <select
                          className={`block w-full rounded-md border border-gray-300 px-4 py-2 text-base text-gray-500 bg-gray-100 focus:outline-none`}
                          id="category"
                          name="category"
                          value={selectedCategory}
                          onChange={handleCategoryChange}
                          disabled
                        >
                            <option value="" disabled>Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Two Columns for the rest of the form */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-auto">
                    {/* Left Column (Name, Rating, Review) */}
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-2">
                                Name:
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full rounded-md border border-gray-300 px-4 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Rating */}
                        <div className="mb-4">
                            <div className="flex items-center space-x-2 w-full"> {/* Flex container */}
                                <label htmlFor="rating" className="text-base font-medium text-gray-700">
                                    Rating (1-100):
                                </label>
                                <div className="flex items-center space-x-2 flex-grow"> {/* Allow slider to take remaining space */}
                                    <input
                                        id="rating"
                                        name="rating"
                                        type="range"
                                        min="1"
                                        max="100"
                                        step="1"
                                        value={rating}
                                        onChange={(e) => setRating(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <span className="text-base text-gray-700">{rating}</span>
                                </div>
                            </div>
                        </div>

                        {/* Review */}
                        <div className="pb-2">
                            <label htmlFor="review" className="block text-base font-medium text-gray-700 mb-2">
                                Review:
                            </label>
                            <textarea
                                id="review"
                                name="review"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                className="block w-full h-56 rounded-md border border-gray-300 px-4 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label htmlFor="images" className="block text-base font-medium text-gray-700 mb-2">
                                Image Upload Here:
                            </label>
                            <input
                                id="images"
                                name="images"
                                type="file"
                                accept="image/*"  // Ensures only image files can be selected
                                multiple  // Allows multiple files
                                className="block w-full rounded-md border border-gray-300 px-4 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    {/* Right Column (Category Specific Inputs) */}
                    <div className="space-y-4">
                        {renderCategorySpecificInputs()}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                        Cancel
                    </button>
                    {renderCategoryUpdate()}
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