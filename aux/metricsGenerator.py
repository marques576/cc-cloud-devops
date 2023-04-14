import asyncio
import json
import random
import websockets

async def broadcast_message(websocket, path):
    while True:
        message = {
            "userId": 2,
            "message": {
                "lat": random.uniform(38, 40),
                "lng": random.uniform(-7, -9),
                "alt": random.uniform(0, 10000),
                "velX": random.uniform(-100, 100),
                "velY": random.uniform(-100, 100),
                "velZ": random.uniform(-100, 100),
                "batLvl": random.uniform(0, 100),
                "hdg": random.uniform(-180,180)
            }
        }
        await websocket.send(json.dumps(message))
        await asyncio.sleep(2)

start_server = websockets.serve(broadcast_message, "localhost", 8080)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()