import React from "react";
import Ribbon from "../components/Ribbon";
import PageHeader from "../components/PageHeader";
import MapComponent from "../components/MapComponent";
import FormPanel from "../components/FormPanel";

class Maps extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Ribbon breadcrumbArray={["Map"]} />
        <PageHeader iconClasses="fa fa-lg fa-fw fa-map" title="Map" />
        <FormPanel>
          <div>
            <div id="map" className="col-lg-12">
              <div
                className="mapComponent"
                style={{
                  height: "400px"
                }}
              >
                <MapComponent />
              </div>
            </div>
          </div>
        </FormPanel>
      </React.Fragment>
    );
  }
}
export default Maps;
