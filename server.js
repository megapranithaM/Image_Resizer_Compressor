const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// Endpoint to handle image resizing and compression
app.post("/resize", upload.single("image"), async (req, res) => {
    try {
        const width = parseInt(req.body.width, 10);
        const height = parseInt(req.body.height, 10);
        const quality = req.body.quality === "true" ? 50 : 100; // Quality in percentage
        const maintainRatio = req.body.ratio === "true";

        const inputPath = req.file.path;
        const outputPath = `uploads/resized-${Date.now()}.jpg`;

        let sharpInstance = sharp(inputPath);

        // Resize image with or without maintaining aspect ratio
        if (maintainRatio) {
            sharpInstance = sharpInstance.resize({ width, height });
        } else {
            sharpInstance = sharpInstance.resize(width, height);
        }

        // Compress and save the image
        await sharpInstance.jpeg({ quality }).toFile(outputPath);

        // Remove the original uploaded file
        fs.unlinkSync(inputPath);

        // Send the resized/compressed image as a downloadable file
        res.download(outputPath, (err) => {
            if (err) console.error(err);
            fs.unlinkSync(outputPath); // Clean up the resized file after download
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred during image processing.");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
