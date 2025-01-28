// components/ItemDetails.js
import { Item } from "@/app/lib/definitions";
import Link from "next/link";
import React from "react";

interface ItemDetailsProps {
    item: Item | null;
}

// const ItemDetails = ({ item }: { item: Item }) => {
const ItemDetails: React.FC<ItemDetailsProps> = ({ item }) => {
    // console.log("Selected Row in DetailsPanel:", item);  
    if (!item) {
        return <p className="text-gray-500">Select a row to view details.</p>;
    }

    // TEMPORARY !!!!!!!!!!!!!!!!!!!!!! should fix how it is stored in db
    if (item.item_url == null) {
        item.item_url = ''
    }
    if (item.gmap_url == null) {
        item.gmap_url = ''
    }

    const renderDetails = () => {
        switch (item.category) {
            case 'Dining':
                return (
                    <>
                        <ul>
                            <li>
                                <strong>{item.name}</strong>
                            </li>
                            <li> </li>
                            <li>
                                <strong>Location:</strong> {item.location}
                            </li>
                            <li>
                                <strong>Address:</strong> <Link href={item.gmap_url} className="button">{item.address}</Link>
                            </li>
                            <li>
                                <strong>Price Range:</strong> {item.price_range}
                            </li>
                            <li>
                                <strong>Cuisine:</strong> {item.cuisine}
                            </li>
                        </ul>
                    </>
                )
            case 'Food':
                return (
                    <>
                        <ul>
                            <li>
                                <strong>{item.name}</strong>
                            </li>
                            <li>
                                <strong>Location:</strong> {item.location}
                            </li>
                            <li>
                                <strong>Cost:</strong> ${item.cost}
                            </li>
                            <li>
                                <strong>Cuisine:</strong> {item.cuisine}
                            </li>
                        </ul>
                    </>
                )
            case 'Music':
                return (
                    <>
                        <ul>
                            <li>
                                <strong>{item.name}</strong>
                            </li>
                            <li>
                                <strong>Artist:</strong> {item.category}
                            </li>
                            <li>
                                <strong>Source:</strong> {item.music_source}
                            </li>
                            <li>
                                <strong>Additional Info:</strong> {item.music_meta} -- TBD flesh out the metadata (genre, album, etc)
                            </li>
                        </ul>
                    </>
                )
            case 'Travel':
                return (
                    <>
                        <ul>
                            <li>
                                <strong>{item.name}</strong>
                            </li>
                            <li>
                                <strong>Location:</strong> {item.location}
                            </li>
                            <li>
                                <strong>Address:</strong> <Link href={item.gmap_url} className="button">{item.address}</Link>
                            </li>
                        </ul>
                    </>
                )
        }
    }


    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="h-[80vh] border-separate overflow-clip rounded-xl border border-solid flex flex-col text-xl">
                    <div>
                        {renderDetails()}
                    </div>
                    <li>
                        <strong>Rating:</strong> {item.rating}
                    </li>
                    <li>
                        <strong>Review:</strong> {item.review}
                    </li>
                    <li>
                        <strong>Website: </strong> <Link href={item.item_url} className="button">Link to Item</Link>
                    </li>
                    <li>
                        <strong>Photos:</strong> TBD
                    </li>
                </div>
            </div>
        </div>

    );
};

export default ItemDetails;
