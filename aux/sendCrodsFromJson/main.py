import json
import websocket
import time

# Define the WebSocket server URL
WEBSOCKET_URL = "ws://127.0.0.1:8080"

with open("movementLog_1.json", "r") as f:
    drone_data = json.load(f)

total_items = len(drone_data)

ws = websocket.create_connection(WEBSOCKET_URL)

for i, data in enumerate(drone_data):
    message = data['drones'][0]['position']
    message['command'] = "gpsInput"
    message = json.dumps(data['drones'][0]['position'])
    time.sleep(0.05)
    ws.send(message)

    percent_complete = (i + 1) / total_items * 100
    print(f"{i+1}/{total_items} ({percent_complete:.2f}%)")

ws.close()
