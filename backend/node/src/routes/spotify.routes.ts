import { Router, Request, Response } from "express";

import querystring from "querystring";
import axios from "axios";
const router = Router();
const spotifyURl = "https://api.spotify.com/v1";

router.get("/login", function (req, res) {
  var state = generateRandomString(16);
  var scope = [
    "user-read-private",
    "user-read-email",
    "user-read-playback-position",
    "user-top-read",
    "user-read-recently-played",
    "user-library-read",
    "user-read-currently-playing",
  ].join(" ");
  let client_id = process.env.SPOTIFY_CLIENT_ID;
  let redirect_uri = process.env.URL + "/spotify/callback";
  if (!client_id || client_id === "") {
    res.status(500).send("Spotify client id not set");
    return;
  }
  if (!redirect_uri || redirect_uri === "/spotify/callback") {
    res.status(500).send("Spotify redirect uri not set");
    return;
  }

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

function generateRandomString(arg0: number) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < arg0; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

router.get("/callback", async function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;

  let client_id = process.env.SPOTIFY_CLIENT_ID;
  let client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  let redirect_uri = process.env.URL + "/spotify/callback";

  if (!client_id || client_id === "") {
    res.status(500).send("Spotify client id not set");
    return;
  }
  if (!redirect_uri || redirect_uri === "/spotify/callback") {
    res.status(500).send("Spotify redirect uri not set");
    return;
  }

  if (!client_secret || client_secret === "") {
    res.status(500).send("Spotify client secret not set");
  }

  if (code === null || state === null) {
    res.send("There was an error during the authentication");
    return;
  }
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    json: true,
  };

  try {
    let response = await axios.post(authOptions.url, authOptions.form, {
      headers: authOptions.headers,
    });
    res.redirect(
      process.env.FRONTEND_URL +
        "?access_token=" +
        response.data.access_token +
        "&refresh_token=" +
        response.data.refresh_token +
        "&expires_in=" +
        response.data.expires_in
    );
  } catch (err) {
    console.log(err);
    res.redirect(process.env.FRONTEND_URL!);
  }
});

router.get("/refresh_token", async function (req, res) {
  var refresh_token = req.query.refresh_token;
  let client_id = process.env.SPOTIFY_CLIENT_ID;
  let client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  let redirect_uri = process.env.URL + "/spotify/callback";

  if (!client_id || client_id === "") {
    res.status(500).send("Spotify client id not set");
    return;
  }
  if (!redirect_uri || redirect_uri === "/spotify/callback") {
    res.status(500).send("Spotify redirect uri not set");
    return;
  }

  if (!client_secret || client_secret === "") {
    res.status(500).send("Spotify client secret not set");
  }

  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  try {
    let response = await axios.post(authOptions.url, authOptions.form, {
      headers: authOptions.headers,
    });
    res.send({ access_token: response.data.access_token, expires_in: response.data.expires_in});
  } catch (err) {
    console.log(err);
    res.status(500).send("Error refreshing token");
  }
});

router.get("/top-artists", async (req: Request, res: Response) => {
  let { term } = req.query;
  const access_token = req.headers.authorization;

  if (!access_token || access_token === "") {
    res.status(403).send("No access token provided");
    return;
  }

  if (!term || term === "") {
    term = "short_term";
  }
  try {
    const topArtists = await axios.get(
      `${spotifyURl}/me/top/artists?time_range=${term}&limit=10`,
      {
        headers: {
          Authorization: `${access_token}`,
          ContentType: "application/json",
        },
      }
    );
    res.send(topArtists.data.items);
    return;
  } catch (err) {
    res.status(500).send("Error getting top artists");
    return;
  }
});

router.get("/top-tracks", async (req: Request, res: Response) => {
  let { term } = req.query;
  const access_token = req.headers.authorization;

  if (!access_token || access_token === "") {
    res.status(403).send("No access token provided");
    return;
  }

  if (!term || term === "") {
    term = "short_term";
  }
  try {
    const topTracks = await axios.get(
      `${spotifyURl}/me/top/tracks?time_range=${term}&limit=10`,
      {
        headers: {
          Authorization: `${access_token}`,
          ContentType: "application/json",
        },
      }
    );

    res.send(topTracks.data.items);
    return;
  } catch (err) {
    res.status(500).send("Error getting top tracks");
    return;
  }
});

export default router;
