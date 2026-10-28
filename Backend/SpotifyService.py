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
        print("Next Track command sent.")  # Placeholder for actual implementation

    def previous_track(self):
        self.sp.previous_track()
        print("Previous Track command sent.")  # Placeholder for actual implementation

    def toggle_shuffle(self, enabled: bool):
        self.sp.shuffle(enabled)
        print(f"Shuffle set to: {enabled}")  # Placeholder for actual implementation

    def pause_resume_playback(self):
        if (self.get_current_track and self.get_current_track()["is_playing"]):
            self.sp.pause_playback()
            print("Playback paused.")  # Placeholder for actual implementation
        else:
            self.sp.start_playback()
            print("Playback resumed.")  # Placeholder for actual implementation

    def get_current_track(self):
        return self.sp.current_playback()

    def get_current_track_name(self):
        return self.get_current_track()["item"]["name"] if self.get_current_track() else None

    def get_queue(self):                                                                                    
        return self.sp.queue()

    def print_queue(self): 
        queue_data = self.get_queue()

        print("Currently playing:")
        current = queue_data.get("currently_playing")
        if current:
            print(f'{current["name"]} - {current["artists"][0]["name"]}')

        print("\nUp Next:")
        for index, track in enumerate(queue_data.get("queue", []), start=1):
            artist = track["artists"][0]["name"]
            print(f'{index}. {track["name"]} - {artist}')

    