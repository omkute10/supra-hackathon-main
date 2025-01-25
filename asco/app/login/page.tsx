import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/Navigation"

export default function Login() {
  return (
    <>
      <Navigation />
      <div className="flex h-screen w-full items-center justify-center px-4">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your email below to login into your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="asco@example.com" />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

