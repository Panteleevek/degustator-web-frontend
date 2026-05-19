'use client'
import FeedCard from "@/components/FeedCard"
import Navigation from "@/components/Navigation";
import {
  useGetPostByIdQuery,
} from "@/services";
import { useParams } from 'next/navigation';
import { useMemo } from "react";

interface PageProps {
  params: {
    id: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const Main =  ({searchParams }: PageProps) =>  {
    const params = useParams();
    const post = useGetPostByIdQuery(params?.id, {skip: !params?.id})
    const currentPost=  useMemo(() => post?.data, [post])
    if(post?.isLoading){
        return (
            <div>loading</div>
        )
    }
  return (
        <>
        <FeedCard post={currentPost}/>
        <Navigation/>
        </>
    )
}

export default Main