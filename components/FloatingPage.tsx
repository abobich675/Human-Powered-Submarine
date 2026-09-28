import { MutableRefObject, useEffect, useState } from "react";
import './animations.css';

type FloatingPageProps = {
    startY: number;
    endY: number;
    scrollRef: MutableRefObject<number>;
    children?: React.ReactNode;
  };

const FloatingPage = ({ startY, endY, scrollRef, children }: FloatingPageProps) => {
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        function checkHidden() {
            const inRange = startY < scrollRef.current && scrollRef.current < endY;

            setVisible(inRange);
            if (inRange)
                setMounted(true)
            else if (visible)
                setTimeout(() => setMounted(false), 2000);
        }

        checkHidden();
        const id = setInterval(checkHidden, 10);
        return () => clearInterval(id); // cleanup on unmount / dep change
    }, [startY, endY, scrollRef, visible])

    if (!mounted)
        return null;

    return (
        <div className="flex justify-center items-stretch w-full h-full">
            <div id={`floating_page_${startY}`}
                className={`relative w-full m-[5%] ${visible ? 'fade-in-right' : 'fade-out-right'}`}>
                {children}
            </div>
        </div>
    )
}

export default FloatingPage;
