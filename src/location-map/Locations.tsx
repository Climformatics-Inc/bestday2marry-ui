import * as React from "react";
import ApplicationPage from "../common/ApplicationPage/ApplicationPage";
import states from "./us_states.json"
import MapLocation from "./MapLocation";

export interface Props { }

export const Locations: React.FC<Props> = (props: Props) => {
  const [selectedState, setSelectedState] = React.useState("CA");
  React.useEffect(() => {
    console.log("States", states);
  }, [])

  const onStateSelected = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const label = (states as any)[value];

    console.log("State Selected", value, label)
    setSelectedState(value);
  }, [states])

  const options = React.useMemo(() => {
    return Object.keys(states).map((state, index) => {
      const label = (states as Record<string, string>)[state];
      return <option value={state} key={index}>{label}</option>
    })
  }, [states])

  return <ApplicationPage>
    <p>Congratulations on taking the first step towards the most important day of your life!</p>
    <p>Let's start with selecting the place you are interested in..</p>
    <hr />
    <p>
      Select State: <select onChange={onStateSelected} value={selectedState}>{options}</select>
    </p>
    <MapLocation state={selectedState} />
  </ApplicationPage>
};

export default Locations;
