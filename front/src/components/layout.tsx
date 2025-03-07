import { ApplicationLayout } from '@/app/(authenticated)/application-layout'

export async function Layout({ children }: { children: React.ReactNode }) {
  const events = []
  
  return (
    <>
      <ApplicationLayout events={events}>{children}</ApplicationLayout>
    </>
  )
}
