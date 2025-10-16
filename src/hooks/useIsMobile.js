import { useEffect, useState } from 'react';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 750);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 750);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
};

export default useIsMobile;