import * as React from "react";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import ApplicationPage from "../common/ApplicationPage/ApplicationPage";
import "react-datepicker/dist/react-datepicker.css";
import Property from "../common/Properties/Property";
import DataTable from "./DataTable";

export const LocationInformation: React.FC = () => {
  const { search } = useLocation();
  const { state, name, position } = React.useMemo(() => {
    const params = new URLSearchParams(search);
    return {
      state: params.get("state"),
      name: params.get("name"),
      position: {
        lat: parseFloat(params.get("lat") as string),
        lng: parseFloat(params.get("lng") as string),
      },
    };
  }, [search]);

  const [startDate, setStartDate] = React.useState<Date | null>(
    new Date("2022-10-29 10:00:00"),
  );
  const [endDate, setEndDate] = React.useState<Date | null>(
    new Date(new Date("2022-10-29 10:00:00").getTime() + 24 * 60 * 60 * 1000),
  );
  const [selectedZone, setSelectedZone] = React.useState<string>("zone1");
  const [fwiChecked, setFWIChecked] = React.useState(false);
  const [tempChecked, setTempChecked] = React.useState(false);
  const [selectedTimeScale, setSelectedTimeScale] = React.useState("daily");

  React.useEffect(() => {
    console.log("Got Params", search, "\n", state, name, position);
  }, [search, state, name, position]);

  return (
    <ApplicationPage backTo="/">
      <h3>{name}</h3>
      <p>
        This place is located at Latitude: <strong>{position.lat}</strong> and
        longitude: <strong>{position.lng}</strong>
      </p>
      <div>
        <h4>Pick your date range</h4>

        <Property label="Start Date">
          <DatePicker
            selected={startDate}
            showTimeSelect={true}
            dateFormat={`MM/dd/yyyy h:mm aa`}
            minDate={new Date("2022-10-29 10:00:00")}
            maxDate={new Date("2023-07-01")}
            onChange={(date) => {
              console.log("Start Date", date);
              setStartDate(date);
            }}
          />
        </Property>

        <Property label="End Date">
          <DatePicker
            showTimeSelect={true}
            dateFormat={`MM/dd/yyyy h:mm aa`}
            selected={endDate}
            minDate={startDate}
            onChange={(date) => {
              setEndDate(date);
            }}
          />
        </Property>

        <Property
          label="Zone"
          hint={
            `Ideally we should calculate this from the position of the place. ` +
            `However, I do not know how to do this.`
          }
        >
          <select
            value={selectedZone}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setSelectedZone(e.target.value);
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((num) => {
              return (
                <option key={num} value={`zone${num}`}>
                  Zone {num}
                </option>
              );
            })}
          </select>
        </Property>

        <Property
          label="Type"
          hint="Choose the type of climate information you would like to see about the place"
        >
          <input
            type="checkbox"
            value="FWI"
            id="fwi"
            checked={fwiChecked}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFWIChecked(e.target.checked);
            }}
          />
          <label htmlFor="fwi">Fire Weather Index</label>

          <input
            type="checkbox"
            value="temp"
            id="temp"
            style={{ marginLeft: "20px" }}
            checked={tempChecked}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTempChecked(e.target.checked);
            }}
          />
          <label htmlFor="fwi">Temperature</label>
        </Property>

        <Property label="Time Scale">
          <select
            value={selectedTimeScale}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setSelectedTimeScale(e.target.value);
            }}
          >
            {["hourly", "daily"].map((scale) => {
              return (
                <option value={scale} key={scale}>
                  {scale.toUpperCase()}
                </option>
              );
            })}
          </select>
        </Property>

        <hr />

        {tempChecked && (
          <DataTable
            type="temp"
            label="Temprature Data"
            startDate={startDate}
            endDate={endDate}
            timeScale={selectedTimeScale}
            zone={selectedZone}
          />
        )}
        {fwiChecked && (
          <DataTable
            type="FWI"
            label="Fire Weather Index Data"
            startDate={startDate}
            endDate={endDate}
            timeScale={selectedTimeScale}
            zone={selectedZone}
          />
        )}
      </div>
    </ApplicationPage>
  );
};

export default LocationInformation;
