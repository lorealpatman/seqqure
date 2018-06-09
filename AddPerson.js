import React from "react";
import * as ajaxcalls from "../services/people.service";
import Ribbon from "../components/Ribbon";
// import PageHeader from "../components/PageHeader";
import FormPanel from "../components/FormPanel";
import {
  FormField,
  FormFieldConfig,
  validate as formFieldValidate
} from "../helpers/form.helper";
import Notifier from "../helpers/notifier";
import PageHeader from "../components/PageHeader";

class AddPerson extends React.Component {
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
      receiveSms: false
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
      number: { value: true, message: "Must enter numbers only" },
      maxLength: { value: 10, message: "Must not exceed 10 numbers" },
      required: { value: true }
    }),
    address: new FormFieldConfig("Address", {
      maxLength: { value: 100 }
    }),
    userId: new FormFieldConfig("Login Id"),
    receiveSms: new FormFieldConfig("Receive SMS")
  };

  constructor(props) {
    super(props);
    const formFields = this.convertPropsToFormFields();

    this.state = {
      formFields: formFields,
      formValid: this.validateForm(formFields)
    };

    this.onChange = this.onChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  // Returns true if every field is valid
  validateForm(formFields) {
    return Object.values(formFields).reduce((valid, formField) => {
      return valid && formField.valid;
    }, true);
  }

  // maps model values to full-up FormFields
  convertPropsToFormFields() {
    let person = AddPerson.defaultProps.formData;

    const formFields = {
      firstName: new FormField(person.firstName),
      lastName: new FormField(person.lastName),
      middleName: new FormField(person.middleName),
      prefixName: new FormField(person.prefixName),
      suffixName: new FormField(person.suffixName),
      publicEmail: new FormField(person.publicEmail),
      phoneNumber: new FormField(person.phoneNumber),
      address: new FormField(person.address),
      userId: new FormField(person.userId),
      receiveSms: new FormField(person.receiveSms)
    };

    // Loop through validation for each field
    for (let fieldName in formFields) {
      let field = formFields[fieldName];
      let config = AddPerson.formDataConfig[fieldName];
      formFieldValidate(field, config);
    }
    return formFields;
  }

  onChange(event) {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    const name = event.target.name;
    const config = AddPerson.formDataConfig[name];

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

  handleAdd(event) {
    event.preventDefault();
    if (!this.state.formValid) {
      // Mark all fields as touched to display validation errors for all fields
      const formFields = JSON.parse(JSON.stringify(this.state.formFields));
      for (let fieldIdentifier in formFields) {
        formFields[fieldIdentifier].touched = true;
      }
      this.setState({ formData: formFields });
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
      roles: []
    };

    ajaxcalls
      .post(newPerson)
      .then(data => {
        console.log(data, "Person Added");
        this.setState({ person: data.items });
        this.setState({
          firstName: "",
          lastName: "",
          middleName: "",
          prefixName: "",
          suffixName: "",
          publicEmail: "",
          phoneNumber: "",
          address: "",
          userId: "",
          receiveSms: this.state.receiveSms
        });
        Notifier.success("Person Added");
        window.location.href = "/People";
      })
      .catch(() => {
        console.log("error");
        Notifier.error("Unable to Add Person");
      });
  }

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
        <Ribbon breadcrumbArray={["People", "Add Person"]} />
        <PageHeader
          iconClasses="fa fa-lg fa-fw fa-user-plus"
          title=" Add New Person"
        />
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
                                        value={true}
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
                              <section className="col col-2">
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
                                    title="created after add"
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
                          className="btn btn-primary"
                          onClick={this.handleAdd}
                        >
                          {" "}
                          Add Person
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

export default AddPerson;
