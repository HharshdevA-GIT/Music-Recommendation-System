import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Home() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await API.get("/songs");
      setSongs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-black to-indigo-900 text-white">
      <Navbar />

      <div className="flex flex-col justify-center items-center pt-20">
        <h1 className="text-5xl font-bold mb-4">
          🎵 Music Recommendation System
        </h1>

        <p className="text-gray-300 text-lg mb-10">
          Discover songs tailored to your taste
        </p>

        <div className="flex gap-5 mb-12">
          <Link to="/register">
            <button className="bg-purple-600 px-6 py-3 rounded-xl hover:bg-purple-700 transition">
              Register
            </button>
          </Link>

          <Link to="/login">
            <button className="bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 transition">
              Login
            </button>
          </Link>

          <Link to="/recommendations">
            <button className="bg-green-600 px-6 py-3 rounded-xl hover:bg-green-700 transition">
              Recommendations
            </button>
          </Link>
        </div>

        <h2 className="text-3xl font-bold mb-6">
          🎶 Latest Songs
        </h2>

        <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl px-6">
          {songs.map((song) => (
            <div
              key={song._id}
              className="bg-white/10 p-5 rounded-2xl backdrop-blur-lg"
            >
              <img
                src={song.coverImage}
                alt={song.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />

              <h3 className="text-xl font-bold">
                {song.title}
              </h3>

              <p className="text-gray-300">
                {song.artist}
              </p>

              <p className="text-sm text-purple-300">
                {song.genre}
              </p>

              <audio
                controls
                className="w-full mt-4"
              >
                <source
                  src={song.audioUrl}
                  type="audio/mpeg"
                />
              </audio>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;