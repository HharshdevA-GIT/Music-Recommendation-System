import { useState, useEffect } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const res = await API.get("/playlists");
      setPlaylists(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const createPlaylist = async () => {
    if (!name.trim()) return;

    try {
      await API.post("/playlists", { name });

      setName("");
      loadPlaylists();

      alert("Playlist Created ✅");
    } catch (err) {
      console.log(err);
      alert("Playlist Create Failed ❌");
    }
  };

  const deletePlaylist = async (id) => {
    try {
      await API.delete(`/playlists/${id}`);

      setPlaylists((prev) =>
        prev.filter((playlist) => playlist._id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const removeSong = async (playlistId, songId) => {
    try {
      await API.delete(`/playlists/${playlistId}/song/${songId}`);

      loadPlaylists();

      alert("Song Removed ❌");
    } catch (err) {
      console.log(err);
      alert("Failed To Remove Song");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-purple-950">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-5xl text-center text-white font-bold mb-10">
          🎶 My Playlists
        </h1>

        <div className="flex gap-4 mb-10">
          <input
            type="text"
            placeholder="Playlist Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 p-4 rounded-2xl bg-white/10 text-white border border-white/10"
          />

          <button
            onClick={createPlaylist}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-4 rounded-2xl text-white"
          >
            Create
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-lg"
            >
              <h2 className="text-2xl text-white font-bold mb-2">
                🎶 {playlist.name}
              </h2>

              <p className="text-gray-400 mb-4">
                Songs: {playlist.songs?.length || 0}
              </p>

              {playlist.songs?.length > 0 ? (
                <div className="space-y-3 mb-5">
                  {playlist.songs.map((song) => (
                    <div
                      key={song._id}
                      className="bg-black/30 rounded-2xl p-4 border border-white/5"
                    >
                      <p className="text-white font-semibold">
                        🎵 {song.title}
                      </p>

                      <p className="text-gray-400">
                        🎤 {song.artist}
                      </p>

                      <p className="text-gray-500 text-sm mb-3">
                        💿 {song.album}
                      </p>

                      <button
                        onClick={() =>
                          removeSong(playlist._id, song._id)
                        }
                        className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-xl text-white text-sm"
                      >
                        ❌ Remove Song
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mb-5">
                  No songs in this playlist
                </p>
              )}

              <button
                onClick={() => deletePlaylist(playlist._id)}
                className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-xl text-white"
              >
                🗑 Delete Playlist
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Playlist;