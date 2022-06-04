
document.addEventListener("DOMContentLoaded", function () {
    // load the functions into the global space
    window.uploadGalleryNew = uploadGalleryNew;
    window.uploadSingleImageNew = uploadSingleImageNew;
    window.deleteImage = deleteImage;

  
    // get all (hidden) input fields to add action listeners for drag and drop
    document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
        const dropZoneElement = inputElement.closest(".drop-zone");
        // if you click on the 'drop-zone' you activate the hidden input element
        dropZoneElement.addEventListener("click", (e) => {
            inputElement.click();
        });

        // handle above click event where 'browse' adds file =>triggers change event 
        inputElement.addEventListener("change", (e) => {
            if (inputElement.files.length == 1) {    // if there is a file in this input element

                //* loop through all files and add thumbnails for each here*

                //CASE: single uploader -  // (target, file)
                updateThumbnail(dropZoneElement, inputElement.files[0]);
                //(target, name, file)

                // This would replace thumbnail with our image - but would require removing the call from the uploader component itself so it can be handled here
                //uploadSingleImageNew(dropZoneElement, dropZoneElement.id, inputElement.files[0]);




                // CASE: gallery uploader  Remove old thumbnails                //Svien doesn't want thumbnails so commented it out for gallery  
                //if (inputElement.files.length) {
                //    if (dropZoneElement.querySelector(".drop-zone__thumb")) {   // if we have old images in dropzone - delete them(input only holds most recent)
                //        dropZoneElement.querySelectorAll(".drop-zone__thumb").forEach(item => {
                //            item.remove();    // delete old images from dropzone
                //        })
                //    }


                //Svien doesn't want thumbnails so commented it out for now   CASE: Gallery uploader ADD new Thumbnails
                //for (let x = 0; x < inputElement.files.length; x++) {
                //    if (x < 8) {
                //        updateThumbnail(dropZoneElement, inputElement.files[x]);
                //    }
                //}

                //   }





            } else {
               // console.log("browse selected.  Recieved ", inputElement.files.length, "files from ", dropZoneElement.id);
               // the upload component will call this onChange: for either uploadSingleImageNew or  uploadGalleryNew("canvasgallery", dropZoneElement.id, inputElement.files);
            }
        });

        // On DragOver - make border solid
        dropZoneElement.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZoneElement.classList.add("drop-zone--over");
        });

        // undo solid border after dragOver
        ["dragleave", "dragend"].forEach((type) => {
            dropZoneElement.addEventListener(type, (e) => {
                dropZoneElement.classList.remove("drop-zone--over");
            });
        });

        // handle drop event
        dropZoneElement.addEventListener("drop", (e) => {
            e.preventDefault(); // default is to show this image on it's own seperate webpage...prevent that
            //console.log("recieved drop of ", e.dataTransfer.files.length, " images");

            // if we have files, add them to the inputElement (drop), but first remove old thumbnails(if any)
            if (e.dataTransfer.files.length) {
                if (dropZoneElement.querySelector(".drop-zone__thumb")) {   // if we have old images in dropzone - delete them(input only holds most recent)
                    dropZoneElement.querySelectorAll(".drop-zone__thumb").forEach(item => {
                        item.remove();    // delete old images from dropzone
                    })
                }
                inputElement.files = e.dataTransfer.files;  // drop complete

                
                // display thumbnail of image selected - one image only
                if (e.dataTransfer.files.length == 1) {
                    console.log("about to show thumbnail of single image", e.dataTransfer.files);
                    updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);                  // uncomment this to allow thumbnail to show in upload box
                }

                //single uploader component will only allow 1 image to be attached, so this works in both cases
                // Svien wants thumbnails removed??? commented out for now
                //for (let x = 0; x < e.dataTransfer.files.length; x++) {
                //    if (x < 8) {
                //        updateThumbnail(dropZoneElement, e.dataTransfer.files[x]);
                //    }
                //}


                // now handle auto upload -
                // Determine who to call: uploadSingleImageNew() or uploadGalleryNew()...There is one set id to find Gallery only

                if (dropZoneElement.id == "divGalleryDrop") {
                    console.log("now we have these Gallery files via drop: ", inputElement.files);

                    uploadGalleryNew(document.querySelector("#canvasgallery"), "gallery", e.dataTransfer.files);
                } else {
                    // console.log("dropZone element - identify which input it is",  dropZoneElement);
                    // instead of trying to get info on this component, just create onchange() event w/ javaScript - as this is handled already on the COMPONENT: DragDropUploaderComponent

                    //Browse event triggers auto upload already, so simulate that action because we already have image in inputElement
                    const evt = new Event("change");
                    inputElement.dispatchEvent(evt);

                }
            }

            dropZoneElement.classList.remove("drop-zone--over");
        });
    });
});

