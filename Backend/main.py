import spotipy
from spotipy.oauth2 import SpotifyOAuth
import json

def load_config():
    with open("config.json", "r") as f:
        config = json.load(f)
    return config


def get_spotify_client():
    sp = spotipy.Spotify(
        auth_manager=SpotifyOAuth(
            client_id=client_id,
            client_secret=client_secret,
            redirect_uri=redirect_uri,
            scope="user-library-read",
        )
    )

    return sp

def main(sp):


    # tracks = sp.current_user_saved_tracks()

    # for item in tracks["items"]:
    #     track = item["track"]
    #     print(track["name"])
    pass 


if __name__ == "__main__":
    config = load_config()
    client_id = config["spotifyClientId"]
    client_secret = config["spotifyClientSecret"]
    redirect_uri = config["spotifyRedirectUri"]

    sp = get_spotify_client()
    main(sp)
