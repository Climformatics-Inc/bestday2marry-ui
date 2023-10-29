import * as React from "react";
import { useLocation } from "react-router-dom";
import ApplicationPage from "../common/ApplicationPage/ApplicationPage";

export interface Props { }

export const LocationInformation: React.FC<Props> = (props: Props) => {
  const { search } = useLocation();
  const { state, name, position } = React.useMemo(() => {
    const params = new URLSearchParams(search);
    return {
      state: params.get("state"),
      name: params.get("name"),
      position: {
        lat: parseFloat(params.get("lat") as string),
        lng: parseFloat(params.get("lng") as string)
      }
    }
  }, [search])

  React.useEffect(() => {
    console.log("Got Params", search, "\n", state, name, position)
  }, [search, state, name, position]);


  return <ApplicationPage backTo="/">
    <h3>{name}</h3>
    <p>
      This place is located at Latitude: <strong>{position.lat}</strong> and longitude: <strong>{position.lng}</strong>
    </p>
  </ApplicationPage>;
};

export default LocationInformation;
