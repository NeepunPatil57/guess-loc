import React, { useEffect, useRef } from 'react';
import './submit.css';

const Submit = ({ myref, lat1, lng1, lat2, lng2, generateRandomPoint, distance, guessLat, guessLng }) => {
  const submitMapContainerRef = useRef(null);
  
  useEffect(() => {
    let map;
    let marker1;
    let marker2;
    let guessedMarker;

    const initializeMap = () => {
      const mapOptions = {
        center: { lat: lat1, lng: lng1 },
        zoom: 5,
      };

      map = new window.google.maps.Map(submitMapContainerRef.current, mapOptions);

      // Place the first marker at lat1 and lng1
      marker1 = new window.google.maps.Marker({
        position: { lat: lat1, lng: lng1 },
        map,
        title: 'Marker 1',
      });

      marker2 = new window.google.maps.Marker({
        position: { lat: lat2, lng: lng2 },
        map,
        title: 'Marker 2',
      });

      // Place the guessed marker at guessLat and guessLng
      guessedMarker = new window.google.maps.Marker({
        position: { lat: guessLat, lng: guessLng },
        map,
        title: 'Guessed Marker',
        icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Blue marker icon URL
      });
    };

    initializeMap();

    // Clean up function for when the component unmounts (optional)
    return () => {
      // Any cleanup code for the map or markers (if required)
    };
  }, [lat1, lng1, lat2, lng2, guessLat, guessLng]);

  return (
    <div className="absolute w-[100%] h-[100%] bg-[#000000a8] z-10">
      <div id="submitMapContainer" ref={myref || submitMapContainerRef}></div>
      <div>Distance: {distance} km</div> {/* Display the distance */}
      <div>Guessed Latitude: {guessLat}</div> {/* Display the guessed latitude */}
      <div>Guessed Longitude: {guessLng}</div> {/* Display the guessed longitude */}
      <button id="generateButton" onClick={generateRandomPoint}>
        Generate Random Point
      </button>
    </div>
  );
};

export default Submit;
