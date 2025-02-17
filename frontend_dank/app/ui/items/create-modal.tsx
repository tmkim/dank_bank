'use client'
import { Item, Image } from '@/app/lib/definitions';
import Link from 'next/link';
import {
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import React, { useEffect, useState } from 'react';
import ImageUploader from '../upload';

type Category = Item['category'];
type MSource = Item['music_source'];

interface CreateProps {
    // item: Item;
    onClose: () => void;
    // onUpdate: (updatedItem: Item) => void;
}

{/* export default function Form() {   */ }
const CreateModal: React.FC<CreateProps> = ({ onClose }) => {

    // Category Select
    const categories: Category[] = ['Dining', 'Food', 'Music', 'Travel'];
    const [selectedCategory, setSelectedCategory] = useState<Category>('');

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value as Category);
        setSelectedLocation('');
        setSelectedPrice(0);
        setSelectedMSource('');
    };

    // Price Range Select
    const [selectedPrice, setSelectedPrice] = useState<number>(0);
    const [hoveredPrice, setHoveredPrice] = useState<number>(-1);

    const handlePriceClick = (index: number) => {
        setSelectedPrice(index + 1); // Adjust to start from 1 instead of 0
    };

    // Music Source Select
    const msources: MSource[] = ['SoundCloud', 'Spotify', 'YouTube'];
    const [selectedSource, setSelectedMSource] = useState<MSource>('');

    const handleMusicSourceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMSource(event.target.value as MSource);
    }

    // Food Location Select
    const [locations, setLocations] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>(''); // Selected location
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

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedLocation(value);
    
        // If "Other" is deselected, clear custom location input
        if (value !== 'Other') {
          setCustomLocation('');
        }
    };

    const handleCustomLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomLocation(e.target.value);
    };

    // Rating Slidebar
    const [rating, setRating] = useState(50); // Default value can be 50 or whatever you'd like

    // Handle image upload
    const [selectedImages, setSelectedImages] = useState<Image[]>([]);
    

    // Update file descriptions when users type in the description for each file
    // Update file descriptions when users type in the description for each file
    const handleFileNameChange = (index: number, fileName: string) => {
        const updatedFiles = [...selectedImages];
        const originalFileName = updatedFiles[index]?.name || '';
        const extension = originalFileName.substring(originalFileName.lastIndexOf('.') + 1).toLowerCase();
      
        // Only update the filename if an extension exists
        if (extension && fileName) {
          const updatedFileName = `${fileName.replace(/\.[^/.]+$/, '')}.${extension}`;
          updatedFiles[index].name = updatedFileName;  // Update the name of the selected image
          setSelectedImages(updatedFiles);
        }
      };

    // Update file descriptions when users type in the description for each file
    const handleDescriptionChange = (index: number, description: string) => {
        const updatedFiles = [...selectedImages];
        updatedFiles[index].description = description;  // Update the description of the selected image
        setSelectedImages(updatedFiles);
      };

    // Handle file selection passed from ImageUploader
    const handleFileSelection = (files: Image[]) => {
        // Create new image objects with the file, empty description, and name from the file
        const newImages = files.map((file) => ({
          id: '', // Temporary ID (could be updated after upload)
          file: file.file,
          name: file.name,
          description: '',
        }));
      
        // Append the new images to the existing images
        // setSelectedImages((prevFiles) => [...prevFiles, ...newImages]);
        setSelectedImages((prevFiles) => {
            console.log("Previous files:", prevFiles);
            return [...prevFiles, ...newImages];  // Make sure we're appending, not duplicating
          });
      };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const formData = new FormData(e.target as HTMLFormElement);
        const formObject = Object.fromEntries(formData.entries());
    
        const payload = {
            ...formObject,
            ...(selectedLocation && {
                location: selectedLocation === 'Other' ? "Other:" + customLocation : selectedLocation
            }),
            images: selectedImages.map((file, index) => ({
                file: file.file,
                name: file.name,
                description: file.description // Set description to null if empty
            })),
        };
    
        try {
            // Step 1: Send Form Data (Including Image URLs)
            const itemResponse = await fetch('http://localhost:8000/api_dank/items/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!itemResponse.ok) {
                const errorData = await itemResponse.json();
                console.error('Error creating item:', errorData);
                alert(`Error: ${errorData.detail || 'Failed to create item'}`);
                return;
            }
            const itemData = await itemResponse.json();
            const itemId = itemData.id;

            // Step 2: Upload Images only if the rest of the form is valid
            let imageIds: number[] = [];

            if (selectedImages.length > 0) {
                const imageFormData = new FormData();
                selectedImages.forEach((file, index) => {
                    imageFormData.append('item', itemId)
                    imageFormData.append('files', file.file);
                    imageFormData.append(`name_${index}`, file.name);
                    imageFormData.append(`description_${index}`, file.description);
                });
    
                console.log(imageFormData); 
                const uploadResponse = await fetch('http://localhost:8000/api_dank/image/', {
                    method: 'POST',
                    body: imageFormData,
                });
    
                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    console.error('Error uploading images:', errorData);
                    alert(`Error: ${errorData.detail || 'Failed to upload images'}`);
                    return;
                    // throw new Error('Image upload failed');
                }
                
                const uploadedImages = await uploadResponse.json(); // Expecting { images: [{ id: image_id, url: '...' }] }
                imageIds = uploadedImages.images.map((img: { id: number }) => img.id);
            }
    
            alert('Item created successfully!');
            setSelectedImages([]); // Clear selected files
            onClose(); // Close the modal

        } catch (error) {
            console.error('Network error:', error);
            alert('Network error. Please try again later.');
        }
    };

    // Render specific inputs based on chosen category
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
                                className="block w-full px-4 py-2 rounded-md border border-gray-400 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                className="block w-full px-4 py-2 rounded-md border border-gray-400 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                className="block w-full px-4 py-2 rounded-md border border-gray-400 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                className="block w-full px-4 py-2 rounded-md border border-gray-400 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                className="block w-full px-4 py-2 rounded-md border border-gray-400 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                className="block w-full px-4 py-2 rounded-md border border-gray-400 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    className="block w-full px-4 py-2 rounded-md border border-gray-400 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                className="block w-full px-4 py-2 rounded-md border border-gray-400 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    className="block w-full px-4 py-2 pl-10 rounded-md border border-gray-400 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                className="block w-full px-4 py-2 rounded-md border border-gray-400 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div className="mb-4 relative">
                            <label htmlFor="music_source" className="block text-base font-medium text-gray-700 mb-2">
                                Music Source:
                            </label>
                            <select
                                className="peer block w-full cursor-pointer rounded-md border border-gray-400 py-2 pr-4 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                            <label htmlFor="item_url" className="block text-base font-medium text-gray-700 mb-2">
                                Link to Music:
                            </label>
                            <input
                                id="item_url"
                                name="item_url"
                                type="text"
                                className="block w-full px-4 py-2 rounded-md border border-gray-400 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                className="block w-full px-4 py-2 rounded-md border border-gray-400 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                className="block w-full px-4 py-2 rounded-md border border-gray-400 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                className="block w-full px-4 py-2 rounded-md border border-gray-400 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                className="block w-full px-4 py-2 rounded-md border border-gray-400 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            <div className="bg-white w-[70%] max-w-4xl p-6 rounded-lg h-[800px] max-h-[100vh]">
                <form onSubmit={handleSubmit} className="h-full flex flex-col">
                    {/* Category Centered at the top */}
                    <div className="mb-6 flex justify-center">
                        <div className="w-full max-w-xs">
                            <label htmlFor="category" className="block text-base font-medium text-gray-700 mb-2">
                                Category:
                            </label>
                            <select
                                className="block w-full rounded-md border border-gray-400 px-4 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                id="category"
                                name="category"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                required
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
                        <div className="space-y-4 ml-1">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-2">
                                    Name:
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    className="block w-full rounded-md border border-gray-400 px-4 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            {/* Rating */}
                            <div className="">
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
                            <div className="">
                                <label htmlFor="review" className="block text-base font-medium text-gray-700 mb-2">
                                    Review:
                                </label>
                                <textarea
                                    id="review"
                                    name="review"
                                    className="block w-full h-40 rounded-md border border-gray-400 px-4 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <ImageUploader onImagesSelected={handleFileSelection} />
                                <div className="mt-4 pl-2 pr-4 h-40 block border rounded-md border-gray-400 overflow-y-auto">
                                    {selectedImages.length > 0 && (
                                    <div>
                                        {selectedImages.map((file, index) => (
                                        <div key={index} className="my-2">
                                            <input 
                                            required
                                            value={file.name}
                                            onChange={(e) => handleFileNameChange(index, e.target.value)}
                                            className="block w-full h-10 rounded-md border border-gray-400 px-4 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"/>
                                            <textarea
                                            placeholder="Description"
                                            value={file.description || ''}
                                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                            className="block w-full h-10 rounded-md border border-gray-400 px-4 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                        ))}
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column (Category Specific Inputs) */}
                        <div className="space-y-4 mr-1">
                            {renderCategorySpecificInputs()}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                            Cancel
                        </button>
                        <Button type="submit" className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                            Create Item
                        </Button>
                    </div>
                </form>
            </div>
        </div>


    );
};

export default CreateModal;