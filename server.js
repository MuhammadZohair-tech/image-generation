// server.js (dev only)
import app from "./app.js";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // If you set BASE_PATH="/myiris", open http://localhost:3000/myiris
  console.log(`Dev server running at http://localhost:${PORT}`);
});
