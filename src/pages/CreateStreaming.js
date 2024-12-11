// FILE: src/pages/CreateStreaming.js
import React, { useState, useEffect } from 'react';
import '../css/CreateStreamingForm.css';
import axios from 'axios';

const CreateStreaming = () => {
  const [title, setTitle] = useState('');
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_COMPOSITION_API}/get_game_name_list`)
      .then(response => response.json())
      .then(data => {
        setGames(data);
      })
      .catch(error => {
        console.error('Error fetching games:', error);
      });

    // Fetch tags from the API
    axios.get(`${process.env.REACT_APP_COMPOSITION_API}/get_game_tag_list`)
      .then(response => response.json())
      .then(data => {
        setTags(data);
      })
      .catch(error => {
        console.error('Error fetching tags:', error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      title,
      game: selectedGame,
      tags: selectedTags,
    };

    axios.post(`${process.env.REACT_APP_COMPOSITION_API}/start_stream`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Stream created successfully:', data);
        const token = data.token;
        if (token) {
          window.location.href = `/streaming?token=${token}`;
        } else {
          console.error('Token not found in response');
        }
      })
      .catch(error => {
        console.error('Error creating stream:', error);
      });
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