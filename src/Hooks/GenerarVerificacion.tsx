import axios from "axios";
import express from "express";

const app = express();
const PORT = 3000;

app.get("/create-veriff-session", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.veriff.com/v1/sessions",
      {
        verification: {
          callback: "https://www.afpatlantida.com/callback",
          person: {
            firstName: "Jose",
            lastName: "Villalobos",
          },
        },
      },
      {
        headers: {
          "X-AUTH-CLIENT": "4d078b9d-14f3-4009-9b03-868ef1f2c69cTU_API_KEY",
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ url: response.data.verification.url }); // Esta URL la usas en el frontend
  } catch (error) {
    res.status(500).json({ error: "Error al crear la sesión" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});