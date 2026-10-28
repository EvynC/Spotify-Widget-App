"""
Spotify client setup and authentication.

Responsibilities:
- Configure Spotify OAuth authentication.
- Define the required Spotify API scopes.
- Create and return an authenticated Spotipy client.
- Configure the redirect URI and token-cache location.
- Centralize Spotify client initialization.
"""

# Need to allow user to self-auuthenticate with Spotify and store the token for future use.

import spotipy
from spotipy.oauth2 import SpotifyOAuth
import json

def load_config():
    with open("config.json", "r") as f:
        config = json.load(f)
    return config

def get_spotify_client():
    """
    Create an authenticated Spotify client using OAuth.

    Returns:
        spotipy.Spotify: An authenticated Spotify API client.

    Raises:
        KeyError: If a required configuration key is missing.
    """

    config = load_config()
    client_id = config["spotifyClientId"]
    client_secret = config["spotifyClientSecret"]
    redirect_uri = config["spotifyRedirectUri"]

    sp = spotipy.Spotify(
        auth_manager=SpotifyOAuth(
            client_id=client_id,
            client_secret=client_secret,
            redirect_uri=redirect_uri,
            scope="user-library-read",
        )
    )

    return sp