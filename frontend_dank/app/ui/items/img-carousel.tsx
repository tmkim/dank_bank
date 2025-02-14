'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const ImageCarousel = ({ itemId }: { itemId: number }) => {
    const [images, setImages] = useState<any[]>([]); // State to hold the images
    const [currentIndex, setCurrentIndex] = useState<number>(0); // State to track current image index

    // Fetch images when component mounts or when itemId changes
    useEffect(() => {
        const fetchImages = async () => {
            const response = await fetch(`http://localhost:8000/api_dank/image/?item=${itemId}`);
            const data = await response.json();
            console.log(data)
            setImages(data.results); // Assuming your response contains the image data in "results"
        };

        fetchImages();
    }, [itemId]); // Fetch again when itemId changes

    // Handle next/prev navigation
    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Wrap around to first image
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length); // Wrap around to last image
    };

    if (images.length === 0) {
        return(
            <div className="px-4 mt-4 w-full bg-gray-200 h-[420px] rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No Images Available</span>
            </div>
        )
    }

    return (
        <div className="relative w-full max-w-lg mx-auto">
            {/* Image Display */}
            <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                <Image
                    src={images[currentIndex].file}
                    alt="Carousel Image"
                    fill
                    objectFit="cover"
                    className="rounded-lg"
                />
            </div>

            {/* Navigation Buttons */}
            <button 
                onClick={goToPrevious} 
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
            >
                ◀
            </button>
            <button 
                onClick={goToNext} 
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
            >
                ▶
            </button>
        </div>
    );
};

export default ImageCarousel;
