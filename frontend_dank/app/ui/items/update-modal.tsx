'use client'
import { Item, Image } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useEffect, useState } from 'react';
import ImageUploader from '../upload';

type Category = Item['category'];

interface UpdateProps {
  item: Item;
  onClose: () => void;
  onUpdate: (updatedItem: Item) => void;
}

{/* export default function Form() {   */ }
const UpdateModal: React.FC<UpdateProps> = ({ item, onClose, onUpdate }) => {
    // Item data states
    const [name, setName] = useState(item.name);
    const [category, setCategory] = useState(item.category);
    const [review, setReview] = useState(item.review);
    const [rating, setRating] = useState(item.rating);
    const [address, setAddress] = useState(item.category_data.address);
    const [location, setLocation] = useState(item.category_data.location);
    const [gmap_url, setGmap_url] = useState(item.category_data.gmap_url);
    const [website, setWebsite] = useState(item.category_data.website);
    // const [price_range, setPrice_range] = useState(item.price_range);
    const [cost, setCost] = useState(item.category_data.cost);
    const [cuisine, setCuisine] = useState(item.category_data.cuisine);
    const [source, setSource] = useState(item.category_data.source);
    const [artist, setArtist] = useState(item.category_data.artist);
    const [genre, setGenre] = useState(item.category_data.genre);

    // Category Select -- might not let them change this though
    const categories: Category[] = ['Dining', 'Food', 'Media', 'Travel'];
    const [selectedCategory, setSelectedCategory] = useState<Category>(item.category);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value as Category);
    };

    // Price Range Select
    const [selectedPrice, setSelectedPrice] = useState<number>(String(item.category_data.price_range).length);
    const [hoveredPrice, setHoveredPrice] = useState<number>(-1);

    const handlePriceClick = (index: number) => {
        setSelectedPrice(index + 1); // Adjust to start from 1 instead of 0
    };

    // Source Select
    // const [selectedSource, setSource] = useState<string>(item.category_data.source as string);

    // const handleSourceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     setSelectedSource(event.target.value);
    // }

    // Food Location Select
    const [locations, setLocations] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>(
        String(item.category_data.location).startsWith("Other:") ? "Other" : String(item.category_data.location)
    ); // Selected location
    const [customLocation, setCustomLocation] = useState<string>(
        String(item.category_data.location).startsWith("Other:") ? String(item.category_data.location).substring(6) : ''

    );

    // Images associated with item
    const [selectedImages, setSelectedImages] = useState<Image[]>([]);
    const [originalImages, setOriginalImages] = useState<Image[]>([]);

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

        const fetchImages = async () => {
            const response = await fetch(`http://localhost:8000/api_dank/image/?item=${item.id}`);
            const data = await response.json();
            // console.log(data)
            setSelectedImages(JSON.parse(JSON.stringify(data.results)));
            setOriginalImages(JSON.parse(JSON.stringify(data.results)));
        };

        fetchImages();
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

    //------------------------
    // Handle image updates


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

      const handleImageDelete = (index: number) => {
        // Show confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this image?");
        
        if (confirmDelete) {
            // If confirmed, remove the image at the specified index
            setSelectedImages((prevFiles) => prevFiles.filter((_, i) => i !== index));
        }
    };

    // Define the type for each request array
    const updateRequests: Promise<Response>[] = [];
    const deleteRequests: Promise<Response>[] = [];
    const addRequest: Promise<Response>[] = [];
    const newImagesList: Image[] = [];
    
    // Function to compare images and handle API requests
    const handleImageChanges = (
      originalImages: Image[], 
      newImages: Image[]
    ) => {

      newImages.forEach((newImage) => {
        const originalImage = originalImages.find((image) => image.id === newImage.id);
    
        // Case 1: If the image is unchanged, skip
        if (originalImage && originalImage.name === newImage.name && originalImage.description === newImage.description) {
            console.log(`No change detected - ${originalImage.name}:${originalImage.description}`)
            return; // No change, skip
        }
    
        // Case 2: If the image has changed (name or description)
        if (originalImage) {
            const formData = new FormData();
            formData.append('name', newImage.name);
            formData.append('description', newImage.description);
          // Update the existing image
          console.log(`Update detected - ${newImage}`)
          updateRequests.push(
            fetch(`http://localhost:8000/api_dank/image/${newImage.id}/`, {
              method: 'PATCH',
              body: formData,
            })
          );
        } else {
          // Case 3: If the image is new (no id)
          newImagesList.push(newImage)
        }
      });
    
      // Case 4: Handle deleted images
      originalImages.forEach((originalImage) => {
        const newImage = newImages.find((image) => image.id === originalImage.id);
    
        if (!newImage) {
          // If the image no longer exists, delete it
          console.log(`Deletion detected`)
          deleteRequests.push(
            fetch(`http://localhost:8000/api_dank/image/${originalImage.id}/`, {
              method: 'DELETE',
            })
          );
        }
      });

      if (newImagesList.length > 0) {
        const imageFormData = new FormData();
        newImagesList.forEach((file, index) => {
            imageFormData.append('item', item.id)
            imageFormData.append('files', file.file);
            imageFormData.append(`name_${index}`, file.name);
            imageFormData.append(`description_${index}`, file.description);
        });

        console.log(imageFormData); 
        addRequest.push(fetch('http://localhost:8000/api_dank/image/', {
            method: 'POST',
            body: imageFormData,
            })
        );
    }
};
    


  // ------------------------------- modal

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Update item
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
          category_data: {
            ...(category === "Dining" && {
                address,
                location: selectedLocation === 'Other' ? "Other:" + customLocation : selectedLocation,
                gmap_url,
                website,
                price_range: "$".repeat(selectedPrice),
                cuisine
            }),
            ...category === "Food" && {
                location: selectedLocation === 'Other' ? "Other:" + customLocation : selectedLocation,
                cost,
                cuisine
            },
            ...category === "Media" && {
                source,
                artist,
                genre,
                website
            },
            ...category === "Travel" && {
                location: selectedLocation === 'Other' ? "Other:" + customLocation : selectedLocation,
                address,
                gmap_url,
                website
            }
          },
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

    // Handle Image Updates
    try {
        // Compare and create requests for updates, deletions, and additions
        handleImageChanges(originalImages, selectedImages);
    
        // Run all the API requests concurrently using Promise.all
        const allRequests = [
          ...updateRequests,
          ...deleteRequests,
          ...addRequest,
        ];
    
        const responses = await Promise.allSettled(allRequests);

        // Handle the responses (successful updates/deletes/adds)
        responses.forEach((response) => {
            if (response.status === 'fulfilled') {
                if (response.value.ok) {
                    console.log('Request succeeded:', response.value);
                } else {
                    console.error('Request failed with status:', response.value.status, response.value);
                }
            } else {
                console.error('Request failed:', response.reason);
            }
        });
      } catch (error) {
        // Handle errors
        console.error('Error occurred while handling images:', error);
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
      case 'Media':
        return (
          <Button type="submit">Update Media</Button>
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
                        <label htmlFor="website" className="block text-base font-medium text-gray-700 mb-2">
                            Website URL:
                        </label>
                        <input
                            id="website"
                            name="website"
                            type="text"
                            value={website} 
                            onChange={(e) => setWebsite(e.target.value)}
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
                            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                className="block w-full px-4 py-2 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                            value={artist} 
                            onChange={(e) => setArtist(e.target.value)}
                            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                            value={genre} 
                            onChange={(e) => setGenre(e.target.value)}
                            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="source" className="block text-base font-medium text-gray-700 mb-2">
                            Source:
                        </label>
                        <input
                            id="source"
                            name="source"
                            type="text"
                            value={source} 
                            onChange={(e) => setSource(e.target.value)}
                            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>  

                    <div className="mb-4">
                        <label htmlFor="website" className="block text-base font-medium text-gray-700 mb-2">
                            Link to Media:
                        </label>
                        <input
                            id="website"
                            name="website"
                            type="text"
                            value={website} 
                            onChange={(e) => setWebsite(e.target.value)}
                            className="block w-full px-4 py-2 rounded-md border border-gray-300 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* <div className="mb-4 relative">
                        <label htmlFor="source" className="block text-base font-medium text-gray-700 mb-2">
                            Music Source:
                        </label>
                        <select
                            className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pr-4 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            id="source"
                            name="source"
                            value={selectedSource}
                            onChange={handleSourceChange}
                        >
                            <option value="" disabled>
                                Select A Music Source
                            </option>
                            {sources.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                        <MusicalNoteIcon className="pointer-events-none absolute left-3 top-1/2 mt-1 transform h-5 w-5 text-gray-500" />
                    </div> */}
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
                        <label htmlFor="website" className="block text-base font-medium text-gray-700 mb-2">
                            Website URL:
                        </label>
                        <input
                            id="website"
                            name="website"
                            type="text"
                            value={website} 
                            onChange={(e) => setWebsite(e.target.value)}
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
      <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center">
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
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full rounded-md border border-gray-300 px-4 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
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
                                        required
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
                                            value={file.description}
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
                    {renderCategoryUpdate()}
                </div>
            </form>
        </div>
    </div>
  );
};

export default UpdateModal;