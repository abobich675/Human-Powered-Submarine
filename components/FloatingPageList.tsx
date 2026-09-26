import { MutableRefObject, useEffect, useState } from "react";
import FloatingPage from "./FloatingPage";

type FloatingPageListProps = {
    start?: number;
    verticalSize?: number;
    gap?: number;
    scrollRef: MutableRefObject<number>;
    items: React.ReactNode[];
  };

const FloatingPageList = ({ start=10, verticalSize=1000, gap=10, scrollRef, items }: FloatingPageListProps) => {

    return (
        <>
            {items.map((item, index) => {
                const itemStart = start + ((verticalSize + gap) * index)
                const itemEnd = start + ((verticalSize + gap) * index) + verticalSize
                
                return (
                    <div key={index} className="fixed w-full h-full" >
                        <FloatingPage startY={itemStart} endY={itemEnd} scrollRef={scrollRef}>
                            {item} 
                        </FloatingPage>
                    </div>
                )
            })}
        </>
    )
}

export default FloatingPageList;