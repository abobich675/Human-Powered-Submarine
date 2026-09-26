import { MutableRefObject, useEffect, useState } from "react";

type FloatingPageProps = {
    startY: number;
    endY: number;
    scrollRef: MutableRefObject<number>;
    children?: React.ReactNode;
  };

const FloatingPage = ({ startY, endY, scrollRef, children }: FloatingPageProps) => {
    const [hidden, setHidden] = useState(true);

    function checkHidden() {
        if (startY < scrollRef.current && scrollRef.current < endY)
            setHidden(false)
        else
            setHidden(true)
    }

    useEffect(() => {
        setInterval(checkHidden, 100);
    }, [])

    return (
        <>
        { !hidden &&
            <div className="flex justify-center items-stretch w-full h-full">
                <div className="w-full m-[5%]">
                    {children}
                </div>
            </div>
        }
        </>
    )
}

export default FloatingPage;
