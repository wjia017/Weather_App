import React from "react";

const Icons = ({ src, alt, className }) => (
  <img
    src={src}
    alt={alt}
    className={`h-8 w-8 inline-block ${className}`}
  />
);

export const WindIcon = () => (
  <Icons src="/assets/wind.png" alt="Wind" className="powerful-pulse svg-hover" />
);

export const HumidityIcon = () => (
  <Icons src="/assets/humidity.png" alt="Humidity" className="powerful-pulse svg-hover" />
);

export const VisibilityIcon = () => (
  <Icons src="/assets/visibility.png" alt="Visibility" className="powerful-pulse svg-hover" />
);

export const SunriseIcon = () => (
  <Icons src="/assets/sunrise.png" alt="Sunrise" className="powerful-pulse svg-hover" />
);

export const SunsetIcon = () => (
  <Icons src="/assets/sunset.png" alt="Sunset" className="powerful-pulse svg-hover" />
);

export default Icons;
