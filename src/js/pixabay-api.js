import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
  
const API_KEY = "41636185-b642aedee9ddf38a3f46d8b56"
axios.defaults.baseURL = "https://pixabay.com";

export const getPosts = (query, page = 1, per_page = 15) => {
      try {
  
 return axios(`/api/`, {
    params: {
      key: API_KEY,
      q: query,
      page,
      per_page,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true'
    },
  });
  }
  catch {
    iziToast.error({
            title: "Error",
            message: `Something went wrong. ${error.message}`
        })
  }
};

 


