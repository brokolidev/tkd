import { useEffect, useState } from "react"

/**
 * Helps to determine the current view of the Users screen
 */
export enum userViews {
  UNKNOWN,
  ADMIN,
  INSTRUCTOR,
  STUDENT
}


// modified with help from: https://chatgpt.com/share/679a611a-d6bc-800c-b646-e04fd1a40c17
export const useUserViews = () => {

    //this is what will eventually be exposed
    const [currentView, setCurrentView] = useState<userViews>(() => {
        //get the value from local storage if there is anythig
        const storedView = parseInt(localStorage.getItem("tk_users_currentview") ?? "0")
        //return the value pulled. default to student if there's nothing.
        return storedView !== userViews.UNKNOWN ? storedView : userViews.STUDENT
    })

    useEffect(() => {
      //set the value in local storage
      if (parseInt(localStorage.getItem("tk_users_currentview") ?? "0") !== currentView) {
        localStorage.setItem("tk_users_currentview", currentView.toString())
      }
    }, [currentView])

    return { currentView, setCurrentView }
}
