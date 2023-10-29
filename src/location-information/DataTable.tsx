import * as React from "react";
import moment from "moment";

export interface Props {
  label: string;
  startDate: Date | null;
  endDate: Date | null;
  timeScale: string;
  type: "temp" | "FWI";
  zone: string;
}

export const DataTable: React.FC<Props> = (props: Props) => {
  const { label, startDate, endDate, timeScale, type, zone = "zone6" } = props;
  const [data, setData] = React.useState<Record<string, any>>({});

  const queryData = React.useCallback(() => {
    /*
    https://6i7vehp3glxjkfaxo4vkwe25lu0cnrhs.lambda-url.us-west-1.on.aws/predict?zone=zone1&start_time=2022-10-29%2010%3A00%3A00&end_time=2022-12-01%2010%3A00%3A00&variable=temp&time_scale=daily
    */
    const format = "YYYY-MM-DD HH:mm:ss";
    const startTime = moment(startDate).format(format);
    const endTime = moment(endDate).format(format);

    const url = `https://6i7vehp3glxjkfaxo4vkwe25lu0cnrhs.lambda-url.us-west-1.on.aws/predict?zone=${zone}` +
      `&start_time=${startTime}` +
      `&end_time=${endTime}` +
      `&variable=${type}` +
      `&time_scale=${timeScale}`

    console.log("URL", encodeURI(url));
    fetch(url).then(response => {
      return response.json();
    }).then(data => {
      console.log("Fetched Data", data);
      setData(data);
    }).catch(e => {
      console.log("Bummer... ", e);
    })
  }, [startDate, endDate, zone, timeScale])

  React.useEffect(() => {
    queryData();
  }, [startDate, endDate, timeScale, zone])


  return <div>
    <h3>Climformatic's Amazing Data for {type}</h3>
    <pre>{data && JSON.stringify(data, null, 4)}</pre>
  </div>
};

export default DataTable;
