import React from "react";
import * as peopleService from "../services/people.service";

class PeopleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      people: this.props.people,
      userName: ""
    };

    // this.onDelete = this.onDelete.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  // componentDidMount() {
  //   peopleService
  //     .getAll()
  //     .then(data => {
  //       console.log(data);
  //       this.setState({
  //         people: data.items.map(person => {
  //           return person;
  //         })
  //       });
  //       console.log("People Displayed", data);
  //     })

  //     .catch(() => {
  //       console.log("Error Loading People");
  //     });
  // }

  componentWillReceiveProps(nextProps) {
    this.setState({ people: nextProps.people });
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value }, () =>
      peopleService
        .search(this.state.userName.trim())
        .then(data => {
          console.log(data);
          this.setState({
            people: data.items.map(person => {
              return person;
            })
          });
        })
        .catch(err => {})
    );
  }
  render() {
    return (
      <React.Fragment>
        <section
          style={{ display: "inline", marginLeft: "1%" }}
          className="col col-3"
        >
          <label className="input">
            {" "}
            <strong> Search People</strong>{" "}
            <input
              type="text"
              name="userName"
              placeholder="By Last Name"
              value={this.state.userName}
              onChange={this.onChange}
            />
          </label>
        </section>

        <div>
          {this.state.people.map(person => {
            return (
              <div
                className="flex-container col-lg-4 tab-content bg-color-white padding-2 smart-form"
                key={person._id}
                style={{ textAlign: "center" }}
              >
                <div
                  className="flex-item card panel panel-default"
                  style={{
                    padding: "10px 10px 10px 10px",
                    marginBottom: "15px"
                  }}
                >
                  <h5>
                    <img
                      className="picture pull-center"
                      src={`${person.fileKey ||
                        "http://www.udayanschoolgor.edu.bd/uploads/avatar_icon.jpg"}`}
                      alt=""
                      height="65px"
                      style={{
                        borderRadius: "50%",
                        margin: "5px 5px 5px 0px"
                      }}
                      width="65px"
                    />
                    <a
                      href={`/people/${person._id}/dashboard/editPerson`}
                      title={`Edit ${person.firstName} ${person.lastName} `}
                    >{`${person.prefixName || ""} ${
                      person.firstName
                    } ${person.middleName || ""} ${
                      person.lastName
                    } ${person.suffixName || ""}`}</a>
                  </h5>
                  <br />
                  <div>
                    <div className="publicEmail">
                      <i
                        className="fa-fw fa fa-envelope fa-sm"
                        style={{ color: "gray" }}
                      />{" "}
                      {person.publicEmail}
                    </div>
                    <div
                      className="phoneNumber"
                      style={{
                        color: "green",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {person.phoneNumber ? (
                        <React.Fragment>
                          <i className="fa-fw fa fa-phone fa-sm" />{" "}
                          {person.phoneNumber}
                        </React.Fragment>
                      ) : null}
                    </div>
                    {/* <p className="address">{`Address: ${person.address || ""}`}</p>
                <p className="loginId">{`Login ID: ${person.loginId || ""}`}</p> */}
                    <div>
                      <input
                        type="checkbox"
                        name="receiveSms"
                        checked={person.receiveSms}
                        value={true}
                        readOnly
                      />{" "}
                      SMS Notifications
                    </div>
                    {/* <div style={{ margin: "24px 0" }}>
                  <a
                    href={`/people/${person._id}/dashboard/editPerson`}
                    title="Edit"
                  >
                    <i
                      className="fa-fw fa fa-pencil fa-sm pull-left"
                      style={{ color: "orange" }}
                    />
                  </a>
                  <a href="/" title="Delete">
                    <i
                      className="fa-fw fa fa-times fa-sm"
                      style={{ color: "maroon" }}
                      onClick={e => props.onDelete(person, e)}
                    />
                  </a>
                  <Link
                    role="button"
                    to={{
                      pathname: "/invite",
                      search: `?person=${person._id}`,
                      state: { person }
                    }}
                    disabled={
                      !person.firstName ||
                      !person.lastName ||
                      !person.publicEmail
                    }
                    title="Invite"
                  >
                    <i
                      className="fa-fw fa fa-send fa-sm"
                      style={{ color: "teal" }}
                    />
                  </Link>
                </div> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}

export default PeopleList;
