// components/ItemDetails.js
import { Item } from "@/app/lib/definitions";
import Link from "next/link";
import React from "react";
import { Star } from "lucide-react";

interface ItemDetailsProps {
    item: Item | null;
}

const getStarRating = (rating: number) => {
    const fullStars = Math.floor(rating / 20); // Full stars (20% per star)
    const partialStars = rating % 20; // The remainder gives the percentage for the next star
  
    return (
      <>
        {/* Full yellow stars */}
        {Array.from({ length: fullStars }, (_, i) => (
          <Star key={`full-${i}`} className="text-yellow-500 w-16 h-16 fill-current" />
        ))}
        
        {/* Partial star */}
        {partialStars > 0 && (
          <div className="relative w-16 h-16">
            {/* Full grey star as the background */}
            <Star className="text-gray-400 w-16 h-16 fill-current" />
            
            {/* Partial yellow star */}
            <div
              className="absolute top-0 left-0 w-16 h-16 overflow-hidden"
              style={{ width: `${(partialStars / 20) * 100}%` }} // Fix: Calculate the fill percentage
            >
              <Star className="text-yellow-500 w-16 h-16 fill-current" />
            </div>
          </div>
        )}
        
        {/* Empty grey stars */}
        {Array.from({ length: 5 - fullStars - (partialStars > 0 ? 1 : 0) }, (_, i) => (
          <Star key={`empty-${i}`} className="text-gray-400 w-16 h-16 fill-current" />
        ))}
      </>
    );
  };

// const ItemDetails = ({ item }: { item: Item }) => {
const ItemDetails: React.FC<ItemDetailsProps> = ({ item }) => {
    // console.log("Selected Row in DetailsPanel:", item);  
    if (!item) {
        return <p className="text-gray-500">Select a row to view details.</p>;
    }

    const renderName = () => {
        switch (item.item_url){
            case '':
                return(
                    <div className="mt-2 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">{item.name}</h2>
                    </div>
                )
            case null:
                return(
                    <div className="mt-2 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">{item.name}</h2>
                    </div>
                )
            default:
                return(
                    <div className="mt-2 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold"><Link href={item.item_url} className="button">{item.name}</Link></h2>
                    </div>
                )
        }
    }

    const renderDetails = () => {
        switch (item.category) {
            case 'Dining':
                return (
                    <>
                    <div className="flex items-center justify-between">
                        <div className="">
                            {item.location}
                        </div>
                        <div className="">
                            {item.price_range}
                        </div>
                    </div>
                    <div className="text-sm">
                        <Link href={item.gmap_url} className="button">{item.address}</Link>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="">
                            {item.cuisine}
                        </div>
                    </div>
                    </>
                )
            case 'Food':
                return (
                    <>
                    <div className="flex items-center justify-between">
                        <div className="">
                            {item.location}
                        </div>
                        <div className="">
                            ${item.cost}
                        </div>
                    </div>
                    <div className="">
                        {item.cuisine} -- update to make a select
                    </div>
                    </>
                )
            case 'Music':
                return (
                    <>
                    <div className="text-sm">
                        {item.artist}
                    </div>
                    <div className="">
                        <Link href={item.item_url}>{item.music_source} link</Link>
                        {/* Eventually would like to include an embed from appropriate source
                            Also maybe add album art or something for the image carousel
                        */}
                    </div>
                    </>
                )
            case 'Travel':
                return (
                    <>
                    <div className="">
                        {item.location}
                    </div>
                    <div className="text-sm">
                        <Link href={item.gmap_url} className="button">{item.address}</Link>
                    </div>
                    <div>
                        <Link href={item.item_url} className="button">Link to Website</Link>
                    </div>
                    </>
                )
        }
    }


    return (
        <div className="flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="h-[80vh] border-separate overflow-clip rounded-xl border-2 border-gray-400 border-4 border-solid flex flex-col text-xl">
                    <div className="px-4">
                        <div className="flex justify-center gap-1 mt-2 mb-2">{getStarRating(item.rating)}</div>
                        {/* Name */}
                        <div>
                            {renderName()}
                        </div>
                        
                        <div>
                            {renderDetails()}
                        </div>

                        {/* Images - Carousel or Grid
                            Maybe - if no images, turn into upload button */}
                        <div className="px-4 mt-4 w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">No Images Available</span>
                        </div>
                        {/* Review */}
                        <p className="mt-3">
                            "{item.review}"
                        </p>
                    </div>
                </div>
                    
            </div>
        </div>

    );
};

export default ItemDetails;
