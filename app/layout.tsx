import './globals.css'

export const metadata = {
  title: 'PathLy - Master New Skills',
  description: 'Master new skills with personalized learning plans on PathLy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
