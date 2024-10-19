'use client'
import SignUpForm from '@/components/sign-up'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent, Card } from "@/components/ui/card"
import Link from "next/link"
import { MessageSquare, Zap, Shield, BarChart, User, LogIn } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ModeToggle } from '@/components/mode-toggle'


export default function Home() {  
  return (
      <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-14 flex items-center border-b">
          <Link className="flex items-center justify-center" href="#">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-bold">Estate Chatbot AI</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
              Features
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
              Pricing
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#about">
              About
            </Link>
          </nav>
          {false ? (
            <Button variant="ghost" className="ml-4">
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="ml-4">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white rounded-md">
                <DialogTitle className='hidden'>Sign Up</DialogTitle>
                <SignUpForm />
              </DialogContent>
            </Dialog>
          )}
          <ModeToggle />
        </header>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Intelligent Chatbots for Your Property
                  </h1>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                    Create customized AI chatbots that understand your property's unique features and engage with potential buyers or renters 24/7.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <form className="flex space-x-2">
                    <Input className="flex-1" placeholder="Enter your email" type="email" />
                    <Button type="submit">Get Started</Button>
                  </form>
                </div>
              </div>
            </div>
          </section>
          <section id="features" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Why Choose ChatProp AI?</h2>
              <div className="grid gap-6 lg:grid-cols-3">
                <Card>
                  <CardContent className="p-6">
                    <Zap className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-lg font-bold mb-2">Instant Responses</h3>
                    <p className="text-muted-foreground">
                      Our AI chatbots provide immediate answers to property inquiries, improving customer satisfaction.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <Shield className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-lg font-bold mb-2">Customized Knowledge</h3>
                    <p className="text-muted-foreground">
                      Tailor your chatbot with specific details about your properties for accurate and relevant information.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <BarChart className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-lg font-bold mb-2">Analytics & Insights</h3>
                    <p className="text-muted-foreground">
                      Gain valuable insights into customer inquiries and preferences to optimize your property listings.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Simple, Transparent Pricing</h2>
              <div className="grid gap-6 lg:grid-cols-3">
                {[
                  { name: "Starter", price: "$49", features: ["1 Property", "Basic Customization", "24/7 Support"] },
                  { name: "Pro", price: "$99", features: ["5 Properties", "Advanced Customization", "Analytics Dashboard"] },
                  { name: "Enterprise", price: "Custom", features: ["Unlimited Properties", "Full API Access", "Dedicated Account Manager"] }
                ].map((plan) => (
                  <Card key={plan.name}>
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-4xl font-bold mb-4">{plan.price}</p>
                      <ul className="space-y-2 mb-4">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center">
                            <svg
                              className=" h-5 w-5 text-primary mr-2"
                              fill="none"
                              height="24"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              width="24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full">Choose Plan</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
          <section id="about" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">About ChatProp AI</h2>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                    ChatProp AI is revolutionizing the real estate industry by providing intelligent, property-specific chatbots. 
                    Our mission is to streamline communication between property owners and potential clients, 
                    making the process of buying, selling, or renting properties more efficient and user-friendly.
                  </p>
                </div>
                <Button>Learn More About Us</Button>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Transform Your Property Management?</h2>
                  <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                    Join thousands of property owners who are already using ChatProp AI to engage with clients and boost their business.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <form className="flex flex-col gap-2">
                    <Input placeholder="Enter your email" type="email" />
                    <Button type="submit">Get Started Now</Button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-muted-foreground">© 2024 ChatProp AI. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Privacy Policy
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Contact Us
            </Link>
          </nav>
        </footer>
      </div>
  )
}

