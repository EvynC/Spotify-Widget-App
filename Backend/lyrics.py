"""
Lyrics provider integration.

Responsibilities:
- Retrieve lyrics using a separate lyrics provider or API.
- Normalize the returned lyrics into a format usable by the frontend.
- Handle unavailable lyrics, missing tracks, and provider errors.
- Optionally retrieve synchronized lyric timestamps if supported.

Spotify's Web API does not provide a general-purpose lyrics endpoint.
This module should remain independent of the playback controller.

Optional feature: implement when the core player is working.
"""

# LRCLIB APi?
