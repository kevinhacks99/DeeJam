import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
    "users-read-email",
    "playlist-read-private",
    "user-read-email",
    "playlist-read-collaborative",
    "user-top-read",
    "users-read-private"
].join(',');

const params = {
    scope: scopes,
};

const queryParamString = new URLSearchParams(params);

const LOGIN_URL = `https://acounts.spotify.com/authorize?${queryParamString.toString()}`;

const SpotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
})

export default SpotifyApi;

export { LOGIN_URL };