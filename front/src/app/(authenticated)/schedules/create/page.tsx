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
import ImageUpload from '@/components/image'
import {ISchedule} from "@/structures/schedule";
import {Badge, BadgeButton} from "@/components/badge";
import {Dialog, DialogActions, DialogDescription, DialogTitle} from "@/components/dialog";
import {Description, Field, Label} from "@/components/fieldset";
import * as Headless from '@headlessui/react'
import {Listbox, ListboxLabel, ListboxOption} from "@/components/listbox";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/table";
import {Avatar} from "@/components/avatar";
import {getTimeSlots} from "@/services/tmeSlotServices";
import {Monda} from "next/dist/compiled/@next/font/dist/google";
import {Checkbox, CheckboxField, CheckboxGroup} from "@/components/checkbox";
import {getAllInstructors, getInstructors} from "@/services/instructorServices";

export default function CreateSchedulePage() {
  const [isCreated, setIsCreated] = useState(false)
  const [formData, setFormData] = useState<ISchedule | null>(null)
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [isSaveOpen, setIsSaveOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [instructors, setInstructors] = useState([])
  const [timeslots, setTimeslots] = useState([]);
  const [timeslotComponents, setTimeslotComponents] = useState([])
  const [selectedTimeslots, setSelectedTimeslots] = useState([])

  async function loadTimeslots(): Promise<void> {
    const timeslots = await getTimeSlots();
    setTimeslots(timeslots)
    setTimeslotComponents([
      [ "Monday", timeslots.length > 0 ? timeslots[0].id : null]
    ])
    setSelectedTimeslots([
      ["Monday", 1],
    ]);
  }
  
  async function loadInstructors(): Promise<void> {
    const instructorData = await getAllInstructors();
    setInstructors(instructorData.data)
  }

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ]

  const handleDOWSelect = (e, idx) => {
    selectedTimeslots[idx][0] = e
    setSelectedTimeslots(selectedTimeslots)
  }

  const handleTimeslotSelect = (e, idx) => {
    selectedTimeslots[idx][1] = e
    setSelectedTimeslots(selectedTimeslots)
  }

  const handleReset = () => {
    setFormData(null)
    setIsResetOpen(false)
  }
  
  const addTimeslotComponent = () => {
    setTimeslotComponents([
      ...timeslotComponents,
      [
        "Monday",
        timeslots.length > 0 ? timeslots[0].id : null
      ]
    ])
    setSelectedTimeslots([
      ...selectedTimeslots,
      ["Monday", 1]
    ])
  }

  const removeTimeslotComponent = (componentId) => {
    const components = timeslotComponents.filter((val, idx) => idx !== componentId)
    setTimeslotComponents(components)
    const selected = selectedTimeslots.filter((val, idx) => idx !== componentId)
    setSelectedTimeslots(selected)
    console.table(selectedTimeslots)
  }

  const handleSubmit = async (event?: React.FormEvent) => {
    return false;
  }

  useEffect(() => {
    loadTimeslots();
    loadInstructors();
  }, [])

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-full">

      <Link href="/schedules" className="max-lg:hidden inline-flex items-center gap-2 text-sm/6 text-zinc-500 ">
        <ChevronLeftIcon className="size-4 fill-zinc-400 " />
        Schedule
      </Link>
      
      <Heading className="mt-4">Create a new schedule</Heading>
      <Divider className="my-10 mt-6" />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Class Name</Subheading>
        </div>
        <div>
          <Input
            aria-label="Class Name"
            name="className"
            placeholder="Little Warrior 1"
            onChange={(e) => setFormData({ ...formData, className: e.target.value })}
          />
        </div>
      </section>

      <Divider className="my-6" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Class Description</Subheading>
        </div>
        <div>
          <Input
            aria-label="Class Description"
            name="description"
            placeholder="Enter a description for the class"
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </section>

      <Divider className="my-6" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Class Image</Subheading>
        </div>
        <div>
          <ImageUpload />
        </div>
      </section>
      
      <Divider className="my-10" />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2 items-start">
        <div className="flex items-center gap-3">
          <Subheading>Time Slots</Subheading>
          <BadgeButton color="blue" onClick={addTimeslotComponent}>
            + Add
          </BadgeButton>
        </div>
        <div>
            {timeslotComponents.map((value, compIdx) => (
              <Headless.Field className="flex items-baseline justify-center gap-6 mb-4" key={compIdx}>
                <Listbox name="dows[]" 
                         onChange={(e) => handleDOWSelect(e, compIdx)} 
                         defaultValue={value[0]} className="max-w-48">
                  {daysOfWeek.map((day, index: number) => (
                    <ListboxOption<string> value={day} key={index}>
                      <ListboxLabel>{day}</ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
                <Listbox name="timeslots[]" onChange={(e) => handleTimeslotSelect(e, compIdx)}
                         defaultValue={value[1]} className="max-w-48">
                  {timeslots.map((timeslot) => (
                    <ListboxOption value={timeslot.id} key={timeslot.id}>
                      <ListboxLabel>{timeslot?.startsAt.replace(/:00$/, '')} ~ {timeslot?.endsAt.replace(/:00$/, '')}</ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
                <BadgeButton color="red" onClick={() => removeTimeslotComponent(compIdx)}>Remove</BadgeButton>
              </Headless.Field>
            ))}
        </div>
      </section>

      <Divider className="my-10" />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2 items-start">
        <div className="flex items-center gap-3">
          <Subheading>Instructors</Subheading>
        </div>
        <fieldset className="pl-4">
          {instructors.length > 0 && instructors.map((value, idx) => (
            <div className="space-y-5" key={idx}>
              <div className="flex gap-3">
                <div className="flex h-6 shrink-0 items-center">
                  <div className="group grid size-4 grid-cols-1">
                    <input
                      defaultChecked={idx == 0}
                      id="comments"
                      name="comments"
                      type="checkbox"
                      aria-describedby="comments-description"
                      className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                    />
                    <svg
                      fill="none"
                      viewBox="0 0 14 14"
                      className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                    >
                      <path
                        d="M3 8L6 11L11 3.5"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-0 group-has-[:checked]:opacity-100"
                      />
                      <path
                        d="M3 7H11"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-0 group-has-[:indeterminate]:opacity-100"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-sm/6">
                  <label htmlFor="comments" className="font-medium text-gray-900">
                    {`${value.firstName} ${value.lastName}`}
                  </label>
                </div>
              </div>
            </div>
          ))}
        </fieldset>
      </section>

      <Divider className="my-10" />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2 items-start">
        <div className="flex items-center gap-3">
          <Subheading>Students</Subheading>
        </div>
        <Table className="[--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.handle}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar src={user.avatarUrl} className="size-12" />
                    <div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {user.online ? <Badge color="lime">Online</Badge> : <Badge color="zinc">Offline</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <Divider className="my-10" />

      <div className="flex justify-end gap-4">
        <Button color="red" className="cursor-pointer"
                onClick={() => setIsResetOpen(true)}>
          Reset
        </Button>

        <Button className="cursor-pointer text-white bg-black" 
                onClick={() => setIsSaveOpen(true)}>
          Save Changes
        </Button>
      </div>
      

      <Alert open={isCreated} onClose={setIsCreated}>
        <AlertTitle>Congratulations!</AlertTitle>
        <AlertDescription>A new schedule has been created</AlertDescription>
        <AlertActions>
          <Link href="/schedules">
            <Button onClick={() => setIsCreated(false)}>Sounds Good!</Button>
          </Link>
        </AlertActions>
      </Alert>

      <Dialog open={isResetOpen} onClose={() => setIsResetOpen(false)}>
        <DialogTitle>Reset</DialogTitle>
        <DialogDescription>Want to reset the current settings?</DialogDescription>
        <DialogActions>
          <Button plain onClick={() => setIsResetOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleReset}>Reset</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isSaveOpen} onClose={() => setIsSaveOpen(false)}>
        <DialogTitle>Save Changes</DialogTitle>
        <DialogDescription>Want to save your changes?</DialogDescription>
        <DialogActions>
          <Button plain onClick={() => setIsSaveOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}
