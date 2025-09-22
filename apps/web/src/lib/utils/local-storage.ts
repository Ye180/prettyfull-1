'use client'

export function setItem(key: string, value: unknown) {
      try { 
            window.localStorage.setItem(key,JSON.stringify(value) )
      } catch(error) {
            console.log(error)
      }
}

export function removeItem(key: string, ) {
      try { 
            const item = localStorage.removeItem(key)
            // return item ? JSON.parse(item) : undefined
      } catch(error) {
            console.log(error)
      }
}

export function getItem(key: string, ) {
      try { 
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : undefined
      } catch(error) {
            console.log(error)
      }
}

export function clearLocal( ) {
      try { 
            localStorage.clear()
      } catch(error) {
            console.log(error)
      }
 }