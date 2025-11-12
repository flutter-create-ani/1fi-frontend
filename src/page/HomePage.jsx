import React, { useEffect } from "react";
import HomeLayer from "../layer/HomeLayer";

export const HomePage = () => {
useEffect(() => {
    document.title = "Home | 1Fi";
    return () => {
        document.title = "1Fi";
    }
});
  return (
    <React.Fragment>
      <HomeLayer />
    </React.Fragment>
  )
}

export default HomePage;