import React from "react";

const RightSideBarLoading = () => {
  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
        </h3>

        <div className="mt-7 flex w-[300px] flex-col gap-9"></div>
      </div>
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Similar Minds</h3>
        <div className="mt-7 flex w-[300px] flex-col gap-10"></div>
      </div>
    </section>
  );
};

export default RightSideBarLoading;
