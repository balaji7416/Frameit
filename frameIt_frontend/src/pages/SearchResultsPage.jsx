import { useSearchParams } from "react-router";
import useSearch from "../hooks/useSearch.js";
import { useEffect, useState } from "react";
import Gallery from "../components/Gallery.jsx";
function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const { loading: searchLoading, searchPosts } = useSearch();
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      try {
        const results = await searchPosts(query);
        setSearchResults(results);
      } catch (err) {
        console.log("Error in fetchSearchResults: ", err);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div>
      {/* main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <Gallery
          posts={searchResults}
          loading={searchLoading}
          isOwner={false}
        />
      </main>
    </div>
  );
}

export default SearchResultsPage;
