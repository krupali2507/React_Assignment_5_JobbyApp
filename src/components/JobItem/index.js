import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobItem = props => {
  const {jobDetail} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetail

  return (
    <Link to={`/jobs/${id}`} className="job-item-link">
      <li className="job-item-container">
        <div className="company-logo-title-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
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
          <div>{packagePerAnnum}</div>
        </div>
        <hr className="job-item-hr-line" />
        <h1 className="description-heading">Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
