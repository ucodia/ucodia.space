import axios from "axios";

const apiKey = process.env.REACT_APP_GIPHY_API_KEY;
const searchUrl = "https://api.giphy.com/v1/gifs/search";

const search = async (query) => {
  try {
    const response = await axios.get(searchUrl, {
      params: {
        api_key: apiKey,
        limit: 1,
        offset: 0,
        rating: "G",
        lang: "en",
        q: query,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const giphy = { search };

export default giphy;
