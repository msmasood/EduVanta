"use client";

import { useState } from "react";
import CountUp from "react-countup";
import { InView } from "react-intersection-observer";

interface CountProps {
  number: number;
  text?: string;
  addStyle?: boolean;
}

/**
 * SSR-safe countup component. Uses InView to trigger animation when visible.
 */
const Count = ({ number, text, addStyle }: CountProps) => {
  const [focus, setFocus] = useState(false);

  return (
    <CountUp start={focus ? 0 : undefined} end={number} duration={2}>
      {({ countUpRef }) => (
        <div className={`d-flex ${addStyle ? "align-items-center justify-content-center" : ""}`}>
          <span ref={countUpRef} />
          <InView
            as="span"
            onChange={(inView) => {
              if (inView && !focus) setFocus(true);
            }}
          >
            {text ?? ""}
          </InView>
        </div>
      )}
    </CountUp>
  );
};

export default Count;
