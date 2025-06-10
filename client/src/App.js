import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Header from "./Layout/Header";
import Footer from "./Layout/Footer";
import SidebarSuperAdmin from "./Layout/SidebarSuperAdmin";
import SidebarSystemAdmin from "./Layout/SidebarSystemAdmin.js";
import SidebarAdmin from "./Layout/SidebarAdmin";
import SidebarHOD from "./Layout/SidebarHOD";
import SidebarEmployee from "./Layout/SidebarEmployee";
import DashboardSuperAdmin from "./components/superadmin/Dashboard.js";
import DashboardAdmin from "./components/admin/Dashboard.js";
import DashboardHOD from "./components/hod/Dashboard";
import DashboardEmployee from "./components/employee/Dashboard";
import Layout from "./Layout/Layout";
import EmployeeListSuperAdmin from "./components/superadmin/EmployeeList";
import EmployeeListAdmin from "./components/admin/EmployeeList";
import EmployeeListHOD from "./components/hod/EmployeeList";
import EmployeeAddSuperAdmin from "./components/superadmin/EmployeeAdd";
import EmployeeViewSuperAdmin from "./components/superadmin/EmployeeView";
import EmployeeViewAdmin from "./components/admin/EmployeeView.js";
import EmployeeViewHOD from "./components/hod/EmployeeView.js";
import EmployeeViewEmployee from "./components/employee/EmployeeView";
import EmployeeEditSuperAdmin from "./components/superadmin/EmployeeEdit";
import DepartmentListSuperAdmin from "./components/superadmin/DepartmentList";
import ApplicationListSuperAdmin from "./components/superadmin/ApplicationList";
import ApplicationListAdmin from "./components/admin/ApplicationList";
import ApplicationListHOD from "./components/hod/ApplicationList";
import ApplicationListEmployee from "./components/employee/ApplicationList";
import Application from "./components/Application";
import SalaryDetails from "./components/SalaryDetails";
import SalaryListSuperAdmin from "./components/superadmin/SalaryList";
import SalaryViewSuperAdmin from "./components/superadmin/SalaryView.js";
import SalaryViewAdmin from "./components/admin/SalaryView";
import SalaryViewHOD from "./components/hod/SalaryView";
import SalaryViewEmployee from "./components/employee/SalaryView";
import Expense from "./components/Expense";
import ExpenseReportAdmin from "./components/admin/ExpenseReport";
import ExpenseReportHOD from "./components/hod/ExpenseReport";
import ExpenseHOD from "./components/hod/Expense";
import ExpenseReportSuperAdmin from "./components/superadmin/ExpenseReport";
import AnnouncementSuperAdmin from "./components/superadmin/Announcement";
import AnnouncementAdmin from "./components/admin/Announcement";
import AnnouncementHOD from "./components/hod/Announcement";
import AnnouncementEmployee from "./components/employee/Announcement";
import Register from "./components/Register";
import withAuth from "./withAuth";
import Login from "./components/Login";

import OnboardingList from "./components/systemadmin/OnboardingList.js";
import OnboardingDetail from "./components/systemadmin/OnboardingDetail.js";
import AssetAllocation from "./components/systemadmin/AssetAllocation.js";
import OnboardingDashboard from "./components/onboarding/OnboardingDashboard";
import AssetManagement from "./components/systemadmin/AssetManagement";

import TerminationList from "./components/pages/TerminationList";
import ResignationList from "./components/pages/ResignationList";
import ResignationForm from "./components/pages/ResignationForm.js";
import ResignationStatus from "./components/pages/ResignationStatus.js";
import ApplicationStatus from "./components/hod/ApplicationStatus.js";

import JobRequisitionForm from "./components/recruitment/JobRequisitionForm.js";
import RequisitionListAdmin from "./components/recruitment/RequisitionListAdmin.js";

import CollegeEventFormSuperAdmin from "./components/superadmin/CollegeEventFormSuperAdmin.js";
import RecentCollegeEvents from "./components/superadmin/RecentCollegeEvents.js";
import DepartmentEventFormAdmin from "./components/admin/DepartmentEventFormAdmin.js";
import DepartmentEventFormHOD from "./components/hod/DepartmentEventFormHOD.js";
import EventViewerFaculty from "./components/employee/EventViewerFaculty.js";

export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/login" component={LoginContainer} />
          <Route exact path="/register" component={RegisterContainer} />
          <Route path="/" component={withAuth(DefaultContainer)} />
        </Switch>
      </Router>
    );
  }
}

const LoginContainer = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      height: "600px",
    }}
  >
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/login" />} />
      <Route path="/login" component={Login} />
    </Switch>
  </div>
);

const RegisterContainer = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      height: "600px",
    }}
  >
    <Route exact path="/" render={() => <Redirect to="/register" />} />
    <Route path="/register" component={Register} />
  </div>
);

const DefaultContainer = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Redirect to="/login" replace />;
  }

  return (
    <div>
      {user.role === "ROLE_SUPER_ADMIN" ? (
        <SuperAdminContainer />
      ) : user.role === "ROLE_SYSTEM_ADMIN" ? (
        <SystemAdminContainer />
      ) : user.role === "ROLE_ADMIN" ? (
        <AdminContainer />
      ) : user.role === "ROLE_HOD" ? (
        <HODContainer />
      ) : user.role === "ROLE_FACULTY" ? (
        <FacultyContainer />
      ) : (
        <Redirect to="/login" replace />
      )}
    </div>
  );
};

