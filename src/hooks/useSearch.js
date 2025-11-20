import { useState, useCallback } from "react";

export default function useSearch() {
    const [search, setSearch] = useState("");

    const handleSearch = useCallback((value) => {
        setSearch(value.toLowerCase());
    }, []);

    return { search, handleSearch };
}
