import { useUser } from "@/context/UserProvider"
import { useEffect, useState } from "react"

export default function UserQueue(){

    const[avatar, setAvatar] = useState("")

    const { user } = useUser()
    console.log("USER VINDO DO CONTEXT",user)

    useEffect(() => {
        fetch("https://randomfox.ca/floof/").then(res => res.json()).then(data => setAvatar(data.image))
    }, [])


    return(
        <section>
          <div className="border-b-2 ">
            <div className="flex">
              <img className="w-12 h-12 object-fill"
                src={avatar}
                alt="Avatar photo"
              />
              <div>
                <p>{user?.name}</p>
              </div>
            </div>
          </div>
        </section>
    )
}