/**
 * this function updates photo thumbnails and file list
 * param {HTMLElement} dropZoneElement
 * param {File} file
 */

// Below function is for thumbnails to be shown via drag and drop - ie. BEFORE upload

function updateThumbnail(dropZoneElement, file) {

    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");  // there is no .drop-zone__thumb yet...so I guess this is underfined 1st time

    // First time - remove the prompt
    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
        dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }

    // if there is a thumbnail in there already -remove it
    if (dropZoneElement.querySelector(".drop-zone__thumb")) {
        dropZoneElement.querySelector(".drop-zone__thumb").remove();
    }

    // First time - there is no thumbnail element, so create it
    if (!thumbnailElement) {
        dropZoneElement.classList.add("row");
    }

    thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("drop-zone__thumb");
    thumbnailElement.style.height = ("85px");
    thumbnailElement.style.width = ("85px");
    dropZoneElement.appendChild(thumbnailElement);


    //grabing name, setting with css => (dropZone=thumbnail) content: attr(data-label)
    thumbnailElement.dataset.label = file.name;

    // Show thumbnail for image files

    if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.readAsDataURL(file); //async call
        reader.onload = () => {
            thumbnailElement.style.backgroundImage = `url('${reader.result}')`;

        };
    } else {
        thumbnailElement.style.backgroundImage = null;
    }
}



// Generic function  handles  gallery uploader max 8 images - instead of hitting API directly - uses service layer  wwwroot/html/js/services/media-service.js

export function uploadGalleryNew(imageTarget, name, files) {
    console.log("inside uploadGalleryNew with ", imageTarget, name, files);     // imageTarget sent in is reference to the HTML element itself- not just the name
    
    var inputGalleryFile = null;
    if (files.files) {      // handle both cases if drag and drop files=actual files, if 'browse' used, will have sent 'this' 
        console.log("file is located in files.files");
        inputGalleryFile = files.files;
    } else {
        console.log("file is located in files, target is ",imageTarget);
        inputGalleryFile = files;
    }

    imageTarget.innerHTML = "You have uploaded " + inputGalleryFile.length + " images, of 8 maximum. They will show here: <br/>";

    var inputFileCounter = 0;

    // call individually as Api ONLY accepts one at a time:
    for (const file of inputGalleryFile) {
        inputFileCounter++;
        if (inputFileCounter > 8) {           // limit of 8 images
            //   targetForImages.append("Max of 8 images reached, upload Complete");
            return;
        }

        // FUTURE: NOTE: need to add front end generated image id to send to service layer here in the future

        // get id to be sent to API  
        const id = new URL(location.href).searchParams.get('id');


        console.log("about to upload gallery image number ", inputFileCounter);

        //Uploading the Data to the service layer
        uploadMediaById(id, file, name)        // note: name = action in API
            .then(response => {
                console.log("recieved from api", response);
                if (response) {
                    showAPIImage(id, imageTarget, name, response[0] );        
                    
                } else console.log("response from uploadMediaById is null")
            })
  
    }
   
}



// this function does async upload of single image

export function uploadSingleImageNew(imageTarget, name, file) {
    console.log("uploading ", name, " image", file, "to ", imageTarget);

    // append profile id to be sent to API 
    const id = new URL(location.href).searchParams.get('id');

    uploadMediaById(id, name, file)
        .then(response => {
            if (!response) {
                console.log("no data returned from API");
            } else {
                imageTarget.innerHTML = "";
                showAPIImage(id, imageTarget, name, response[0]);


            }
        })
        .catch(console.error);
};


