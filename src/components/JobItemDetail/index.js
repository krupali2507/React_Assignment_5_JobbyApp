import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'
import SimilarJobCard from '../SimilarJobCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetail extends Component {
  state = {
    jobDetail: {},
    apiJobDetailStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getSpecificJobDetail()
  }

  getSpecificJobDetail = async () => {
    this.setState({apiJobDetailStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(jobDetailsApiUrl, options)

    if (response.ok === true) {
      const data = await response.json()

      console.log(data)

      const updatedJobDetailData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        id: data.job_details.id,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        title: data.job_details.title,
        packagePerAnnum: data.job_details.package_per_annum,
        location: data.job_details.location,
        rating: data.job_details.rating,
        skills: data.job_details.skills.map(eachSkill => ({
          name: eachSkill.name,
          imageUrl: eachSkill.image_url,
        })),
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        similarJobs: data.similar_jobs.map(eachSimilarJob => ({
          id: eachSimilarJob.id,
          companyLogoUrl: eachSimilarJob.company_logo_url,
          employmentType: eachSimilarJob.employment_type,
          jobDescription: eachSimilarJob.job_description,
          location: eachSimilarJob.location,
          rating: eachSimilarJob.rating,
          title: eachSimilarJob.title,
        })),
      }

      console.log(updatedJobDetailData)

      this.setState({
        jobDetail: updatedJobDetailData,
        apiJobDetailStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiJobDetailStatus: apiStatusConstants.failure})
    }
  }

  renderJobItemDetailSuccess = () => {
    const {jobDetail} = this.state

    const {
      title,
      companyWebsiteUrl,
      companyLogoUrl,
      employmentType,
      jobDescription,
      rating,
      packagePerAnnum,
      location,
      skills,
      lifeAtCompany,
      similarJobs,
    } = jobDetail

    console.log(skills)

    return (
      <div className="job-item-detail-bg-container">
        <div className="job-item-container">
          <div className="company-logo-title-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="title-rating-container">
              <h1 className="job-title">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="star-icon" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-salary-container">
            <div className="location-employment-container">
              <div className="location-container">
                <MdLocationOn /> <p>{location}</p>
              </div>
              <div className="location-container">
                <BsFillBriefcaseFill /> <p>{employmentType}</p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr className="job-item-hr-line" />
          <div className="website-visit-container">
            <h1 className="description-heading">Description</h1>
            <div className="visit-link-container">
              <a href={companyWebsiteUrl}>
                Visit
                <BiLinkExternal />
              </a>
            </div>
          </div>

          <p>{jobDescription}</p>
          <h1 className="description-heading">Skills</h1>
          <ul className="skill-list-container">
            {skills.map(eachSkill => {
              const {name, imageUrl} = eachSkill

              return (
                <div className="skill-item" key={eachSkill.name}>
                  <img src={imageUrl} alt={name} className="skill-icon" />
                  <p>{name}</p>
                </div>
              )
            })}
          </ul>
          <h1 className="description-heading">Life at Company</h1>
          <div className="life-at-company-container">
            <p>{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list-container">
          {similarJobs.map(eachSimilarJob => (
            <SimilarJobCard
              similarJobDetail={eachSimilarJob}
              key={eachSimilarJob.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetry = () => {
    this.getSpecificJobDetail()
  }

  renderJobItemDetailFailure = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="retry-btn" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderApiStatusView = () => {
    const {apiJobDetailStatus} = this.state

    switch (apiJobDetailStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      case apiStatusConstants.success:
        return this.renderJobItemDetailSuccess()

      case apiStatusConstants.failure:
        return this.renderJobItemDetailFailure()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderApiStatusView()}
      </>
    )
  }
}

export default JobItemDetail
