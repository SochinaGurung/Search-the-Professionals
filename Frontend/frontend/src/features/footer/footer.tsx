import "./footer.css";
import facebookIcon from '../../assets/facebook-icon.png';
import linkedinIcon from '../../assets/linkedin-icon.png';

export default function Footer(){
    return(
        <>
            <div className="footer-container">
                <div className="footer-about">
                    <h3>FindProfessionals</h3>
                    <p>Your shortcut to the trusted professionals - anywhere, anytime.</p>
                </div>
                <div className="our-contact">
                    <h4>Contact</h4>
                    <p>Email: <a href="mailto:support@findmepro.com">support@findmepro.com</a></p>
                    <p>Phone: +977 9800000000</p>
                </div>
                <div className="social-icons">
                    <h3>Our Socials</h3>
                    <div className="ughh">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="icon">
                        <img src={facebookIcon} alt="Facebook" />
                    </a>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="icon">
                        <img src={linkedinIcon} alt="LinkedIn" />
                    </a>
                    </div>
                </div>
            </div>  
            <div className="footer-bottom">
                <p>© 2025 FindProfessionals. All rights reserved.</p>
            </div>     
        </>
    )
}