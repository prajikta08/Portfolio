import React from "react";

const BackGround = () => {
  return (
    <section className="absolute inset-0 -z-50">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('/assets/planet.jpeg')",
        }}
      ></div>

      {/* Optional Overlay for Dim Effect */}
      <div className="absolute inset-0 bg-black/85"></div>
    </section>
  );
};

export default BackGround;
