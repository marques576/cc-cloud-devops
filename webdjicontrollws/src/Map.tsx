import React, { FC, useState } from "react";
import GoogleMapReact from 'google-map-react';
import { HiMapPin } from 'react-icons/hi2';

type DroneProps = {
  currentGPSLocation?: Array<[string, [number, number, number]]>;
  desiredGPSInputLocation?: Array<[string, [number, number]]>;
  lat?: number;
  lng?: number;
  heading?: number;
};

type MarkerProps = {
  lat: number;
  lng: number;
  markerColor: string;
  timeStamp: string;
};

const colorsList = ['#FF0000', '#00FF00', '#0000FF'];

const Map: FC<DroneProps> = ({ currentGPSLocation, desiredGPSInputLocation }) => {
  const [markers, setMarkers] = useState([]);

  const defaultProps = {
    center: {
      lat: 39.7375638,
      lng: -8.8113102,
    },
    zoom: 18,
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const jsonData = JSON.parse(event.target?.result as string);
        setMarkers(jsonData);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
        <input type="file" className="rounded-none" accept=".json" onChange={handleFileUpload} />
      </div>
      <div style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          options={{ mapTypeId: 'satellite' }}
        >

        {desiredGPSInputLocation?.map(([userId, [lat, lng]], index) => (
          <MarkerFromJson key={userId} lat={lat} lng={lng} markerColor={colorsList[index]} timeStamp="" />
        ))}

          {currentGPSLocation?.map(([userId, [lat, lng, heading]], index) => (
            <Drone key={index} lat={lat} lng={lng} heading={heading} />
          ))}
          {markers.map((data: any, index: number) => (
            data.drones.map((drone: any, index: number) => (
              <MarkerFromJson
                key={index}
                lat={drone.position.lat}
                lng={drone.position.lng}
                markerColor={colorsList[index]}
                timeStamp={data.currentTime}
              />
            ))
          ))}
        </GoogleMapReact>
      </div>
    </div>
  );
};

const Drone: FC<DroneProps> = ({ heading }) => (
  <div className="marker transform" style={{ transform: `rotate(${heading?? - 180}deg)` }}>
    <img src="droneMap.png" className="w-10 h-10"></img>
  </div>
);

const MarkerFromJson: FC<MarkerProps> = ({lat, lng, markerColor, timeStamp}) => {
  const [showCoords, setShowCoords] = useState(false);
  
  const handleMouseOver = () => {
    setShowCoords(true);
  }
  
  const handleMouseOut = () => {
    setShowCoords(false);
  }
  
  return (
    <div className="marker" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <HiMapPin className="w-8 h-8" style={{color: markerColor}}/>
      {showCoords && (
        <div className="text-cyan-50">{`${lat}, ${lng}, ${timeStamp}`}</div>
      )}
    </div>
  );
};

export default Map;