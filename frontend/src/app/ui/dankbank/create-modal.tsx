'use client'
import {
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/dankbank/button';
import React, { useEffect, useState } from 'react';
import ImageUploader from '@/app/ui/dankbank/image-uploader';
import { CategoryData, Item, Image } from '@/app/lib/dankbank/definitions';

interface CreateProps {
    onClose: () => void;
    refreshData: () => void;
    data: Item[]
}

{/* export default function Form() {   */ }
const CreateModal: React.FC<CreateProps> = ({ onClose, data, refreshData }) => {

    // Category Select
    const categories: string[] = ['Dining', 'Food', 'Media', 'Travel'];
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value as string);
        setSelectedLocation('');
        setSelectedSource('');
        setSelectedPrice(0);
    };

    // Price Range Select
    const [selectedPrice, setSelectedPrice] = useState<number>(0);
    const [hoveredPrice, setHoveredPrice] = useState<number>(-1);

    const handlePriceClick = (index: number) => {
        setSelectedPrice(index + 1); // Adjust to start from 1 instead of 0
    };

    // Food Location Select
    const [locations, setLocations] = useState<string[]>([]);
    const [sources, setSources] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>(''); // Selected location
    const [selectedSource, setSelectedSource] = useState<string>(''); // Selected location
    const [customLocation, setCustomLocation] = useState<string>('');
    const [customSource, setCustomSource] = useState<string>('');

    useEffect(() => {
        // Fetch items with category "Dining"
        const fetchSelectOptions = async () => {
            try {
              const response = await fetch('http://localhost:8000/api_dank/selectoption/?category=Location');
              const data = await response.json();
              console.log(data); // Log the data to inspect its structure
          
              // Check if the results key exists and is an array
              if (Array.isArray(data.results)) {
                const locations = data.results.map((item: { name: string }) => item.name);
                // setLocations(locations);
                setLocations([...locations, 'Other']);
            } else {
            console.error('Results is not an array:', data.results);
            }
            } catch (error) {
            console.error('Error fetching locations:', error);
            }

            try {
                const response = await fetch('http://localhost:8000/api_dank/selectoption/?category=Source');
                const data = await response.json();
                console.log(data); // Log the data to inspect its structure
            
                // Check if the results key exists and is an array
                if (Array.isArray(data.results)) {
                  const sources = data.results.map((item: { name: string }) => item.name);
                //   setLocations(sources);
                  setSources([...sources, 'Other']);
            } else {
                console.error('Results is not an array:', data.results);
            }
            } catch (error) {
            console.error('Error fetching locations:', error);
            }
        };
    
        fetchSelectOptions();
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

    const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedSource(value);
    
        // If "Other" is deselected, clear custom Source input
        if (value !== 'Other') {
          setCustomSource('');
        }
    };

    const handleCustomSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomSource(e.target.value);
    };

    // Rating Slidebar
    const [rating, setRating] = useState(50); // Default value can be 50 or whatever you'd like

    // Handle image upload
    const [selectedImages, setSelectedImages] = useState<Image[]>([]);
    

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
        
        const category = formObject.category as string;
        // console.log(category)
        let category_data: CategoryData = {};

        switch (category){
            case "Dining":
                category_data = {
                    address: formObject.address as string,
                    location: formObject.location as string,
                    gmap_url: formObject.gmap_url as string,
                    website: formObject.website as string,
                    price_range: formObject.price_range as string,
                    cuisine: formObject.cuisine as string,
                    
                };
                break;
            case "Food":
                category_data = {
                    location: selectedLocation === 'Other' ? "Other:" + customLocation : selectedLocation,
                    cost: Number(formObject.cost) || 0,
                    cuisine: formObject.cuisine as string,
                };
                break;
            case "Media":
                category_data = {
                    source: selectedSource === 'Other' ? "Other:" + customSource : selectedSource,
                    artist: formObject.artist as string,
                    genre: formObject.genre as string,
                    website: formObject.website as string,
                };
                break;
            case "Travel":
                category_data = {
                    location: formObject.location as string,
                    address: formObject.address as string,
                    gmap_url: formObject.gmap_url as string,
                    website: formObject.website as string,
                };
                break;
            default:
                category_data = {};
        }
        
        const payload = {
            // ...formObject,
            name: formObject.name,
            category: formObject.category,
            review: formObject.review,
            rating: formObject.rating,
            category_data: category_data,
            // images: selectedImages.map((file, index) => ({
            //     file: file.file,
            //     name: file.name,
            //     description: file.description
            // })),
        };

        // console.log("Final Payload:", payload);
    
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
            refreshData()

        } catch (error) {
            console.error('Network error:', error);
            alert('Network error. Please try again later.');
        }
    };

    const handleImageDelete = (index: number) => {
        // Show confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this image?");
        
        if (confirmDelete) {
            // If confirmed, remove the image at the specified index
            setSelectedImages((prevFiles) => prevFiles.filter((_, i) => i !== index));
        }
    }

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
                            <label htmlFor="website" className="block text-base font-medium text-gray-700 mb-2">
                                Website URL:
                            </label>
                            <input
                                id="website"
                                name="website"
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
                                Location
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
            case 'Media':
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
                        <div className="mb-4">
                            <label htmlFor="genre" className="block text-base font-medium text-gray-700 mb-2">
                                Genre:
                            </label>
                            <input
                                id="genre"
                                name="genre"
                                type="text"
                                className="block w-full px-4 py-2 rounded-md border border-gray-400 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>  
                        <div className="mb-4 relative">
                            <label htmlFor="source" className="block text-base font-medium text-gray-700 mb-2">
                                Source
                            </label>
                            <select
                                id="source"
                                name="source"
                                value={selectedSource}
                                onChange={handleSourceChange}
                                className="block w-full px-4 py-2 rounded-md border border-gray-400 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Select a location</option>
                                {sources.map((source, index) => (
                                <option key={index} value={source}>
                                    {source}
                                </option>
                                ))}
                            </select>

                            {/* If "Other" is selected, show an input field for custom location */}
                            {selectedSource === 'Other' && (
                                <div className="mt-4 relative">
                                <label htmlFor="customSource" className="block text-base font-medium text-gray-700 mb-2">
                                    Please specify:
                                </label>
                                <input
                                    id="customSource"
                                    type="text"
                                    value={customSource}
                                    onChange={handleCustomSourceChange}
                                    placeholder="Enter custom source"
                                    className="block w-full px-4 py-2 rounded-md border border-gray-400 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="website" className="block text-base font-medium text-gray-700 mb-2">
                                Link to Media:
                            </label>
                            <input
                                id="website"
                                name="website"
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
                            <label htmlFor="website" className="block text-base font-medium text-gray-700 mb-2">
                                Website URL:
                            </label>
                            <input
                                id="website"
                                name="website"
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
        <div className="fixed inset-0 bg-black flex items-center justify-center"
             style={{ backgroundColor: 'rgba(31, 41, 55, 0.5)' }}>
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
                                <ImageUploader onImagesSelected={handleFileSelection} itemImages={selectedImages} />
                                <div className="mt-4 pl-2 pr-4 h-40 block border rounded-md border-gray-400 overflow-y-auto">
                                    {selectedImages.length > 0 && (
                                    <div>
                                        {selectedImages.map((file, index) => (
                                        <div key={index} className="my-2">
                                            {/* Container for the X button and name input */}
                                            <div className="flex items-center mb-2">
                                                {/* X Button to delete */}
                                                <button
                                                    onClick={() => handleImageDelete(index)}
                                                    className="mr-2 text-red-500 hover:text-red-700 focus:outline-none"
                                                    aria-label="Delete"
                                                >
                                                    ❌
                                                </button>
    
                                                {/* Input field for file name */}
                                                <input 
                                                    required
                                                    value={file.name}
                                                    onChange={(e) => handleFileNameChange(index, e.target.value)}
                                                    className="block w-full h-10 rounded-md border border-gray-400 px-4 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                />
                                            </div>
    
                                            {/* Textarea for file description */}
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