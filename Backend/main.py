from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import spotify  # TEMP DONT NEED LATER

"""
Backend entry point.

Responsibilities:
- Initialize the Spotify client and required services.
- Create the PlayerController and other application components.
- Define API endpoints that receive commands from the frontend.
- Return results and errors to the frontend.
- Start the backend server.

This file connects the components together. It should not contain
the implementation of individual Spotify operations or UI logic.
"""



# Network and API layer

app = FastAPI()
sp = spotify.get_spotify_client()  # Initialize the Spotify client

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Local development only
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test")
def test_connection():
    return {"message": "Hello from Python!"}


class ShuffleRequest(BaseModel):
    enabled: bool

@app.post("/player/shuffle")
def shuffle(request: ShuffleRequest):
    # player.set_shuffle(request.enabled)
    print(f"Shuffle set to: {request.enabled}")  
    return {"success": True}
