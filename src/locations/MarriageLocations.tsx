import * as React from "react";
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_API_KEY } from "../constants";
import { Link } from "react-router-dom";

export interface Props {
  state: string;
}

export interface MarriageLocation {
  id: number;
  name: string;
  position: google.maps.LatLngLiteral;
}

export const MarriageLocations: React.FC<Props> = (props: Props) => {
  const { state } = props;
  const [locations, setLocations] = React.useState<MarriageLocation[]>();
  const [errorLoadingModule, setErrorLoadingModule] = React.useState<Error | undefined>(undefined);
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [activerMarkerId, setActiveMarkerId] = React.useState<number | null>();

  const center: google.maps.LatLngLiteral = React.useMemo(() => {
    return {
      lat: 34.0825472,
      lng: -118.4201763
    }
  }, [])

  const importLocations = React.useCallback(async () => {
    setErrorLoadingModule(undefined);
    try {
      const locationsModule = await import(`./${state}_locations.json`);
      console.log("Loaded", locationsModule.default);
      // normalize the locations
      let id = 0;
      const marriageLocations = (locationsModule.default as Array<any>).map(location => {
        return {
          id: id++,
          name: location.Location,
          position: {
            lat: parseFloat(location.Lat),
            lng: parseFloat(location.Lon)
          }
        } as MarriageLocation;
      });
      console.log("Normalized Locations", marriageLocations);
      setLocations(marriageLocations);
    } catch (e) {
      console.log("Error in loading module", state, e);
      setErrorLoadingModule(e as Error);
    }
  }, [state])

  React.useEffect(() => {
    importLocations();
  }, [state])

  const { isLoaded } = useJsApiLoader({
    id: "google-locations-script",
    googleMapsApiKey: GOOGLE_API_KEY
  })

  const onLoad = React.useCallback((map: google.maps.Map) => {
    // bounds based on locations
    if (locations && map) {
      /*const bounds = new google.maps.LatLngBounds();
      locations.forEach(({ position }) => bounds.extend(position));
      map.fitBounds(bounds, 1);
      map.panToBounds(bounds, 0);*/
    }
    setMap(map);
  }, [center, locations])

  const onUnmount = React.useCallback((map: google.maps.Map) => {
    setMap(null);
  }, [])

  const handleMarkerOnClick = React.useCallback((id: number) => {
    console.log("Marker Clicked", id, activerMarkerId);
    if (id === activerMarkerId) {
      return;
    }
    setActiveMarkerId(id);
  }, [locations, activerMarkerId])



  return <div>
    <p>Hello - {state}</p>

    {isLoaded && <GoogleMap mapContainerStyle={{ width: "100vw-20", height: "75vh" }}
      center={center}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={() => {
        setActiveMarkerId(null);
      }}
      zoom={6}
    >
      {locations && locations.map((location, index) => {
        const { id, name, position } = location;
        return <Marker position={position} key={id} title={name} clickable={true} onClick={() => {
          handleMarkerOnClick(id);
        }} >
          {activerMarkerId && (activerMarkerId === id) ? <InfoWindow key={id} onCloseClick={() => {
            setActiveMarkerId(null);
          }}>
            <>
              <div>{name}</div>
              <div><Link to={`/location-information?state=${state}&name=${name}&lat=${position.lat}&lng=${position.lng}`}>View detailed climate information</Link></div>
            </>
          </InfoWindow> : null}
        </Marker>
      })}
    </GoogleMap>}
  </div>
};

export default MarriageLocations;
