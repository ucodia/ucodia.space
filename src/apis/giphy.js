import axios from "axios";

const apiKey = process.env.REACT_APP_GIPHY_API_KEY;
const searchUrl = "https://api.giphy.com/v1/gifs/search";

const search = async (query) => {
  const url = `${searchUrl}?api_key=${apiKey}&q=${query}&limit=1&offset=0&rating=G&lang=en`;

  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

const giphy = { search };

export default giphy;
