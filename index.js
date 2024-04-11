const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const folderPath = path.join(__dirname, "text_files");

try {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
} catch (err) {
  console.error("Error creating folder:", err);
}

app.use("/textFiles", express.static(folderPath));

// API endpoint to create a text file with current timestamp
app.get("/createTextFile", (req, res) => {
  try {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    const fileName = `${currentDate.toISOString().split("T")[0]}.txt`;
    const filePath = path.join(folderPath, fileName);

    fs.writeFile(filePath, `Current Timestamp: ${timestamp}`, (err) => {
      if (err) {
        console.error("Error creating text file:", err);
        res.status(500).send("Error creating text file");
      } else {
        console.log("Text file created successfully:", fileName);
        res.status(200).send(`Text file created successfully: ${fileName}`);
      }
    });
  } catch (err) {
    console.error("Error creating text file:", err);
  }
});

// API endpoint to retrieve all text files in the folder
app.get("/getTextFiles", (req, res) => {
  try {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        res.status(500).send("Error reading directory");
      } else {
        const textFiles = files.filter((file) => file.endsWith(".txt"));
        res.status(200).json({ files: textFiles });
      }
    });
  } catch (err) {
    console.error("Error reading directory:", err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
