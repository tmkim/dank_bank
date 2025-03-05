'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const ImageCarousel = ({ itemId }: { itemId: number }) => {
    const [images, setImages] = useState<any[]>([]); // State to hold the images
    const [currentIndex, setCurrentIndex] = useState<number>(0); // State to track current image index
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State to track if the modal is open
    const [modalIndex, setModalIndex] = useState<number>(0); // State to track the image index inside the modal

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

    // Handle next/prev navigation in the carousel
    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Wrap around to first image
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length); // Wrap around to last image
    };

    // Handle next/prev navigation in the modal
    const goToNextInModal = () => {
        setModalIndex((prevIndex) => (prevIndex + 1) % images.length);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Wrap around to first image
    };

    const goToPreviousInModal = () => {
        setModalIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length); // Wrap around to last image
    };

    // Open modal and set the selected image
    const openModal = (index: number) => {
        setModalIndex(index);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (images.length === 0) {
        return <></>;
    }

    return (
        <div className="relative w-full max-w-lg mx-auto">
            {/* Image Display */}
            <div className="w-full max-w-sm mx-auto">
                <div className="relative w-full h-0" style={{ paddingBottom: '100%' }}>
                    <Image
                        src={images[currentIndex].file}
                        alt="Carousel Image"
                        fill
                        className="rounded-lg cursor-pointer object-contain max-w-full max-h-full"
                        loading="eager"
                        onClick={() => openModal(currentIndex)} // Open modal when image is clicked
                    />
                </div>
                <link rel="preload" as="image" href={images[(currentIndex + 1) % images.length].file} />
                <link rel="preload" as="image" href={images[(currentIndex - 1 + images.length) % images.length].file} />
                <p className="text-md italic w-full text-center">{images[currentIndex].description}</p>
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
                onClick={closeModal}
                >
                    <div className="relative bg-white p-4 rounded-lg max-w-[90vw]"
                    onClick={(e) => e.stopPropagation()} 
                    >
                        {/* <button onClick={closeModal} className="absolute top-2 right-2 text-xl">X</button> */}
                        <button onClick={goToPreviousInModal} className="absolute top-1/2 left-2 -translate-y-1/2 text-xl bg-black/50 text-white p-2 rounded-full">◀</button>
                        <link rel="preload" as="image" href={images[(modalIndex + 1) % images.length].file} />
                        <link rel="preload" as="image" href={images[(modalIndex - 1 + images.length) % images.length].file} />

                        <div className="flex flex-col items-center">
                            {/* Image Display */}
                            <Image
                                src={images[modalIndex].file}
                                alt="Modal Image"
                                layout="intrinsic"
                                width={500}
                                height={500}
                                className="rounded-lg object-contain"
                            />

                            {/* Description */}
                            <div className="max-w-[500px] w-full mt-2">
                                <p className="text-md italic text-center break-words">{images[modalIndex].description}</p>
                            </div>
                        </div>

                        <button onClick={goToNextInModal} className="absolute top-1/2 right-2 -translate-y-1/2 text-xl bg-black/50 text-white p-2 rounded-full">▶</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ImageCarousel;
