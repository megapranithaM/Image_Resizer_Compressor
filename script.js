// Get DOM elements
const imageUpload = document.getElementById("image-upload");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const ratioCheckbox = document.getElementById("ratio");
const qualityCheckbox = document.querySelector("#quality");
const downloadBtn = document.querySelector(".download-btn");

// Sidebar Toggle
const sidebarToggleBtn = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');

sidebarToggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// Variables
let uploadedImage = null;
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");

// Set the canvas size to match the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.zIndex = "1000";
canvas.style.pointerEvents = "none"; // Prevent it from blocking other elements
document.body.appendChild(canvas);

// Store particles for rendering
let particles = [];

// Handle image upload
imageUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;
    img.onload = () => {
      uploadedImage = img;
      widthInput.value = img.width;
      heightInput.value = img.height;
    };
  };
});

// Adjust height when aspect ratio is checked
widthInput.addEventListener("input", () => {
  if (ratioCheckbox.checked && uploadedImage) {
    const aspectRatio = uploadedImage.width / uploadedImage.height;
    heightInput.value = Math.round(widthInput.value / aspectRatio);
  }
});

heightInput.addEventListener("input", () => {
  if (ratioCheckbox.checked && uploadedImage) {
    const aspectRatio = uploadedImage.width / uploadedImage.height;
    widthInput.value = Math.round(heightInput.value * aspectRatio);
  }
});

// Download resized image
downloadBtn.addEventListener("click", () => {
  if (!uploadedImage) {
    alert("Please upload an image first!");
    return;
  }

  const width = parseInt(widthInput.value);
  const height = parseInt(heightInput.value);

  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
    alert("Please enter valid dimensions!");
    return;
  }

  // Resize the canvas
  canvas.width = width;
  canvas.height = height;

  // Draw the resized image
  ctx.drawImage(uploadedImage, 0, 0, width, height);

  // Adjust quality if the checkbox is checked
  const quality = qualityCheckbox.checked ? 0.7 : 1.0;

  // Convert canvas to image and download
  const resizedImage = canvas.toDataURL("image/jpeg", quality);
  const link = document.createElement("a");
  link.href = resizedImage;
  link.download = "resized-image.jpg";
  link.click();
});

// Particle effect initialization
function createParticle(x, y) {
  // Randomly pick a color for the bubble (particle)
  const colors = [
    "rgba(255, 0, 119, 1)", // Aurora pink
    "rgba(0, 255, 255, 1)", // Aqua
    "rgba(255, 255, 0, 1)", // Yellow
    "rgba(0, 255, 0, 1)", // Green
    "rgba(255, 165, 0, 1)", // Orange
    "rgba(138, 43, 226, 1)" // Blue Violet
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  // Create a new particle (bubble)
  const particle = {
    x: x,
    y: y,
    size: Math.random() * 10 + 5,  // Random size between 5 and 15px
    life: Math.random() * 1000 + 500,  // Random lifespan between 500ms and 1500ms
    opacity: 1.0,
    speedX: Math.random() * 2 - 1,  // Random speed in X direction
    speedY: Math.random() * 2 - 1,  // Random speed in Y direction
    color: randomColor // Assign the random color to the particle
  };

  // Add the particle to the array
  particles.push(particle);
}

// Particle rendering and animation
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Draw each particle
  particles.forEach((particle, index) => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2, false);
    ctx.fillStyle = particle.color; // Use the random color
    ctx.fill();

    // Update particle position and opacity
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.opacity -= 0.01;  // Fade the particle out
    particle.size *= 0.99;  // Shrink the particle

    // Remove the particle if it's too small or transparent
    if (particle.opacity <= 0 || particle.size <= 1) {
      particles.splice(index, 1); // Remove the particle from the array
    }
  });

  requestAnimationFrame(animateParticles); // Continue animating
}

// Start the particle animation
animateParticles();

// Mousemove event to create particles at cursor position
document.addEventListener("mousemove", (event) => {
  createParticle(event.pageX, event.pageY);
});

// Generate bubbles continuously at random positions every 100ms
setInterval(() => {
  // Generate a random position on the canvas
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  createParticle(x, y); // Create a new bubble at the random position
}, 100);  // This will create new bubbles every 100ms
