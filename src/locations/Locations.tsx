import React from "react";
import ApplicationPage from "../common/ApplicationPage/ApplicationPage";
import MarriageLocations from "./MarriageLocations";
import statesData from "./us_states.json";

export interface City {
  name: string;
  code: string;
}

export interface State {
  name: string;
  cities: City[];
}

export type States = Record<string, string>;

export const Locations: React.FC = () => {
  const states = React.useMemo(() => {
    return statesData as States;
  }, []);

  const [selectedState, setSelectedState] = React.useState("CA");

  const onStateSelected = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      const label = states[value];

      console.log("State Selected", value, label);
      setSelectedState(value);
    },
    [states],
  );

  const stateOptions = React.useMemo(() => {
    return Object.keys(states).map((state, index) => {
      const label = states[state];
      return (
        <option value={state} key={index}>
          {label}
        </option>
      );
    });
  }, [states]);

  return (
    <ApplicationPage>
      <p>
        Congratulations on taking the first step towards the most important day
        of your life!
      </p>
      <p>Let us start with selecting the place you are interested in..</p>
      <hr />
      <p>
        Select State:{" "}
        <select onChange={onStateSelected} value={selectedState}>
          {stateOptions}
        </select>
      </p>
      {selectedState && <MarriageLocations state={selectedState} />}
    </ApplicationPage>
  );
};

export default Locations;
