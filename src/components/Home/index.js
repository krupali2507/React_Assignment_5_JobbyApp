import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-bg-container">
      <div className="home-content">
        <h1 className="home-heading">Find The Job That Fits Your Life</h1>
        <p className="home-desc">
          Millions of people are searching for jobs,salary information,company
          reviews. Find the jobs that fits your ability and potentials.
        </p>
        <Link to="/jobs">
          <button type="button" className="find-jobs-btn">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </>
)

export default Home