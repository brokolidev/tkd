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
import {Field, Label} from "@/components/fieldset";
import * as Headless from '@headlessui/react'
import {Listbox, ListboxLabel, ListboxOption} from "@/components/listbox";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/table";
import {Avatar} from "@/components/avatar";


export default function CreateSchedulePage() {
  const [isCreated, setIsCreated] = useState(false)
  const [formData, setFormData] = useState<ISchedule | null>(null)
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [isSaveOpen, setIsSaveOpen] = useState(false)
  const [users, setUsers] = useState([])

  useEffect(() => {
    
  }, []);


  const handleReset = () => {
    setFormData(null)
    setIsResetOpen(false)
  }

  const handleSubmit = async (event?: React.FormEvent) => {
    return false;
  }

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
          <BadgeButton color="blue" onClick={() => null}>
            + Add
          </BadgeButton>
        </div>
        <div>
          <Headless.Field className="flex items-baseline justify-center gap-6">
              <Listbox name="status" defaultValue="active" className="max-w-48">
                <ListboxOption value="active">
                  <ListboxLabel>Active</ListboxLabel>
                </ListboxOption>
                <ListboxOption value="paused">
                  <ListboxLabel>Paused</ListboxLabel>
                </ListboxOption>
                <ListboxOption value="delayed">
                  <ListboxLabel>Delayed</ListboxLabel>
                </ListboxOption>
                <ListboxOption value="canceled">
                  <ListboxLabel>Canceled</ListboxLabel>
                </ListboxOption>
              </Listbox>
            
              <Listbox name="status" defaultValue="active" className="max-w-48">
                <ListboxOption value="active">
                  <ListboxLabel>Active</ListboxLabel>
                </ListboxOption>
                <ListboxOption value="paused">
                  <ListboxLabel>Paused</ListboxLabel>
                </ListboxOption>
                <ListboxOption value="delayed">
                  <ListboxLabel>Delayed</ListboxLabel>
                </ListboxOption>
                <ListboxOption value="canceled">
                  <ListboxLabel>Canceled</ListboxLabel>
                </ListboxOption>
              </Listbox>
            
            <BadgeButton color="red">Remove</BadgeButton>
          </Headless.Field>
        </div>
      </section>

      <Divider className="my-10" />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2 items-start">
        <div className="flex items-center gap-3">
          <Subheading>Instructors</Subheading>
          <BadgeButton color="blue" onClick={() => null}>
            + Add
          </BadgeButton>
        </div>
        <div>
          <Headless.Field className="flex items-baseline justify-center gap-6">
            <Listbox name="status" defaultValue="active" className="max-w-96">
              <ListboxOption value="active">
                <ListboxLabel>Active</ListboxLabel>
              </ListboxOption>
              <ListboxOption value="paused">
                <ListboxLabel>Paused</ListboxLabel>
              </ListboxOption>
              <ListboxOption value="delayed">
                <ListboxLabel>Delayed</ListboxLabel>
              </ListboxOption>
              <ListboxOption value="canceled">
                <ListboxLabel>Canceled</ListboxLabel>
              </ListboxOption>
            </Listbox>

            <BadgeButton color="red">Remove</BadgeButton>
          </Headless.Field>
        </div>
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
