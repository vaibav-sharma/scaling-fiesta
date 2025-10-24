'use client'

import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { ArrowRight, Plus, RefreshCcw, Save } from 'lucide-react'

// -----------------------------
// Mock meal generation function
// -----------------------------
const generateSuggestion = ({
  mealType,
  dietType,
  cuisine,
  calorie,
  recentMeals,
}: {
  mealType: string
  dietType: string
  cuisine: string
  calorie: string
  recentMeals: string[]
}) => {
  const meals = {
    base: ['Jeera rice', 'Multigrain roti', 'Garlic naan', 'Brown rice', 'Paratha'],
    pulses: ['Moong dal tadka', 'Masoor dal', 'Chana masala', 'Paneer bhurji', 'Tofu scramble'],
    mains: ['Bhindi do pyaza', 'Mixed veg sabzi', 'Tofu stir-fry', 'Baingan bharta', 'Matar paneer'],
    sides: ['Cucumber salad', 'Mint raita', 'Steamed rice', 'Tomato soup'],
    beverage: ['Buttermilk', 'Lemon water', 'Green tea', 'Warm turmeric milk'],
  }

  const pick = (arr: string[]) =>
    arr.filter((item) => !recentMeals.some((r) => item.toLowerCase().includes(r.toLowerCase())))[0] ||
    arr[Math.floor(Math.random() * arr.length)]

  return {
    mealType,
    dietType,
    base: pick(meals.base),
    pulses: pick(meals.pulses),
    mains: pick(meals.mains),
    sides: pick(meals.sides),
    beverage: pick(meals.beverage),
    reason:
      'Avoids repetition and adds a balanced mix of protein and vegetables suitable for a moderate-calorie ' +
      (dietType === 'Vegetarian' ? 'veg' : dietType.toLowerCase()) +
      ' dinner.',
  }
}

export default function MealRecommender() {
  const [mealType, setMealType] = useState('Dinner')
  const [dietType, setDietType] = useState('Vegetarian')
  const [cuisine, setCuisine] = useState('Indian')
  const [calorie, setCalorie] = useState('Moderate')
  const [recentMeals, setRecentMeals] = useState(['Palak Paneer', 'Rajma Chawal', 'Aloo Paratha'])
  const [recentInput, setRecentInput] = useState('')
  const [result, setResult] = useState<any | null>(null)

  const handleAddMeal = () => {
    if (!recentInput.trim()) return
    setRecentMeals((prev) => [recentInput, ...prev.slice(0, 7)])
    setRecentInput('')
  }

  const handleRemoveMeal = (idx: number) => {
    setRecentMeals((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleGenerate = () => {
    const suggestion = generateSuggestion({ mealType, dietType, cuisine, calorie, recentMeals })
    setResult(suggestion)
    setRecentMeals((prev) => [`${suggestion.mains} with ${suggestion.base}`, ...prev.slice(0, 7)])
  }

  const handleSave = () => {
    if (!result) return toast('No suggestion to save yet.')
    toast.success('Meal saved to your recent list!')
  }

  const handleRegenerate = () => {
    handleGenerate()
    toast('Generated a new suggestion!')
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border border-border bg-card shadow-md">
          <CardHeader>
            <CardTitle>What Should I Eat?</CardTitle>
            <CardDescription>Quick meal ideas tailored to your preferences</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Meal Type */}
              <div>
                <Label>Meal Type</Label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full rounded-md border border-input bg-background text-foreground px-2 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>

              {/* Diet Type */}
              <div>
                <Label>Diet Type</Label>
                <select
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value)}
                  className="w-full rounded-md border border-input bg-background text-foreground px-2 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Eggetarian">Eggetarian</option>
                </select>
              </div>

              {/* Cuisine */}
              <div>
                <Label>Cuisine Preference</Label>
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full rounded-md border border-input bg-background text-foreground px-2 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <option value="Any">Any</option>
                  <option value="Indian">Indian</option>
                  <option value="Continental">Continental</option>
                  <option value="Mediterranean">Mediterranean</option>
                </select>
              </div>

              {/* Calorie Level */}
              <div>
                <Label>Calorie Level</Label>
                <select
                  value={calorie}
                  onChange={(e) => setCalorie(e.target.value)}
                  className="w-full rounded-md border border-input bg-background text-foreground px-2 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <option value="Light">Light</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Heavy">Heavy</option>
                </select>
              </div>
            </div>

            <Separator />

            {/* Recent Meals */}
            <div>
              <Label>Recent Meals (avoid repetition)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {recentMeals.length > 0 ? (
                  recentMeals.map((meal, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                      {meal}
                      <button
                        onClick={() => handleRemoveMeal(idx)}
                        className="ml-1 text-xs hover:text-red-500"
                      >
                        ✕
                      </button>
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent meals yet.</p>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <Input
                  placeholder="Add recent meal..."
                  value={recentInput}
                  onChange={(e) => setRecentInput(e.target.value)}
                />
                <Button variant="default" onClick={handleAddMeal}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button onClick={handleGenerate}>
                <ArrowRight className="w-4 h-4 mr-1" /> Get Suggestion
              </Button>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-1" /> Save Meal
                </Button>
                <Button variant="outline" onClick={handleRegenerate}>
                  <RefreshCcw className="w-4 h-4 mr-1" /> Generate Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="border border-border bg-card shadow-md">
            <CardHeader>
              <CardTitle>
                {result.mealType} — {result.dietType}
              </CardTitle>
              <CardDescription>Suggested combination for you</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                <li>
                  <strong>Bread/Base:</strong> {result.base}
                </li>
                <li>
                  <strong>Pulses/Proteins:</strong> {result.pulses}
                </li>
                <li>
                  <strong>Main Dish:</strong> {result.mains}
                </li>
                <li>
                  <strong>Sides/Add-ons:</strong> {result.sides}
                </li>
                <li>
                  <strong>Beverage:</strong> {result.beverage}
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">{result.reason}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="secondary" onClick={handleSave}>
                Save Meal
              </Button>
              <Button variant="outline" onClick={handleRegenerate}>
                Generate Another
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}