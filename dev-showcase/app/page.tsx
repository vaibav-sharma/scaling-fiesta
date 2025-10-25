"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useThemeStore } from "@/src/store/themeStore";
import { HomeIcon } from "lucide-react";
import Link from 'next/link'
import { useEffect } from "react";


export default function Home() {
  const { theme, toggleTheme } = useThemeStore();
  useEffect(() => {
    theme
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* <Link href="/" passHref>
        <HomeIcon />
      </Link> */}
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-row gap-8 p-8">
          {/* Meal Planner */}
          <Link href="/mealplanner" passHref>
            <Card className="w-56 h-[28rem] flex flex-col justify-between shadow-lg bg-primary">
              <CardHeader>
                <CardTitle className="text-lg">Meal Planner</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Plan your meals smartly.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center">
                <h1 className="text-center text-base font-medium text-gray-600">🥗 Testing</h1>
              </CardContent>
              <CardFooter className="flex justify-center py-3 text-sm text-gray-500">
                Footer
              </CardFooter>
            </Card>
          </Link>

          {/* Movie Planner */}
          <Link href="/movieplanner" passHref>
            <Card className="w-56 h-[28rem] flex flex-col justify-between shadow-lg bg-primary">
              <CardHeader>
                <CardTitle className="text-lg">Movie Planner</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Pick your perfect movie.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center">
                <h1 className="text-center text-base font-medium text-gray-600">🎬 Testing</h1>
              </CardContent>
              <CardFooter className="flex justify-center py-3 text-sm text-gray-500">
                Footer
              </CardFooter>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}