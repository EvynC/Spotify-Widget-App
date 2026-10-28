import spotify

sp = spotify.get_spotify_client()

def test_playback():
    print("\n=== PLAYBACK ===")

    playback = sp.current_playback()

    if not playback:
        print("No playback information available.")
        return

    item = playback.get("item")
    device = playback.get("device") or {}

    print("Playing:", playback.get("is_playing"))
    print("Track:", item.get("name") if item else "None")
    print("Device:", device.get("name"))
    print("Progress:", playback.get("progress_ms"), "ms")
    print("Volume:", device.get("volume_percent"))
    print("Shuffle:", playback.get("shuffle_state"))
    print("Repeat:", playback.get("repeat_state"))


def test_queue():
    print("\n=== QUEUE ===")

    data = sp.queue()

    current = data.get("currently_playing")
    if current:
        print("Current:", current["name"])

    for index, track in enumerate(data.get("queue", []), start=1):
        artist = ", ".join(a["name"] for a in track["artists"])
        print(f"{index}. {track['name']} - {artist}")


def test_top_tracks():
    print("\n=== TOP TRACKS ===")

    results = sp.current_user_top_tracks(limit=20, offset=0, time_range="long_term")

    for index, track in enumerate(results["items"], start=1):
        artist = ", ".join(a["name"] for a in track["artists"])
        popularity = track.get("popularity", "N/A")

        print(f"{index}. {track['name']} - {artist} " f"| Popularity: {popularity}")


def test_top_artists():
    print("\n=== TOP ARTISTS ===")

    results = sp.current_user_top_artists(limit=10, time_range="long_term")

    for index, artist in enumerate(results["items"], start=1):
        print(f"{index}. {artist['name']}")


def test_recently_played():
    print("\n=== RECENTLY PLAYED ===")

    results = sp.current_user_recently_played(limit=20)

    for index, item in enumerate(results["items"], start=1):
        track = item["track"]
        artist = ", ".join(a["name"] for a in track["artists"])
        print(f"{index}. {track['name']} - {artist}")

def debug():
    test_playback()
    test_queue()
    test_top_tracks()
    test_top_artists()
    test_recently_played()

while (True):
    choice = input("Choose between the following options: \n1. Next Track\n2. Previous Track\n3. Toggle Shuffle\n4. Get Current Track\n5. Pause/Resume Playback\n6. Print Queue\n7. Debug\n8. Exit\n")
    match choice: 
        case "1":
            sp.next_track()
            print("Next Track command sent.")  
        case "2":
            sp.previous_track()
            print("Previous Track command sent.")  
        case "3":
            enabled_input = input("Enable shuffle? (yes/no): ")
            enabled = enabled_input.lower() == "yes"
            sp.toggle_shuffle(enabled)
            print(f"Shuffle set to: {enabled}")  
        case "4":
            current_track = sp.get_current_track()
            print(f"Current Track: {current_track}")  
            # print("Get Current Track command sent.")  
        case "5":
            sp.pause_resume_playback()
            print("Pause/Resume Playback command sent.")  
        case "6": 
            sp.print_queue()
            print("Print Queue command sent.")  
        case "7":
            print("Debugging...")
            debug(); 
        case "8":
            print("Exiting...")
            break