import WebSocket from 'ws';

interface WebSocketConnection {
    rawHeaders: string[];
  }
  
export function getIDfromWS(websocketConnection: WebSocketConnection): string | undefined {
    const index = websocketConnection.rawHeaders.indexOf('dboidsid');
    if (index !== -1 && index < websocketConnection.rawHeaders.length - 1) {
      return websocketConnection.rawHeaders[index + 1];
    }
    if (index !== -1){
      return "0";
    }
    return undefined;
  }


export function encaspulateMessageJSON (userId:string, message:string): string {
    const messageJSON = {
        userId: userId,
        message: JSON.parse(message)
    };
    return JSON.stringify(messageJSON);
};

export function decaspulateMessageJSON (message:string): {userId:string, message:string} {
    return JSON.parse(message);
}
