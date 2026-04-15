import express from "express";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes can be added here if needed in the future
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Production static file serving
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  
  // The key fix for SPA routing: 
  // Redirect all non-file requests to index.html
  app.get('*all', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
