const generateForm = document.querySelector(".generate-form");
const imagegallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imagegallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");

        //set the image source to the AI generated image data
        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        // when the image is loaded remove the loading class
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
        }
    });
}

const generateAiImages = async (userprompt, userImgquantity) => {
    try{
        //Send a request to the OpenAI to generate images based on user input//
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userprompt,
                n: parseInt(userImgquantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if(!response.ok) throw new Error("Failed to generate images! please try again.");

        const{ data } = await response.json(); // Get data from the response
        updateImageCard([...data]);
    } catch (error) {
        alert(error.message);
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();

//Get user input and image quantity values from the form    
    const userPrompt = e.srcElement[0].value;
    const userImgquantity = e.srcElement[1].value;


    const imgCardMarkup = Array.from ({length: userImgquantity}, () =>
       ` <div class="img-card loading">
            <img src="images/loader.svg" alt="image">
            <a href="#" class="download-btn">
            <img src="images/download.svg" alt="download icon">
            </a>
        </div>`
        ).join("");

        imagegallery.innerHTML = imgCardMarkup;  
        generateAiImages(userPrompt, userImgquantity);   

}

generateForm.addEventListener("submit", handleFormSubmission);