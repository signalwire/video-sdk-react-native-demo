require("dotenv").config();
const auth = {
  username: process.env.PROJECT_ID, // Project-ID
  password: process.env.API_KEY // API token
};
const apiurl = `https://${process.env.SPACE}/api/video`;

const normalPermissions = [
  "room.self.audio_mute",
  "room.self.audio_unmute",
  "room.self.video_mute",
  "room.self.video_unmute",
  "room.self.deaf",
  "room.self.undeaf",
  "room.self.set_input_volume",
  "room.self.set_output_volume",
  "room.self.set_input_sensitivity",
  "room.set_layout",
  "room.hide_video_muted",
  "room.show_video_muted",
  "room.list_available_layouts",
];

// Basic express boilerplate
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());
// End basic express boilerplate

app.get("/", (req, res) => {
  if (!auth.username || !auth.password || !process.env.SPACE)
    return res.send(
      "Hello. The environment variables are not set.<br/> Please set PROJECT_ID, API_KEY, and SPACE."
    );
  else return res.send("The server is running.");
});

// Endpoint to request token for a room
app.post("/get_token", async (req, res) => {
  const { user_name, room_name } = req.body;
  console.log("Name: ", user_name, "Room: ", room_name);

  try {
    const response = await axios.post(
      apiurl + "/room_tokens", {
        user_name,
        room_name: room_name,
        permissions: normalPermissions
      }, {
        auth
      }
    );

    const token = response.data?.token;
    console.log(
      "Token:",
      token.length < 7 ? token : token.substring(0, 6) + "..."
    );

    return res.json({ token });
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

async function start(port) {
  app.listen(port, () => {
    console.log("Server listening at port", port);
  });
}

// Start the server
const PORT = process.env.PORT || 8080;
start(PORT);

