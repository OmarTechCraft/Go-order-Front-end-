import React, { useState, useEffect } from "react";
import "./ImageGenerator.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

import Nav_2 from "../../../components/navbar copy/Navbar";
import Sidebar_2 from "../../../components/Sidebar_2/Sidebar_2";

const ImageGenerator: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [prompt, setPrompt] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);

  const FAL_KEY =
    "5e52d37d-4813-4995-ab5f-bd9483f8b658:87bb47a0e479e43c046cc8cd0c3af2bf";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const generateImage = async () => {
    // Check if the user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      setError(
        "You must be logged in to generate images. Redirecting to login..."
      );
      setTimeout(() => {
        navigate("/login"); // Redirect to login page after a short delay
      }, 2000); // Redirect after 2 seconds
      return;
    }

    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://fal.run/fal-ai/flux/dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${FAL_KEY}`,
        },
        body: JSON.stringify({
          prompt: prompt,
          num_images: 1,
          size: "512x512",
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      if (data.images?.length > 0) {
        setGeneratedImage(data.images[0].url);
        setRecentPrompts((prev) => [...new Set([prompt, ...prev.slice(0, 4)])]);
      } else {
        throw new Error("No image was generated");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div className="image-generator-page">
      <Nav_2 />
      <Sidebar_2 />
      <div className={`image-generator-content ${showContent ? "show" : ""}`}>
        <div className="card">
          <div className="content">
            <div className="image-container">
              <div
                className={`image-frame ${
                  isLoading ? "loading" : generatedImage ? "generated" : ""
                }`}
              >
                {isLoading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p className="loading-text">Generating...</p>
                  </div>
                ) : generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="generated-image"
                  />
                ) : (
                  <img
                    src="/images/nasser.png"
                    alt="Placeholder"
                    className="image"
                  />
                )}
              </div>

              {generatedImage && !isLoading && (
                <div className="image-actions">
                  <button
                    onClick={() => window.open(generatedImage!, "_blank")}
                    className="action-button"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => setGeneratedImage(null)}
                    className="action-button"
                  >
                    New
                  </button>
                </div>
              )}
            </div>

            <div className="form-container">
              <div className="tagline">
                "Create Stunning AI-Generated images effortlessly."
              </div>
              <p className="label">Generate unique images</p>

              <div className="input-group">
                <input
                  type="text"
                  placeholder="Describe your image idea..."
                  className="input"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && generateImage()}
                />
                {/* Display error message here */}
                {error && <p className="error">{error}</p>}
              </div>

              <button
                className={`button ${isLoading ? "loading" : ""}`}
                onClick={generateImage}
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate Image"}
              </button>

              {recentPrompts.length > 0 && (
                <div className="recent-prompts">
                  <p className="recent-label">Recent prompts:</p>
                  <div className="prompt-tags">
                    {recentPrompts.map((prompt, index) => (
                      <span
                        key={index}
                        className="prompt-tag"
                        onClick={() => handlePromptSuggestionClick(prompt)}
                      >
                        {prompt}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="prompt-suggestions">
                <p className="suggestion-label">Try these ideas:</p>
                <div className="suggestion-tags">
                  <span
                    className="suggestion-tag"
                    onClick={() =>
                      handlePromptSuggestionClick(
                        "A serene mountain landscape with a lake"
                      )
                    }
                  >
                    Mountain landscape
                  </span>
                  <span
                    className="suggestion-tag"
                    onClick={() =>
                      handlePromptSuggestionClick(
                        "A futuristic city with flying cars"
                      )
                    }
                  >
                    Futuristic city
                  </span>
                  <span
                    className="suggestion-tag"
                    onClick={() =>
                      handlePromptSuggestionClick(
                        "A cute cat wearing sunglasses"
                      )
                    }
                  >
                    Cat with sunglasses
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
