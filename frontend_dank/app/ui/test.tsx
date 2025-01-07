import { useState, useEffect, FormEvent } from 'react';
import { Item } from '@/app/lib/definitions';

const SearchWithPagination: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [results, setResults] = useState<Item[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

//  use Next/Previous instead of page numbers
//  const fetchResults = async (url: string): Promise<void> => {
//  const response = await fetch(url);
//  setCurrentPage(data.next ? data.next.match(/page=(\d+)/)?.[1] || 1 : totalPages); 
//  fetchResults(`http://127.0.0.1:8000/api/items/?page=${page}&query=${query}&limit=10`);

  const fetchResults = async (page: number = 1, query: string = ''): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/items/?page=${page}&query=${query}&limit=10`
      );
      const data = await response.json();
  
      setResults(data.results); // DRF returns the items under "results"
      setTotalPages(Math.ceil(data.count / 10)); // Calculate total pages from "count"

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchResults(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearch = (e: FormEvent): void => {
    e.preventDefault();
    setCurrentPage(1);
    fetchResults(1, searchQuery);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
        />
        <button type="submit">Search</button>
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th> {/* Adjust based on your API fields */}
              </tr>
            </thead>
            <tbody>
              {results.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.review}</td> {/* Adjust based on your API fields */}
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                disabled={currentPage === i + 1}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchWithPagination;
