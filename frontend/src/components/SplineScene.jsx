import { useRef } from "react";
import Spline from "@splinetool/react-spline";

export default function SplineScene() {
  const splineRef = useRef();

  function onLoad(spline) {
    splineRef.current = spline;
    if (spline && spline.setZoom) {
      spline.setZoom(1);
    }
  }

  return (
    <div className="w-full relative group overflow-hidden rounded-full">
      <div className="w-full h-[80dvh] transition-transform duration-500 group-hover:scale-110">
        <div className="w-full h-[80dvh] scale-110">
          <Spline
            scene="https://prod.spline.design/g-DW0juYbIlS6oaU/scene.splinecode"
            onLoad={onLoad}
            style={{
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
