import { useState, useEffect } from 'react';

interface Item {
  id: number;
  name: string;
}
interface ApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Item[]; // Assuming 'Item' is already typed elsewhere in your code
  }

const DeleteItemsButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Fetch the list of items when the modal is opened
  useEffect(() => {
    if (isModalOpen) {
      fetchItems();
    }
  }, [isModalOpen]);

  const fetchItems = async () => {
    let allItems: Item[] = [];
    let nextUrl: string | null = 'http://localhost:8000/api_dank/items/'; // Start with the first page
  
    try {
      while (nextUrl) {
        const response: Response = await fetch(nextUrl); // Type the response as 'Response'
        const data: ApiResponse = await response.json(); // Type the 'data' as 'ApiResponse'
  
        const items = data.results; // Get the current page of items
        allItems = [...allItems, ...items]; // Add the items to the allItems array
        nextUrl = data.next; // Get the URL for the next page, or null if there's no next page
      }
  
      setItems(allItems); // Set all items once pagination is done
    } catch (error) {
      console.error('Error fetching items:', error);
    }
};


  // Handle checkbox selection
  const handleSelectItem = (itemId: number) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  // Handle the delete action for selected items
  const handleDeleteSelectedItems = async () => {
    try {
      const response = await fetch('http://localhost:8000/api_dank/items/delete_multiple/', {
        method: 'DELETE', // Use DELETE for the batch deletion
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_ids: selectedItems, // Array of item IDs to delete
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      setItems((prevItems) => prevItems.filter((item) => !selectedItems.includes(item.id)));
      setSelectedItems([]); // Clear selected items after deletion
    } catch (error) {
      console.error('Failed to delete selected items:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Delete Items
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 max-w-lg w-full">
            <h2 className="text-xl mb-4">Select Items to Delete</h2>
            <div className="overflow-y-auto max-h-64 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`item-${item.id}`}
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`item-${item.id}`} className="text-gray-700">
                    {item.name}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleDeleteSelectedItems}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete Selected
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteItemsButton;
