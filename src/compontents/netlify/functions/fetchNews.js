const axios = require("axios");

exports.handler = async (event) => {
  const API_KEY = process.env.c77b0f55e26b4d35856adee64101339b; // Replace with your NewsAPI key
  const category = event.queryStringParameters.q || "trading"; // Default to trading if no category is selected

  try {
    const response = await axios.get(
     `https://newsapi.org/v2/everything?q=${category}&sortBy=publishedAt&apiKey=${API_KEY}`
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching news" }),
    };
  }
};