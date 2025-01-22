from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.ai_responses import generate_response


app = FastAPI()

# Definir un modelo de entrada para el mensaje
class MessageRequest(BaseModel):
    message: str

@app.post("/respond")
async def respond(request: MessageRequest):
    try:
        response = generate_response(request.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
