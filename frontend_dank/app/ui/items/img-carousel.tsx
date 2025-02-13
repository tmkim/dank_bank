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
        return <div>Loading...</div>; // Loading state
    }

    return (
        <div className="carousel-container">
            <button onClick={goToPrevious} className="carousel-nav prev">Prev</button>
            <div className="carousel-image">
                {/* <Image 
                    src={images[currentIndex].file}
                    alt="Image Alt"
                    layout="fill"
                    objectFit="cover"
                /> */}
                {/* <img src={images[currentIndex].file} alt={`Item image ${images[currentIndex].file}`} /> */}
            </div>
            <button onClick={goToNext} className="carousel-nav next">Next</button>
        </div>
    );
};

export default ImageCarousel;
