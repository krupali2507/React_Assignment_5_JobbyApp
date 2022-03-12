import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobCard = props => {
  const {similarJobDetail} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobDetail

  return (
    <li className="similar-job-item-container">
      <div className="logo-title-rating-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company-logo"
        />
        <div>
          <h1 className="job-title">{title}</h1>
          <div className="rating-container">
            <AiFillStar className="star-icon" /> <p>{rating}</p>
          </div>
        </div>
      </div>
      <h1>Description</h1>
      <p>{jobDescription}</p>
      <div className="location-employment-container">
        <div className="location-container">
          <MdLocationOn /> <p>{location}</p>
        </div>
        <div className="location-container">
          <BsFillBriefcaseFill /> <p>{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobCard
