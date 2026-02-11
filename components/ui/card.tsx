import * as React from "react"
import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "card-base rounded-tango border border-white/5 bg-tango-dark backdrop-blur-md text-tango-text",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col space-y-2 p-6", className)} {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("text-2xl font-black uppercase font-playfair tracking-tight text-tango-text transition-colors duration-300", "group-hover:text-tango-red", className)} {...props} />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("text-sm text-tango-text/50 font-inter", className)} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }