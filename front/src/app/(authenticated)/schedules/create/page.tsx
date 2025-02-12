'use client'

import { Alert, AlertActions, AlertDescription, AlertTitle } from '@/components/alert'
import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Heading, Subheading } from '@/components/heading'
import { Input } from '@/components/input'
import { Link } from '@/components/link'
import { Select } from '@/components/select'
import { ChevronLeftIcon, PlusIcon, MinusIcon } from '@heroicons/react/16/solid'
import { useState, useEffect } from 'react'
import { getInstructors } from '@/services/instructorServices'
import { getStudents } from '@/services/studentServices'
import axios from "axios"
import { Avatar } from '@/components/avatar'
import ImageUpload from '@/components/image'
// using enum for days of the week
enum DaysOfWeek {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

const daysArray = Object.values(DaysOfWeek);

interface TimeSlot {
  day: DaysOfWeek | "";
  startTime: string;
  endTime: string;
}

export default function SchedulecreatePage() {
  const [isCreated, setIsCreated] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [selectedInstructors, setSelectedInstructors] = useState<any[]>([]);

  useEffect(() => {
    fetchCustomers();
    fetchInstructors();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await getStudents(1);
      
      // Extract the actual student list from 'users'
      const studentData = response.data;
  
      if (Array.isArray(studentData)) {
        const formattedCustomers = studentData.map((student: any) => ({
          id: student.id,
          name: student.getFullName ? student.getFullName() : `${student.firstName} ${student.lastName}`,
          email: student.email || "",
          profileImgUrl: student.profileImgUrl || "",
        }));
        setCustomers(formattedCustomers);
      } else {
        console.error("Unexpected response format: Missing 'users' array", response);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  
  

  const fetchInstructors = async () => {
    try {
      const response = await getInstructors(1);
      
      // Extract the actual instructor list from 'users'
      const instructorData = response.data;
  
      if (Array.isArray(instructorData)) {
        const formattedInstructors = instructorData.map((instructor: any) => ({
          id: instructor.id,
          name: `${instructor.firstName} ${instructor.lastName}`,
          profileImgUrl: instructor.profileImgUrl || "",
        }));
        setInstructors(formattedInstructors);
      } else {
        console.error("Unexpected response format: Missing 'users' array", response);
      }
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };
  
  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { day: "", startTime: "", endTime: "" }]);
  };

  const handleRemoveTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const handleTimeSlotChange = (index: number, field: keyof TimeSlot, value: string) => {
    const updatedTimeSlots = [...timeSlots];
    updatedTimeSlots[index][field] = value as any;
    setTimeSlots(updatedTimeSlots);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      className: formData.get("class_name"),
      timeSlots,
      instructors: selectedInstructors.map((inst) => inst.id),
      customers: selectedCustomers.map((cust) => cust.id),
    };

    try {
      const res = await createSchedule(data);
      if (res.status === 204) {
        setIsCreated(true);
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
    }
  };
// handling the creation of a new schedule
  const createSchedule = async (data: any) => {
    try {
      return await axios.post("/api/schedules", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error;
    }
  };
  // handling all the instructor selection and removal stuff
  const handleInstructorSelection = (instructor: any) => {
    const isSelected = selectedInstructors.find((inst) => inst.id === instructor.id);
    if (isSelected) {
      setSelectedInstructors(selectedInstructors.filter((inst) => inst.id !== instructor.id));
    } else {
      setSelectedInstructors([...selectedInstructors, instructor]);
    }
  };

  const getInstructorClassName = (instructorId: number) => {
    return selectedInstructors.find((inst) => inst.id === instructorId)
      ? "bg-grey-100"
      : "hover:bg-gray-200";
  };

// handling all the customer selctiona dn removal stuff
  const handleCustomerSelection = (customer: any) => {
    const isSelected = selectedCustomers.find((cust) => cust.id === customer.id);
    if (isSelected) {
      setSelectedCustomers(selectedCustomers.filter((cust) => cust.id !== customer.id));
    } else {
      setSelectedCustomers([...selectedCustomers, customer]);
    }
  };
  const getCustomerClassName = (customerId: number) => {
    return selectedCustomers.find((cust) => cust.id === customerId)
      ? "bg-grey-100"
      : "hover:bg-gray-200";
  };
    
  return (
    <>
      <div className="max-w-full max-h-full ">
      <Alert open={isCreated} onClose={setIsCreated}>
        <AlertTitle>Congratulations!</AlertTitle>
        <AlertDescription>A new schedule has been created</AlertDescription>
        <AlertActions>
          <Link href="/schedules">
            <Button onClick={() => setIsCreated(false)}>Sounds Good!</Button>
          </Link>
        </AlertActions>
      </Alert>

      <div className="max-lg:hidden">
        <Link href="/schedules" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 ">
          <ChevronLeftIcon className="size-4 fill-zinc-400 " />
          Schedule
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 lg:mt-8">
        <Heading>Create a new schedule</Heading>
        <Divider className="my-10 w-full" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
  <div>
    <Subheading>Class Name</Subheading>
  </div>
  <div>
    <Input aria-label="Class Name" name="class_name" placeholder="Little Warrior 1" />
  </div>

  <div>
    <Subheading>Class Description</Subheading>
  </div>
  <div>
    <textarea
      aria-label="Class Description"
      name="class_description"
      placeholder="Enter a description for the class"
      className="w-full p-2 border rounded-md h-11"
      rows={4}
    />
  </div>

  <div> {/*OpenAI, "Custom implementation for image upload 
            in a user management system,"
          ChatGPT-generated response, Jan. 27, 2025.  */}
    <Subheading>Class Image</Subheading>
  </div>
  <div>
  <ImageUpload />
  </div>
</section>
        <Divider className="my-10 w-full" />


          {/* Time slot  */}
          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2 items-start">
            <div className="flex items-center gap-3">
              <Subheading>Time Slots</Subheading>
              <Button type="button" onClick={handleAddTimeSlot} className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {timeSlots.map((timeSlot, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 items-center mb-4">
                  <Select
                    aria-label="Day"
                    value={timeSlot.day}
                    onChange={(e) => handleTimeSlotChange(index, "day", e.target.value)}
                  >
                    <option value="">Select Day</option>
                    {daysArray.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </Select>

                  <Input
                    type="time"
                    aria-label="Start Time"
                    value={timeSlot.startTime}
                    onChange={(e) => handleTimeSlotChange(index, "startTime", e.target.value)}
                  />
                  <Input
                    type="time"
                    aria-label="End Time"
                    value={timeSlot.endTime}
                    onChange={(e) => handleTimeSlotChange(index, "endTime", e.target.value)}
                  />
                  <Button type="button" onClick={() => handleRemoveTimeSlot(index)} className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>



        <Divider className="my-10 w-full" />

     {/* Instructors Selection */}
     <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <Subheading>Instructors</Subheading>
            </div>
            <div className="max-h-64 overflow-y-auto border rounded-md p-4 bg-gray-50">
              {instructors.length > 0 ? (
                instructors.map((instructor: any) => (
                  <div
                    key={instructor.id}
                    className={`p-4 rounded-md cursor-pointer ${getInstructorClassName(instructor.id)}`}
                    onClick={() => handleInstructorSelection(instructor)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar src={instructor.profileImgUrl} className="size-6" />
                      <span className="font-medium">{instructor.name}</span>
                    </div>
                    <Divider className="mt-2" />
                  </div>
                ))
              ) : (
                <p>No instructors available</p>
              )}
            </div>
          </section>

                  <Divider className="my-10 w-full" />


          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <Subheading className="text-lg font-semibold text-gray-700">Customers</Subheading>
            </div>
            <div className="max-h-64 overflow-y-auto border rounded-md p-4 bg-gray-50">
              {customers.length > 0 ? (
                customers.map((customer: any) => (
                  <div
                    key={customer.id}
                    className={`p-4 rounded-md cursor-pointer ${getCustomerClassName(customer.id)}`}
                    onClick={() => handleCustomerSelection(customer)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar src={customer.profileImgUrl} className="w-12 h-12 rounded-full" />
                      <div>
                        <span className="text-lg font-semibold">{customer.name}</span>
                        <p className="text-sm text-gray-500 mt-1">{customer.email}</p>
                      </div>
                    </div>
                    <Divider className="mt-4" />
                  </div>
                ))
              ) : (
                <p>No customers available</p>
              )}
            </div>
          </section>


        <Divider className="my-10 w-full" />

        <div className="flex justify-end gap-4">
          <Button type="reset"  className="cursor-pointer bg-red-600 text-white">
            Delete
          </Button>
          <Button type="submit" className="cursor-pointer bg-black text-white">
            Save Chnages
          </Button>
        </div>
      </form>
      </div>
    </>
  )
}
