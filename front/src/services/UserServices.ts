import { userViews } from "@/hooks/userViews";
import axios from "@/lib/axios";
import { NewUser } from "@/structures/users";

export function createUser(newUser: NewUser) {

    console.log(JSON.stringify(newUser))

    let endpoint = ""

    switch (newUser.Role) {
        case userViews.ADMIN:
            endpoint = "admin"
            break
        case userViews.INSTRUCTOR:
            endpoint = "instructor"
            break
        case userViews.STUDENT:
            endpoint = "student"
            break
        default:
            throw new Error("ERROR: user role was not valid")
    }

    //send the user off to be created at the backend
    return axios.post(endpoint, JSON.stringify(newUser))
      .then(r => r.data)
      .catch(err => {
        const msg = "ERROR: createUser: " + err
        console.error(msg)
        throw new Error(msg)
      })
}
