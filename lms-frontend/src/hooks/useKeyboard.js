import { useEffect } from "react"

export function useKeyboard(key, callback, modifiers = {}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrl = modifiers.ctrl ? e.ctrlKey || e.metaKey : true
      const isShift = modifiers.shift ? e.shiftKey : true
      const isAlt = modifiers.alt ? e.altKey : true

      if (e.key === key && isCtrl && isShift && isAlt) {
        e.preventDefault()
        callback()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [key, callback, modifiers])
}

export function useShortcut(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      shortcuts.forEach(({ key, callback, ctrl = false }) => {
        const isCtrlOrMeta = ctrl ? e.ctrlKey || e.metaKey : true
        if (e.key === key && isCtrlOrMeta) {
          e.preventDefault()
          callback()
        }
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [shortcuts])
}
