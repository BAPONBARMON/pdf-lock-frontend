document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const popupOverlay = document.getElementById("popupOverlay");
  const popupTitle = document.getElementById("popupTitle");
  const pdfFileInput = document.getElementById("pdfFile");
  const passwordInput = document.getElementById("passwordInput");
  const nextBtn = document.getElementById("nextBtn");
  const loader = document.getElementById("loader");
  const downloadSection = document.getElementById("downloadSection");
  const downloadBtn = document.getElementById("downloadBtn");

  let step = 1;
  let selectedFile = null;
  let password = "";

  startBtn.addEventListener("click", () => {
    step = 1;
    selectedFile = null;
    password = "";
    popupTitle.textContent = "Upload your PDF";
    pdfFileInput.style.display = "block";
    passwordInput.style.display = "none";
    downloadSection.style.display = "none";
    popupOverlay.style.display = "flex";
  });

  nextBtn.addEventListener("click", async () => {
    if (step === 1) {
      if (pdfFileInput.files.length === 0) {
        alert("Please upload a PDF file!");
        return;
      }
      selectedFile = pdfFileInput.files[0];
      step = 2;
      popupTitle.textContent = "Enter password to lock PDF";
      pdfFileInput.style.display = "none";
      passwordInput.style.display = "block";
      passwordInput.value = "";
    } else if (step === 2) {
      if (!passwordInput.value) {
        alert("Please enter a password!");
        return;
      }
      password = passwordInput.value;
      step = 3;
      popupTitle.textContent = "Confirm your password";
      passwordInput.value = "";
    } else if (step === 3) {
      if (passwordInput.value !== password) {
        alert("❌ Password mismatch! Try again.");
        step = 2;
        popupTitle.textContent = "Enter password to lock PDF";
        passwordInput.value = "";
        return;
      }

      // Show loader
      loader.style.display = "block";
      nextBtn.style.display = "none";

      const formData = new FormData();
      formData.append("pdf", selectedFile);
      formData.append("password", password);

      try {
        const response = await fetch("https://pdf-lock-backend.onrender.com/lock-pdf", {
          method: "POST",
          body: formData
        });

        if (!response.ok) {
          throw new Error("Server error: " + response.status);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        downloadBtn.onclick = () => {
          const a = document.createElement("a");
          a.href = url;
          a.download = "locked.pdf";
          a.click();
        };

        loader.style.display = "none";
        downloadSection.style.display = "block";
      } catch (error) {
        loader.style.display = "none";
        nextBtn.style.display = "block";
        alert("⚠️ Error locking PDF: " + error.message);
      }
    }
  });
});
