'use client'

import { useEffect, useState } from 'react'
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
import { ArrowRight, RefreshCcw, Save, Film } from 'lucide-react'
import { url as baseURL } from '@/src/store/authStore'
import { apiRequest } from '@/src/utils/apiClient'
import { Spinner } from '@/src/components/ui/spinner'
import { SpinnerBadge } from '@/src/utils/spinner'
import { getAllMovies, saveMovie } from '@/src/utils/movieDB'
import { FlipWordsDemo } from '@/src/utils/flipWords'
import { HeroHighlightDemo } from '@/src/utils/highlightWords'
import { LayoutTextFlipDemo } from '@/src/utils/textFlip'

export default function MovieRecommender() {
  const [mood, setMood] = useState('inspiring')
  const [genres, setGenres] = useState('Drama, Biography')
  const [language, setLanguage] = useState('English')
  const [platform, setPlatform] = useState('Netflix')
  const [context, setContext] = useState('solo')
  const [notes, setNotes] = useState('no horror, short runtime preferred')
  const [pastMovies, setPastMovies] = useState<string[]>(['The Social Network', 'Moneyball'])
  const [recentInput, setRecentInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any | null>(null)

  const handleAddMovie = () => {
    if (!recentInput.trim()) return
    setPastMovies(prev => [recentInput, ...prev.slice(0, 7)])
    setRecentInput('')
  }

  const handleMovieLoader = async (e: React.MouseEvent, title: string) => {
  e.preventDefault()
  try {
    const all = await getAllMovies()
    const movieInfo = all.find((m) => m.data.top_pick?.title === title)
    if (movieInfo) {
      setResult(movieInfo.data)
      toast.success('Loaded saved movie!')
    } else toast.error('Movie not found in your history.')
  } catch (err) {
    toast.error('Failed to load from IndexedDB.')
  }
}

  const handleRemoveMovie = (idx: number) => {
    setPastMovies(prev => prev.filter((_, i) => i !== idx))
  }

  useEffect(() => {
    (async () => {
      try {
        const items = await getAllMovies()
        if (items.length > 0) {
          const titles = items
            .map(i => i.data.top_pick?.title || 'Unknown')
            .filter(Boolean)
          setPastMovies([...new Set(titles)]) // remove duplicates
        }
      } catch (err) {
        console.error('Error loading IndexedDB movies:', err)
      }
    })()
  }, [])

  const fetchMovieSuggestion = async () => {
    if (loading) return
    try {
      setLoading(true)
      setError('')
      const method = 'POST'
      const url = `${baseURL}/api/movie-suggestion`
      const payloadType = 'json'

      const payload = {
        mood,
        genres: genres.split(',').map(g => g.trim()),
        language,
        platform,
        past_movies: pastMovies,
        context,
        notes,
      }

      const result = await apiRequest({
        method,
        url,
        operation: 'CustomFetch',
        payload,
        payloadType,
        retry: true,
      })

      if (result.success) {
        // console.log('Movie Suggestion Result:', result.data)
        setResult(result.data)
        toast.success('Movie suggestion generated!')
      } else {
        setError(typeof result.error === 'string' ? result.error : result.error?.message || 'Unknown error')
      }
    } catch (err: any) {
      setError(err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!result) return toast('No suggestion to save yet.')
    try {
      await saveMovie(result)
      toast.success('Saved to IndexedDB!')
      const items = await getAllMovies()
      setPastMovies(items.map(i => i.data.top_pick?.title || 'Unknown'))
    } catch (err) {
      console.error(err)
      toast.error('Failed to save movie.')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border border-border bg-card shadow-md">
          <CardHeader>
            {/* <CardTitle>
              What Movie Should I Watch?
            </CardTitle> */}
            <CardTitle>
              {/* <FlipWordsDemo {...({ flipWords: ["inspiring", "funny", "romantic", "thought-provoking"], phrase: "Want to watch something" } as any)} /> */}
              <LayoutTextFlipDemo text={["sci-fi?", "funny?", "classic?", "action?"]} phrase="Want to watch something" disc="AI-powered movie recommendations based on your taste and mood 🎬"/>
            </CardTitle>
            <CardDescription>
              {/* <LayoutTextFlipDemo text="AI-powered movie recommendations based on your taste and mood 🎬"/> */}
              {/* AI-powered movie recommendations based on your taste and mood 🎬 */}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Mood / Theme</Label>
                <Input value={mood} onChange={e => setMood(e.target.value)} />
              </div>

              <div>
                <Label>Genres (comma separated)</Label>
                <Input value={genres} onChange={e => setGenres(e.target.value)} />
              </div>

              <div>
                <Label>Language</Label>
                <Input value={language} onChange={e => setLanguage(e.target.value)} />
              </div>

              <div>
                <Label>Platform</Label>
                <Input value={platform} onChange={e => setPlatform(e.target.value)} />
              </div>

              <div>
                <Label>Context (who’s watching)</Label>
                <Input value={context} onChange={e => setContext(e.target.value)} />
              </div>

              <div>
                <Label>Extra Notes</Label>
                <Input value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
            </div>

            <Separator />

            <div>
              <Label>Past Watched Movies (avoid repetition)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {pastMovies.length > 0 ? (
                  pastMovies.map((movie, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                      <button onClick={(e) => handleMovieLoader(e, movie)} className="mr-1 text-xs hover:text-blue-500">ℹ️</button>
                      {movie}
                      <button onClick={() => handleRemoveMovie(idx)} className="ml-1 text-xs hover:text-red-500">✕</button>
                    </Badge>
                    // <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                    //   {movie}
                    //   <button
                    //     onClick={() => handleRemoveMovie(idx)}
                    //     className="ml-1 text-xs hover:text-red-500"
                    //   >
                    //     ✕
                    //   </button>
                    // </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No past movies yet.</p>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <Input
                  placeholder="Add movie..."
                  value={recentInput}
                  onChange={e => setRecentInput(e.target.value)}
                />
                <Button variant="default" onClick={handleAddMovie}>
                  + Add
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex py-4">
                {/* <Film className="h-6 w-6 animate-pulse" /> */}
                <SpinnerBadge text="Planning your movie for you" />
              </div>
            ) : (
              <div className="flex justify-between mt-4">
                <Button onClick={fetchMovieSuggestion}>
                  <ArrowRight className="w-4 h-4 mr-1" /> Get Suggestion
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  <RefreshCcw className="w-4 h-4 mr-1" /> Reset
                </Button>
              </div>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
        </Card>

        {result && (
          <Card className="border border-border bg-card shadow-md">
            <CardHeader>
              <CardTitle>{result.top_pick?.title || 'Movie Recommendation'}</CardTitle>
              <CardDescription>{result.mood} • {result.genre} • {result.language}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{result.top_pick?.description}</p>
              <p className="text-sm">{result.top_pick?.reason}</p>

              {result.alternatives && (
                <div className="mt-4">
                  <Label>Alternatives</Label>
                  <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                    {result.alternatives.map((alt: any, i: number) => (
                      <li key={i}>
                        <strong>{alt.title}</strong> — {alt.note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="secondary" onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
              {!loading && <Button variant="outline" onClick={fetchMovieSuggestion}>
                <RefreshCcw className="w-4 h-4 mr-1" /> New Suggestion
              </Button>}
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}