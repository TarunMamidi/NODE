function reloadPage() {
    location.reload();
  }

  function myFunction() {
    let element = document.body;
    element.classList.toggle("dark");
}
  

document.addEventListener("DOMContentLoaded", () => {
    const imageContainer = document.querySelector(".image-container");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
  
    const images = ["image1.jpg", "image2.jpg", "image3.jpg"];

    let currentIndex = 0;

  
    function showImage(index) {
      imageContainer.innerHTML = `<img src="${images[index]}" alt="Image ${index + 1}">`;

    }
  
    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);

    }
  
    showImage(currentIndex);

  
    prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);

    });
  
    nextButton.addEventListener("click", () => {
      nextImage();
    });
  

    const intervalId = setInterval(nextImage, 3000);
  

    prevButton.addEventListener("click", () => {
      clearInterval(intervalId);
    });
  
    nextButton.addEventListener("click", () => {
      clearInterval(intervalId);
    });
  });


  async function fetchData() {
    const phoneNumber = document.getElementById("phoneInput").value;
    
    try {
        const response = await fetch(`https://api.apilayer.com/number_verification/validate?number=${phoneNumber}`, {
            method: 'GET',
            headers: {
                'apikey': 'Gt54EXsu51DU9vaY7Vc32VC8fo86R0dF'
            }
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json(); // Parse JSON response
        const apiResponseDiv = document.getElementById('api-response');
        apiResponseDiv.innerHTML = ''; // Clear previous content

        // Iterate through the JSON object and append each value
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const value = data[key];
                const div = document.createElement('div');
                div.innerText = `${key}: ${value}`;
                apiResponseDiv.appendChild(div);
            }
        }
        apiResponseDiv.style.backgroundColor = 'black';
        
    } catch (error) {
        console.error(error);
        document.getElementById('api-response').innerText = 'Error fetching data from the API.';
    }
}

document.getElementById('fetchButton').addEventListener('click', fetchData);

