import React from "react";

const Test = ({ name }: { name: string }) => {
  console.log("I'm test component", name);

  return <div></div>;
};

export default Test;
