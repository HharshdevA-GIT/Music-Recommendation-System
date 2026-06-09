import { useState, useEffect } from "react";
import axios from "axios";

function Admin() {
  const [songs, setSongs] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    genre: "",
    album: "",
    coverImage: "",
    audioUrl: "",
  });

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/songs"
      );
      setSongs(res.data);
    } catch (error) {
      console.log("FETCH ERROR:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/songs",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ADD SONG SUCCESS:", res.data);

      alert("Song Added Successfully");

      setFormData({
        title: "",
        artist: "",
        genre: "",
        album: "",
        coverImage: "",
        audioUrl: "",
      });

      fetchSongs();
    } catch (error) {
      console.log("ADD SONG ERROR:", error);
      console.log("ADD SONG RESPONSE:", error.response);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Error Adding Song"
      );
    }
  };

  const deleteSong = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `http://localhost:5000/api/songs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("DELETE SUCCESS:", res.data);

      alert("Song Deleted Successfully");

      fetchSongs();
    } catch (error) {
      console.log("DELETE ERROR:", error);
      console.log("DELETE RESPONSE:", error.response);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Delete Failed"
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Panel</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Song Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="artist"
          placeholder="Artist"
          value={formData.artist}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="genre"
          placeholder="Genre"
          value={formData.genre}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="album"
          placeholder="Album"
          value={formData.album}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="coverImage"
          placeholder="Cover Image URL"
          value={formData.coverImage}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="audioUrl"
          placeholder="Audio URL"
          value={formData.audioUrl}
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">
          Add Song
        </button>
      </form>

      <hr />

      <h2>All Songs ({songs.length})</h2>

      {songs.map((song) => (
        <div
          key={song._id}
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <h3>{song.title}</h3>
          <p>Artist: {song.artist}</p>
          <p>Genre: {song.genre}</p>

          <button
            onClick={() => deleteSong(song._id)}
            style={{
              backgroundColor: "red",
              color: "white",
              border: "none",
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Admin;