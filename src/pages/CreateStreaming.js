// FILE: src/pages/CreateStreaming.js
import React, { useState, useEffect } from 'react';

const CreateStreaming = () => {
  const [title, setTitle] = useState('');
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    // Fetch games from the API
    fetch(`${process.env.REACT_APP_STEAM_API_MANAGEMENT_SERVICE}/steam_api/game_name_list`)
      .then(response => response.json())
      .then(data => {
        setGames(data);
      })
      .catch(error => {
        console.error('Error fetching games:', error);
      });

    // Fetch tags from the API
    fetch(`${process.env.REACT_APP_STEAM_API_MANAGEMENT_SERVICE}/steam_api/game_tag_list`)
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
      streamer_id: 1,  // Hardcoded streamer ID for now
    };

    fetch(`${process.env.REACT_APP_RECOMMENDATION_SERVICE}/create_stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Stream created successfully:', data);
      })
      .catch(error => {
        console.error('Error creating stream:', error);
      });
  };

  return (
    <div>
      <h1>Create Streaming</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Game:</label>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            required
          >
            <option value="">Select a game</option>
            {games.map(game => (
              <option key={game} value={game}>{game}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Tags:</label>
          <select
            multiple
            value={selectedTags}
            onChange={(e) => setSelectedTags([...e.target.selectedOptions].map(option => option.value))}
            required
          >
            {tags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        <button type="submit">Proceed</button>
      </form>
    </div>
  );
};

export default CreateStreaming;