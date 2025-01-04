// components/ItemDetails.js
import { Item } from "@/app/lib/definitions";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

const ItemDetails = ({ item }: {item: Item}) => {
    if (item.item_url == null){
        item.item_url = ''
    }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="h-[80vh] border-separate overflow-clip rounded-xl border border-solid flex flex-col">
            <div className={clsx()}>
                {item.category === 'Dining' ? (
                    <ul>
                        <li>
                            <strong>Price:</strong> ${item.rating}
                        </li>
                        <li>
                            <strong>Category:</strong> {item.category}
                        </li>
                        <li>
                            <strong>Review:</strong> {item.review}
                        </li>
                    </ul>
                ) : null}
                {item.category === 'Food' ? (
                    <ul>
                        <li>
                            <strong>Price:</strong> ${item.rating}
                        </li>
                        <li>
                            <strong>Category:</strong> {item.category}
                        </li>
                        <li>
                            <strong>Description:</strong> {item.review}
                        </li>
                    </ul>
                ) : null}
                {item.category === 'Music' ? (
                    <>
                    Paid
                    </>
                ) : null}
                {item.category === 'Travel' ? (
                    <>
                    Paid
                    </>
                ) : null}
            </div>
            <Link href={item.item_url} className="button">
                Link to Item
            </Link>
        </div>
      </div>
    </div>

  );
};

export default ItemDetails;
