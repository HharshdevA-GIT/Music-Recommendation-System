import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function SongDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await API.get(`/songs/${id}`);
        setSong(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  const handlePlay = async () => {
    try {
      await API.post(`/recently-played/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const addToFavorite = async () => {
    try {
      await API.post(`/favorites/${id}`);
      alert("Added To Favorites ❤️");
    } catch (error) {
      console.log(error);
      alert("Already In Favorites");
    }
  };

  const addToPlaylist = async () => {
    try {
      const playlists = await API.get("/playlists");

      if (playlists.data.length === 0) {
        alert("Create Playlist First 🎶");
        return;
      }

      const playlistId = playlists.data[0]._id;

      await API.post(`/playlists/${playlistId}/${id}`);

      alert("Song Added To Playlist 🎶");
    } catch (error) {
      console.log(error);
      alert("Failed To Add Song");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        Song Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-purple-950">
      <Navbar />

      <div className="max-w-4xl mx-auto p-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
        >
          ← Back
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
          <img
            src={song.coverImage}
            alt={song.title}
            className="w-72 h-72 object-cover rounded-3xl mx-auto mb-6 shadow-2xl"
          />

          <h1 className="text-4xl font-bold text-white text-center mb-4">
            {song.title}
          </h1>

          <div className="text-center text-gray-300 space-y-3">
            <p>🎤 Artist: {song.artist}</p>
            <p>💿 Album: {song.album}</p>
            <p>🎵 Genre: {song.genre}</p>
          </div>

          <div className="mt-8">
            <audio
              ref={audioRef}
              controls
              className="w-full"
              onPlay={handlePlay}
            >
              <source src={song.audioUrl} type="audio/mpeg" />
              Your browser does not support audio.
            </audio>
          </div>

          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <button
              onClick={addToFavorite}
              className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-xl text-white"
            >
              ❤️ Add Favorite
            </button>

            <button
              onClick={addToPlaylist}
              className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-xl text-white"
            >
              🎶 Add To Playlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SongDetails;