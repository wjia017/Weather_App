import React from 'react';

const Thunderstorm = '/assets/Thunderstorm.gif';
const Rain = '/assets/Rain.gif';
const SnowDay = '/assets/Snow.gif';
const ClearDay = '/assets/ClearDay.gif';
const ClearNight = '/assets/ClearNight.gif';
const CloudsDay = '/assets/CloudsDay.gif';
const CloudsNight = '/assets/CloudsNight.gif';
const Haze = '/assets/Haze.gif';
const video = '/assets/video1.mp4';

const WeatherBackground = ({ condition }) => {
    const gifs = {
        Thunderstorm,
        Drizzle: Rain,
        Rain,
        Snow: SnowDay,
        Clear: { day: ClearDay, night: ClearNight },
        Clouds: { day: CloudsDay, night: CloudsNight },
        Mist: Haze,
        Smoke: Haze,
        Haze,
        Fog: Haze,
        default: video
    };
    const getBackground = () => {
        if (!condition) return gifs.default;
        const weatherType = condition.main;
        const asset = gifs[weatherType];

        if (!asset) return gifs.default;
        if (typeof asset === 'object')
            return condition.isDay ? asset.day : asset.night;
        return asset;
    }

    const background = getBackground();
    return (
        <div className='fixed inset-0 z-0 overflow-hidden'>
            {background === video ? (
                <video autoPlay loop muted className=' w-full h-full object-cover opacity-100 pointer-events-none 
                animate-fade-in'>
                    <source src={video} type='video/mp4' />
                </video>
            ) : (
                <img src={background} alt='Weather-bg' className='w-full h-full object-cover opacity-100 pointer-events-none 
                animate-fade-in'/>
            )}
            <div className='absolute inset-0 bg-black/30'>
            </div>
        </div>
    )
}
export default WeatherBackground