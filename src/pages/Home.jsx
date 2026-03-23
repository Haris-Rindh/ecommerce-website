import React from "react";
import Herosection from "../components/home/herosection";
import Deals from "../components/home/deals";
import Homeitems from "../components/home/homeitems";
import Inquiry from "../components/home/Inquiry";
import Recommended_items from "../components/home/recommended_items";
import Extra_service from "../components/home/extra_service";
import Suppliers from "../components/home/suppliers";

const Home = () => {
  return (
    <div className="bg-gray-50">
      <Herosection />
      <Deals />
      <Homeitems />
      <Inquiry />
      <Recommended_items />
      <Extra_service />
      <Suppliers />
    </div>
  );
};

export default Home;