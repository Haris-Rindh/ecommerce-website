import React, {useState, useEffect} from 'react'

const Countdown = ({ initialTime }) => {
    const  [time, setTime] = useState(initialTime);

    useEffect(() => {
        if (time <= 0) {
            return;
        }

        const timerId = setInterval(() => {
            setTime((prevTime) => prevTime- 1000);
        }, 1000);

        return () => clearInterval(timerId);
    }, [time]);

        const days = Math.floor(time / (1000 * 60 * 60 * 24));
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((time / 1000 / 60 % 60));
        const seconds = Math.floor((time / 1000) % 60);

        const padDigit = (num) => num.toString().padStart(2, '0');
        
        
        return (
            <div className='flex gap-1.5 mt-1'>
                <TimeBlock number={padDigit(days)} label="Days" />
                <TimeBlock number={padDigit(hours)} label="Hours" />
                <TimeBlock number={padDigit(minutes)} label="Min" />
                <TimeBlock number={padDigit(seconds)} label="Sec" />
            </div>
        );
    };

    function TimeBlock({number, label}) {
        return (
            <div className="w-11 h-[50px] bg-[#606060] text-white flex flex-col items-center justify-center rounded">
                <span className='font-bold text-lg leading-none'>{number}</span>
                <span className='text-[11px] leading-tight'>{label}</span>
            </div>
        )
    }

export default Countdown
