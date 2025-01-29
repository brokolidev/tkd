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


export const useUserViews = () => {

    //this is what will eventually be exposed
    const [currentView, setCurrentView] = useState<userViews>(userViews.UNKNOWN);

    useEffect(() => {
      //pull out the value stored in local storage
      const storedView: userViews = parseInt(localStorage.getItem("tk_users_currentview") ?? "0")
    
      //check if the current view is unknown, if so, then we need to default to something
      if (currentView == userViews.UNKNOWN) {
        //if there is a stored value default to that.
        if (storedView != userViews.UNKNOWN) {
            setCurrentView(storedView)
        } else {
            //worst case scenario, default to student
            setCurrentView(userViews.STUDENT)
        }
      }

      //update the stored view, if it is not the same as the current view chosen
      if (currentView != storedView) {
        localStorage.setItem("tk_users_currentview", currentView.toString())
      }

    }, [currentView])

    return { currentView, setCurrentView }
}
