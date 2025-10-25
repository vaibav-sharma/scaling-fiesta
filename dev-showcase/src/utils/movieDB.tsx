export interface MovieEntry {
  id?: number
  timestamp: number
  data: any
}

export const openMovieDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MovieRecommenderDB", 1)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains("movies")) {
        db.createObjectStore("movies", { keyPath: "id", autoIncrement: true })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const saveMovie = async (movieData: any) => {
  const db = await openMovieDB()
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("movies", "readwrite")
    const store = tx.objectStore("movies")
    store.add({ timestamp: Date.now(), data: movieData })

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export const getAllMovies = async (): Promise<MovieEntry[]> => {
  const db = await openMovieDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction("movies", "readonly")
    const store = tx.objectStore("movies")
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}