from fastapi import FastAPI, HTTPException, Query
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound, VideoUnavailable
import uvicorn

app = FastAPI(title="YouTube Transcript Microservice")

@app.get("/transcript")
async def get_transcript(videoId: str = Query(..., description="The YouTube Video ID")):
    try:
        # Create instance (required in v1.x)
        ytt_api = YouTubeTranscriptApi()
        
        # Fetch transcript
        transcript_list = ytt_api.fetch(videoId)

        # Combine text segments
        full_transcript = " ".join([item.text for item in transcript_list])
        full_transcript = " ".join(full_transcript.split())

        return {
            "videoId": videoId,
            "transcript": full_transcript
        }

    except (TranscriptsDisabled, NoTranscriptFound):
        raise HTTPException(status_code=404, detail="Transcript is disabled or not found for this video.")
    except VideoUnavailable:
        raise HTTPException(status_code=404, detail="The video is unavailable.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)