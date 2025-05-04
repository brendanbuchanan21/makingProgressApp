import './landingPage.css'
import historyImg from '../../images/histoyrImg.jpeg'
import planImg from '../../images/planImg.jpeg'
import workoutImg from '../../images/todayworkout.jpeg'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';





const LandingPageComponent = () => {

    const cardFeatures = [
        {
            title: "Make A Plan",
            emoji: "📝",
            image: planImg
        },
        {
            title: "Complete Daily Workouts",
            emoji: "🏋️",
            image: workoutImg
        },
        {
            title: "See Progress Over Time",
            emoji: "📈",
            image: historyImg
        }
    ]

    return (
        <section className='landing-page-section'>
            <div className='hero-section-container'>
                <div className='hero-header-div'>
                    <h1>TRACK YOUR WORKOUTS.⚡️</h1>
                    <h2>Visualize your progress</h2>
                </div>
                <div className='hero-buttons-div'>
                    <button className='landing-login-btn'>Login</button>
                    <button className='get-started-btn'>Get Started</button>
                </div>
            </div>

            <div className='card-section'>
                {cardFeatures.map((feature, index) => (
                    <div className='individual-card-container' key={index}>
                    <p>{feature.title}{feature.emoji}</p>
                    <div className='inner-card-border'>
                        <img src={feature.image} alt={feature.title} />
                    </div>
                </div>
                ))}
                
            </div>


                 {/* Mobile Carousel */}
            <div className='card-carousel'>
                <Swiper
                    modules={[Pagination]}
                    pagination={{ clickable: true }}
                    spaceBetween={20}
                    slidesPerView={1}
                >
                    {cardFeatures.map((feature, index) => (
                        <SwiperSlide key={index}>
                            <div className='individual-card-container'>
                                <p>{feature.title}{feature.emoji}</p>
                                <div className='inner-card-border'>
                                    <img src={feature.image} alt={feature.title} />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

           
        </section>
    )
}
export default LandingPageComponent;