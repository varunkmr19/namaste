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
    };

    reader.readAsDataURL(imageUrl.files[0]);
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
  const cropConfirm = document.getElementById("id_image_crop_confirm");

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

  imageContainer.removeEventListener("click", function (event) {
    event.preventDefault();
    // do nothing
  });
  profileImage.addEventListener("click", function (event) {
    event.preventDefault();
    // do nothing
  });

  cropConfirm.classList.remove("d-none");
  cropConfirm.classList.add("d-flex");
  cropConfirm.classList.add("flex-row");
  cropConfirm.classList.add("justify-content-between");

  const confirm = document.getElementById("id_confirm");
  confirm.addEventListener("click", function (event) {
    enableImageOverlay();
  });

  const cancel = document.getElementById("id_cancel");
  cancel.addEventListener("click", function (event) {
    console.log("Reloading window...");
    window.location.reload();
  });
}

enableImageOverlay();
