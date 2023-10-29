import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';
import Locations from './locations/Locations';
import LocationInformation from './location-information/LocationInformation';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/location-information" exact={true}><LocationInformation /></Route>
        <Route path="/">
          <Locations />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
