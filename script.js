const API_URL = "https://pdf-lock-backend.onrender.com"; // 🔥 तुम्‍हारा backend

const startBtn = document.getElementById("startBtn");
const popupOverlay = document.getElementById("popupOverlay");
const nextBtn = document.getElementById("nextBtn");
const passwordInput = document.getElementById("passwordInput");
const confirmPasswordInput = document.getElementById("confirmPasswordInput");
const loader = document.getElementById("loader");
const downloadSection = document.getElementById("downloadSection");
const downloadBtn = document.getElementById("downloadBtn");
const pdfFileInput = document.getElementById("pdfFile");
const popupTitle = document.getElementById("popupTitle");

let step = 0;
let selectedFile = null;
let finalPassword = "";

// Step 1: open popup
startBtn.addEventListener("click", () => {
  popupOverlay.style.display = "flex";
  step = 1;
  popupTitle.innerText = "Upload your PDF";
  pdfFileInput.style.display = "block";
  passwordInput.style.display = "none";
  confirmPasswordInput.style.display = "none";
  downloadSection.style.display = "none";
});

// Step 2: next button logic
nextBtn.addEventListener("click", async () => {
  if (step === 1) {
    if (!pdfFileInput.files.length) {
      alert("Please upload a PDF file");
      return;
    }
    selectedFile = pdfFileInput.files[0];
    step = 2;
    popupTitle.innerText = "Enter Password";
    pdfFileInput.style.display = "none";
    passwordInput.style.display = "block";
  } 
  else if (step === 2) {
    if (!passwordInput.value) {
      alert("Please enter password");
      return;
    }
    finalPassword = passwordInput.value;
    step = 3;
    popupTitle.innerText = "Confirm Password";
    passwordInput.style.display = "none";
    confirmPasswordInput.style.display = "block";
  } 
  else if (step === 3) {
    if (confirmPasswordInput.value !== finalPassword) {
      alert("Password mismatch! Try again.");
      confirmPasswordInput.value = "";
      return;
    }
    // lock PDF
    loader.style.display = "block";
    nextBtn.style.display = "none";

    const formData = new FormData();
    formData.append("pdf", selectedFile);
    formData.append("password", finalPassword);

    try {
      const response = await fetch(`${API_URL}/lock`, {
        method: "POST",
        body: formData,
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      downloadBtn.onclick = () => {
        const a = document.createElement("a");
        a.href = url;
        a.download = "locked.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      };

      loader.style.display = "none";
      downloadSection.style.display = "block";
    } catch (err) {
      alert("Error locking PDF: " + err.message);
      loader.style.display = "none";
      nextBtn.style.display = "block";
    }
  }
});
