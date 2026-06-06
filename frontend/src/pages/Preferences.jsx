import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Preferences() {
  const navigate = useNavigate();

  const genres = [
    "Pop",
    "Rock",
    "Hip Hop",
    "Jazz",
    "Classical",
    "Electronic",
    "Bollywood",
    "Punjabi",
  ];

  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(
        selectedGenres.filter((g) => g !== genre)
      );
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSave = async () => {
    try {
      await API.put("/users/preferences", {
        favoriteGenres: selectedGenres,
        favoriteArtists: [],
      });

      alert("Preferences Saved!");
      navigate("/recommendations");
    } catch (error) {
      console.log(error);
      alert("Failed to save preferences");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-purple-950">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-white mb-3">
          Choose Your Favorite Genres 🎵
        </h1>

        <p className="text-center text-gray-400 mb-8">
          Select genres to get personalized recommendations
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`px-5 py-3 rounded-2xl font-semibold transition-all ${
                selectedGenres.includes(genre)
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-2xl text-white font-semibold"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default Preferences;