from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import subprocess


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://junco-front.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

blenderbot_model = None
tokenizer = None

@app.post("/install")
async def install_libraries():
    try:
        subprocess.run(['pip', 'install', 'transformers'])
        subprocess.run(['pip', 'install', 'torch'])
        print("ok install")
        return {"message": "Libraries installed successfully."}
    except Exception as e:
        return {"message": str(e)}

@app.post("/load")
async def load_model():
    global blenderbot_model
    global tokenizer
    
    
    from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration
    import torch

    try:
        model_name = "facebook/blenderbot-400M-distill"
        tokenizer = BlenderbotTokenizer.from_pretrained(model_name)
        model = BlenderbotForConditionalGeneration.from_pretrained(model_name)

        blenderbot_model = model
        return {"message": "Model loaded successfully."}
    except Exception as e:
        return {"message": str(e)}

@app.post("/execute")
async def execute_model(message_chat: str):
    global blenderbot_model
    global tokenizer
    
    if blenderbot_model is None:
        return {"message" : "Model not loaded. Use /load to load the model first."}
    
    from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration
    import torch

 

    try:
        inputs = tokenizer(message_chat, return_tensors="pt")
        inputs["input_ids"] = inputs["input_ids"].to(torch.int64)

        response = blenderbot_model.generate(inputs["input_ids"])
        response_text = tokenizer.decode(response[0], skip_special_tokens=True)

        return {"message": response_text}
    except Exception as e:
        return {"message": str(e)}


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

