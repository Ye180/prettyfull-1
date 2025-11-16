'use client'

export function setItem(key: string, value: unknown) {
      try { 
            if (typeof window !== 'undefined' && window.localStorage) {
                  // CORRECTION : Si la valeur est undefined, on supprime la clé
                  // au lieu de stocker la chaîne "undefined".
                  if (value === undefined) {
                        localStorage.removeItem(key);
                  } else {
                        window.localStorage.setItem(key, JSON.stringify(value));
                  }
            }
      } catch(error) {
            console.log(error)
      }
}

export function removeItem(key: string, ) {
      try { 
            if (typeof window !== 'undefined' && window.localStorage) {
                  localStorage.removeItem(key)
            }
      } catch(error) {
            console.log(error)
      }
}

export function getItem(key: string, ) {
      try { 
            if (typeof window === 'undefined' || !window.localStorage) {
                  return undefined;
            }
            
            const item = localStorage.getItem(key);

            // CORRECTION : On vérifie si l'item est null OU la chaîne "undefined"
            // avant de tenter de le parser.
            if (item === null || item === 'undefined') {
                  return undefined;
            }
            
            // Si on arrive ici, l'item n'est ni null ni "undefined", on peut parser
            return JSON.parse(item);

      } catch(error) {
            // J'ajoute un log plus précis pour t'aider si ça échoue encore
            console.error(`Erreur JSON.parse pour la clé "${key}" avec la valeur "${localStorage.getItem(key)}"`, error);
      }
}

export function clearLocal( ) {
      try { 
            if (typeof window !== 'undefined' && window.localStorage) {
                  localStorage.clear()
            }
      } catch(error) {
            console.log(error)
      }
 }