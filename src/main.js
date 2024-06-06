import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { getPosts } from './js/pixabay-api.js';
import { renderImg } from './js/render-functions.js';

const formEl = document.querySelector(".form");
const galleryEl = document.querySelector(".gallery");
const searchInput = document.getElementById('search-input');
const loader = document.querySelector(".loader");
const pageButton = document.querySelector(".page-btn");

let page = 1;
let query = null;
let totalHits = 0;
let lightbox;

loader.classList.add("hidden");
pageButton.classList.add("hidden");

const handleSubmit = async (event) => {
  event.preventDefault();

  query = searchInput.value.trim();

  if (!query) {
    return iziToast.info({
      message: 'Please enter text',
      position: 'topCenter'
    });
  }
  page = 1;
  totalHits = 0;
  loader.classList.remove("hidden");
  pageButton.classList.add("hidden");
  galleryEl.innerHTML = '';

  try {
    const response = await getPosts(query, page);
    const { hits, totalHits: newTotalHits } = response.data;
    totalHits = newTotalHits;

    if (hits.length > 0) {
      galleryEl.innerHTML = renderImg(hits);

      if (!lightbox) {
        lightbox = new SimpleLightbox('.gallery a', {
          nav: true,
          captionsData: 'alt',
          captionDelay: 250,
          close: true,
          enableKeyboard: true,
          docClose: true
        });
        lightbox.refresh();
      }
      

      if (totalHits > 15) {
        pageButton.classList.remove("hidden");
      }
    } else {
      return iziToast.error({
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topCenter'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    iziToast.error({
      message: 'An error occurred. Try again later.',
      position: 'topCenter'
    });
  } finally {
    loader.classList.add("hidden");
  }
};

formEl.addEventListener('submit', handleSubmit);

const pageMore = async () => {
  pageButton.disabled = true; 
  page += 1;
  loader.classList.remove("hidden");

  try {
    const response = await getPosts(query, page);
    const { hits } = response.data;

    if (hits.length > 0) {
      const markup = renderImg(hits);
      galleryEl.insertAdjacentHTML("beforeend", markup);
      lightbox.refresh();

      const item = document.querySelector(".gallery-item");
      const height = item.getBoundingClientRect().height;
      window.scrollBy({
        left: 0,
        top: height * 2,
        behavior: "smooth"
      });

      if (totalHits <= page * 15) {
        pageButton.classList.add("hidden");
        iziToast.info({
          title: 'No more info',
          message: "We're sorry, but you've reached the end of search results."
        });
      } else {
        pageButton.disabled = false; 
      }
    } else {
      iziToast.info({
        title: 'No more results',
        message: "No additional images found."
      });
      pageButton.disabled = false; 
    }
  } catch (error) {
    iziToast.error({
      title: "Error",
      message: `Something went wrong. ${error.message}`
    });
    pageButton.disabled = false; 
  } finally {
    loader.classList.add('hidden');
  }
};

pageButton.addEventListener("click", pageMore);