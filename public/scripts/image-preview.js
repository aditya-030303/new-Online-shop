const imageInputElement = document.querySelector(
  "#image-upload-controle input"
);
const previewImageElement = document.querySelector(
  "#image-upload-controle img"
);

function updateImagePreview() {
  const files = imageInputElement.files;

  if (!files || files.length === 0) {
    previewImageElement.style.display = "none";
    return;
  }

  const pickedFile = files[0];
  previewImageElement.src = URL.createObjectURL(pickedFile);
  previewImageElement.style.display = "block";
}

imageInputElement.addEventListener("change", updateImagePreview);
