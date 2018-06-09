import React from "react";
import { Link } from "react-router-dom";
import * as peopleService from "../services/people.service";
import PeopleList from "../components/PeopleList";
import Ribbon from "../components/Ribbon";
// import Notifier from "../helpers/notifier";
import PageHeader from "../components/PageHeader";

class People extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      people: []
    };
  }
  //   // this.handleEditPerson = this.handleEditPerson.bind(this);
  //   this.onDelete = this.onDelete.bind(this);
  // }

  // handleEditPerson(people, e) {
  //   window.location.href = "/EditPerson?id=" + people._id;
  // }

  // onDelete(people, e) {
  //   peopleService
  //     .del(people._id)
  //     .then(response => {
  //       console.log("Person Deleted");
  //       this.setState(prevState => {
  //         const oldPeople = prevState.people;
  //         const newPeople = oldPeople.filter(item => item._id !== people._id);
  //         return { people: newPeople };
  //       });
  //       Notifier.success("Person Deleted");
  //       window.location.href = "/People";
  //     })
  //     .catch(() => {
  //       Notifier.error("Unable to Delete Person");
  //     });
  // }

  componentDidMount() {
    peopleService
      .getAll()
      .then(data => {
        this.setState({
          people: data.items
        });
        console.log("people loaded");
      })
      .catch(() => {
        console.log("Error Loading People");
      });
  }

  render() {
    return (
      <React.Fragment>
        <Ribbon breadcrumbArray={["People"]} />
        <PageHeader iconClasses="fa fa-lg fa-fw fa-user" title="People" />

        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="panel panel-info">
                <div className="panel-heading">
                  <i className="fa fa-pencil" />
                  View / Edit
                  <Link to="/AddPerson">
                    <button className="btn btn-primary btn-xs pull-right">
                      Add New
                    </button>
                  </Link>
                </div>
                <div className="panel-body">
                  <div
                    className="smart-form"
                    style={{ marginBottom: "10px" }}
                  />
                  <div>
                    <PeopleList
                      people={this.state.people}
                      // onDelete={this.onDelete}
                      // handleEditPerson={this.handleEditPerson}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default People;
