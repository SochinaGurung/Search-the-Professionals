import "./firstpage.css";
import Header from "./firstheader";
import Footer from "../footer/footer";
import { useNavigate } from "react-router-dom";
import professionalImg from "../../assets/professional.png";

export default function FirstPage() {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <section className="landing-hero">
        <div className="landing-hero-text">
          <h1>Your Shortcut to Skilled Professionals</h1>
          <p>One platform. Thousands of skilled professionals. Infinite possibilities.</p>
        </div>
        <img src={professionalImg} className="landing-hero-img" alt="Professional" />
      </section>
      <section className="landing-content">
        <div className="landing-about">
          <h2>Where Expertise Meets Opportunity</h2>
          <p>
            Discover a platform where talented professionals from every field are just a
            click away. Whether you're looking for developers, designers, consultants, or
            creatives, finding the right expert has never been easier. Connect, collaborate,
            and achieve your goals with the right people by your side.
          </p>
        </div>
        <div className="landing-actions">
          <button className="landing-action-btn" onClick={() => navigate("/Login")}>
            Search
          </button>
          <button className="landing-action-btn" onClick={() => navigate("/Login")}>
            Connect
          </button>
          <button className="landing-action-btn" onClick={() => navigate("/Register")}>
            Collaborate
          </button>
          <p className="landing-actions-hint">Search professionals by name, skill, or location.</p>
        </div>
      </section>
      <Footer />
    </>
  );
}
