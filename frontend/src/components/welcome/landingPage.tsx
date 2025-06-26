import { Calendar, TrendingUp, Dumbbell, ArrowRight, CheckCircle } from 'lucide-react';
import 'swiper/swiper-bundle.css';
import './landingPage.css'
import { useNavigate } from 'react-router-dom';








const LandingPageComponent = () => {

const navigate = useNavigate();

const features = [
    {
      title: "Smart Planning",
      description: "Create personalized workout plans tailored to your goals and schedule",
      icon: Calendar,
      image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Daily Workouts",
      description: "Follow guided workouts with real-time tracking and form corrections",
      icon: Dumbbell,
      image: "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Progress Analytics",
      description: "Visualize your fitness journey with detailed progress tracking and insights",
      icon: TrendingUp,
      image: "/another-chart.jpg"
    }
  ];

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-brand">
              <div className="nav-logo">
                <Dumbbell className="nav-logo-icon" />
              </div>
              <span className="nav-title">makingProgress</span>
            </div>
            <div className="nav-buttons">
              <button className="nav-login-btn" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="nav-get-started-btn" onClick={() => navigate("/signup")}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-pattern"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-text-content">
                <h1 className="hero-title">
                  TRACK YOUR
                  <span className="hero-title-gradient">
                    WORKOUTS⚡️
                  </span>
                </h1>
                <p className="hero-description">
                  Transform your fitness journey with intelligent workout tracking, 
                  personalized plans, and detailed progress visualization.
                </p>
              </div>
              
              <div className="hero-buttons">
                <button className="hero-primary-btn" onClick={() => navigate("/signup")}>
                  <span>Get Started</span>
                  <ArrowRight className="hero-btn-icon" />
                </button>
                <button className="hero-secondary-btn" onClick={() => navigate("/login")}>
                  <span>Login</span>
                </button>
              </div>
            </div>

            <div className="hero-image-container">
              <div className="hero-image-wrapper">
                <img 
                  src="https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Fitness tracking app interface"
                  className="hero-image"
                />
              </div>
              <div className="hero-blur-1"></div>
              <div className="hero-blur-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">
              Everything you need to succeed
            </h2>
            <p className="features-description">
              Comprehensive tools designed to help you achieve your fitness goals and track your progress effectively.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-image-container">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="feature-image"
                  />
                </div>
                
                <div className="feature-content">
                  <div className="feature-header">
                    <div className="feature-icon-container">
                      <feature.icon className="feature-icon" />
                    </div>
                    <h3 className="feature-title">{feature.title}</h3>
                  </div>
                  
                  <p className="feature-description">{feature.description}</p>
                  
                  <button className="feature-learn-more" onClick={() => navigate("/signup")}>
                    <span>Learn more</span>
                    <ArrowRight className="feature-arrow" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="benefits-container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2 className="benefits-title">
                Why choose makingProgress?
              </h2>
              <p className="benefits-description">
                Built with simplicity and effectiveness in mind, our app helps you stay consistent and motivated on your fitness journey.
              </p>
              
              <div className="benefits-list">
                {[
                  "Easy-to-use interface designed for daily use",
                  "Comprehensive progress tracking and analytics",
                  "Personalized workout plans that adapt to your goals",
                  "Visual progress reports to keep you motivated"
                ].map((benefit, index) => (
                  <div key={index} className="benefit-item">
                    <CheckCircle className="benefit-icon" />
                    <span className="benefit-text">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="benefits-image-container">
              <img 
                src="/bar-graph-img.png" 
                alt="Progress tracking visualization"
                className="benefits-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <h2 className="cta-title">
            Ready to start making progress?
          </h2>
          <p className="cta-description">
            Begin your fitness journey today with our simple and effective tracking tools
          </p>
          <div className="cta-buttons">
            <button className="cta-primary-btn" onClick={() => navigate('/signup')}>
              Get Started
            </button>
            <button className="cta-secondary-btn" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <Dumbbell className="footer-logo-icon" />
              </div>
              <span className="footer-title">makingProgress</span>
            </div>
            <div className="footer-copyright">
              © 2024 makingProgress. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPageComponent