import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Card, Form, Button, Alert, ProgressBar, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import axios from "axios";
import "./EmployeeAdd.css";
import {
  validatePersonalInfo,
  validateGovernmentIds,
  validateContactDetails,
  validateBankInfo,
  validateQualificationDetails,
  validateOfficialStatus,
  validateAllSteps
} from "../../utils/employeeValidation";

// Memoized Form Components
const FormStep = React.memo(({ title, children }) => (
  <div className="form-step">
    <Card className="form-card">
      <Card.Header className="form-card-header">
        <h4 className="mb-0">{title}</h4>
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  </div>
));

const FormGroup = React.memo(({ label, children, required = false, error }) => (
  <Form.Group className="form-group-custom">
    <Form.Label className={required ? "required" : ""}>
      {label}
    </Form.Label>
    {children}
    {error && (
      <div className="text-danger mt-2" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
        {error}
      </div>
    )}
  </Form.Group>
));

export default class EmployeeAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ui: {
        redirectToList: false,
        currentStep: 1,
        totalSteps: 6,
        isLoading: false,
        loadingMessage: "",
        showSuccessAlert: false,
        showErrorAlert: false,
        alertMessage: ""
      },
      formData: {
        personalInfo: {
          firstName: "",
          lastName: "",
          dateOfBirth: null,
          age: "",
          gender: "",
          maritalStatus: "",
          fatherName: ""
        },
        governmentIds: {
          aadharNumber: "",
          panNumber: "",
          passportNumber: "",
          drivingLicense: "",
          aadharCard: null,
          panCard: null,
          passport: null,
          drivingLicenseDoc: null
        },
        contactDetails: {
          address: "",
          country: "",
          city: "",
          mobile: "",
          phone: "",
          email: ""
        },
        bankInfo: {
          bankName: "",
          accountName: "",
          accountNumber: "",
          ifscCode: ""
        },
        qualificationDetails: {
          highestQualification: "",
          university: "",
          graduationYear: "",
          fieldOfStudy: "",
          gpa: "",
          certifications: [],
          educationalCertificates: []
        },
        officialStatus: {
          employeeId: "",
          username: "",
          password: "",
          role: "",
          department: "",
          departmentId: null,
          college: "",
          jobTitle: "",
          joiningDate: null,
          startDate: null,
          endDate: null,
          salary: "",
          employmentType: "",
          experienceCertificates: []
        }
      },
      systemData: {
        departments: [],
        colleges: []
      },
      validation: {
        errors: {},
        isValid: false
      }
    };
  }

  componentDidMount() {
    this.fetchDepartments();
    this.fetchColleges();
  }

  fetchDepartments = async () => {
    try {
      const response = await axios.get("/api/departments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      this.setState({ 
        systemData: { 
          ...this.state.systemData, 
          departments: response.data 
        } 
      });
    } catch (err) {
      this.handleApiError("Error fetching departments:", err);
    }
  };

  fetchColleges = async () => {
    try {
      const response = await axios.get("/api/colleges", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      this.setState({ 
        systemData: { 
          ...this.state.systemData, 
          colleges: response.data 
        } 
      });
    } catch (err) {
      this.handleApiError("Error fetching colleges:", err);
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    const [section, field] = name.split('.');
    
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [section]: {
          ...prevState.formData[section],
          [field]: value
        }
      }
    }));
  };

  handleFileChange = (event) => {
    const { name, files } = event.target;
    const [section, field] = name.split('.');
    
    if (files[0] && files[0].size > 5 * 1024 * 1024) {
      this.setState(prev => ({
        validation: {
          ...prev.validation,
          errors: {
            ...prev.validation.errors,
            [section]: {
              ...prev.validation.errors[section],
              [field]: "File size must be less than 5MB"
            }
          }
        }
      }));
      return;
    }
    
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [section]: {
          ...prevState.formData[section],
          [field]: files[0]
        }
      }
    }));
  };

  getFileName = (file) => {
    if (!file) return null;
    if (file instanceof File) return file.name;
    if (typeof file === 'string') return file.split('/').pop();
    return null;
  };

 handleFileRemove = (section, field) => {
  this.setState(prevState => {
    // Check if the field is an array (multiple files)
    if (Array.isArray(prevState.formData[section][field])) {
      return {
        formData: {
          ...prevState.formData,
          [section]: {
            ...prevState.formData[section],
            [field]: []
          }
        }
      };
    }
    
    // Handle single file fields
    return {
      formData: {
        ...prevState.formData,
        [section]: {
          ...prevState.formData[section],
          [field]: null
        }
      }
    };
  });
};

  handleMultipleFiles = (event) => {
    const { name, files } = event.target;
    const [section, field] = name.split('.');
    
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [section]: {
          ...prevState.formData[section],
          [field]: Array.from(files)
        }
      }
    }));
  };

  handleDateChange = (date, fieldPath) => {
    const [section, field] = fieldPath.split('.');
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [section]: {
          ...prevState.formData[section],
          [field]: date
        }
      }
    }));
  };

  handleCertificationChange = (index, field, value) => {
    this.setState(prevState => {
      const certifications = [...prevState.formData.qualificationDetails.certifications];
      certifications[index] = { ...certifications[index], [field]: value };
      
      return {
        formData: {
          ...prevState.formData,
          qualificationDetails: {
            ...prevState.formData.qualificationDetails,
            certifications
          }
        }
      };
    });
  };

  addCertification = () => {
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        qualificationDetails: {
          ...prevState.formData.qualificationDetails,
          certifications: [
            ...prevState.formData.qualificationDetails.certifications,
            { 
              name: "", 
              issuingOrganization: "", 
              issueDate: null, 
              expiryDate: null, 
              credentialId: "" 
            }
          ]
        }
      }
    }));
  };

  removeCertification = (index) => {
    this.setState(prevState => {
      const certifications = [...prevState.formData.qualificationDetails.certifications];
      certifications.splice(index, 1);
      
      return {
        formData: {
          ...prevState.formData,
          qualificationDetails: {
            ...prevState.formData.qualificationDetails,
            certifications
          }
        }
      };
    });
  };

  validateStep = (step) => {
    let errors = {};
    const { formData } = this.state;
    
    console.log('Validating step:', step);
    console.log('Current form data:', formData);
    
    switch(step) {
      case 1:
        errors.personalInfo = validatePersonalInfo(formData.personalInfo);
        console.log('Personal info validation errors:', errors.personalInfo);
        break;
      case 2:
        errors.governmentIds = validateGovernmentIds(formData.governmentIds);
        console.log('Government IDs validation errors:', errors.governmentIds);
        break;
      case 3:
        errors.contactDetails = validateContactDetails(formData.contactDetails);
        console.log('Contact details validation errors:', errors.contactDetails);
        break;
      case 4:
        errors.bankInfo = validateBankInfo(formData.bankInfo);
        console.log('Bank info validation errors:', errors.bankInfo);
        break;
      case 5:
        errors.qualificationDetails = validateQualificationDetails(formData.qualificationDetails);
        console.log('Qualification details validation errors:', errors.qualificationDetails);
        break;
      case 6:
        errors.officialStatus = validateOfficialStatus(formData.officialStatus);
        console.log('Official status validation errors:', errors.officialStatus);
        break;
    }

    // Helper function to check if an object has any non-null errors
    const hasNonNullErrors = (obj) => {
      if (!obj) return false;
      if (Array.isArray(obj)) {
        return obj.some(item => hasNonNullErrors(item));
      }
      if (typeof obj === 'object') {
        return Object.values(obj).some(value => {
          if (value === null) return false;
          if (typeof value === 'object') return hasNonNullErrors(value);
          return true;
        });
      }
      return obj !== null;
    };

    const hasErrors = hasNonNullErrors(errors);
    console.log('Step validation result:', !hasErrors);

    // Update validation state
    this.setState(prev => ({
      validation: {
        ...prev.validation,
        errors: {
          ...prev.validation.errors,
          ...errors
        },
        isValid: !hasErrors
      }
    }));
    
    return !hasErrors;
  };

  validateAllSteps = () => {
    const errors = {
      personalInfo: validatePersonalInfo(this.state.formData.personalInfo),
      governmentIds: validateGovernmentIds(this.state.formData.governmentIds),
      contactDetails: validateContactDetails(this.state.formData.contactDetails),
      bankInfo: validateBankInfo(this.state.formData.bankInfo),
      qualificationDetails: validateQualificationDetails(this.state.formData.qualificationDetails),
      officialStatus: validateOfficialStatus(this.state.formData.officialStatus)
    };

    // Helper function to check if an object has any non-null errors
    const hasNonNullErrors = (obj) => {
      if (!obj) return false;
      if (Array.isArray(obj)) {
        return obj.some(item => hasNonNullErrors(item));
      }
      if (typeof obj === 'object') {
        return Object.values(obj).some(value => {
          if (value === null) return false;
          if (typeof value === 'object') return hasNonNullErrors(value);
          return true;
        });
      }
      return obj !== null;
    };

    const hasErrors = hasNonNullErrors(errors);
    const isValid = !hasErrors;

    // Update validation state
    this.setState({
      validation: {
        errors,
        isValid
      }
    });

    return { isValid, errors };
  };

  // Add this new method to check the current step
  checkCurrentStep = () => {
    const { currentStep } = this.state.ui;
    this.validateStep(currentStep);
  };

  nextStep = () => {
    const { currentStep, totalSteps } = this.state.ui;
    console.log('Next step clicked. Current step:', currentStep, 'Total steps:', totalSteps);
    
    if (currentStep < totalSteps) {
      console.log('Attempting to validate step:', currentStep);
      const isValid = this.validateStep(currentStep);
      console.log('Step validation result:', isValid);
      
      if (isValid) {
        console.log('Moving to next step');
        this.setState(prev => ({
          ui: {
            ...prev.ui,
            currentStep: prev.ui.currentStep + 1
          }
        }));
      } else {
        console.log('Validation failed, staying on current step');
      }
    } else {
      console.log('Already at last step');
    }
  };

  prevStep = () => {
    const { currentStep } = this.state.ui;
    if (currentStep > 1) {
      this.setState(prev => ({
        ui: {
          ...prev.ui,
          currentStep: prev.ui.currentStep - 1
        }
      }));
    }
  };

  renderStepIndicator = () => {
    const progress = (this.state.ui.currentStep / this.state.ui.totalSteps) * 100;
    const steps = [
      { number: 1, title: "Personal Info", icon: "👤" },
      { number: 2, title: "Government IDs", icon: "🪪" },
      { number: 3, title: "Contact Details", icon: "📞" },
      { number: 4, title: "Bank Info", icon: "🏦" },
      { number: 5, title: "Qualifications", icon: "🎓" },
      { number: 6, title: "Official Status", icon: "💼" }
    ];

    return (
      <div className="step-indicator mb-5">
        <ProgressBar now={progress} className="mb-3" />
        <div className="steps-container">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`step ${this.state.ui.currentStep >= step.number ? "active" : ""}`}
            >
              <div className="step-icon">{step.icon}</div>
              <div className="step-number">{step.number}</div>
              <div className="step-title">{step.title}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  renderFormGroup = (label, children, section, field, required = false) => {
    const error = this.state.validation.errors[section]?.[field];
    return (
      <FormGroup
        label={label}
        children={children}
        required={required}
        error={error}
      />
    );
  };

  renderPersonalInfo = () => {
    const { personalInfo } = this.state.formData;
    return (
      <FormStep title="Personal Details">
        <div className="row">
          <div className="col-md-6">
            {this.renderFormGroup(
              "First Name",
              <Form.Control
                type="text"
                placeholder="Enter first name"
                name="personalInfo.firstName"
                value={personalInfo.firstName}
                onChange={this.handleChange}
                required
              />,
              "personalInfo",
              "firstName",
              true
            )}
          </div>
          <div className="col-md-6">
            {this.renderFormGroup(
              "Last Name",
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="personalInfo.lastName"
                value={personalInfo.lastName}
                onChange={this.handleChange}
                required
              />,
              "personalInfo",
              "lastName",
              true
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            {this.renderFormGroup(
              "Date of Birth",
              <DatePicker
                selected={personalInfo.dateOfBirth}
                onChange={(date) => this.handleDateChange(date, "personalInfo.dateOfBirth")}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="yyyy-MM-dd"
                className="form-control"
                placeholderText="Select Date Of Birth"
                required
              />,
              "personalInfo",
              "dateOfBirth",
              true
            )}
          </div>
          <div className="col-md-6">
            {this.renderFormGroup(
              "Age",
              <Form.Control
                type="number"
                placeholder="Enter age"
                name="personalInfo.age"
                value={personalInfo.age}
                onChange={this.handleChange}
                min="18"
                max="100"
                required
              />,
              "personalInfo",
              "age",
              true
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            {this.renderFormGroup(
              "Gender",
              <Form.Control
                as="select"
                value={personalInfo.gender}
                onChange={this.handleChange}
                name="personalInfo.gender"
                required
              >
                <option value="">Choose...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Control>,
              "personalInfo",
              "gender",
              true
            )}
          </div>
          <div className="col-md-6">
            {this.renderFormGroup(
              "Marital Status",
              <Form.Control
                as="select"
                value={personalInfo.maritalStatus}
                onChange={this.handleChange}
                name="personalInfo.maritalStatus"
                required
              >
                <option value="">Choose...</option>
                <option value="married">Married</option>
                <option value="single">Single</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </Form.Control>,
              "personalInfo",
              "maritalStatus",
              true
            )}
          </div>
        </div>

        {this.renderFormGroup(
          "Father's Name",
          <Form.Control
            type="text"
            placeholder="Enter father's name"
            name="personalInfo.fatherName"
            value={personalInfo.fatherName}
            onChange={this.handleChange}
            required
          />,
          "personalInfo",
          "fatherName",
          true
        )}
      </FormStep>
    );
  };

  renderGovernmentIds = () => {
    const { governmentIds } = this.state.formData;
    return (
      <FormStep title="Government IDs">
        {this.renderFormGroup(
          "Aadhar Number",
          <Form.Control
            type="text"
            placeholder="Enter Aadhar number (12 digits)"
            name="governmentIds.aadharNumber"
            value={governmentIds.aadharNumber}
            onChange={this.handleChange}
            pattern="[0-9]{12}"
            maxLength="12"
            required
          />,
          "governmentIds",
          "aadharNumber",
          true
        )}

        {this.renderFormGroup(
          "Aadhar Card",
          <div>
            <Form.Control
              type="file"
              name="governmentIds.aadharCard"
              onChange={this.handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              required
              key={governmentIds.aadharCard ? 'file-selected' : 'file-empty'}
            />
            {governmentIds.aadharCard && (
              <div className="file-selected mt-2">
                <i className="fas fa-check-circle text-success mr-2"></i>
                Selected: {this.getFileName(governmentIds.aadharCard)}
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-danger ml-2"
                  onClick={() => this.handleFileRemove('governmentIds', 'aadharCard')}
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            )}
          </div>,
          "governmentIds",
          "aadharCard",
          true
        )}

        {this.renderFormGroup(
          "PAN Number",
          <Form.Control
            type="text"
            placeholder="Enter PAN number"
            name="governmentIds.panNumber"
            value={governmentIds.panNumber}
            onChange={this.handleChange}
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            maxLength="10"
          />,
          "governmentIds",
          "panNumber"
        )}

        {this.renderFormGroup(
          "Passport Number",
          <Form.Control
            type="text"
            placeholder="Enter passport number"
            name="governmentIds.passportNumber"
            value={governmentIds.passportNumber}
            onChange={this.handleChange}
          />,
          "governmentIds",
          "passportNumber"
        )}

        {this.renderFormGroup(
          "Driving License",
          <Form.Control
            type="text"
            placeholder="Enter driving license number"
            name="governmentIds.drivingLicense"
            value={governmentIds.drivingLicense}
            onChange={this.handleChange}
          />,
          "governmentIds",
          "drivingLicense"
        )}

        <div className="row">
          <div className="col-md-6">
            {this.renderFormGroup(
              "PAN Card",
              <div>
                <Form.Control
                  type="file"
                  name="governmentIds.panCard"
                  onChange={this.handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  key={governmentIds.panCard ? 'file-selected' : 'file-empty'}
                />
                {governmentIds.panCard && (
                  <div className="file-selected mt-2">
                    <i className="fas fa-check-circle text-success mr-2"></i>
                    Selected: {this.getFileName(governmentIds.panCard)}
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-danger ml-2"
                      onClick={() => this.handleFileRemove('governmentIds', 'panCard')}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  </div>
                )}
              </div>,
              "governmentIds",
              "panCard"
            )}
          </div>
          
          <div className="col-md-6">
            {this.renderFormGroup(
  "Passport",
  <div>
    <Form.Control
      type="file"
      name="governmentIds.passport"
      onChange={this.handleFileChange}
      accept=".pdf,.jpg,.jpeg,.png"
      key={governmentIds.passport ? 'file-selected' : 'file-empty'}
    />
    {governmentIds.passport && (
      <div className="file-selected mt-2">
        <i className="fas fa-check-circle text-success mr-2"></i>
        Selected: {this.getFileName(governmentIds.passport)}
        <Button 
          variant="link" 
          size="sm" 
          className="text-danger ml-2"
          onClick={() => this.handleFileRemove('governmentIds', 'passport')}
        >
          <i className="fas fa-times"></i>
        </Button>
      </div>
    )}
  </div>,
  "governmentIds",
  "passport"
)}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            {this.renderFormGroup(
  "Driving License Document",
  <div>
    <Form.Control
      type="file"
      name="governmentIds.drivingLicenseDoc"
      onChange={this.handleFileChange}
      accept=".pdf,.jpg,.jpeg,.png"
      key={governmentIds.drivingLicenseDoc ? 'file-selected' : 'file-empty'}
    />
    {governmentIds.drivingLicenseDoc && (
      <div className="file-selected mt-2">
        <i className="fas fa-check-circle text-success mr-2"></i>
        Selected: {this.getFileName(governmentIds.drivingLicenseDoc)}
        <Button 
          variant="link" 
          size="sm" 
          className="text-danger ml-2"
          onClick={() => this.handleFileRemove('governmentIds', 'drivingLicenseDoc')}
        >
          <i className="fas fa-times"></i>
        </Button>
      </div>
    )}
  </div>,
  "governmentIds",
  "drivingLicenseDoc"
)}
          </div>
        </div>
      </FormStep>
    );
  };

  renderContactDetails = () => {
    const { contactDetails } = this.state.formData;
    return (
      <FormStep title="Contact Details">
        {this.renderFormGroup(
          "Address",
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter complete address"
            name="contactDetails.address"
            value={contactDetails.address}
            onChange={this.handleChange}
            required
          />,
          "contactDetails",
          "address",
          true
        )}

        <div className="row">
          <div className="col-md-6">
            {this.renderFormGroup(
              "Country",
              <Form.Control
                type="text"
                placeholder="Enter country"
                name="contactDetails.country"
                value={contactDetails.country}
                onChange={this.handleChange}
                required
              />,
              "contactDetails",
              "country",
              true
            )}
          </div>
          <div className="col-md-6">
            {this.renderFormGroup(
              "City",
              <Form.Control
                type="text"
                placeholder="Enter city"
                name="contactDetails.city"
                value={contactDetails.city}
                onChange={this.handleChange}
                required
              />,
              "contactDetails",
              "city",
              true
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            {this.renderFormGroup(
              "Mobile",
              <Form.Control
                type="tel"
                placeholder="Enter mobile number"
                name="contactDetails.mobile"
                value={contactDetails.mobile}
                onChange={this.handleChange}
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />,
              "contactDetails",
              "mobile",
              true
            )}
          </div>
          <div className="col-md-6">
            {this.renderFormGroup(
              "Phone",
              <Form.Control
                type="tel"
                placeholder="Enter phone number"
                name="contactDetails.phone"
                value={contactDetails.phone}
                onChange={this.handleChange}
              />,
              "contactDetails",
              "phone"
            )}
          </div>
        </div>

        {this.renderFormGroup(
          "Email",
          <Form.Control
            type="email"
            placeholder="Enter email address"
            name="contactDetails.email"
            value={contactDetails.email}
            onChange={this.handleChange}
            required
          />,
          "contactDetails",
          "email",
          true
        )}
      </FormStep>
    );
  };

  renderBankInfo = () => {
    const { bankInfo } = this.state.formData;
    return (
      <FormStep title="Bank Information">
        {this.renderFormGroup(
          "Bank Name",
          <Form.Control
            type="text"
            placeholder="Enter bank name"
            name="bankInfo.bankName"
            value={bankInfo.bankName}
            onChange={this.handleChange}
            required
          />,
          "bankInfo",
          "bankName",
          true
        )}

        {this.renderFormGroup(
          "Account Name",
          <Form.Control
            type="text"
            placeholder="Enter account holder name"
            name="bankInfo.accountName"
            value={bankInfo.accountName}
            onChange={this.handleChange}
            required
          />,
          "bankInfo",
          "accountName",
          true
        )}

        {this.renderFormGroup(
          "Account Number",
          <Form.Control
            type="text"
            placeholder="Enter account number"
            name="bankInfo.accountNumber"
            value={bankInfo.accountNumber}
            onChange={this.handleChange}
            pattern="[0-9]{9,18}"
            required
          />,
          "bankInfo",
          "accountNumber",
          true
        )}

        {this.renderFormGroup(
          "IFSC Code",
          <Form.Control
            type="text"
            placeholder="Enter IFSC code"
            name="bankInfo.ifscCode"
            value={bankInfo.ifscCode}
            onChange={this.handleChange}
            pattern="[A-Z]{4}0[A-Z0-9]{6}"
            maxLength="11"
            required
          />,
          "bankInfo",
          "ifscCode",
          true
        )}
      </FormStep>
    );
  };

  renderQualificationDetails = () => {
    const { qualificationDetails } = this.state.formData;
    return (
      <FormStep title="Qualification Details">
        <div className="row">
          <div className="col-md-6">
            {this.renderFormGroup(
              "Highest Qualification",
              <Form.Control
                as="select"
                value={qualificationDetails.highestQualification}
                onChange={this.handleChange}
                name="qualificationDetails.highestQualification"
                required
              >
                <option value="">Choose...</option>
                <option value="PhD">PhD</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Diploma">Diploma</option>
                <option value="High School">High School</option>
              </Form.Control>,
              "qualificationDetails",
              "highestQualification",
              true
            )}
          </div>
          <div className="col-md-6">
            {this.renderFormGroup(
              "University",
              <Form.Control
                type="text"
                placeholder="Enter university name"
                name="qualificationDetails.university"
                value={qualificationDetails.university}
                onChange={this.handleChange}
                required
              />,
              "qualificationDetails",
              "university",
              true
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            {this.renderFormGroup(
              "Graduation Year",
              <Form.Control
                type="number"
                placeholder="Enter graduation year"
                name="qualificationDetails.graduationYear"
                value={qualificationDetails.graduationYear}
                onChange={this.handleChange}
                min="1950"
                max={new Date().getFullYear()}
                required
              />,
              "qualificationDetails",
              "graduationYear",
              true
            )}
          </div>
          <div className="col-md-6">
            {this.renderFormGroup(
              "Field of Study",
              <Form.Control
                type="text"
                placeholder="Enter field of study"
                name="qualificationDetails.fieldOfStudy"
                value={qualificationDetails.fieldOfStudy}
                onChange={this.handleChange}
                required
              />,
              "qualificationDetails",
              "fieldOfStudy",
              true
            )}
          </div>
        </div>

        {this.renderFormGroup(
          "GPA",
          <Form.Control
            type="text"
            placeholder="Enter GPA (0-4)"
            name="qualificationDetails.gpa"
            value={qualificationDetails.gpa}
            onChange={this.handleChange}
            pattern="[0-4](\.[0-9]{1,2})?"
          />,
          "qualificationDetails",
          "gpa"
        )}

        <div className="certifications-section">
          <h5 className="mb-3">Certifications</h5>
          {qualificationDetails.certifications.map((cert, index) => (
            <div key={index} className="certification-item mb-3 p-3 border rounded">
              <div className="row">
                <div className="col-md-6">
                  {this.renderFormGroup(
                    "Certification Name",
                    <Form.Control
                      type="text"
                      placeholder="Enter certification name"
                      value={cert.name}
                      onChange={(e) => this.handleCertificationChange(index, "name", e.target.value)}
                      required
                    />,
                    "qualificationDetails",
                    `certifications[${index}].name`
                  )}
                </div>
                <div className="col-md-6">
                  {this.renderFormGroup(
                    "Issuing Organization",
                    <Form.Control
                      type="text"
                      placeholder="Enter issuing organization"
                      value={cert.issuingOrganization}
                      onChange={(e) => this.handleCertificationChange(index, "issuingOrganization", e.target.value)}
                      required
                    />,
                    "qualificationDetails",
                    `certifications[${index}].issuingOrganization`
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  {this.renderFormGroup(
                    "Issue Date",
                    <DatePicker
                      selected={cert.issueDate}
                      onChange={(date) => this.handleCertificationChange(index, "issueDate", date)}
                      dateFormat="yyyy-MM-dd"
                      className="form-control"
                      placeholderText="Select issue date"
                      required
                    />,
                    "qualificationDetails",
                    `certifications[${index}].issueDate`
                  )}
                </div>
                <div className="col-md-4">
                  {this.renderFormGroup(
                    "Expiry Date",
                    <DatePicker
                      selected={cert.expiryDate}
                      onChange={(date) => this.handleCertificationChange(index, "expiryDate", date)}
                      dateFormat="yyyy-MM-dd"
                      className="form-control"
                      placeholderText="Select expiry date"
                    />,
                    "qualificationDetails",
                    `certifications[${index}].expiryDate`
                  )}
                </div>
                <div className="col-md-4">
                  {this.renderFormGroup(
                    "Credential ID",
                    <Form.Control
                      type="text"
                      placeholder="Enter credential ID"
                      value={cert.credentialId}
                      onChange={(e) => this.handleCertificationChange(index, "credentialId", e.target.value)}
                    />,
                    "qualificationDetails",
                    `certifications[${index}].credentialId`
                  )}
                </div>
              </div>
              <Button
                variant="danger"
                size="sm"
                className="mt-2"
                onClick={() => this.removeCertification(index)}
              >
                Remove Certification
              </Button>
            </div>
          ))}
          <Button
            variant="outline-primary"
            className="mt-2"
            onClick={this.addCertification}
          >
            Add Certification
          </Button>
        </div>

        <div className="mt-4">
          {this.renderFormGroup(
  "Educational Certificates",
  <div>
    <Form.Control
      type="file"
      multiple
      onChange={this.handleMultipleFiles}
      name="qualificationDetails.educationalCertificates"
      accept=".pdf,.jpg,.jpeg,.png"
      key={qualificationDetails.educationalCertificates?.length > 0 ? 'files-selected' : 'files-empty'}
      required
    />
    {qualificationDetails.educationalCertificates?.length > 0 && (
      <div className="files-selected mt-2">
        <i className="fas fa-check-circle text-success mr-2"></i>
        Selected: {qualificationDetails.educationalCertificates.length} file(s)
        <Button 
          variant="link" 
          size="sm" 
          className="text-danger ml-2"
          onClick={() => this.handleFileRemove('qualificationDetails', 'educationalCertificates')}
        >
          <i className="fas fa-times"></i> Remove All
        </Button>
      </div>
    )}
  </div>,
  "qualificationDetails",
  "educationalCertificates",
  true
)}
        </div>
      </FormStep>
    );
  };

  renderOfficialStatus = () => {
    const { officialStatus } = this.state.formData;
    const { departments, colleges } = this.state.systemData;
    
    return (
      <FormStep title="Official Status">
        {this.renderFormGroup(
          "Employee ID",
          <Form.Control
            type="text"
            placeholder="Enter employee ID"
            name="officialStatus.employeeId"
            value={officialStatus.employeeId}
            onChange={this.handleChange}
            required
          />,
          "officialStatus",
          "employeeId",
          true
        )}

        <div className="row">
          <div className="col-md-6">
            {this.renderFormGroup(
              "Username",
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="officialStatus.username"
                value={officialStatus.username}
                onChange={this.handleChange}
                required
              />,
              "officialStatus",
              "username",
              true
            )}
          </div>
          <div className="col-md-6">
            {this.renderFormGroup(
              "Password",
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="officialStatus.password"
                value={officialStatus.password}
                onChange={this.handleChange}
                required
              />,
              "officialStatus",
              "password",
              true
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            {this.renderFormGroup(
              "Role",
              <Form.Control
                as="select"
                value={officialStatus.role}
                onChange={this.handleChange}
                name="officialStatus.role"
                required
              >
                <option value="">Choose...</option>
                <option value="ROLE_SUPER_ADMIN">Super Admin</option>
                <option value="ROLE_SYSTEM_ADMIN">System Admin</option>
                <option value="ROLE_ADMIN">Principal</option>
                <option value="ROLE_HOD">HOD</option>
                <option value="ROLE_FACULTY">Faculty</option>
              </Form.Control>,
              "officialStatus",
              "role",
              true
            )}
          </div>
          <div className="col-md-6">
            {this.renderFormGroup(
              "Department",
              <Form.Control
                as="select"
                value={officialStatus.departmentId}
                onChange={this.handleChange}
                name="officialStatus.departmentId"
                required
              >
                <option value="">Choose...</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.departmentName}
                  </option>
                ))}
              </Form.Control>,
              "officialStatus",
              "departmentId",
              true
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            {this.renderFormGroup(
              "College",
              <Form.Control
                as="select"
                value={officialStatus.college}
                onChange={this.handleChange}
                name="officialStatus.college"
                required
              >
                <option value="">Choose...</option>
                {colleges.map((college, index) => (
                  <option key={index} value={college}>
                    {college}
                  </option>
                ))}
              </Form.Control>,
              "officialStatus",
              "college",
              true
            )}
          </div>
          <div className="col-md-6">
            {this.renderFormGroup(
              "Job Title",
              <Form.Control
                as="select"
                value={officialStatus.jobTitle}
                onChange={this.handleChange}
                name="officialStatus.jobTitle"
                required
              >
                <option value="">Choose...</option>
                <option value="HOD">HOD</option>
                <option value="PRINCIPAL">Principal</option>
                <option value="ASSOCIATE_PROFESSOR">Associate Professor</option>
                <option value="ASSISTANT_PROFESSOR">Assistant Professor</option>
              </Form.Control>,
              "officialStatus",
              "jobTitle",
              true
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            {this.renderFormGroup(
              "Employment Type",
              <Form.Control
                as="select"
                value={officialStatus.employmentType}
                onChange={this.handleChange}
                name="officialStatus.employmentType"
                required
              >
                <option value="">Choose...</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERN">Intern</option>
              </Form.Control>,
              "officialStatus",
              "employmentType",
              true
            )}
          </div>
          <div className="col-md-6">
            {this.renderFormGroup(
              "Joining Date",
              <DatePicker
                selected={officialStatus.joiningDate}
                onChange={(date) => this.handleDateChange(date, "officialStatus.joiningDate")}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                placeholderText="Select joining date"
                required
              />,
              "officialStatus",
              "joiningDate",
              true
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            {this.renderFormGroup(
              "Start Date",
              <DatePicker
                selected={officialStatus.startDate}
                onChange={(date) => this.handleDateChange(date, "officialStatus.startDate")}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                placeholderText="Select start date"
                required
              />,
              "officialStatus",
              "startDate",
              true
            )}
          </div>
          <div className="col-md-6">
            {this.renderFormGroup(
              "End Date",
              <DatePicker
                selected={officialStatus.endDate}
                onChange={(date) => this.handleDateChange(date, "officialStatus.endDate")}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                placeholderText="Select end date"
              />,
              "officialStatus",
              "endDate"
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            {this.renderFormGroup(
              "Salary",
              <Form.Control
                type="number"
                placeholder="Enter salary"
                name="officialStatus.salary"
                value={officialStatus.salary}
                onChange={this.handleChange}
                min="0"
                required
              />,
              "officialStatus",
              "salary",
              true
            )}
          </div>
        </div>

        <div className="mt-4">
          {this.renderFormGroup(
  "Experience Certificates",
  <div>
    <Form.Control
      type="file"
      multiple
      onChange={this.handleMultipleFiles}
      name="officialStatus.experienceCertificates"
      accept=".pdf,.jpg,.jpeg,.png"
      key={officialStatus.experienceCertificates?.length > 0 ? 'files-selected' : 'files-empty'}
      required
    />
    {officialStatus.experienceCertificates?.length > 0 && (
      <div className="files-selected mt-2">
        <i className="fas fa-check-circle text-success mr-2"></i>
        Selected: {officialStatus.experienceCertificates.length} file(s)
        <Button 
          variant="link" 
          size="sm" 
          className="text-danger ml-2"
          onClick={() => this.handleFileRemove('officialStatus', 'experienceCertificates')}
        >
          <i className="fas fa-times"></i> Remove All
        </Button>
      </div>
    )}
  </div>,
  "officialStatus",
  "experienceCertificates",
  true
)}
        </div>
      </FormStep>
    );
  };

  hasDocumentsToUpload = () => {
    const { governmentIds, qualificationDetails, officialStatus } = this.state.formData;
    return (
      governmentIds.aadharCard ||
      governmentIds.panCard ||
      governmentIds.passport ||
      governmentIds.drivingLicenseDoc ||
      (qualificationDetails.educationalCertificates && qualificationDetails.educationalCertificates.length > 0) ||
      (officialStatus.experienceCertificates && officialStatus.experienceCertificates.length > 0)
    );
  };

  uploadDocuments = async (userId) => {
    const formData = new FormData();
    const { governmentIds, qualificationDetails, officialStatus } = this.state.formData;
  
    // Append single files
    if (governmentIds.aadharCard) formData.append('aadharCard', governmentIds.aadharCard);
    if (governmentIds.panCard) formData.append('panCard', governmentIds.panCard);
    if (governmentIds.passport) formData.append('passport', governmentIds.passport);
    if (governmentIds.drivingLicenseDoc) formData.append('drivingLicense', governmentIds.drivingLicenseDoc);
  
    // Append multiple files
    if (qualificationDetails.educationalCertificates) {
      qualificationDetails.educationalCertificates.forEach((file, index) => {
        formData.append(`educationalCertificates`, file);
      });
    }
  
    if (officialStatus.experienceCertificates) {
      officialStatus.experienceCertificates.forEach((file, index) => {
        formData.append(`experienceCertificates`, file);
      });
    }
  
    formData.append('userId', userId);
  
    try {
      await axios.post(
        "/api/documents",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );
    } catch (err) {
      console.error('Error uploading documents:', err);
      throw err;
    }
  };

  handleApiError = (message, err) => {
    console.error(message, err);
    this.setState({
      ui: {
        ...this.state.ui,
        isLoading: false,
        showErrorAlert: true,
        alertMessage: err.response?.data?.message || "An error occurred. Please try again."
      }
    });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    if (!this.validateAllSteps()) {
      window.scrollTo(0, 0);
      return;
    }

    this.setState({ 
      ui: {
        ...this.state.ui,
        isLoading: true, 
        loadingMessage: "Creating employee profile...",
        showErrorAlert: false
      }
    });

    try {
      // Create user first
      const { officialStatus, personalInfo } = this.state.formData;
      const userRes = await axios.post(
        "/api/users",
        {
          username: officialStatus.username,
          password: officialStatus.password || "1234",
          fullname: `${personalInfo.firstName} ${personalInfo.lastName}`,
          role: officialStatus.role,
          departmentId: officialStatus.departmentId,
          college: officialStatus.college,
          employeeId: officialStatus.employeeId,
          active: 1,
          jobPosition: this.state.jobPosition,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const userId = userRes.data.id;

      // Qualification Information
      const formattedCertifications = this.state.formData.qualificationDetails.certifications.map(cert => ({
        name: cert.name,
        issuingOrganization: cert.issuingOrganization,
        issueDate: cert.issueDate ? cert.issueDate.toISOString().split('T')[0] : null,
        expiryDate: cert.expiryDate ? cert.expiryDate.toISOString().split('T')[0] : null,
        credentialId: cert.credentialId
      }));

      await axios.post("/api/qualifications", {
        highestQualification: this.state.formData.qualificationDetails.highestQualification,
        university: this.state.formData.qualificationDetails.university,
        graduationYear: parseInt(this.state.formData.qualificationDetails.graduationYear),
        fieldOfStudy: this.state.formData.qualificationDetails.fieldOfStudy,
        gpa: parseFloat(this.state.formData.qualificationDetails.gpa) || null,
        certifications: formattedCertifications.length > 0 ? JSON.stringify(formattedCertifications) : null,
        userId: userId
      }, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        },
      });

      // Then create other records in parallel
      await Promise.all([
        // Personal Information
        axios.post("/api/personalInformations", {
          ...this.state.formData.personalInfo,
          ...this.state.formData.governmentIds,
          ...this.state.formData.contactDetails,
          userId,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),

        // Financial Information
        axios.post("/api/financialInformations", {
          ...this.state.formData.bankInfo,
          userId,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),

        // Job Information
        axios.post("/api/jobs", {
          ...this.state.formData.officialStatus,
          userId,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      // Handle document uploads if any
      if (this.hasDocumentsToUpload()) {
        await this.uploadDocuments(userId);
      }

      this.setState({
        ui: {
          ...this.state.ui,
          completed: true,
          redirectToList: true,
          showSuccessAlert: true,
          alertMessage: "Employee Details Added Successfully",
          isLoading: false
        }
      });
    } catch (err) {
      console.error('Error during submission:', err);
      this.handleApiError("Employee creation failed:", err);
      window.scrollTo(0, 0);
    }
  };

  render() {
    const { ui } = this.state;
    if (ui.redirectToList) {
      return <Redirect to="/employee-list" />;
    }

    return (
      <div className="employee-add-container">
        <Form onSubmit={this.onSubmit}>
          {ui.showErrorAlert && (
            <Alert 
              variant="danger" 
              className="alert-custom" 
              onClose={() => this.setState({ 
                ui: { 
                  ...ui, 
                  showErrorAlert: false 
                } 
              })} 
              dismissible
            >
              {ui.alertMessage}
            </Alert>
          )}
          
          {ui.showSuccessAlert && (
            <Alert 
              variant="success" 
              className="alert-custom" 
              onClose={() => this.setState({ 
                ui: { 
                  ...ui, 
                  showSuccessAlert: false 
                } 
              })} 
              dismissible
            >
              {ui.alertMessage}
            </Alert>
          )}

          {ui.isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner">
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
                <div className="mt-2">{ui.loadingMessage}</div>
              </div>
            </div>
          )}

          <Card className="main-card">
            <Card.Header className="main-card-header">
              <h3 className="mb-0">Add New Employee</h3>
            </Card.Header>
            <Card.Body>
              {this.renderStepIndicator()}
              
              <div className="form-content">
                {ui.currentStep === 1 && this.renderPersonalInfo()}
                {ui.currentStep === 2 && this.renderGovernmentIds()}
                {ui.currentStep === 3 && this.renderContactDetails()}
                {ui.currentStep === 4 && this.renderBankInfo()}
                {ui.currentStep === 5 && this.renderQualificationDetails()}
                {ui.currentStep === 6 && this.renderOfficialStatus()}
              </div>

              <div className="form-navigation">
                {ui.currentStep > 1 && (
                  <Button 
                    variant="outline-primary" 
                    onClick={this.prevStep}
                    className="nav-button"
                    disabled={ui.isLoading}
                  >
                    <i className="fas fa-arrow-left"></i> Previous
                  </Button>
                )}
                {ui.currentStep < ui.totalSteps ? (
                  <Button 
                    variant="primary" 
                    onClick={this.nextStep}
                    className="nav-button"
                    disabled={ui.isLoading}
                  >
                    Next <i className="fas fa-arrow-right"></i>
                  </Button>
                ) : (
                  <Button 
                    variant="success" 
                    type="submit"
                    className="nav-button"
                    disabled={ui.isLoading}
                    onClick={this.checkCurrentStep}
                  >
                    {ui.isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="mr-2"
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check"></i> Submit
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Form>
      </div>
    );
  }
}
