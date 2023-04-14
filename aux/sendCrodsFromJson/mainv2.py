import json
import websocket
import time

# Define the WebSocket server URL
WEBSOCKET_URL = "ws://127.0.0.1:8080"

with open("movementLog_1.json", "r") as f:
    drone_data = json.load(f)

total_items = len(drone_data)

ws = websocket.create_connection(WEBSOCKET_URL, header={"dboidsID": "0"})

for i, data in enumerate(drone_data):
    for j, drone in enumerate(data['drones']):
        drone_pos = drone['position']
        drone_pos['command'] = "gpsInput"
        message = json.dumps({
            "userId": str(j+1),
            "message": drone_pos
        })
        ws.send(message)

    time.sleep(0.05)

    percent_complete = (i + 1) / total_items * 100
    print(f"{i+1}/{total_items} ({percent_complete:.2f}%)")

ws.close()
