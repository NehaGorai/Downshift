import React, { useState, useEffect } from 'react';
import Downshift from 'downshift';
import cx from 'classnames';
import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';

const apiToken = process.env.REACT_APP_API_TOKEN;
const spreadsheetId = process.env.REACT_APP_SPREADSHEET_ID;
const API_URL = `https://api.lowcodeapi.com/googlesheets/spreadsheetid/get?spreadsheetId=${spreadsheetId}&gid=55787554&tab=localalities&api_token=${apiToken}`;

function App() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        console.log('API response data:', data);

        if (Array.isArray(data.result.data)) {
          const formattedItems = data.result.data.map(item => ({ name: item.Name }));
          setItems(formattedItems);
          console.log('Formatted items:', formattedItems);
        } else {
          console.error('Unexpected data structure:', data);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  return (
    <div style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }} className="flex items-center justify-center min-h-screen">
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-md">
        <Downshift
          itemToString={(item) => (item ? item.name : '')}
        >
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            getLabelProps,
            getToggleButtonProps,
            inputValue,
            highlightedIndex,
            selectedItem,
            isOpen,
          }) => (
            <div className="relative bg-cyan-50 shadow-lg rounded-lg">
              <div className="flex flex-col gap-1 p-4">
                <label {...getLabelProps()} className="text-lg font-semibold text-cyan-700">Select Localities in Jamshedpur</label>
                <div className="relative flex items-center bg-green-200 border border-gray-300 rounded-lg">
                  <input
                    placeholder="locations..."
                    className="w-full p-2 pl-10 border-none rounded-lg focus:outline-none placeholder-cyan-600"
                    {...getInputProps()}
                  />
                  <FaSearch className="absolute left-3 text-cyan-600" />
                  <button
                    aria-label={isOpen ? 'close menu' : 'open menu'}
                    className="absolute right-0 top-0 h-full px-3 flex items-center bg-cyan-200 rounded-r-lg"
                    {...getToggleButtonProps()}
                  >
                    {isOpen ? <FaChevronUp className="text-cyan-800" /> : <FaChevronDown className="text-cyan-800" />}
                  </button>
                </div>
              </div>
              <ul
                className={`absolute w-full bg-white mt-1 shadow-md max-h-60 overflow-auto rounded-b-lg z-10 ${!(isOpen && items.length) && 'hidden'
                  }`}
                {...getMenuProps()}
              >
                {isOpen &&
                  items
                    .filter(
                      (item) =>
                        !inputValue ||
                        item.name.toLowerCase().includes(inputValue.toLowerCase())
                    )
                    .map((item, index) => (
                      <li
                        className={cx(
                          highlightedIndex === index && 'bg-cyan-100',
                          selectedItem === item && 'text-cyan-600 font-bold',
                          'py-2 px-3 cursor-pointer'
                        )}
                        key={`${item.name}${index}`}
                        {...getItemProps({ item, index })}
                      >
                        <span>{item.name}</span>
                      </li>
                    ))}
                {!inputValue && items.length === 0 && (
                  <li className="py-2 px-3 text-gray-500">No results found</li>
                )}
              </ul>
            </div>
          )}
        </Downshift>
      </div>
    </div>
  );
}

export default App;
