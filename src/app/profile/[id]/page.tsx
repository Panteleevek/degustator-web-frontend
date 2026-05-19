"use client";
import Navigation from "@/components/Navigation";
import Profile from "@/pages/Profile";
import { useGetUserProfileQuery } from "@/services";
import { useParams } from "next/navigation";

const Main = () => {
  const params = useParams();
  return (
    <>
      <Profile id={params?.id} />
      <Navigation />
    </>
  );
};

export default Main;