// display the image returned after uploading to API
function showAPIImage(id, imageTarget, name, data) {

    console.log("our file for: ",name, " is now on the server at ", data.url, "will show at ", imageTarget);
    const imgHolder = document.createElement("span");
    const apiImage = document.createElement("img");
    const imgDeleteButton = document.createElement("img");

    imgHolder.style.whiteSpace="nowrap";
    
    apiImage.src = data.url;
    apiImage.style.height = "95px";
    apiImage.style.objectFit = "cover";
    apiImage.style.position = "relative";
    apiImage.style.padding = "1px";
    imgHolder.append(apiImage);

    imgDeleteButton.src = "/images/Icons/Wizard/x-circle.svg";
    imgDeleteButton.style.backgroundColor = ("rgba(255, 0, 0, 0.5");
    imgDeleteButton.style.height = "25px";
    
    imgDeleteButton.style.borderRadius = "10px";
    imgDeleteButton.style.position = ("relative");
    imgDeleteButton.style.right = ("26px");
    

    // style the returned image in format it will be displayed
    if (name == "heroimage1400x500") {
        apiImage.style.width = "266px"; // 266x95 is aspect ratio of 1400x500 for hero image
        imgDeleteButton.style.top = ("-34px");
    } else if (name == "cardimage") {
        apiImage.style.width = "127px"; // 4:3 aspect ratio for card image
        imgDeleteButton.style.top = ("-34px");
    } else {
        apiImage.style.width = "95px";
    }

    if (name == "gallery") {
        imgDeleteButton.style.top = ("-34px");
    }

    if (name == "headshot") {
        console.log("applying style to ", name);
        apiImage.style.borderRadius = "50%";   // for headshot display as circle image
        imgDeleteButton.style.top = ("0px");
    } 

    // function to delete image and button
    imgDeleteButton.onclick = function () {
        apiImage.parentNode.removeChild(apiImage);
        imgDeleteButton.parentNode.removeChild(imgDeleteButton);
        //  Here we will delete image from database
        console.log('deleting ', name, data);
        deleteImage(id, name, data.url);
    };
    imgHolder.append(imgDeleteButton);
    
    imageTarget.append(imgHolder);
                // FUTURE: can style the images to show up in the box where the SVG image is...  or delete this and REMOVE the 'icon' marker from the first single uploader
                // if (iconReplace) {
                //     iconReplace.innerHTML = "";
                //iconReplace.removeChild(`icon${name}SVG`);

                //     iconReplace.append(imgDiv);
                //     iconReplace.append("HeadShot");
                // }
}



// delete selected image from api
export function deleteImage(id, name, fileLocation) {


    console.log("deleting ", name, " image file: ", fileLocation, " from API<br/>");
    deleteMediaByIdFileName(id, fileLocation, name)
        .then(response => console.log("delete function has COMPLETED :) and has returned ", response));
    // returns success:  message:
    
    // CORS error preventing direct access to API, so Built service layer and handled call in API.js

    //// append id to body to be sent to API 
    //const formDataDeleteImage = new FormData();


    
    //formDataDeleteImage.append("id", id);
    //formDataDeleteImage.append("propertyName", "image");
    //formDataDeleteImage.append("propertyValue", fileLocation);     // file seems to have no name attribute in postman
    //// Future add Front-end generated image data-id
    ////formDataDeleteImage.append("data-id", id);      //
    //formDataDeleteImage.append("action", name);

  


    //fetch("https://odinapi.azure-api.net/kvasirapi/delete", {
    //    method: "delete",
    //    headers: {
    //        "Ocp-Apim-Subscription-Key": "77c89a78e1d148a492212fa068010652"
    //    },
    //    body: formDataDeleteImage

    //    // append id to the body file   id = new URL(location.href).searchParams.get('id');

    //}) //.then(response => response.json())
    //    .then(data => {
    //        if (!data) {
    //            console.log("no data returned from API");
    //        } else {

    //            console.log("our file is now deleted on the server ", data);

    //        }
    //    })
    //    .catch(console.log("API direct failed w/ CORS error?"));
        

}





