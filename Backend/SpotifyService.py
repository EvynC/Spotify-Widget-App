import spotipy

"""
SpotifyService: interface to the Spotify Web API through Spotipy.

Responsibilities:
- Execute Spotify playback commands.
- Retrieve the current playback state and track information.
- Read and modify shuffle and repeat settings.
- Search for tracks and add tracks to the queue.
- Translate Spotify API responses into useful application data.
- Handle Spotify-specific errors where appropriate.

This class receives an authenticated Spotipy client.
It should not handle UI events, Electron windows, or HTTP routing.
"""


class SpotifyService:
    """
    Handles communication with the Spotify Web API.
    """

    def __init__(self, spotify_client):
        self.sp = spotify_client

    def next_track(self):
        self.sp.next_track()

    def previous_track(self):
        self.sp.previous_track()

    def toggle_shuffle(self, enabled: bool):
        self.sp.shuffle(enabled)

    def get_current_track(self):
        pass 
