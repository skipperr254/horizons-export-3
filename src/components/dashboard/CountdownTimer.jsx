import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const getNextMidnight = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };

  const calculateTimeLeft = () => {
    const difference = +getNextMidnight() - +new Date();
    let timeLeft = { hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => String(time).padStart(2, '0');

  return (
    <div className="text-4xl font-bold tracking-widest text-shadow-lg">
      <span>{formatTime(timeLeft.hours)}</span>:
      <span>{formatTime(timeLeft.minutes)}</span>:
      <span>{formatTime(timeLeft.seconds)}</span>
    </div>
  );
};

export default CountdownTimer;