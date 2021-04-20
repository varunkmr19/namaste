let imageFile, base64ImageString, cropX, cropY, cropWidth, cropHeight;
function readURL(imageUrl) {
  if (imageUrl.files && imageUrl.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      disableImageOverlay();
      const image = e.target.result;
      let imageFieldDisplay = document.getElementById(
        "id_profile_image_display"
      );
      imageFieldDisplay.src = image;
      const imageSrc = document.getElementById("id_profile_image");
      imageSrc.src = image;
      const cropper = new Cropper(imageFieldDisplay, {
        aspectRatio: 1/1,
        crop(event) {
          console.log(event.detail.x)
          console.log(event.detail.y)
          console.log(event.detail.width)
          console.log(event.detail.height)
          setImageCropProperties(image, event.detail.x, event.detail.y, event.detail.height, event.detail.width)
        }
      })
    };

    reader.readAsDataURL(imageUrl.files[0]);
  }
}

function setImageCropProperties(image, x, y, width, height) {
  imageFile = image
  cropX = x
  cropY = y
  cropWidth = width
  cropHeight = height
}

function isImageSizeValid(image) {
  console.log("max size: {{DATA_UPLOAD_MAX_MEMORY_SIZE}}")
  const startIndex = image.indexOf("base64,") + 7;
  const base64str = image.substr(startIndex);
  const decoded = atob(base64str);
  console.log("FileSize: " + decoded.length);
  if(decoded.length>= "{{DATA_UPLOAD_MAX_MEMORY_SIZE}}"){
    return null
  }
  return base64str
}

function cropImage(image, x, y, width, height) {
  base64ImageString = isImageSizeValid(image)

  if(base64ImageString != null){
    var requestData = {
      "csrfmiddlewaretoken": window.CSRF_TOKEN,
      "image": base64ImageString,
      "cropX": cropX,
      "cropY": cropY,
      "cropWidth": cropWidth,
      "cropHeight": cropHeight
    }
    $.ajax({
      type: 'POST',
      dataType: "json",
      url: "http://localhost:8000/account/user/window.USER_ID/edit/cropImage",
      data: requestData,
      timeout: 10000,
      success: function(data) {
        if(data.result == "success"){
          document.getElementById("id_cancel").click()
        }
        else if(data.result == "error"){
          alert(data.exception)
          document.getElementById("id_cancel").click()
        }
      },
      error: function(data) {
        console.error("ERROR...", data)
      },
    });
  }
  else{
    alert("Upload an image smaller than 10 MB");
    document.getElementById("id_cancel").click()
  }
}

function enableImageOverlay() {
  const text = document.getElementById("id_text");
  text.style.backgroundColor = "#0066ff";
  text.style.color = "white";
  text.style.fontSize = "16px";
  text.style.padding = "16px 32px";
  text.style.cursor = "pointer";

  const profileImage = document.getElementById("id_profile_image");
  profileImage.style.opacity = "1";
  profileImage.style.display = "block";
  profileImage.style.width = "100%";
  profileImage.style.height = "auto";
  profileImage.style.transition = "0.5s ease";
  profileImage.style.backfaceVisibility = "hidden";
  profileImage.style.cursor = "pointer";

  const middleContainer = document.getElementById("id_middle_container");
  middleContainer.style.transition = "0.5s ease";
  middleContainer.style.opacity = "0";
  middleContainer.style.position = "absolute";
  middleContainer.style.top = "50%";
  middleContainer.style.left = "50%";
  middleContainer.style.transform = "translate(-50%, -50%)";
  middleContainer.style.textAlign = "center";

  const imageContainer = document.getElementById("id_image_container");
  imageContainer.addEventListener("mouseover", (event) => {
    profileImage.style.opacity = "0.3";
    middleContainer.style.opacity = "1";
  });

  imageContainer.addEventListener("mouseout", (event) => {
    profileImage.style.opacity = 1;
    middleContainer.style.opacity = "0";
  });

  imageContainer.addEventListener("click", (event) => {
    document.getElementById("id_profile_image").click();
  });

  const cropConfirm = document.getElementById("id_image_crop_confirm");
  cropConfirm.classList.remove("d-flex");
  cropConfirm.classList.remove("felx-row");
  cropConfirm.classList.remove("justify-content-between");
  cropConfirm.classList.add("d-none");
}

function disableImageOverlay() {
  const text = document.getElementById("id_text");
  const profileImage = document.getElementById("id_profile_image_display");
  const middleContainer = document.getElementById("id_middle_container");
  const imageContainer = document.getElementById("id_image_container");

  imageContainer.removeEventListener("mouseover", function (event) {
    profileImage.style.opacity = "0.3";
    middleContainer.style.opacity = "1";
  });

  imageContainer.removeEventListener("mouseout", function (event) {
    profileImage.style.opacity = "1";
    middleContainer.style.opacity = "0";
  });

  profileImage.style.opacity = "1";
  middleContainer.style.opacity = "0";
  text.style.cursor = "default";
  text.style.opacity = "0";

  document.getElementById('id_image_container').removeEventListener("click", function (event) {
    event.preventDefault();
    // do nothing
  });
  document.getElementById('id_profile_image').addEventListener("click", function (event) {
    event.preventDefault();
    // do nothing
  });

  const cropConfirm = document.getElementById("id_image_crop_confirm");
  cropConfirm.classList.remove("d-none");
  cropConfirm.classList.add("d-flex");
  cropConfirm.classList.add("flex-row");
  cropConfirm.classList.add("justify-content-between");

  const confirm = document.getElementById("id_confirm");
  confirm.addEventListener("click", function (event) {
    console.log("Sending crop data for processing...")
			cropImage(
				imageFile, 
				cropX, 
				cropY, 
				cropWidth,
				cropHeight
			)
  });

  const cancel = document.getElementById("id_cancel");
  cancel.addEventListener("click", function (event) {
    console.log("Reloading window...");
    window.location.reload();
  });
}

enableImageOverlay();
