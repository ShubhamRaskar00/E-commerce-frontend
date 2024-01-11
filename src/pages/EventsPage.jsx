import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";

const EventsPage = ({ updateProgress }) => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  useEffect(() => {
    updateProgress(99);
    setTimeout(()=>{
      updateProgress(100);
    }) // Set progress to 70%
  }, []);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          <EventCard active={true} data={allEvents && allEvents[0]} />
        </div>
      )}
    </>
  );
};

export default EventsPage;
