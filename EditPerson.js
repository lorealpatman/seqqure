import React from "react";
import * as ajaxcalls from "../services/people.service";
import {
  FormField,
  FormFieldConfig,
  validate as formFieldValidate
} from "../helpers/form.helper";
import deepmerge from "deepmerge";
import PropTypes from "prop-types";
import Notifier from "../helpers/notifier";
import FormPanel from "../components/FormPanel";

class EditPerson extends React.Component {
  static propTypes = {
    formData: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      middleName: PropTypes.string,
      prefixName: PropTypes.string,
      suffixName: PropTypes.string,
      publicEmail: PropTypes.string,
      phoneNumber: PropTypes.string,
      address: PropTypes.string,
      userId: PropTypes.string,
      receiveSms: PropTypes.bool,
      receiveEmail: PropTypes.bool
    }),
    onChange: PropTypes.func,
    onUpdate: PropTypes.func
  };

  static defaultProps = {
    formData: {
      firstName: "",
      lastName: "",
      middleName: "",
      prefixName: "",
      suffixName: "",
      publicEmail: "",
      phoneNumber: "",
      address: "",
      userId: "",
      receiveSms: false,
      receiveEmail: false
    }
  };

  static formDataConfig = {
    firstName: new FormFieldConfig("First Name", {
      required: { value: true, message: "First Name is required" },
      maxLength: { value: 50 }
    }),
    lastName: new FormFieldConfig("Last Name", {
      required: { value: true, message: "Last Name is required" },
      maxLength: { value: 50 }
    }),
    middleName: new FormFieldConfig("Middle Name", {
      maxLength: { value: 50 }
    }),
    suffixName: new FormFieldConfig("Suffix Name", {
      maxLength: { value: 5 }
    }),
    prefixName: new FormFieldConfig("prefix Name", {
      maxLength: { value: 5 }
    }),
    publicEmail: new FormFieldConfig("Public Email", {
      required: { value: true, message: "Email is required" },
      pattern: {
        value: /[\w\d]+@[\w\d]+\.\w+/,
        message: "Must be a valid email"
      }
    }),
    phoneNumber: new FormFieldConfig("Phone Number", {
      number: { value: true, message: "Must enter numbers only" }
    }),
    address: new FormFieldConfig("Address", {
      maxLength: { value: 100 }
    }),
    userId: new FormFieldConfig("Login Id"),
    receiveSms: new FormFieldConfig("Receive SMS"),
    receiveEmail: new FormFieldConfig("Receive Email")
  };

  constructor(props) {
    super(props);
    const activePersonId = this.props.match.params.userId;
    const formFields = this.convertFormFields();

    this.state = {
      formFields: formFields,
      formValid: this.validateForm(formFields),
      activePersonId: activePersonId,
      activePersonRoles: null
    };

    this.onChange = this.onChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }

  // Returns true if every field is valid
  validateForm(formFields) {
    return Object.values(formFields).reduce((valid, formField) => {
      return valid && formField.valid;
    }, true);
  }

  convertFormFields(propPerson) {
    let person = deepmerge(EditPerson.defaultProps.formData, propPerson || {});

    const formFields = {
      firstName: new FormField(person.firstName),
      lastName: new FormField(person.lastName),
      middleName: new FormField(person.middleName),
      prefixName: new FormField(person.prefixName),
      suffixName: new FormField(person.suffixName),
      publicEmail: new FormField(person.publicEmail),
      phoneNumber: new FormField(person.phoneNumber),
      address: new FormField(person.address),
      userId: new FormField(person.userId || ""),
      receiveSms: new FormField(person.receiveSms),
      receiveEmail: new FormField(person.receiveEmail)
    };

    // Loop through validation for each field
    for (let fieldName in formFields) {
      let field = formFields[fieldName];
      let config = EditPerson.formDataConfig[fieldName];
      formFieldValidate(field, config);
    }
    return formFields;
  }

  componentDidMount() {
    // if (this.state.activePersonId) {

    if (
      this.state.activePersonId &&
      (!this.props.location || !this.props.location.state)
    ) {
      ajaxcalls
        .getPersonById(this.state.activePersonId)
        .then(response => {
          this.setState({
            formFields: this.convertFormFields(response.item),
            activePersonRoles: response.item.roles,
            data: response.item
          });
        })
        .catch(() => {
          console.log("Error Getting Person By ID");
        });
    }
  }

  onChange(event) {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    const name = event.target.name;
    const config = EditPerson.formDataConfig[name];

    this.setState(prevState => {
      const field = { ...prevState.formFields[name] };
      field.value = value;
      field.touched = true;
      formFieldValidate(field, config);

      const formFields = { ...prevState.formFields, [name]: field };
      let formValid = this.validateForm(formFields);
      return { formFields: formFields, formValid: formValid };
    });
  }

  onUpdate(event) {
    event.preventDefault();
    if (!this.state.formValid) {
      const formFields = JSON.parse(JSON.stringify(this.state.formFields));

      for (let field in formFields) {
        formFields[field].touched = true;
      }
      this.setState({ formFields: formFields });
      return;
    }

    const newPerson = {
      firstName: this.state.formFields.firstName.value,
      lastName: this.state.formFields.lastName.value,
      middleName: this.state.formFields.middleName.value,
      prefixName: this.state.formFields.prefixName.value,
      suffixName: this.state.formFields.suffixName.value,
      publicEmail: this.state.formFields.publicEmail.value,
      phoneNumber: this.state.formFields.phoneNumber.value,
      address: this.state.formFields.address.value,
      userId: this.state.formFields.userId.value,
      receiveSms: this.state.formFields.receiveSms.value,
      receiveEmail: this.state.formFields.receiveEmail.value,
      _id: this.state.activePersonId,
      roles: this.state.activePersonRoles
    };
    console.log(newPerson);
    ajaxcalls
      .put(newPerson)
      .then(response => {
        console.log(response);
        Notifier.success("Person Updated");
        window.location.href = "/People";
      })
      .catch(error => {
        Notifier.error("Unable to Update Person");
        console.log("Unable to Update Person", error);
      });
  }

  // searchIDParams() {
  //   const searchParams = new URLSearchParams(window.location.search);
  //   const activePersonId = searchParams.get("id");
  //   return activePersonId;
  // }

  renderErrorMsgs(field) {
    return !field.valid && field.touched
      ? field.brokenRules.map(br => {
          return (
            <div key={br.rule} className="note note-error">
              {br.msg}
            </div>
          );
        })
      : null;
  }

  inputClassName(field) {
    return !field.valid && field.touched ? "input state-error" : "input";
  }

  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <FormPanel>
                <article>
                  <div>
                    <form id="smart-form-register" className="smart-form">
                      <fieldset>
                        <div className="row well">
                          <header>Personal:</header>
                          <fieldset>
                            <div className="row">
                              <section className="col col-2">
                                <label
                                  className={this.inputClassName(
                                    this.state.formFields.prefixName
                                  )}
                                >
                                  Prefix Name
                                  <input
                                    type="text"
                                    name="prefixName"
                                    onChange={this.onChange}
                                    value={
                                      this.state.formFields.prefixName.value
                                    }
                                  />
                                </label>
                                {this.renderErrorMsgs(
                                  this.state.formFields.prefixName
                                )}
                              </section>
                              <section className="col col-6">
                                <label
                                  className={this.inputClassName(
                                    this.state.formFields.firstName
                                  )}
                                >
                                  First Name
                                  <input
                                    type="text"
                                    name="firstName"
                                    onChange={this.onChange}
                                    value={
                                      this.state.formFields.firstName.value
                                    }
                                  />
                                </label>
                                {this.renderErrorMsgs(
                                  this.state.formFields.firstName
                                )}
                              </section>
                            </div>
                          </fieldset>
                          <fieldset>
                            <div className="row">
                              <section className="col col-6">
                                <label
                                  className={this.inputClassName(
                                    this.state.formFields.middleName
                                  )}
                                >
                                  Middle Name
                                  <input
                                    type="text"
                                    name="middleName"
                                    onChange={this.onChange}
                                    value={
                                      this.state.formFields.middleName.value
                                    }
                                  />
                                </label>
                                {this.renderErrorMsgs(
                                  this.state.formFields.middleName
                                )}
                              </section>
                              <section className="col col-6">
                                <label
                                  className={this.inputClassName(
                                    this.state.formFields.lastName
                                  )}
                                >
                                  Last Name
                                  <input
                                    type="text"
                                    name="lastName"
                                    size="2"
                                    onChange={this.onChange}
                                    value={this.state.formFields.lastName.value}
                                  />
                                </label>
                                {this.renderErrorMsgs(
                                  this.state.formFields.lastName
                                )}
                              </section>
                            </div>
                          </fieldset>
                          <section className="col col-2">
                            <label
                              className={this.inputClassName(
                                this.state.formFields.suffixName
                              )}
                            >
                              Suffix Name
                              <input
                                type="text"
                                name="suffixName"
                                onChange={this.onChange}
                                value={this.state.formFields.suffixName.value}
                              />
                            </label>
                            {this.renderErrorMsgs(
                              this.state.formFields.suffixName
                            )}
                          </section>
                        </div>
                      </fieldset>

                      <fieldset>
                        <div className="row well">
                          <header>Contact Information:</header>
                          <fieldset>
                            <div className="row">
                              <section className="col col-6">
                                <label
                                  className={this.inputClassName(
                                    this.state.formFields.publicEmail
                                  )}
                                >
                                  Public Email
                                  <input
                                    type="text"
                                    name="publicEmail"
                                    onChange={this.onChange}
                                    value={
                                      this.state.formFields.publicEmail.value
                                    }
                                  />
                                </label>
                                {this.renderErrorMsgs(
                                  this.state.formFields.publicEmail
                                )}
                                <div className="checkbox">
                                  <section>
                                    <label className="checkbox">
                                      <input
                                        type="checkbox"
                                        name="receiveEmail"
                                        value={
                                          this.state.formFields.receiveEmail
                                            .value
                                        }
                                        checked={
                                          this.state.formFields.receiveEmail
                                            .value
                                        }
                                        onChange={this.onChange}
                                      />
                                      <i />Receive Email Notifications
                                    </label>
                                  </section>
                                </div>
                              </section>
                              <section className="col col-6">
                                <label
                                  className={this.inputClassName(
                                    this.state.formFields.phoneNumber
                                  )}
                                >
                                  Phone Number
                                  <input
                                    type="text"
                                    name="phoneNumber"
                                    onChange={this.onChange}
                                    value={
                                      this.state.formFields.phoneNumber.value
                                    }
                                  />
                                </label>
                                {this.renderErrorMsgs(
                                  this.state.formFields.phoneNumber
                                )}
                                <div className="checkbox">
                                  <section>
                                    <label className="checkbox">
                                      <input
                                        type="checkbox"
                                        name="receiveSms"
                                        value={
                                          this.state.formFields.receiveSms.value
                                        }
                                        checked={
                                          this.state.formFields.receiveSms.value
                                        }
                                        onChange={this.onChange}
                                      />
                                      <i />Receive SMS Notifications
                                    </label>
                                  </section>
                                </div>
                              </section>
                            </div>
                          </fieldset>
                          <fieldset>
                            <div className="row">
                              <section className="col col-6">
                                <label
                                  className={this.inputClassName(
                                    this.state.formFields.address
                                  )}
                                >
                                  Address
                                  <input
                                    type="text"
                                    name="address"
                                    onChange={this.onChange}
                                    value={this.state.formFields.address.value}
                                  />
                                </label>
                                {this.renderErrorMsgs(
                                  this.state.formFields.address
                                )}
                              </section>
                            </div>
                          </fieldset>
                          <fieldset>
                            <div className="row">
                              <section className="col col-6">
                                <label
                                  className={this.inputClassName(
                                    this.state.formFields.userId
                                  )}
                                >
                                  Login ID
                                  <input
                                    type="text"
                                    name="userId"
                                    value={this.state.formFields.userId.value}
                                    onChange={this.onChange}
                                    readOnly
                                  />
                                </label>
                                {this.renderErrorMsgs(
                                  this.state.formFields.userId
                                )}
                              </section>
                            </div>
                          </fieldset>
                        </div>
                      </fieldset>
                      <footer>
                        <button
                          className="btn btn-warning"
                          onClick={this.onUpdate}
                        >
                          {" "}
                          Update {this.state.formFields.firstName.value}{" "}
                          {this.state.formFields.lastName.value}
                        </button>
                      </footer>
                    </form>
                  </div>
                </article>
              </FormPanel>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default EditPerson;
