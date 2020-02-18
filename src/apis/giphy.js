import axios from "axios";

const apiKey = "O6c8raeYgoJuSnAU9oU9Cw19G3UZp0cC";
const searchUrl = "https://api.giphy.com/v1/gifs/search";

const search = async query => {
  try {
    const response = await axios.get(searchUrl, {
      params: {
        api_key: apiKey,
        limit: 1,
        offset: 0,
        rating: "G",
        lang: "en",
        q: query
      }
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default {
  search
};
