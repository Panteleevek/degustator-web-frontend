
'use client'
import Navigation from "@/components/Navigation"
import ProfileEdit from "@/pages/ProfileEdit"
import { useSelector } from "@/store/hooks";

const Main = () =>  {
      const { currentUser } = useSelector((state) => state.auth);
    console.log('currentUser', currentUser)
      if(!currentUser?.id) return <div>Loading</div>
    return (
        <>
        <ProfileEdit user={currentUser}/>
        <Navigation />
        </>
    )
}

export default Main