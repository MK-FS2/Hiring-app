 
export enum Genders 
{
Male,
Female
}

export enum UserAgent 
{
System,
Google
}

export enum OTPTypes 
{
ConfirmEmail,
ForgetPassword 
}


export enum HrActionsTypes 
{
  CreateJob = "CreateJob",
  UpdateJob = "UpdateJob",
  DeleteJob = "DeleteJob",
  ProcessApplication = "ProcessApplication",
  SetInterview = "SetInterview",
  ProcessInterview = "ProcessInterview",
  Other = "Other"
}

export enum HRPermissions 
{
  PostJobs="PostJobs",

  EditJobs="EditJobs",

  DeleteJobs="DeleteJobs",

  ViewApplicants="ViewApplicants",

  ManageApplicants = "ManageApplicants",

  ManageInterviews="ManageInterviews" 
}

export enum IndustriesFeilds
{
    FINANCE = 'FINANCE',
    IT = 'IT',
    TECH = 'TECH',
    MARKETING = 'MARKETING',
    SALES = 'SALES',
    HUMAN_RESOURCES = 'HUMAN_RESOURCES',
    LEGAL = 'LEGAL',
    ENGINEERING = 'ENGINEERING',
    CONSULTING = 'CONSULTING',
    ADMINISTRATION = 'ADMINISTRATION',
    HEALTHCARE = 'HEALTHCARE',
    EDUCATION = 'EDUCATION',
}

export enum Degrees 
{
    HIGH_SCHOOL = 'HIGH_SCHOOL',
    ASSOCIATE = 'ASSOCIATE',
    BACHELOR = 'BACHELOR',
    MASTER = 'MASTER',
    DOCTORATE = 'DOCTORATE',
    DIPLOMA = 'DIPLOMA',
    CERTIFICATE = 'CERTIFICATE',
}

export const enum Filecount 
{
  File = "File",
  Files = "Files"
}

export const enum FolderTypes {
  Resumes = "Resumes",
  JobPostings = "JobPostings",
  Candidates = "Candidates",
  Interviews = "Interviews",
  Offers = "Offers",
  Onboarding = "Onboarding",
  Feedback = "Feedback",
  Training = "Training",
  Reports = "Reports",
  Contracts = "Contracts",
  Assessments = "Assessments",
  Departments = "Departments",
  Users = "Users",
  Photos = "Photos",
  Documents = "Documents",
  App="Hiring",
  Companies="Companies",
  Applications = " Applications"
}


export  enum Roles 
{
  Admin = "Admin",
  Manger = "Manger",
  HR = "HR",
  Applicant = "Applicant",
}


export enum CompanyImageFlag 
{
  coverPic = "coverPic",
  logo = "logo"
}

export enum CarerExperienceLevels 
{
  INTERN = 'intern',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  MANAGER = 'manager'
}

export enum WorkplaceTypes {
  ONSITE = 'onsite',
  REMOTE = 'remote',
  HYBRID = 'hybrid'
}


export enum Currencies
{
  USD = '$',    
  EUR = '€',     
  EGP = 'E£',    
  SAR = '⃁',       
}

export enum JobStatus 
{
  Open = "open",
  Closed = "closed",
  UnderReview = "under_review"
}


export enum ApplicationStatus 
{
    Pending = "Pending",
    Under_Interview = "Under_Interview",
    Accepted = "Accepted",
    Rejected = "Rejected"
}


