"""
Spotify client setup and authentication.

Responsibilities:
- Configure Spotify OAuth authentication.
- Define the required Spotify API scopes.
- Create and return an authenticated Spotipy client.
- Configure the redirect URI and token-cache location.
- Centralize Spotify client initialization.
"""

import spotipy
from spotipy.oauth2 import SpotifyOAuth
import json
import os


def load_config():
    with open("config.json", "r", encoding="utf-8") as f:
        return json.load(f)


def get_spotify_client():
    """
    Create an authenticated Spotify client using OAuth.

    Returns:
        spotipy.Spotify: An authenticated Spotify API client.
    """

    config = load_config()

    client_id = config["spotifyClientId"]
    client_secret = config["spotifyClientSecret"]
    redirect_uri = config["spotifyRedirectUri"]

    # Permissions required by the Spotify widget

    scope = " ".join(
        [
            # Account information
            "user-read-private",
            "user-read-email",
            # Playback and devices
            "user-read-playback-state",
            "user-read-currently-playing",
            "user-modify-playback-state",
            # Queue and playback history
            "user-read-recently-played",
            "user-read-playback-position",
            # Top tracks and artists
            "user-top-read",
            # Saved tracks and albums
            "user-library-read",
            "user-library-modify",
            # Playlists
            "playlist-read-private",
            "playlist-read-collaborative",
            "playlist-modify-public",
            "playlist-modify-private",
            # Followed artists and saved items
            "user-follow-read",
            "user-follow-modify",
            # Listening activity
            "user-read-playback-position",
        ]
    )

    # Keep the token cache alongside this module
    cache_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".cache")

    auth_manager = SpotifyOAuth(
        client_id=client_id,
        client_secret=client_secret,
        redirect_uri=redirect_uri,
        scope=scope,
        cache_path=cache_path,
        open_browser=True,
    )

    return spotipy.Spotify(auth_manager=auth_manager)
