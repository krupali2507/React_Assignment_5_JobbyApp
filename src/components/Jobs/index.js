import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetail: {},
    apiProfileStatus: apiStatusConstants.initial,
    apiJobListStatus: apiStatusConstants.initial,
    selectedEmployementType: [],
    minimumSalaryRange: '',
    searchString: '',
    jobsList: [],
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobListData()
  }

  getProfileData = async () => {
    this.setState({apiProfileStatus: apiStatusConstants.inProgress})
    const token = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const profileApiUrl = 'https://apis.ccbp.in/profile'

    const response = await fetch(profileApiUrl, options)
    const data = await response.json()
    const updatedProfileData = {
      profileImageUrl: data.profile_details.profile_image_url,
      name: data.profile_details.name,
      shortBio: data.profile_details.short_bio,
    }

    if (response.ok === true) {
      this.setState({
        profileDetail: {...updatedProfileData},
        apiProfileStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiProfileStatus: apiStatusConstants.failure})
    }
  }

  getJobListData = async () => {
    this.setState({apiJobListStatus: apiStatusConstants.inProgress})
    const {
      selectedEmployementType,
      minimumSalaryRange,
      searchString,
    } = this.state
    const employmentTypeString = selectedEmployementType.join(',')
    // console.log(employmentTypeString)

    const token = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeString}&minimum_package=${minimumSalaryRange}&search=${searchString}`

    const response = await fetch(jobsApiUrl, options)
    const data = await response.json()
    const updatedJobsData = data.jobs.map(eachData => ({
      id: eachData.id,
      companyLogoUrl: eachData.company_logo_url,
      employmentType: eachData.employment_type,
      jobDescription: eachData.job_description,
      location: eachData.location,
      packagePerAnnum: eachData.package_per_annum,
      rating: eachData.rating,
      title: eachData.title,
    }))

    if (response.ok === true) {
      this.setState({
        apiJobListStatus: apiStatusConstants.success,
        jobsList: [...updatedJobsData],
      })
    } else {
      this.setState({apiJobListStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetryProfile = () => {
    this.getProfileData()
  }

  onClickRetryJobs = () => {
    this.getJobListData()
  }

  renderProfileFailureView = () => (
    <div className="failure-view-container">
      <button
        type="button"
        className="retry-btn"
        onClick={this.onClickRetryProfile}
      >
        Retry
      </button>
    </div>
  )

  renderProfileSuccessView = () => {
    const {profileDetail} = this.state
    const {profileImageUrl, name, shortBio} = profileDetail

    return (
      <div className="profile-bg-container">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  renderProfileApiStatusView = () => {
    const {apiProfileStatus} = this.state

    switch (apiProfileStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      case apiStatusConstants.success:
        return this.renderProfileSuccessView()

      case apiStatusConstants.failure:
        return this.renderProfileFailureView()

      default:
        return null
    }
  }

  renderLeftSearchBar = () => (
    <div className="left-search-container">
      <hr />
      <h1 className="filter-heading">Type of Employment</h1>
      <ul className="search-selection-container">
        {employmentTypesList.map(eachEmploymentType => {
          const onSelectCheckbox = () => {
            const {selectedEmployementType} = this.state

            if (
              selectedEmployementType.includes(
                eachEmploymentType.employmentTypeId,
              ) === false
            ) {
              this.setState(
                prevState => ({
                  selectedEmployementType: [
                    ...prevState.selectedEmployementType,
                    eachEmploymentType.employmentTypeId,
                  ],
                }),
                this.getJobListData,
              )
            } else {
              this.setState(
                prevState => ({
                  selectedEmployementType: [
                    ...prevState.selectedEmployementType.filter(
                      eachType =>
                        eachType !== eachEmploymentType.employmentTypeId,
                    ),
                  ],
                }),
                this.getJobListData,
              )
            }
          }

          return (
            <li key={eachEmploymentType.employmentTypeId}>
              <input
                type="checkbox"
                onClick={onSelectCheckbox}
                id={eachEmploymentType.employmentTypeId}
                value={eachEmploymentType.employmentTypeId}
              />
              <label htmlFor={eachEmploymentType.employmentTypeId}>
                {eachEmploymentType.label}
              </label>
            </li>
          )
        })}
      </ul>
      <hr />
      <h1 className="filter-heading">Salary range</h1>
      <ul className="search-selection-container">
        {salaryRangesList.map(eachSalary => {
          const onSelectSalaryRange = () => {
            this.setState(
              {minimumSalaryRange: eachSalary.salaryRangeId},
              this.getJobListData,
            )
          }

          return (
            <li key={eachSalary.salaryRangeId}>
              <input
                type="radio"
                id={eachSalary.salaryRangeId}
                value={eachSalary.salaryRangeId}
                onClick={onSelectSalaryRange}
                name="salaryRange"
              />
              <label htmlFor={eachSalary.salaryRangeId}>
                {eachSalary.label}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )

  onChangeSearchInput = event => {
    this.setState({searchString: event.target.value})
  }

  onClickSearchInput = () => {
    this.setState(this.getJobListData)
  }

  renderSearchBar = () => {
    const {searchString} = this.state

    return (
      <div className="search-container">
        <input
          type="search"
          className="search-input"
          value={searchString}
          onChange={this.onChangeSearchInput}
        />
        <button
          type="button"
          testid="searchButton"
          className="search-icon"
          onClick={this.onClickSearchInput}
        >
          <BsSearch />
        </button>
      </div>
    )
  }

  renderNoJobsView = () => (
    <div className="no-jobs-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  renderJobListingSuccessView = () => {
    const {jobsList} = this.state

    const isJobListEmpty = jobsList.length === 0

    return (
      <>
        {isJobListEmpty ? (
          this.renderNoJobsView()
        ) : (
          <ul className="job-all-list-container">
            {jobsList.map(eachJobItem => (
              <JobItem jobDetail={eachJobItem} key={eachJobItem.id} />
            ))}
          </ul>
        )}
      </>
    )
  }

  renderJobListingFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.onClickRetryJobs}
      >
        Retry
      </button>
    </div>
  )

  renderJobsListApiStatusView = () => {
    const {apiJobListStatus} = this.state

    switch (apiJobListStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      case apiStatusConstants.failure:
        return this.renderJobListingFailureView()

      case apiStatusConstants.success:
        return this.renderJobListingSuccessView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-bg-container">
          <div className="sm-device-search-bar">{this.renderSearchBar()}</div>
          <div className="left-side-container">
            {this.renderProfileApiStatusView()}
            {this.renderLeftSearchBar()}
          </div>
          <div className="right-side-container">
            <div className="md-device-search-bar">{this.renderSearchBar()}</div>
            {this.renderJobsListApiStatusView()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
