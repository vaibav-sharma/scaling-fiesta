// src/utils/mealDB.ts
export interface MealEntry {
  id?: number
  timestamp: number
  data: any
}

export const openMealDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MealRecommenderDB", 1)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains("meals")) {
        db.createObjectStore("meals", { keyPath: "id", autoIncrement: true })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const saveMeal = async (mealData: any): Promise<void> => {
  const db = await openMealDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction("meals", "readwrite")
    const store = tx.objectStore("meals")
    store.add({ timestamp: Date.now(), data: mealData })

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export const getAllMeals = async (): Promise<MealEntry[]> => {
  const db = await openMealDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction("meals", "readonly")
    const store = tx.objectStore("meals")
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const clearAllMeals = async (): Promise<void> => {
  const db = await openMealDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction("meals", "readwrite")
    const store = tx.objectStore("meals")
    const request = store.clear()

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}