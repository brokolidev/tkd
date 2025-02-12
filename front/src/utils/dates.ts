export const buildDate = (dateString: string) => {

    //pull out the different parts of the date, to set to the new date
    const [year, month, day] = dateString.split('-').map(part => parseInt(part))

    const newDate = new Date(year, month - 1, day)
    
    return newDate
}

export const formatDate = (date: Date) => {
    return date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + 
      date.getDate().toString().padStart(2, "0")
}
