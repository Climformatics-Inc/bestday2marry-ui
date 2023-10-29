import * as React from "react";
import { GOOGLE_API_KEY } from "../constants";

export interface Props {
  state: string;
}


export const MapLocation: React.FC<Props> = (props: Props) => {
  const { state } = props;

  const location = React.useMemo(() => {
    const size = "800x800"
    const url = `https://maps.googleapis.com/maps/api/staticmap?size=${size}&key=${GOOGLE_API_KEY}`;
    const center = "508 w moraga st, Mountain House CA 95391";

    return encodeURI(`${url}&center=${center}`)
  }, [state])


  return <div>Showing Map for {state}
    <p>{location}</p>
    <p>
      <img src={location} />
    </p>
  </div>;
};

export default MapLocation;
