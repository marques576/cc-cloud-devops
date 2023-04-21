import React, { useState, useEffect, useRef } from "react";
import { Joystick } from 'react-joystick-component';
import Map from "./Map";
import Messages from "./Messages";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [pitch, setPitch] = useState(0);
  const [roll, setRoll] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [throttle, setThrottle] = useState(0);
  const [wsStatus, setWsStatus] = useState("Not Connected");

  const [lat, setLat] = useState(39.7375638);
  const [lng, setLng] = useState(-8.8113102);
  const [heading, setHeading] = useState(0);
  const [battery, setBattery] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [xVelocity, setXVelocity] = useState(0);
  const [yVelocity, setYVelocity] = useState(0);
  const [zVelocity, setZVelocity] = useState(0);

  const [messages, setMessages] = useState([] as string[]);

  let [connectedUserIds, setConnectedUserIds] = useState<Set<string>>(new Set());

  const [desiredGPSInputLocation, setDesiredGPSInputLocation] = useState<Array<[string, [number, number]]>>([]);

  const [currentGPSLocation, setCurrentGPSLocation] = useState<Array<[string, [number, number, number]]>>([]);


  useEffect(() => {
    const newSocket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL, "dboidsid");

    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("Connected to the WebSocket server!");
      setWsStatus("Connected");
    };

    newSocket.onmessage = (event) => {
      setMessages((messages) => [...messages, event.data]);

      const messageReceived = JSON.parse(event.data);

      try {

        if (messageReceived.userId !== undefined && messageReceived.userId !== null &&
          messageReceived.message.lat !== undefined && messageReceived.message.lat !== null &&
          messageReceived.message.lng !== undefined && messageReceived.message.lng !== null &&
          messageReceived.message.hdg !== undefined && messageReceived.message.hdg !== null &&
          messageReceived.message.batLvl !== undefined && messageReceived.message.batLvl !== null &&
          messageReceived.message.alt !== undefined && messageReceived.message.alt !== null &&
          messageReceived.message.velX !== undefined && messageReceived.message.velX !== null &&
          messageReceived.message.velY !== undefined && messageReceived.message.velY !== null &&
          messageReceived.message.velZ !== undefined && messageReceived.message.velZ !== null
        ) {

          if (!connectedUserIds.has(messageReceived.userId)) {
            connectedUserIds.add(messageReceived.userId);
          }

          setLat(parseFloat(messageReceived.message.lat));
          setLng(parseFloat(messageReceived.message.lng));
          setAltitude(parseFloat(messageReceived.message.alt));
          setXVelocity(parseFloat(messageReceived.message.velX));
          setYVelocity(parseFloat(messageReceived.message.velY));
          setZVelocity(parseFloat(messageReceived.message.velZ));
          setHeading(parseFloat(messageReceived.message.hdg));
          setBattery(parseFloat(messageReceived.message.batLvl));

          setCurrentGPSLocation(prevState => {
            const index = prevState.findIndex(([userId]) => userId === messageReceived.userId);
            if (index === -1) {
              return [...prevState, [messageReceived.userId, [messageReceived.message.lat, messageReceived.message.lng, messageReceived.message.hdg]]];
            } else {
              const newArray = [...prevState];
              newArray[index] = [messageReceived.userId, [messageReceived.message.lat, messageReceived.message.lng, messageReceived.message.hdg]];
              return newArray;
            }
          });
        }
      } catch (e) {
        console.log(e);
      }

      try {
        if (messageReceived.userId !== undefined && messageReceived.userId !== null &&
          messageReceived.message.command === 'gpsInput' &&
          messageReceived.message.lat !== undefined && messageReceived.message.lat !== null &&
          messageReceived.message.lng !== undefined && messageReceived.message.lng !== null
        ) {
          if (!connectedUserIds.has(messageReceived.userId)) {
            connectedUserIds.add(messageReceived.userId);
          }
          setDesiredGPSInputLocation(prevState => {
            const index = prevState.findIndex(([userId]) => userId === messageReceived.userId);
            if (index === -1) {
              return [...prevState, [messageReceived.userId, [messageReceived.message.lat, messageReceived.message.lng]]];
            } else {
              const newArray = [...prevState];
              newArray[index] = [messageReceived.userId, [messageReceived.message.lat, messageReceived.message.lng]];
              return newArray;
            }
          });
        }
      }
      catch (e) {
        console.log(e);
      }
    };

    newSocket.onclose = () => {
      console.log("Disconnected from the WebSocket server!");
      setWsStatus("Disconnected");
    };

    return () => {
      newSocket.close();
    };
  }, []);

  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);


  const handleMoveRightStick = (e: any) => {
    setPitch(e.y.toFixed(4));
    setRoll(e.x.toFixed(4));
    socket?.send(JSON.stringify({ "userId": "1", "message": { "command": "virtualSticksInput", "pitch": pitch, "roll": roll } }));
  }

  const handleMoveLeftStick = (e: any) => {
    setThrottle(e.y.toFixed(4));
    setYaw(e.x.toFixed(4));
    socket?.send(JSON.stringify({ "userId": "1", "message": { "command": "virtualSticksInput", "throttle": throttle, "yaw": yaw } }));
  }

  const handleStop = (e: any) => {
    socket?.send(JSON.stringify({ "userId": "1", "message": { "command": "virtualSticksInput", "pitch": 0, "roll": 0, "yaw": 0, "throttle": 0 } }));
    setPitch(0);
    setRoll(0);
    setYaw(0);
    setThrottle(0);
  }

  return (
    <div className="min-h-screen max-h-screen grid grid-cols-5 gap-4 bg-slate-100">

      <div className="content-center col-span-3">
        <Map currentGPSLocation={currentGPSLocation} desiredGPSInputLocation={desiredGPSInputLocation} />
      </div>

      <div className="space-y-20 col-span-2">

        <Tabs variant='enclosed'>
          <TabList>
            <Tab>Metrics</Tab>
            <Tab>Logs</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <TableContainer>
                <Table size="sm" variant='simple' className="">
                  <Tbody>
                    <Tr>
                      <Td>Pitch:</Td>
                      <Td>{pitch}</Td>
                    </Tr>
                    <Tr>
                      <Td>Roll:</Td>
                      <Td>{roll}</Td>
                    </Tr>
                    <Tr>
                      <Td>Yaw:</Td>
                      <Td>{yaw}</Td>
                    </Tr>
                    <Tr>
                      <Td>Throttle:</Td>
                      <Td>{throttle}</Td>
                    </Tr>
                    <Tr>
                      <Td>WS Status:</Td>
                      <Td>{wsStatus}</Td>
                    </Tr>
                    <Tr>
                      <Td>Drone Battery:</Td>
                      <Td>{battery} %</Td>
                    </Tr>
                    <Tr>
                      <Td>Latitude:</Td>
                      <Td>{lat}</Td>
                    </Tr>
                    <Tr>
                      <Td>Longitude:</Td>
                      <Td>{lng}</Td>
                    </Tr>
                    <Tr>
                      <Td>Heading:</Td>
                      <Td>{heading}</Td>
                    </Tr>
                    <Tr>
                      <Td>Altitude:</Td>
                      <Td>{altitude}</Td>
                    </Tr>
                    <Tr>
                      <Td>X-axis velocity:</Td>
                      <Td>{xVelocity}</Td>
                    </Tr>
                    <Tr>
                      <Td>Y-axis velocity:</Td>
                      <Td>{yVelocity}</Td>
                    </Tr>
                    <Tr>
                      <Td>Z-axis velocity:</Td>
                      <Td>{zVelocity}</Td>
                    </Tr>
                    <Tr>
                      <Td>Current Users Size:</Td>
                      <Td>{connectedUserIds.size}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <div className="flex flex-row space-x-5 place-content-center">
                <Joystick size={100} sticky={false} baseColor="gray" minDistance={5} throttle={150} move={handleMoveLeftStick} stop={handleStop} stickColor="blue" ></Joystick>
                <Joystick size={100} sticky={false} baseColor="gray" minDistance={5} throttle={150} move={handleMoveRightStick} stop={handleStop} stickColor="blue"></Joystick>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="place-content-center">
                <Messages messages={messages} listRef={listRef} />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>

  )
}

export default App
