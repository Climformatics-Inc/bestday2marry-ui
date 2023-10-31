import * as React from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
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

export type Locations = Array<{ Location: string; Lat: string; Lon: string }>;

export const MarriageLocations: React.FC<Props> = (props: Props) => {
  const { state } = props;
  const [locations, setLocations] = React.useState<MarriageLocation[]>();
  const [errorLoadingModule, setErrorLoadingModule] = React.useState<
    Error | undefined
  >(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [acriveMarkerId, setActiveMarkerId] = React.useState<number | null>();

  const center: google.maps.LatLngLiteral = React.useMemo(() => {
    return {
      lat: 34.0825472,
      lng: -118.4201763,
    };
  }, []);

  const importLocations = React.useCallback(async () => {
    setErrorLoadingModule(undefined);
    try {
      const locationsModule = await import(`./${state}_locations.json`);
      console.log("Loaded", locationsModule.default);
      // normalize the locations
      let id = 0;
      const marriageLocations = (locationsModule.default as Locations).map(
        (location) => {
          return {
            id: id++,
            name: location.Location,
            position: {
              lat: parseFloat(location.Lat),
              lng: parseFloat(location.Lon),
            },
          } as MarriageLocation;
        },
      );
      console.log("Normalized Locations", marriageLocations);
      setLocations(marriageLocations);
    } catch (e) {
      console.log("Error in loading module", state, e);
      setErrorLoadingModule(e as Error);
    }
  }, [state]);

  React.useEffect(() => {
    importLocations();
  }, [importLocations]);

  const { isLoaded } = useJsApiLoader({
    id: "google-locations-script",
    googleMapsApiKey: GOOGLE_API_KEY as string,
  });

  const onLoad = React.useCallback(
    (loadedMap: google.maps.Map) => {
      // bounds based on locations
      console.log("Loaded", GOOGLE_API_KEY);
      if (locations && loadedMap) {
        // This does not work for some reason. Need to check why?
        /*
        const bounds = new google.maps.LatLngBounds();
      locations.forEach(({ position }) => bounds.extend(position));
      map.fitBounds(bounds, 1);
      map.panToBounds(bounds, 0);
      */
      }
      setMap(loadedMap);
    },
    [locations],
  );

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  const handleMarkerOnClick = React.useCallback(
    (id: number) => {
      console.log("Marker Clicked", id, acriveMarkerId);
      if (id === acriveMarkerId) {
        return;
      }
      setActiveMarkerId(id);
    },
    [acriveMarkerId],
  );

  return (
    <div>
      {errorLoadingModule && (
        <div>
          <span>Error in loading module for state {state}</span>
          <div>
            <small>{errorLoadingModule.message}</small>
          </div>
        </div>
      )}

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: "100vw-20", height: "75vh" }}
          center={center}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={() => {
            setActiveMarkerId(null);
          }}
          zoom={6}
        >
          {locations &&
            locations.map((location) => {
              const { id, name, position } = location;
              return (
                <Marker
                  position={position}
                  key={id}
                  title={name}
                  clickable={true}
                  onClick={() => {
                    handleMarkerOnClick(id);
                  }}
                >
                  {acriveMarkerId && acriveMarkerId === id ? (
                    <InfoWindow
                      key={id}
                      onCloseClick={() => {
                        setActiveMarkerId(null);
                      }}
                    >
                      <>
                        <div>{name}</div>
                        <div>
                          <Link
                            to={
                              `/location-information?state=${state}` +
                              `&name=${name}&lat=${position.lat}&lng=${position.lng}`
                            }
                          >
                            View detailed climate information
                          </Link>
                        </div>
                      </>
                    </InfoWindow>
                  ) : null}
                </Marker>
              );
            })}
        </GoogleMap>
      )}
    </div>
  );
};

export default MarriageLocations;
