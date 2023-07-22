import React, { useEffect, useRef, useState } from 'react';
import './home.css';
import env from "react-dotenv";
import randomStreetView  from "../script"
import Submit from "./submit"

const Home = ({ mylat, mylng }) => {

  const [lat, setLat] = useState(mylat);
  const [lng, setLng] = useState(mylng);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [miniWindow, setMiniWindow] = useState(true);

  const mapContainerRef = useRef(null);
  const streetViewContainerRef = useRef(null);
  const mapRef = useRef(null);
  var marker;
  var guessLat ;
  var guessLng ;




  useEffect(() => {
    const loadGoogleMapScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${env.GOOGLE_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {


     
      const mapOptions = {
        center: { lat :0, lng:0 },
        zoom: 0.641,
        minZoom:0.641,
        disableDefaultUI: true, 
        mapTypeControl: false, 
        keyboardShortcuts: false,
        streetViewControl: false,
        mapTypeControl: false,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP, 
        restriction: {
          latLngBounds: {
            north: 85, // Set the northern boundary (latitude)
            south: -85, // Set the southern boundary (latitude)
            west: -180, // Set the western boundary (longitude)
            east: 180, // Set the eastern boundary (longitude)
          },
          strictBounds: false,
        },
        styles: [
          {
            featureType: "all",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "landscape",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          },
          {
            featureType: "administrative.country",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          },
          {
            featureType: "administrative.locality",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          },
        ],
      };
        
      
      const panoramaOptions = {
          position: { lat , lng  },
          pov: { heading: 0, pitch: 0 },
          zoom: 1,
          disableDefaultUI: true, 
          showRoadLabels: false,
          linksControl: true, 
          panoProviderOptions: {
            hideLogo: true, // To hide the Google watermark/logo
            disableCompass: true, // To disable the compass
            panoId: 'gs_id:remove_labels', // You can remove this line if it doesn't serve any specific purpose
          },
      };

      // Create a Google Map
      const map = new window.google.maps.Map(mapContainerRef.current, mapOptions);
      mapRef.current = map;

      // Create a Street View
      const panorama = new window.google.maps.StreetViewPanorama(streetViewContainerRef.current, panoramaOptions);
      map.setStreetView(panorama);


      window.google.maps.event.addListener(map, 'mousemove', function(e) {
        map.setOptions({draggableCursor:'crosshair'});
      });
      // Add click event listener to the map
      map.addListener ('click', (event) => {
        placeMarker(event.latLng);
      });
    };



    if (!window.google) {
      loadGoogleMapScript();
    } else {  
      initMap();
    }

  }, [lat, lng]);

  // Function to place a marker on the map
  function placeMarker(location) {
    if ( marker ) {
      marker.setPosition(location);
    } else {
      marker = new window.google.maps.Marker({
        position: location,
        map: mapRef.current,
      });
    }

    guessLat= marker.position.lat();
    guessLng = marker.position.lng();

    console.log("Marker Lat: " + guessLat);
    console.log("Marker Lng: " + guessLng);
  }


  async function generateRandomPoint() {
    const locations = await randomStreetView.getRandomLocations(1);
    setLat(locations[0][0]);
    setLng(locations[0][1]);
    console.log(locations);
    setMiniWindow(false);
  }

  function CalcDistance(lat1,lat2, lon1, lon2){
      // The math module contains a function
      // named toRadians which converts from
      // degrees to radians.

      console.log(lat1 , lat2, lon1, lon2)


      lon1 =  lon1 * Math.PI / 180;
      lon2 = lon2 * Math.PI / 180;
      lat1 = lat1 * Math.PI / 180;
      lat2 = lat2 * Math.PI / 180;

      // Haversine formula
      let dlon = lon2 - lon1;
      let dlat = lat2 - lat1;
      let a = Math.pow(Math.sin(dlat / 2), 2)
      + Math.cos(lat1) * Math.cos(lat2)
      * Math.pow(Math.sin(dlon / 2),2);

      let c = 2 * Math.asin(Math.sqrt(a));

      // Radius of earth in kilometers. Use 3956
      // for miles
      let r = 6371;

      // calculate the result
      return(c * r);
  }

  // Example usage in the submitHandle function:
  function submitHandle() {
    // Assuming lat, lng, guessLat, and guessLng are defined elsewhere

    setLoading(true);
    setMiniWindow(true);

    const distance = CalcDistance(lat, guessLat , lng , guessLng);
    

    var newPoints = Math.round(20000 - distance)
    
    if (newPoints < 8000) { 
      newPoints = Math.round(newPoints / 10);
    }

    if(newPoints >= 8000) {
      newPoints = Math.round(newPoints * 2 / 10);
     }



    setPoints(points + newPoints);

    setLoading(false);
  
  }
  

  return (
    <div className='myDiv'>

      <div id="streetViewContainer" ref={streetViewContainerRef}></div>
      <div id="mapContainer" ref={mapContainerRef}></div>


      <button id="guessButton" onClick={submitHandle}>Submit</button>  
      <div id="score">Score = {points}</div>
      {miniWindow && <Submit 
        myref={mapContainerRef} 
        lat1={lat} lng1={lng} 
        lat2={guessLat} lng2={guessLng} 
        generateRandomPoint={generateRandomPoint} 
      /> }

    </div>
  );
};

export default Home;