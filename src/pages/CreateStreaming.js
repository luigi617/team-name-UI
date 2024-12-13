// FILE: src/pages/CreateStreaming.js
import React, { useState, useEffect } from 'react';
import '../css/CreateStreamingForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const CreateStreaming = () => {
  const [title, setTitle] = useState('');
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const navigate = useNavigate();
  const userId = Cookies.get('user_id') || 1;

  const get_game_name_list = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_COMPOSITION_API}/get_game_name_list`)
      if (response.status !== 200) {
        throw new Error('Failed to fetch game name list');
      }
      const data = response.data;
      
      setGames(data);
    } catch (err) {
      console.error('Error fetching games:', err);
    }
  }
  const get_game_tag_list = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_COMPOSITION_API}/get_game_tag_list`)
      if (response.status !== 200) {
        throw new Error('Failed to fetch game tag list');
      }
      const data = response.data;
      
      setTags(data);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  }
  useEffect(() => {
    get_game_name_list()
    get_game_tag_list()
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      streamer_id: userId,
      title: title,
      game: selectedGame,
      tags: selectedTags,
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_COMPOSITION_API}/start_stream`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Something went wrong!');
      }

      const result = await res.json();
      const data_json = JSON.parse(result)
      
      const session_id = data_json["data"]["session_id"]
      navigate(`/recording?s=${userId}&v=${session_id}`)
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="form-container">
      <h1>Create a Streaming Session</h1>
      <form onSubmit={handleSubmit} className="streaming-form">
        
        {/* Title Input */}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter stream title"
          />
          {/* Optional: Real-time Validation */}
          {title.length > 0 && title.length < 5 && (
            <span className="error">Title must be at least 5 characters long.</span>
          )}
        </div>

        {/* Game Select */}
        <div className="form-group">
          <label htmlFor="game">Game</label>
          <select
            id="game"
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            required
          >
            <option value="" disabled>Select a game</option>
            {games.map((game) => (
              <option key={game} value={game}>
                {game}
              </option>
            ))}
          </select>
        </div>

        {/* Tags Multi-Select */}
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <select
            id="tags"
            multiple
            value={selectedTags}
            onChange={(e) =>
              setSelectedTags([...e.target.selectedOptions].map((option) => option.value))
            }
            required
          >
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <small>Hold down the Ctrl (Windows) or Command (Mac) button to select multiple options.</small>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">Proceed</button>
      </form>
    </div>
  );
};

export default CreateStreaming;

