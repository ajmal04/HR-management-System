import React, { Component } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment";

export default class EmployeeEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        id: null,
        fullName: "",
        jobPosition: null,
        role: null,
        active: null,
        departmentId: null,
        college: null,
        username: "",
      },
      userPersonalInfo: {
        id: null,
        dateOfBirth: null,
        age: "",
        gender: "",
        maritalStatus: "",
        bloodGroup: "",
        fatherName: "",
        idNumber: "",
        address: "",
        tempAddress: "",
        city: "",
        country: "",
        mobile: "",
        phone: "",
        emailAddress: "",
      },
      userFinancialInfo: {
        id: null,
        bankName: "",
        accountName: "",
        accountNumber: "",
        iban: "",
      },
      department: {
        departmentId: null,
        departmentName: null,
      },
      departments: [],
      colleges: [],
      job: {
        id: null,
        jobTitle: "",
        startDate: null,
        endDate: null,
      },
      hasError: false,
      errMsg: "",
      completed: false,
      falseRedirect: false,
      isSubmitting: false,
      isLoadingEmployee: true,
      isLoadingDepartments: true,
      isLoadingColleges: true,
    };

    this._isMounted = false;
    this.cancelTokenSource = axios.CancelToken.source();
  }

  componentDidMount() {
    this._isMounted = true;

    if (!this.props.location.state?.selectedUser) {
      this.setState({ falseRedirect: true });
      return;
    }

    // Fetch all required data
    Promise.all([
      this.fetchEmployeeData(),
      this.fetchDepartments(),
      this.fetchColleges(),
    ]).catch((err) => {
      if (this._isMounted && !axios.isCancel(err)) {
        this.setState({
          hasError: true,
          errMsg: "Failed to load initial data",
          isLoadingEmployee: false,
          isLoadingDepartments: false,
          isLoadingColleges: false,
        });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.cancelTokenSource.cancel("Component unmounted");
  }

  fetchEmployeeData = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "api/users/" + this.props.location.state.selectedUser.id,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        cancelToken: this.cancelTokenSource.token,
        timeout: 10000,
      });

      if (!this._isMounted) return;

      const user = response.data;

      const stateUpdates = {
        isLoadingEmployee: false,
        user: {
          ...this.state.user,
          ...user,
          college: user.college || null,
        },
        userPersonalInfo: {
          ...this.state.userPersonalInfo,
          ...(user.user_personal_info || {}),
          dateOfBirth: user.user_personal_info?.dateOfBirth
            ? moment(new Date(user.user_personal_info.dateOfBirth)).toDate()
            : null,
        },
        department: user.department || this.state.department,
      };

      if (user.user_financial_info) {
        stateUpdates.userFinancialInfo = {
          ...this.state.userFinancialInfo,
          ...user.user_financial_info,
        };
      }

      if (user.jobs?.length > 0) {
        const currentJob = user.jobs.find(
          (job) =>
            new Date(job.startDate) <= Date.now() &&
            new Date(job.endDate) >= Date.now()
        );

        if (currentJob) {
          stateUpdates.job = {
            id: currentJob.id,
            jobTitle: currentJob.jobTitle || "",
            startDate: currentJob.startDate
              ? moment(new Date(currentJob.startDate)).toDate()
              : null,
            endDate: currentJob.endDate
              ? moment(new Date(currentJob.endDate)).toDate()
              : null,
          };
        }
      }

      this.setState(stateUpdates);
    } catch (err) {
      if (this._isMounted && !axios.isCancel(err)) {
        this.setState({
          hasError: true,
          errMsg: err.response?.data?.message || "Failed to load employee data",
          isLoadingEmployee: false,
        });
      }
    }
  };

  fetchDepartments = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "/api/departments",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        cancelToken: this.cancelTokenSource.token,
        timeout: 10000,
      });

      if (this._isMounted) {
        this.setState({
          departments: response.data,
          isLoadingDepartments: false,
        });
      }
    } catch (err) {
      if (this._isMounted && !axios.isCancel(err)) {
        this.setState({
          hasError: true,
          errMsg: "Failed to load departments",
          isLoadingDepartments: false,
        });
      }
    }
  };

  fetchColleges = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "/api/colleges",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        cancelToken: this.cancelTokenSource.token,
        timeout: 10000,
      });

      if (this._isMounted) {
        this.setState({
          colleges: response.data,
          isLoadingColleges: false,
        });
      }
    } catch (err) {
      if (this._isMounted && !axios.isCancel(err)) {
        this.setState({
          hasError: true,
          errMsg: "Failed to load colleges",
          isLoadingColleges: false,
        });
      }
    }
  };

  handleChangeUser = (event) => {
    const { value, name } = event.target;
    this.setState((prevState) => ({
      user: {
        ...prevState.user,
        [name]: value,
      },
    }));
  };

  handleChangeJob = (event) => {
    const { value, name } = event.target;
    this.setState((prevState) => ({
      job: {
        ...prevState.job,
        [name]: value,
      },
    }));
  };

  handleChangeDepartment = (event) => {
    const { value, name } = event.target;
    this.setState((prevState) => ({
      department: {
        ...prevState.department,
        [name]: value,
      },
    }));
  };

  handleChangeUserPersonal = (event) => {
    const { value, name } = event.target;
    this.setState((prevState) => ({
      userPersonalInfo: {
        ...prevState.userPersonalInfo,
        [name]: value,
      },
    }));
  };

  handleChangeUserFinancial = (event) => {
    const { value, name } = event.target;
    this.setState((prevState) => ({
      userFinancialInfo: {
        ...prevState.userFinancialInfo,
        [name]: value,
      },
    }));
  };

  pushDepartments = () => {
    return this.state.departments.map((dept, index) => (
      <option key={index} value={dept.id}>
        {dept.departmentName}
      </option>
    ));
  };

  pushColleges = () => {
    return this.state.colleges.map((college, index) => (
      <option key={index} value={college}>
        {college}
      </option>
    ));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isSubmitting: true, hasError: false, errMsg: "" });

    try {
      const { user, userPersonalInfo, userFinancialInfo, job } = this.state;

      // Update user data
      const userResponse = await axios({
        method: "put",
        url: "/api/users/" + this.props.location.state.selectedUser.id,
        data: {
          fullName: user.fullName,
          role: user.role,
          departmentId: user.departmentId,
          college: user.college,
          active: user.active,
          jobPosition: user.jobPosition,
        },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        timeout: 10000,
      });

      const userId = userResponse.data.id;

      // Update or create personal information
      const personalInfoMethod = userPersonalInfo.id ? "put" : "post";
      const personalInfoUrl = userPersonalInfo.id
        ? "/api/personalInformations/" + userPersonalInfo.id
        : "/api/personalInformations";

      await axios({
        method: personalInfoMethod,
        url: personalInfoUrl,
        data: {
          dateOfBirth: userPersonalInfo.dateOfBirth
            ? moment(userPersonalInfo.dateOfBirth).format("YYYY-MM-DD")
            : null,
          age: userPersonalInfo.age,
          gender: userPersonalInfo.gender,
          bloodGroup: userPersonalInfo.bloodGroup,
          maritalStatus: userPersonalInfo.maritalStatus,
          fatherName: userPersonalInfo.fatherName,
          idNumber: userPersonalInfo.idNumber,
          address: userPersonalInfo.address,
          tempAddress: userPersonalInfo.tempAddress,
          city: userPersonalInfo.city,
          country: userPersonalInfo.country,
          mobile: userPersonalInfo.mobile,
          phone: userPersonalInfo.phone,
          emailAddress: userPersonalInfo.emailAddress,
          userId: userId,
        },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        timeout: 10000,
      });

      // Update or create financial information if any fields are filled
      if (
        userFinancialInfo.bankName ||
        userFinancialInfo.accountName ||
        userFinancialInfo.accountNumber ||
        userFinancialInfo.iban
      ) {
        const financialInfoMethod = userFinancialInfo.id ? "put" : "post";
        const financialInfoUrl = userFinancialInfo.id
          ? "api/financialInformations/" + userFinancialInfo.id
          : "api/financialInformations";

        await axios({
          method: financialInfoMethod,
          url: financialInfoUrl,
          data: {
            bankName: userFinancialInfo.bankName,
            accountName: userFinancialInfo.accountName,
            accountNumber: userFinancialInfo.accountNumber,
            iban: userFinancialInfo.iban,
            userId: userId,
          },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          timeout: 10000,
        });
      }

      // Update or create job if any fields are filled
      if (job.jobTitle || job.startDate || job.endDate) {
        const jobMethod = job.id ? "put" : "post";
        const jobUrl = job.id ? "api/jobs/" + job.id : "api/jobs";

        await axios({
          method: jobMethod,
          url: jobUrl,
          data: {
            jobTitle: job.jobTitle,
            startDate: job.startDate
              ? moment(job.startDate).format("YYYY-MM-DD")
              : null,
            endDate: job.endDate
              ? moment(job.endDate).format("YYYY-MM-DD")
              : null,
            userId: userId,
          },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          timeout: 10000,
        });
      }

      if (this._isMounted) {
        this.setState({ completed: true, isSubmitting: false });
      }
    } catch (err) {
      if (this._isMounted && !axios.isCancel(err)) {
        this.setState({
          hasError: true,
          errMsg: err.response?.data?.message || "Failed to update employee",
          isSubmitting: false,
        });
        window.scrollTo(0, 0);
      }
    }
  };

  render() {
    const {
      hasError,
      errMsg,
      completed,
      falseRedirect,
      isLoadingEmployee,
      isLoadingDepartments,
      isLoadingColleges,
      isSubmitting,
    } = this.state;

    if (falseRedirect) {
      return <Redirect to="/" />;
    }

    if (hasError) {
      return (
        <Alert variant="danger" className="m-3">
          {errMsg || "Failed to load employee data"}
          <div className="mt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </Alert>
      );
    }

    if (completed) {
      return <Redirect to="/employee-list" />;
    }

    // Show initial spinner only if NO data has loaded at all
    if (isLoadingEmployee && isLoadingDepartments && isLoadingColleges) {
      return (
        <div className="d-flex justify-content-center mt-5">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      );
    }

    const {
      user,
      userPersonalInfo,
      userFinancialInfo,
      departments,
      colleges,
      job,
    } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <div className="row">
          {hasError && (
            <Alert variant="danger" className="m-3 w-100">
              {errMsg}
            </Alert>
          )}

          <Card className="col-sm-12 main-card">
            <Card.Header>
              <b>Edit Employee</b>
              {(isLoadingEmployee ||
                isLoadingDepartments ||
                isLoadingColleges) && (
                <span className="float-right">
                  <Spinner animation="border" size="sm" />
                  <span className="ml-2">Loading data...</span>
                </span>
              )}
            </Card.Header>
            <Card.Body>
              <div className="row">
                {/* Personal Details Card */}
                <div className="col-sm-6">
                  <Card className="secondary-card">
                    <Card.Header>
                      Personal Details
                      {isLoadingEmployee && (
                        <Spinner
                          animation="border"
                          size="sm"
                          className="ml-2"
                        />
                      )}
                    </Card.Header>
                    <Card.Body>
                      {isLoadingEmployee ? (
                        <div className="text-center py-3">
                          <Spinner animation="border" />
                          <p>Loading personal details...</p>
                        </div>
                      ) : (
                        <Card.Text>
                          <Form.Group controlId="formFullName">
                            <Form.Label className="text-muted required">
                              Full Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter full name"
                              name="fullName"
                              value={user.fullName || ""}
                              onChange={this.handleChangeUser}
                              required
                            />
                          </Form.Group>

                          <Form.Group controlId="formDateofBirth">
                            <Form.Label className="text-muted required">
                              Date of Birth
                            </Form.Label>
                            <div>
                              <DatePicker
                                selected={userPersonalInfo.dateOfBirth}
                                onChange={(dateOfBirth) =>
                                  this.setState((prevState) => ({
                                    userPersonalInfo: {
                                      ...prevState.userPersonalInfo,
                                      dateOfBirth: dateOfBirth,
                                    },
                                  }))
                                }
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                name="dateOfBirth"
                                dateFormat="yyyy-MM-dd"
                                className="form-control"
                                placeholderText="Select Date Of Birth"
                                autoComplete="off"
                                required
                              />
                            </div>
                          </Form.Group>
                          <Form.Group controlId="formAge">
                            <Form.Label className="text-muted required">
                              Age
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter Age"
                              name="age"
                              value={this.state.userPersonalInfo.age}
                              onChange={this.handleChangeUserPersonal}
                              required
                            />
                          </Form.Group>
                          <Form.Group controlId="formGender">
                            <Form.Label className="text-muted required">
                              Gender
                            </Form.Label>
                            <Form.Control
                              as="select"
                              value={userPersonalInfo.gender || ""}
                              onChange={this.handleChangeUserPersonal}
                              name="gender"
                              required
                            >
                              <option value="">Choose...</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId="formBloodGroup">
                            <Form.Label className="text-muted required">
                              Blood Group
                            </Form.Label>
                            <Form.Control
                              as="select"
                              value={
                                this.state.userPersonalInfo.bloodGroup || ""
                              }
                              onChange={this.handleChangeUserPersonal}
                              name="bloodGroup"
                              required
                            >
                              <option value="">Choose...</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId="formMaritalStatus">
                            <Form.Label className="text-muted required">
                              Marital Status
                            </Form.Label>
                            <Form.Control
                              as="select"
                              value={userPersonalInfo.maritalStatus || ""}
                              onChange={this.handleChangeUserPersonal}
                              name="maritalStatus"
                              required
                            >
                              <option value="">Choose...</option>
                              <option value="Married">Married</option>
                              <option value="Single">Single</option>
                            </Form.Control>
                          </Form.Group>

                          <Form.Group controlId="formFatherName">
                            <Form.Label className="text-muted required">
                              Father's name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter Father's Name"
                              name="fatherName"
                              value={userPersonalInfo.fatherName || ""}
                              onChange={this.handleChangeUserPersonal}
                              required
                            />
                          </Form.Group>

                          <Form.Group controlId="formId">
                            <Form.Label className="text-muted required">
                              ID Number
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter ID Number"
                              name="idNumber"
                              value={userPersonalInfo.idNumber || ""}
                              onChange={this.handleChangeUserPersonal}
                              required
                            />
                          </Form.Group>
                        </Card.Text>
                      )}
                    </Card.Body>
                  </Card>
                </div>

                <div className="col-sm-6">
                  <Card className="secondary-card">
                    <Card.Header>
                      Contact Details
                      {isLoadingEmployee && (
                        <Spinner
                          animation="border"
                          size="sm"
                          className="ml-2"
                        />
                      )}
                    </Card.Header>
                    <Card.Body>
                      {isLoadingEmployee ? (
                        <div className="text-center py-3">
                          <Spinner animation="border" />
                          <p>Loading contact details...</p>
                        </div>
                      ) : (
                        <Card.Text>
                          <Form.Group controlId="formPhysicalAddress">
                            <Form.Label className="text-muted required">
                              Physical Address
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={userPersonalInfo.address || ""}
                              onChange={this.handleChangeUserPersonal}
                              name="address"
                              placeholder="Enter Address"
                              required
                            />
                          </Form.Group>
                          <Form.Group controlId="formTempAddress">
                            <Form.Label className="text-muted required">
                              Temporary Address
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={
                                this.state.userPersonalInfo.tempAddress || ""
                              }
                              onChange={this.handleChangeUserPersonal}
                              name="tempAddress"
                              placeholder="Enter Temporary Address"
                              required
                            />
                          </Form.Group>
                          <Form.Group controlId="formCountry">
                            <Form.Label className="text-muted required">
                              Country
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={userPersonalInfo.country || ""}
                              onChange={this.handleChangeUserPersonal}
                              name="country"
                              placeholder="Enter Country"
                              required
                            />
                          </Form.Group>
                          <Form.Group controlId="formCity">
                            <Form.Label className="text-muted required">
                              City
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={userPersonalInfo.city || ""}
                              onChange={this.handleChangeUserPersonal}
                              name="city"
                              placeholder="Enter City"
                              required
                            />
                          </Form.Group>
                          <Form.Group controlId="formMobile">
                            <Form.Label className="text-muted required">
                              Mobile
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={userPersonalInfo.mobile || ""}
                              onChange={this.handleChangeUserPersonal}
                              name="mobile"
                              placeholder="Enter Mobile"
                              required
                            />
                          </Form.Group>
                          <Form.Group controlId="formPhone">
                            <Form.Label className="text-muted required">
                              Phone
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={userPersonalInfo.phone || ""}
                              onChange={this.handleChangeUserPersonal}
                              name="phone"
                              placeholder="Enter Phone"
                            />
                          </Form.Group>
                          <Form.Group controlId="formEmail">
                            <Form.Label className="text-muted required">
                              Email
                            </Form.Label>
                            <Form.Control
                              type="email"
                              value={userPersonalInfo.emailAddress || ""}
                              onChange={this.handleChangeUserPersonal}
                              name="emailAddress"
                              placeholder="Enter Email"
                              required
                            />
                          </Form.Group>
                        </Card.Text>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-sm-6">
                  <Card className="secondary-card">
                    <Card.Header>
                      Bank Information
                      {isLoadingEmployee && (
                        <Spinner
                          animation="border"
                          size="sm"
                          className="ml-2"
                        />
                      )}
                    </Card.Header>
                    <Card.Body>
                      {isLoadingEmployee ? (
                        <div className="text-center py-3">
                          <Spinner animation="border" />
                          <p>Loading bank information...</p>
                        </div>
                      ) : (
                        <Card.Text>
                          <Form.Group controlId="formBankName">
                            <Form.Label className="text-muted">
                              Bank Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={userFinancialInfo.bankName || ""}
                              onChange={this.handleChangeUserFinancial}
                              name="bankName"
                              placeholder="Enter Bank name"
                            />
                          </Form.Group>
                          <Form.Group controlId="formAccountName">
                            <Form.Label className="text-muted">
                              Account Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={userFinancialInfo.accountName || ""}
                              onChange={this.handleChangeUserFinancial}
                              name="accountName"
                              placeholder="Enter Account name"
                            />
                          </Form.Group>
                          <Form.Group controlId="formAccountNumber">
                            <Form.Label className="text-muted">
                              Account Number
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={userFinancialInfo.accountNumber || ""}
                              onChange={this.handleChangeUserFinancial}
                              name="accountNumber"
                              placeholder="Enter Account number"
                            />
                          </Form.Group>
                          <Form.Group controlId="formIban">
                            <Form.Label className="text-muted">IBAN</Form.Label>
                            <Form.Control
                              type="text"
                              value={userFinancialInfo.iban || ""}
                              onChange={this.handleChangeUserFinancial}
                              name="iban"
                              placeholder="Enter IBAN"
                            />
                          </Form.Group>
                        </Card.Text>
                      )}
                    </Card.Body>
                  </Card>
                </div>

                <div className="col-sm-6">
                  <Card className="secondary-card">
                    <Card.Header>
                      Official Status
                      {(isLoadingEmployee ||
                        isLoadingDepartments ||
                        isLoadingColleges) && (
                        <Spinner
                          animation="border"
                          size="sm"
                          className="ml-2"
                        />
                      )}
                    </Card.Header>
                    <Card.Body>
                      {isLoadingEmployee ||
                      isLoadingDepartments ||
                      isLoadingColleges ? (
                        <div className="text-center py-3">
                          <Spinner animation="border" />
                          <p>Loading official information...</p>
                        </div>
                      ) : (
                        <Card.Text>
                          <Form.Group controlId="formEmployeeId">
                            <Form.Label className="text-muted">
                              Employee ID
                            </Form.Label>
                            <div>{user.username || ""}</div>
                          </Form.Group>
                          <Form.Group controlId="formDepartment">
                            <Form.Label className="text-muted required">
                              Department
                            </Form.Label>
                            <Form.Control
                              as="select"
                              value={user.departmentId || ""}
                              onChange={this.handleChangeUser}
                              name="departmentId"
                              required
                            >
                              <option value="">Choose...</option>
                              {departments.map((dept, index) => (
                                <option key={index} value={dept.id}>
                                  {dept.departmentName}
                                </option>
                              ))}
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId="formCollege">
                            <Form.Label className="text-muted required">
                              College
                            </Form.Label>
                            <Form.Control
                              as="select"
                              value={user.college || ""}
                              onChange={this.handleChangeUser}
                              name="college"
                              required
                            >
                              <option value="">Choose...</option>
                              {colleges.map((college, index) => (
                                <option key={index} value={college}>
                                  {college}
                                </option>
                              ))}
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId="formJobPosition">
                            <Form.Label className="text-muted required">
                              Job Position
                            </Form.Label>
                            <Form.Control
                              as="select"
                              value={this.state.user.jobPosition}
                              onChange={this.handleChangeUser}
                              name="jobPosition"
                              required
                            >
                              <option value="">Choose...</option>
                              <option value="HR">HR</option>
                              <option value="PRINCIPAL">principal</option>
                              <option value="HOD">Hod</option>
                              <option value="ASSOCIATE_PROFESSOR">
                                Associate Professor
                              </option>
                              <option value="ASSISTANT_PROFESSOR">
                                Assistant Professor
                              </option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId="formRole">
                            <Form.Label className="text-muted required">
                              Role
                            </Form.Label>
                            <Form.Control
                              as="select"
                              value={user.role || ""}
                              onChange={this.handleChangeUser}
                              name="role"
                              required
                            >
                              <option value="">Choose...</option>
                              <option value="ROLE_SUPER_ADMIN">
                                Super Admin
                              </option>
                              <option value="ROLE_SYSTEM_ADMIN">
                                System Admin
                              </option>
                              <option value="ROLE_ADMIN">Principal</option>
                              <option value="ROLE_HOD">HOD</option>
                              <option value="ROLE_FACULTY">Faculty</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId="formActive">
                            <Form.Label className="text-muted required">
                              Status
                            </Form.Label>
                            <Form.Control
                              as="select"
                              value={
                                user.active === null
                                  ? ""
                                  : user.active.toString()
                              }
                              onChange={(e) =>
                                this.handleChangeUser({
                                  target: {
                                    name: "active",
                                    value: e.target.value === "true",
                                  },
                                })
                              }
                              name="active"
                              required
                            >
                              <option value="">Choose...</option>
                              <option value="false">Inactive</option>
                              <option value="true">Active</option>
                            </Form.Control>
                          </Form.Group>
                        </Card.Text>
                      )}
                    </Card.Body>
                  </Card>
                  <Button
                    variant="primary"
                    type="submit"
                    block
                    disabled={
                      isLoadingEmployee ||
                      isLoadingDepartments ||
                      isLoadingColleges ||
                      isSubmitting
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        <span className="ml-2">Updating...</span>
                      </>
                    ) : (
                      "Update Employee"
                    )}
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Form>
    );
  }
}
