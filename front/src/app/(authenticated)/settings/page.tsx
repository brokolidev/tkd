'use client'

import { Button } from '@/components/button'
import { Dialog, DialogActions, DialogDescription, DialogTitle } from '@/components/dialog'
import { Divider } from '@/components/divider'
import { Heading, Subheading } from '@/components/heading'
import { Input } from '@/components/input'
import { Text } from '@/components/text'
import { getSettings, updateSettings } from '@/services/settingServices'
import { ISettings, IUpdateSetting } from '@/structures/setting'
import { useEffect, useState } from 'react'
import { Address } from './address'

export default function Settings() {
  const [settingValues, setSettingValues] = useState<ISettings | null>(null)
  const [formData, setFormData] = useState<IUpdateSetting>({} as IUpdateSetting)
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [isSaveOpen, setIsSaveOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSettings()
        setSettingValues(data)
        setFormData(data)
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const handleReset = () => {
    setFormData(settingValues)
    setIsResetOpen(false)
    console.log('Default value is ', settingValues)
  }

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) event.preventDefault()
    try {
      await updateSettings(formData)
      setIsSuccessOpen(true)
    } catch (error) {
      console.error('Failed to submit updated information: ', error)
    }
    setIsSaveOpen(false)
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
            value={formData?.organizationName || ''}
            onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
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
            value={formData?.email || ''}
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
          street={formData?.street || ''}
          city={formData?.city || ''}
          province={formData?.province || ''}
          postalCode={formData?.postalCode || ''}
          country={formData?.country || ''}
          onChange={(field, value) => setFormData({ ...formData, [field]: value })}
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
            value={formData.maximumClassSize ?? 0}
            onChange={(e) => setFormData({ ...formData, maximumClassSize: Number(e.target.value) })}
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
            value={formData.absentAlert ?? 0}
            onChange={(e) => setFormData({ ...formData, absentAlert: Number(e.target.value) })}
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
            value={formData.paymentAlert ?? 0}
            onChange={(e) => setFormData({ ...formData, paymentAlert: Number(e.target.value) })}
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
