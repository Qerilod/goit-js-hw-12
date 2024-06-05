export const renderImg = (hits) => {
  return hits.reduce((html, { largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
    return (
      html +
      `<li class="gallery-item">
        <a href=${largeImageURL}> 
          <img class="gallery-img" src=${webformatURL} alt="${tags}"/>
        </a>
        <div class="gallery-text-box">
          <p>Likes: <span class="text-value">${likes}</span></p>
          <p>Views: <span class="text-value">${views}</span></p>
          <p>Comments: <span class="text-value">${comments}</span></p>
          <p>Downloads: <span class="text-value">${downloads}</span></p>
        </div>
      </li>`
    );
  }, '');
  
}



