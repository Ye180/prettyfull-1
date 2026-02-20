'use client'

export function setItem(key: string, value: unknown) {
      if (typeof window === "undefined") return; // côté serveur, on ne fait rien
      try { 
            window.localStorage.setItem(key,JSON.stringify(value) )
      } catch (error) {
              throw new Error("Failed to clear local storage = " + error)
      }
}

export function removeItem(key: string,) {
      if (typeof window === "undefined") return; // côté serveur, on ne fait rien
      try { 
            const item = localStorage.removeItem(key)
            // return item ? JSON.parse(item) : undefined
      } catch (error) {
              throw new Error("Failed to clear local storage = " + error)
      }
}

export function getItem(key: string,) {
      if (typeof window === "undefined") return; // côté serveur, on ne fait rien
      try { 
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : undefined
      } catch (error) {
              throw new Error("Failed to get item from local storage = " + error)
      }
}

export function clearLocal() {
      if (typeof window === "undefined") return; // côté serveur, on ne fait rien
      try { 
            localStorage.clear()
      } catch(error) {
            throw new Error("Failed to clear local storage = " + error)
      }
 }