import './Profile.css';
import { useParams } from 'react-router-dom';

export default function Profile() {

    const { username } = useParams();
    return (
        <>
        {}
        <div className="profile-card">
            <div className="cover-photo">
            <div className="user-info">
                <h2>{username}</h2>
                <p>245 connections</p>
            </div>
            </div>

            <div className="tab-bar">
            <button className="tab">Details</button>
            <button className="tab">Skills</button>
            <button className="tab">Posts</button>  
            </div>
        </div>

        <div className="profile-section">
            <h3>About</h3>
            <p>
            Dedicated to advancing in tech industry through meaningful contributions to innovative
            projects and forward-thinking teams. Committed to refining technical expertise and eager
            to learn and embrace new challenges, and consistently delivering high-quality solutions
            that support organizational growth and technological advancement
            </p>
        </div>

        
        <div className="profile-section">
            <h3>Experience</h3>
            <ul>
            <li><strong>UX/UI Designer</strong> – JyotiTech (2012 – 2014)</li>
            <li><strong>SEO Intern</strong> – TechHub (2017 - 2019)</li>
            <li><strong>Front-End Developer</strong> – TechnoLab (2020 – 2023)</li>
            <li><strong>Front-End Developer</strong> – OfficeTech (2023 – present)</li>


            </ul>
        </div>

        {/* Skills Section */}
        <div className="profile-section">
            <h3>Skills</h3>
            <ul className="skills-list">
            <li>HTML/CSS</li>
            <li>Java</li>
            <li>React.js</li>
            <li>Python</li>
            <li>JavaScript</li>
            <li>Wireframing</li>
            <li>Database Management</li>
            </ul>
        </div>
        </>
    );
}