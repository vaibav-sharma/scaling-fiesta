'use client'
import MovieRecommender from '@/src/showcase/components/MoviePlanner'
import MovieTable from '@/src/showcase/components/MovieTable'
import ShowcaseCanvas from '@/src/showcase/components/ShowcaseCanvas'

export default function ShowcasePage() {
  return <div className="p-6 pt-20">
    <MovieTable />
  </div>
}