import { ApplicationLayout } from '@/app/(authenticated)/application-layout'
import { getEvents } from '@/data'

export async function Layout({ children }: { children: React.ReactNode }) {
  let events = await getEvents()

  return (
    <>
      <ApplicationLayout events={events}>{children}</ApplicationLayout>
    </>
  )
}
