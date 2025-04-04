import { userViews } from "@/hooks/userViews";
import axios from "@/lib/axios";
import { IUser, NewUser } from "@/structures/users";

export function createUser(newUser: NewUser) {

    console.log(JSON.stringify(newUser))

    let endpoint = ""

    switch (newUser.Role) {
        case userViews.ADMIN:
            endpoint = "admins"
            break
        case userViews.INSTRUCTOR:
            endpoint = "instructors"
            break
        case userViews.STUDENT:
            endpoint = "students"
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

export function updateUser(updatedUser: IUser) {

    console.log(updatedUser.dateOfBirth)

    //send the user off to be created at the backend
    return axios.put("users/" + updatedUser.id, JSON.stringify({
        ...updatedUser,
        dateOfBirth: updatedUser.dateOfBirth.toISOString().split('T')[0] 
    }))
      .then(r => r.data)
      .catch(err => {
        const msg = "ERROR: updateUser: " + err
        console.error(msg)
        throw new Error(msg)
      })
}

export function deleteUser(id: number) {
    //send the user off to be deleted
    return axios.delete("users/" + id)
        .catch(err => {
            console.log("ERROR: deleteUser: " + err)
            throw new Error("ERROR: deleteUser: " + err)
        })
}
