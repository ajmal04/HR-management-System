// utils/employeeValidation.js

// Constants for reusable validation patterns
const VALIDATION_PATTERNS = {
  NAME: /^[A-Za-z\s\-']+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  AADHAR: /^\d{12}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  PASSPORT: /^[A-Z0-9]{6,9}$/,
  DRIVING_LICENSE: /^[A-Z]{2}[0-9]{2}[0-9]{11}$/,
  MOBILE: /^\d{10}$/,
  ACCOUNT_NUMBER: /^\d{9,18}$/,
  IFSC: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  GPA: /^[0-4](\.\d{1,2})?$/,
  USERNAME: /^[a-zA-Z0-9_]+$/
};

// Helper functions
const validateRequired = (value, fieldName) => {
  if (!value) return `${fieldName} is required`;
  return null;
};

const validateMinLength = (value, min, fieldName) => {
  if (value.length < min) return `${fieldName} must be at least ${min} characters`;
  return null;
};

const validatePattern = (value, pattern, fieldName, message) => {
  if (value && !pattern.test(value)) return message;
  return null;
};

const validateDateRange = (date, minAge, maxAge, fieldName) => {
  if (!date) return null;
  
  const today = new Date();
  const birthDate = new Date(date);
  const age = today.getFullYear() - birthDate.getFullYear();
  
  if (age < minAge) return `${fieldName} must be at least ${minAge} years`;
  if (age > maxAge) return `${fieldName} cannot be more than ${maxAge} years`;
  return null;
};

// Main validation functions
export const validatePersonalInfo = (data) => {
  const errors = {};
  
  errors.firstName = validateRequired(data.firstName, 'First name') ||
                    validateMinLength(data.firstName, 2, 'First name') ||
                    validatePattern(data.firstName, VALIDATION_PATTERNS.NAME, 'First name', 'Should only contain letters, spaces, hyphens, and apostrophes');
  
  errors.lastName = validateRequired(data.lastName, 'Last name') ||
                   validateMinLength(data.lastName,  'Last name') ||
                   validatePattern(data.lastName, VALIDATION_PATTERNS.NAME, 'Last name', 'Should only contain letters, spaces, hyphens, and apostrophes');
  
  errors.dateOfBirth = validateRequired(data.dateOfBirth, 'Date of birth') ||
                      validateDateRange(data.dateOfBirth, 18, 100, 'Age');
  
  errors.age = validateRequired(data.age, 'Age') ||
              (data.age < 18 ? 'Age must be at least 18 years' : 
               data.age > 100 ? 'Age cannot be more than 100 years' : null);
  
  errors.gender = validateRequired(data.gender, 'Gender');
  errors.maritalStatus = validateRequired(data.maritalStatus, 'Marital status');
  
  errors.fatherName = validateRequired(data.fatherName, 'Father\'s name') ||
                     validateMinLength(data.fatherName, 2, 'Father\'s name') ||
                     validatePattern(data.fatherName, VALIDATION_PATTERNS.NAME, 'Father\'s name', 'Should only contain letters, spaces, hyphens, and apostrophes');
  
  return errors;
};

export const validateGovernmentIds = (data) => {
  const errors = {};
  
  errors.aadharNumber = validateRequired(data.aadharNumber, 'Aadhar number') ||
                       validatePattern(data.aadharNumber, VALIDATION_PATTERNS.AADHAR, 'Aadhar number', 'Must be exactly 12 digits');
  
  if (data.panNumber) {
    errors.panNumber = validatePattern(data.panNumber, VALIDATION_PATTERNS.PAN, 'PAN number', 'Must be in format: ABCDE1234F');
  }
  
  if (data.passportNumber) {
    errors.passportNumber = validatePattern(data.passportNumber, VALIDATION_PATTERNS.PASSPORT, 'Passport number', 'Must be 6-9 alphanumeric characters');
  }
  
  if (data.drivingLicense) {
    errors.drivingLicense = validatePattern(data.drivingLicense, VALIDATION_PATTERNS.DRIVING_LICENSE, 'Driving license', 'Must be in format: XX99XXXXXXXXXXX');
  }
  
  errors.aadharCard = validateRequired(data.aadharCard, 'Aadhar card');
  
  if (data.panNumber && !data.panCard) {
    errors.panCard = 'PAN card document is required when PAN number is provided';
  }
  
  if (data.passportNumber && !data.passport) {
    errors.passport = 'Passport document is required when passport number is provided';
  }
  
  if (data.drivingLicense && !data.drivingLicenseDoc) {
    errors.drivingLicenseDoc = 'Driving license document is required when license number is provided';
  }
  
  return errors;
};

export const validateContactDetails = (data) => {
  const errors = {};
  
  errors.address = validateRequired(data.address, 'Address') ||
                  validateMinLength(data.address, 10, 'Address');
  
  errors.country = validateRequired(data.country, 'Country') ||
                  validateMinLength(data.country, 2, 'Country name');
  
  errors.city = validateRequired(data.city, 'City') ||
               validateMinLength(data.city, 2, 'City name');
  
  errors.mobile = validateRequired(data.mobile, 'Mobile number') ||
                 validatePattern(data.mobile, VALIDATION_PATTERNS.MOBILE, 'Mobile number', 'Must be exactly 10 digits');
  
  if (data.phone) {
    errors.phone = validatePattern(data.phone, VALIDATION_PATTERNS.MOBILE, 'Phone number', 'Must be exactly 10 digits');
  }
  
  errors.email = validateRequired(data.email, 'Email') ||
                validatePattern(data.email, VALIDATION_PATTERNS.EMAIL, 'Email', 'Please enter a valid email address (e.g., example@domain.com)');
  
  return errors;
};

export const validateBankInfo = (data) => {
  const errors = {};
  
  errors.bankName = validateRequired(data.bankName, 'Bank name') ||
                   validateMinLength(data.bankName, 2, 'Bank name');
  
  errors.accountName = validateRequired(data.accountName, 'Account holder name') ||
                      validateMinLength(data.accountName, 2, 'Account holder name');
  
  errors.accountNumber = validateRequired(data.accountNumber, 'Account number') ||
                        validatePattern(data.accountNumber, VALIDATION_PATTERNS.ACCOUNT_NUMBER, 'Account number', 'Must be 9-18 digits');
  
  errors.ifscCode = validateRequired(data.ifscCode, 'IFSC code') ||
                   validatePattern(data.ifscCode, VALIDATION_PATTERNS.IFSC, 'IFSC code', 'Must be in format: SBIN0001234');
  
  return errors;
};

export const validateQualificationDetails = (data) => {
  const errors = {};
  
  errors.highestQualification = validateRequired(data.highestQualification, 'Highest qualification');
  errors.university = validateRequired(data.university, 'University') ||
                     validateMinLength(data.university, 2, 'University name');
  
  errors.graduationYear = validateRequired(data.graduationYear, 'Graduation year') ||
                         (data.graduationYear < 1950 ? 'Graduation year must be after 1950' :
                          data.graduationYear > new Date().getFullYear() ? 'Graduation year cannot be in the future' : null);
  
  errors.fieldOfStudy = validateRequired(data.fieldOfStudy, 'Field of study') ||
                       validateMinLength(data.fieldOfStudy, 2, 'Field of study');
  
  if (data.gpa) {
    errors.gpa = validatePattern(data.gpa, VALIDATION_PATTERNS.GPA, 'GPA', 'Must be between 0 and 4 (e.g., 3.5)');
  }
  
  if (data.certifications && data.certifications.length > 0) {
    data.certifications.forEach((cert, index) => {
      const certErrors = {};
      
      certErrors.name = validateRequired(cert.name, 'Certification name');
      certErrors.issuingOrganization = validateRequired(cert.issuingOrganization, 'Issuing organization');
      certErrors.issueDate = validateRequired(cert.issueDate, 'Issue date');
      
      if (cert.expiryDate && new Date(cert.expiryDate) < new Date(cert.issueDate)) {
        certErrors.expiryDate = 'Expiry date must be after issue date';
      }
      
      if (Object.keys(certErrors).length > 0) {
        errors.certifications = errors.certifications || [];
        errors.certifications[index] = certErrors;
      }
    });
  }
  
  errors.educationalCertificates = data.educationalCertificates && data.educationalCertificates.length > 0 
    ? null 
    : 'At least one educational certificate is required';
  
  return errors;
};

export const validateOfficialStatus = (data) => {
  const errors = {};
  
  errors.employeeId = validateRequired(data.employeeId, 'Employee ID') ||
                    validateMinLength(data.employeeId, 3, 'Employee ID');
  
  errors.username = validateRequired(data.username, 'Username') ||
                   validateMinLength(data.username, 4, 'Username') ||
                   validatePattern(data.username, VALIDATION_PATTERNS.USERNAME, 'Username', 'Can only contain letters, numbers, and underscores');
  
  errors.password = validateRequired(data.password, 'Password') ||
                   validateMinLength(data.password, 6, 'Password');
  
  errors.role = validateRequired(data.role, 'Role');
  errors.departmentId = validateRequired(data.departmentId, 'Department');
  errors.college = validateRequired(data.college, 'College');
  errors.jobTitle = validateRequired(data.jobTitle, 'Job title');
  errors.employmentType = validateRequired(data.employmentType, 'Employment type');
  
  errors.joiningDate = validateRequired(data.joiningDate, 'Joining date') ||
                      (new Date(data.joiningDate) < new Date() ? 'Joining date cannot be in the past' : null);
  
  errors.startDate = validateRequired(data.startDate, 'Start date') ||
                   (new Date(data.startDate) < new Date(data.joiningDate) ? 'Start date cannot be before joining date' : null);
  
  if (data.endDate) {
    errors.endDate = new Date(data.endDate) < new Date(data.startDate) 
      ? 'End date cannot be before start date' 
      : null;
  }
  
  errors.salary = validateRequired(data.salary, 'Salary') ||
                (data.salary < 0 ? 'Salary must be positive' :
                 data.salary > 10000000 ? 'Salary must be less than 1,00,00,000' : null);
  
  errors.experienceCertificates = data.experienceCertificates && data.experienceCertificates.length > 0 
    ? null 
    : 'At least one experience certificate is required';
  
  return errors;
};

export const validateAllSteps = (formData) => {
  const errors = {
    personalInfo: validatePersonalInfo(formData.personalInfo),
    governmentIds: validateGovernmentIds(formData.governmentIds),
    contactDetails: validateContactDetails(formData.contactDetails),
    bankInfo: validateBankInfo(formData.bankInfo),
    qualificationDetails: validateQualificationDetails(formData.qualificationDetails),
    officialStatus: validateOfficialStatus(formData.officialStatus)
  };

  const isValid = Object.values(errors).every(
    sectionErrors => !sectionErrors || Object.keys(sectionErrors).length === 0
  );

  return {
    isValid,
    errors
  };
};