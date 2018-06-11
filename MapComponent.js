/*global google*/
import React from "react";
import { compose, withProps, withStateHandlers, lifecycle } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
  // DirectionsRenderer
} from "react-google-maps";
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import SearchBox from "react-google-maps/lib/components/places/SearchBox";
const _ = require("lodash");

const ApiKey = process.env.REACT_APP_APIKEY;

const searchBoxStyle = {
  boxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `240px`,
  height: `32px`,
  marginTop: `27px`,
  padding: `0 12px`,
  borderRadius: `3px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`
};

const MapComponent = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${ApiKey}&v=3.exp&libraries=geometry,places`,
    loadingElement: <div style={{ height: `400px`, width: `80vw` }} />,
    containerElement: <div style={{ height: `400px`, width: `80vw` }} />,
    mapElement: <div style={{ height: `400px`, width: `80vw` }} />
  }),
  withStateHandlers(
    () => ({
      isOpen: false
    }),
    {
      onToggleOpen: ({ isOpen }) => () => ({
        isOpen: !isOpen
      })
    }
  ),
  lifecycle({
    componentWillMount() {
      const refs = {};

      this.setState({
        bounds: null,
        center: {
          lat: 41.9,
          lng: -87.624
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter()
          });
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location
          }));
          const nextCenter = _.get(
            nextMarkers,
            "0.position",
            this.state.center
          );

          this.setState({
            center: nextCenter,
            markers: nextMarkers
          });
        }
      });
    }
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        this.setState({
          currentLocation: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });
      });

      // const DirectionsService = new google.maps.DirectionsService();
      // DirectionsService.route(
      //   {
      //     origin: new google.maps.LatLng(33.988314, -118.384026),
      //     destination: new google.maps.LatLng(33.8752, -118.24505),
      //     travelMode: google.maps.TravelMode.DRIVING
      //   },
      //   (result, status) => {
      //     if (status === google.maps.DirectionsStatus.OK) {
      //       this.setState({
      //         directions: result
      //       });
      //     } else {
      //       console.error(`error fetching directions ${result}`);
      //     }
      //   }
      // );
    }
  })
)(props => (
  <GoogleMap
    defaultZoom={15}
    defaultCenter={{ lat: 33.988314, lng: -118.384026 }}
  >
    {/* {props.directions && <DirectionsRenderer directions={props.directions} />} */}
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Search Address..."
        style={searchBoxStyle}
      />
    </SearchBox>

    {props.markers.map((marker, index) => (
      <Marker key={index} position={marker.position} />
    ))}
    <Marker
      position={{ lat: 33.988314, lng: -118.384026 }}
      // onClick={props.onToggleOpen}
      icon={{ url: "../assets/img/currLoc.png", height: "65px", width: "65px" }}
    >
      {/* {props.isOpen && ( */}
      <InfoBox
        onCloseClick={props.onToggleOpen}
        options={{ closeBoxURL: ``, enableEventPropagation: true }}
      >
        <div
          style={{
            backgroundColor: `lightblue`,
            opacity: 0.8,
            padding: `1px`,
            width: "180px",
            height: "135px",
            borderRadius: "50%"
          }}
        >
          <div
            style={{
              fontSize: `10px`,
              fontColor: "black",
              textAlign: `center`
            }}
          >
            <h5>Sabio Escrow</h5>
            <h6>
              400 Corporate Pointe<br />
              <br />Culver City, CA 90320
            </h6>
          </div>
        </div>
      </InfoBox>
      {/* )} */}
    </Marker>

    {/* Current Location Marker of User's Browser */}
    <Marker
      name={"Your Location"}
      position={props.currentLocation}
      title={"Current Location"}
      onClick={props.onToggleOpen}
    >
      {" "}
      {props.isOpen && (
        <InfoBox
          onCloseClick={props.onToggleOpen}
          options={{ closeBoxURL: ``, enableEventPropagation: true }}
        >
          <div
            style={{
              backgroundColor: `yellow`,
              opacity: 0.8,
              padding: `1px`,
              width: "160px",
              height: "45px"
            }}
          >
            <div
              style={{
                fontSize: `10px`,
                fontColor: "black",
                textAlign: `center`
              }}
            >
              <h6>Current Location</h6>
            </div>
          </div>
        </InfoBox>
      )}
    </Marker>
  </GoogleMap>
));

export default MapComponent;
