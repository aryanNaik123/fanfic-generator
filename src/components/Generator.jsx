import React, { useState } from "react";
import axios from "axios";
import "./Generator.css";

function Generator() {
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target);
    const characters = formData.get("characters");
    const setting = formData.get("setting");
    const plot = formData.get("plot");

    const prompt = `Write a fan fiction story about ${characters} in ${setting} where ${plot}.`;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/engines/davinci/completions",
        {
          prompt,
          max_tokens: 1024,
          temperature: 0.7,
          n: 1,
          stop: ["\n\n"],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const generatedStory =
        response.data.choices.length > 0
          ? response.data.choices[0].text
          : "Unable to generate a story with the given input. Please try again.";
      setStory(generatedStory);
    } catch (error) {
      console.error(error);
      setStory(
        "An error occurred while generating the story. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>StoryGen</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="characters">Characters:</label>
          <input type="text" id="characters" name="characters" required />
        </div>

        <div className="form-group">
          <label htmlFor="setting">Setting:</label>
          <input type="text" id="setting" name="setting" required />
        </div>

        <div className="form-group">
          <label htmlFor="plot">Plot:</label>
          <input type="text" id="plot" name="plot" required />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Story"}
        </button>
      </form>

      {story && (
        <div className="story">
          <h2>Generated Story:</h2>
          <p>{story}</p>
        </div>
      )}
    </div>
  );
}

export default Generator;
