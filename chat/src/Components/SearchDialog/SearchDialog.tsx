import React, { useState, useEffect, useRef } from "react";

type SearchDialogProps = {
    onSearchChange: (newSearchTerm: string) => void;
    searchTerm: string;
};

export const SearchDialog: React.FC<SearchDialogProps> = ({
    onSearchChange,
    searchTerm,
}) => {
    const [inputValue, setInputValue] = useState(searchTerm);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = event.target.value;
        setInputValue(newSearchTerm);
        onSearchChange(newSearchTerm);
    };

    const clearInput = () => {
        setInputValue("");
        onSearchChange("");
        inputRef.current?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if ((event.metaKey || event.ctrlKey) && event.key === "f") {
            event.preventDefault();
            setIsSearchDialogOpen((prev) => !prev);
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setIsSearchDialogOpen(false);
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, [isSearchDialogOpen]);

    return (
        isSearchDialogOpen && (
            <div
                className="fixed inset-0 z-50 flex items-end"
                onClick={handleBackdropClick}
            >
                <div
                    className="bg-[#14171a] w-2/3 md:w-2/3 lg:w-2/3 shadow-lg rounded-lg overflow-hidden mb-6 mx-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="searchbar px-6 py-4">
                        <div className="mt-2 text-2xl text-gray-400">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg
                                        className="w-10 h-10 text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="default-search"
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    className="block w-full p-4 pl-20 text-1xl text-gray-300 border border-gray-300 rounded-lg bg-transparent"
                                    placeholder="Search Messages, Viewers..."
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <button
                                        onClick={clearInput}
                                        className="absolute right-3 text-gray-400"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-10 w-10"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};