const SuperAdminContainer = () => (
  <div>
    <Header />
    <SidebarSuperAdmin />
    <Layout>
      <Switch>
        <Route
          exact
          path="/onboarding-dashboard"
          component={OnboardingDashboard}
        />

        <Route exact path="/employee-list" component={EmployeeListSuperAdmin} />
        <Route exact path="/employee-add" component={EmployeeAddSuperAdmin} />
        <Route exact path="/employee-edit" component={EmployeeEditSuperAdmin} />
        <Route exact path="/employee-view" component={EmployeeViewSuperAdmin} />
        <Route exact path="/departments" component={DepartmentListSuperAdmin} />
        <Route exact path="/termination-list" component={TerminationList} />
        <Route exact path="/resignation-list" component={ResignationList} />
        <Route
          exact
          path="/application-list"
          component={ApplicationListSuperAdmin}
        />
        <Route exact path="/salary-list" component={SalaryListSuperAdmin} />
        <Route exact path="/salary-details" component={SalaryDetails} />
        <Route exact path="/salary-view" component={SalaryViewSuperAdmin} />
        <Route exact path="/expense" component={Expense} />
        <Route
          exact
          path="/expense-report"
          component={ExpenseReportSuperAdmin}
        />
        <Route exact path="/announcement" component={AnnouncementSuperAdmin} />
        <Route exact path="/events" component={CollegeEventFormSuperAdmin} />
        <Route
          exact
          path="/recent-college-event"
          Component={RecentCollegeEvents}
        />
        <Route exact path="/" component={DashboardSuperAdmin} />
      </Switch>
    </Layout>
    <Footer />
  </div>
);

const SystemAdminContainer = () => (
  <div>
    <Header />
    <SidebarSystemAdmin />
    <Layout>
      <Switch>
        <Route exact path="/onboarding/list" component={OnboardingList} />
        <Route
          exact
          path="/onboarding-detail/:id"
          component={OnboardingDetail}
        />
        <Route
          exact
          path="/asset-allocation/:userId"
          component={AssetAllocation}
        />
        <Route exact path="/assets/manage" component={AssetManagement} />
      </Switch>
    </Layout>
    <Footer />
  </div>
);

const AdminContainer = () => (
  <div>
    <Header />
    <SidebarAdmin />
    <Layout>
      <Switch>
        <Route exact path="/employee-list" component={EmployeeListAdmin} />
        <Route exact path="/employee-view" component={EmployeeViewAdmin} />
        <Route exact path="/salary-view" component={SalaryViewAdmin} />
        {/* <Route exact path="/job-list" component={JobListAdmin} /> */}
        <Route exact path="/termination-list" component={TerminationList} />
        <Route exact path="/resignation-list" component={ResignationList} />
        <Route exact path="/resignation-form" component={ResignationForm} />
        <Route exact path="/resignation-status" component={ResignationStatus} />
        <Route
          exact
          path="/application-list"
          component={ApplicationListAdmin}
        />
        <Route
          exact
          path="/application-list"
          component={ApplicationListAdmin}
        />
        <Route exact path="/application" component={Application} />
        <Route exact path="/expense-report" component={ExpenseReportAdmin} />
        <Route exact path="/expense" component={Expense} />
        <Route exact path="/announcement" component={AnnouncementAdmin} />
        <Route
          exact
          path="/admin-events"
          component={DepartmentEventFormAdmin}
        />
        <Route exact path="/" component={DashboardAdmin} />
        <Route
          exact
          path="/requisition-list-admin"
          Component={RequisitionListAdmin}
        />
      </Switch>
    </Layout>
    <Footer />
  </div>
);

const HODContainer = () => (
  <div>
    <Header />
    <SidebarHOD />
    <Layout>
      <Switch>
        <Route exact path="/employee-list" component={EmployeeListHOD} />
        <Route exact path="/employee-view" component={EmployeeViewHOD} />
        <Route exact path="/salary-view" component={SalaryViewHOD} />
        <Route exact path="/termination-list" component={TerminationList} />
        <Route exact path="/resignation-list" component={ResignationList} />
        <Route exact path="/resignation-form" component={ResignationForm} />
        <Route exact path="/resignation-status" component={ResignationStatus} />
        <Route exact path="/application-status" component={ApplicationStatus} />
        <Route exact path="/application-list" component={ApplicationListHOD} />
        <Route exact path="/application" component={Application} />
        <Route exact path="/expense" component={ExpenseHOD} />
        <Route exact path="/expense-report" component={ExpenseReportHOD} />
        <Route exact path="/announcement" component={AnnouncementHOD} />
        <Route exact path="/hod-events" Component={DepartmentEventFormHOD} />
        <Route exact path="/" component={DashboardHOD} />
        <Route exact path="/job-requisition" component={JobRequisitionForm} />
      </Switch>
    </Layout>
    <Footer />
  </div>
);

const FacultyContainer = () => (
  <div>
    <Header />
    <SidebarEmployee />
    <Layout>
      <Switch>
        <Route exact path="/employee-view" component={EmployeeViewEmployee} />
        <Route
          exact
          path="/application-list"
          component={ApplicationListEmployee}
        />
        {/* <Route exact path="/apply-leave" component={Application} /> */}
        <Route exact path="/application" component={Application} />
        <Route exact path="/salary-view" component={SalaryViewEmployee} />
        <Route exact path="/announcement" component={AnnouncementEmployee} />
        <Route exact path="/emp-events" Component={EventViewerFaculty} />
        <Route exact path="/resignation-form" component={ResignationForm} />
        <Route exact path="/resignation-status" component={ResignationStatus} />
        <Route exact path="/" component={DashboardEmployee} />
      </Switch>
    </Layout>
    <Footer />
  </div>
);
