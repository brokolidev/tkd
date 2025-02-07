'use client'

import { Button } from '@/components/button'
import { Dialog, DialogActions, DialogDescription, DialogTitle } from '@/components/dialog'
import { Divider } from '@/components/divider'
import { Heading, Subheading } from '@/components/heading'
import { Input } from '@/components/input'
import { Text } from '@/components/text'
import { useState } from 'react'
import { Address } from './address'

export default function Settings() {
  const initialData = {
    name: '',
    email: '',
    address: {
      street: '',
      city: '',
      province: '',
      postalCode: '',
    },
    maximum_class_size: '',
    absent_alerts: '',
    payment_alerts: '',
  }

  const hardcodedData = {
    name: 'Taekwondoon',
    email: 'taekwondoon_yyc@gmail.com',
    address: {
      street: '1515 Centre Avenue',
      city: 'Calgary',
      province: 'Alberta',
      postalCode: 'A1A 1A1',
    },
    maximum_class_size: '30',
    absent_alerts: '3',
    payment_alerts: '7',
  }

  const [formData, setFormData] = useState(hardcodedData)
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [isSaveOpen, setIsSaveOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  const handleReset = () => {
    setFormData(initialData)
    setIsResetOpen(false)
    console.log('Reset Done!')
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    console.log('Saving data:', formData)
    setIsSaveOpen(false)
    setIsSuccessOpen(true)
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
      <Heading>Settings</Heading>
      <Divider className="my-10 mt-6" />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Organization Name</Subheading>
          <Text>This will be displayed on your public profile.</Text>
        </div>
        <div>
          <Input
            aria-label="Organization Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Organization Email</Subheading>
          <Text>This is how customers can contact you for support.</Text>
        </div>
        <div className="space-y-4">
          <Input
            type="email"
            aria-label="Organization Email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Address</Subheading>
          <Text>This is where your organization is registered.</Text>
        </div>
        <Address
          value={formData.address}
          onChange={(newAddress) => setFormData({ ...formData, address: newAddress })}
        />
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Maximum class size</Subheading>
          <Text>The maximum number of students allowed in a single class.</Text>
        </div>
        <div>
          <Input
            type="number"
            name="maximum_class_size"
            value={formData.maximum_class_size}
            onChange={(e) => setFormData({ ...formData, maximum_class_size: e.target.value })}
          />
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Absent alerts (count)</Subheading>
          <Text>The number of missed classes before sending an alert.</Text>
        </div>
        <div>
          <Input
            type="number"
            name="absent_alerts"
            value={formData.absent_alerts}
            onChange={(e) => setFormData({ ...formData, absent_alerts: e.target.value })}
          />
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Payment alerts (days)</Subheading>
          <Text>The number of days before payment is due when an alert sends.</Text>
        </div>
        <div>
          <Input
            type="number"
            name="payment_alerts"
            value={formData.payment_alerts}
            onChange={(e) => setFormData({ ...formData, payment_alerts: e.target.value })}
          />
        </div>
      </section>

      <Divider className="my-10" soft />

      <div className="flex justify-end gap-4">
        <Button type="button" onClick={() => setIsResetOpen(true)}>
          Reset
        </Button>

        <Button type="button" onClick={() => setIsSaveOpen(true)}>
          Save Changes
        </Button>
      </div>

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

      <Dialog open={isSuccessOpen} onClose={() => setIsSuccessOpen(false)}>
        <DialogTitle>Success</DialogTitle>
        <DialogDescription>Saved successfully!</DialogDescription>
        <DialogActions>
          <Button onClick={() => setIsSuccessOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}
