from fastapi import FastAPI, Request

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Bienvenido a Converso"}

@app.post("/webhook")
async def webhook(request: Request):
    data = await request.json()
    print("Mensaje recibido:", data)  
    return {"status": "success"}
