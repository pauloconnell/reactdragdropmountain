import * as React from "react";
/* ADD IMPORTS FROM TODO ON THE NEXT LINE */

/**
 * The About function defines the component that makes up the About page
 * This component is attached to the /about path in router.jsx
 */

export default function About() {
  /* DECLARE STYLE AND TRIGGER FOR WIGGLE EFFECT FROM TODO ON NEXT LINE */

  // get all dropZone inputs add click listener
  document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");

    dropZoneElement.addEventListener("click", (e) => {
      inputElement.click();
    });

    // handle 'browse' adds file
    inputElement.addEventListener("change", (e) => {
      if (inputElement.files.length) {
        updateThumbnail(dropZoneElement, inputElement.files[0]);
      }
    });

    // On DragOver - make border solid
    dropZoneElement.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZoneElement.classList.add("drop-zone--over");
    });

    // undo solid border
    ["dragleave", "dragend"].forEach((type) => {
      dropZoneElement.addEventListener(type, (e) => {
        dropZoneElement.classList.remove("drop-zone--over");
      });
    });

    // handle drop event
    dropZoneElement.addEventListener("drop", (e) => {
      e.preventDefault();
      console.log(e.dataTransfer.files);

      // if we have files, add them to the inputElement which will be submitted in form
      if (e.dataTransfer.files.length) {
        inputElement.files = e.dataTransfer.files;
        updateThumbnail(dropZoneElement, e.dataTransfer.files[0]); // send first one
      }
      console.log("now we have these files: ", inputElement.files);
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  /**
   * this function updates photo thumbnails and file list
   * param {HTMLElement} dropZoneElement
   * param {File} file
   */
  function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

    // First time - remove the prompt
    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
      dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }

    // First time - there is no thumbnail element, so lets create it
    if (!thumbnailElement) {
      thumbnailElement = document.createElement("div");
      thumbnailElement.classList.add("drop-zone__thumb");
      dropZoneElement.appendChild(thumbnailElement);
    }

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

  // ref: https://morioh.com/p/aedba50ec312

  return (
    <div className="page">
      {/* REPLACE H1 ELEMENT BELOW WITH CODE FROM TODO */}
      <h1 className="title">HTML 5 Drag and Drop API</h1>
      {/* REPLACE OPENING P TAG BELOW WITH CODE FROM TODO */}
      <p>Vanilla JavaScript inside React Components</p>
      <p>
        <em>
          <a href="https://reactjs.org/docs/hello-world.html">main concepts</a>
          {" javaScript HTML5 Drag and Drop File uploader "}
        </em>
      </p>
      <p>
      
      </p>
      <ul>
        <li>Next: MultiFile Uploader. 1 file uploader:</li>
      </ul>

      <p>
     
        
      </p>
      <p>
        Built with <a href="https://reactjs.org/">React</a> and{" "}
        <a href="https://vitejs.dev/">Vite</a> on{" "}
        <a href="https://glitch.com/">Glitch</a>.
      </p>

      <div class="setContainerSize  container-fluid pt-3 ">
        <div class="modal-header">
          <div
            class="modal-title m-auto fw-bold"
            id="exampleModalLongTitle"
            style="font-size:28px;"
            title="A complete profile will attract more clients – and you can promote yourself on your Instagram, Youtube, Facebook, Twitter and even your own website, or a store like Etsy"
          >
            Set up your Profile
          </div>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div class="modal-body">
          <div
            class="my-5 text-center"
            style="font-size:17px; text-decoration:underline;"
          >
            Drag and Drop photos:
          </div>
          <div class="row ">
            <div class="col text-center">
              <a href="/_New/Wizzard">
                <div class="numberStep m-auto">1</div>
              </a>
            </div>
            <div class="col text-center">
              <a href="/_New/Wizzard2">
                <div class="numberStep m-auto">2</div>
              </a>
            </div>
            <div class="col text-center">
              <a href="/_New/Wizzard3">
                <div class="numberStep m-auto">3 </div>{" "}
              </a>
            </div>
            <div class="col text-center">
              <a href="/_New/Wizzard4">
                <div class="numberStep m-auto">
                  <div style="position:relative; right:1px;">4</div>
                </div>
              </a>
            </div>
            <div class="col text-center">
              <a href="/_New/Wizzard5">
                {" "}
                <div class="numberStep m-auto">5</div>
              </a>
            </div>
            <div class="col text-center">
              <div class="numberStepBig m-auto">
                <div style="position:relative; top:11px;">6</div>
              </div>
            </div>

            <div class="row">
              <hr
                class="ms-3 me-5 pe-3 mx-lg-5 pe-lg-0"
                style="width:85%;height:3px;position:relative; left:14px; bottom:37px; z-index:1;"
              />
            </div>

            <div class="row" style="position:relative; bottom:25px;">
              <div class="col text-center">
                <div class=" m-auto">Intro</div>
              </div>
              <div class="col text-center">
                <div class=" m-auto">Expertise</div>
              </div>
              <div class="col text-center">
                <div class=" m-auto">Rate</div>
              </div>
              <div class="col text-center">
                <div class=" m-auto">Social Media</div>
              </div>
              <div class="col text-center">
                <div class=" m-auto">Pics and Videos</div>
              </div>
              <div class="col text-center">
                <div class=" m-auto">Extra Credit</div>
              </div>
            </div>
          </div>

          <form action="/APIPhoto" method="post" enctype="multipart/form-data">
            <div class="row">
              <div class="drop-zone my-3  col-6">
                <span class="drop-zone__prompt">
                  Drop file here or click to upload
                </span>
                <input
                  type="file"
                  name="myFile1"
                  class="drop-zone__input"
                  multiple
                />
              </div>

              <div class="drop-zone my-3 ms-3 col-6">
                <span class="drop-zone__prompt">
                  Drop file here or click to upload
                </span>
                <input type="file" name="myFile2" class="drop-zone__input" />
              </div>
            </div>

            <div class="row">
              <div class="drop-zone my-3 col-6">
                <span class="drop-zone__prompt">
                  Drop file here or click to upload
                </span>
                <input type="file" name="myFile3" class="drop-zone__input" />
              </div>

              <div class="drop-zone my-3 ms-3 col-6">
                <span class="drop-zone__prompt">
                  Drop file here or click to upload
                </span>
                <input type="file" name="myFile4" class="drop-zone__input" />
              </div>
            </div>

            <div class=" my-3 ps-3 fst-italic">
              No need to delete images - simply drag new image to replace images
              as needed.
            </div>
            <input type="submit" value="Submit To API" />
          </form>
        </div>
      </div>
    </div>
  );
}
