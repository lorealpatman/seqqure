import React from "react";
import { Link } from "react-router-dom";

const Home = ({ loggedIn }) => (
  <React.Fragment>
    <div className="wrap">
      <div className="homeBackground">
        <div>
          <div id="black" />

          <div className="animated fadeInLeftBig fast">
            <div className="container">
              <div className="col-md-12">
                <h1
                  style={{
                    paddingTop: "230px",
                    paddingLeft: "55px"
                  }}
                >
                  <img
                    src="favicon.ico"
                    className="logo"
                    alt="logo"
                    style={{
                      margin: "5px px 5px 5px"
                    }}
                  />{" "}
                  <span className="homeTitle">seQQure</span>
                  <br className="visible-lg " />
                </h1>
                <hr
                  style={{
                    width: "25%",
                    textAlign: "left",
                    margin: "30px 0",
                    border: "2.5px solid #fff",
                    paddingLeft: "80px"
                  }}
                />
              </div>
              <div className="col-md-8">
                <h2
                  className="subtitle"
                  style={{
                    paddingLeft: "55px"
                  }}
                >
                  <span className="homeh2"> Securing the Escrow Process!</span>
                </h2>
              </div>
            </div>

            {!loggedIn && (
              <Link
                to="/Login"
                role="button"
                className="loginButtonHome pull-right
              animated fadeInRightBig fast"
              >
                <span> Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
);
export default Home;
