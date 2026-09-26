import { MutableRefObject, useEffect, useState } from "react";
import './animations.css';

type FloatingPageProps = {
    startY: number;
    endY: number;
    scrollRef: MutableRefObject<number>;
    children?: React.ReactNode;
  };

const FloatingPage = ({ startY, endY, scrollRef, children }: FloatingPageProps) => {
    const [hidden, setHidden] = useState(true);

    useEffect(() => {
        function checkHidden() {
            const isInRange = startY < scrollRef.current && scrollRef.current < endY;
            setHidden(!isInRange);
        }

        checkHidden();
        const id = setInterval(checkHidden, 10);
        return () => clearInterval(id); // cleanup on unmount / dep change
    }, [startY, endY, scrollRef])
    
    return (
        <>
        { !hidden &&
            <div className="flex justify-center items-stretch w-full h-full">
                <div id={`floating_page_${startY}`} className="relative w-full m-[5%] fade-in-right">
                    {children}
                </div>
            </div>
        }
        </>
    )
}

export default FloatingPage;
