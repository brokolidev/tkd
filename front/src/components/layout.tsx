import { ApplicationLayout } from '@/app/(authenticated)/application-layout'

export async function Layout({ children }: { children: React.ReactNode }) {  
  
  return (
    <>
      <ApplicationLayout>{children}</ApplicationLayout>
    </>
  )
}
