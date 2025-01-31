import axios from "@/lib/axios";
import { NewUser } from "@/structures/users";

export function createUser(newUser: NewUser) {

    console.log(JSON.stringify(newUser))

    //send the user off to be created at the backend
    return axios.post('student', JSON.stringify(newUser))
      .then(r => r.data)
      .catch(err => {
        const msg = "ERROR: createUser: " + err
        console.error(msg)
        throw new Error(msg)
      })
}
