"use client"

import { useState, useCallback, useEffect } from "react"

interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  includeEmojis: boolean
  memorable: boolean
}

interface GraphicalOptions {
  mode: "text" | "graphical" | "hybrid"
  selectedIcons: string[]
  patternGrid: boolean[][]
  iconTheme: "animals" | "nature" | "food" | "objects" | "symbols"
}

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz"
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const NUMBERS = "0123456789"
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?"
const EMOJIS =
  "😀😃😄😁😆😅😂🤣😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🤩🥳😏😒😞😔😟😕🙁☹️😣😖😫😩🥺😢😭😤😠😡🤬🤯😳🥵🥶😱😨😰😥😓🤗🤔🤭🤫🤥😶😐😑😬🙄😯😦😧😮😲🥱😴🤤😪😵🤐🥴🤢🤮🤧😷🤒🤕🤑🤠😈👿👹👺🤡💩👻💀☠️👽👾🤖🎃😺😸😹😻😼😽🙀😿😾"

const MEMORABLE_WORDS = [
  "apple",
  "brave",
  "cloud",
  "dream",
  "eagle",
  "flame",
  "grace",
  "heart",
  "light",
  "magic",
  "ocean",
  "peace",
  "quick",
  "river",
  "storm",
  "trust",
  "wonder",
  "bright",
  "swift",
  "noble",
  "gentle",
  "strong",
  "wise",
  "kind",
]

const ICON_THEMES = {
  animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔"],
  nature: ["🌸", "🌺", "🌻", "🌷", "🌹", "🌿", "🍀", "🌳", "🌲", "🌴", "🌵", "🌾", "🌊", "⭐", "🌙", "☀️"],
  food: ["🍎", "🍌", "🍊", "🍓", "🍇", "🥝", "🍑", "🍒", "🥭", "🍍", "🥥", "🥑", "🍅", "🥕", "🌽", "🥒"],
  objects: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏓", "🏸", "🥅", "🎯", "🎮", "🎲", "🎸", "🎹", "🎺", "🎻"],
  symbols: ["❤️", "💙", "💚", "💛", "🧡", "💜", "🖤", "🤍", "💯", "💫", "⭐", "🌟", "✨", "💎", "🔥", "💧"],
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    includeEmojis: false,
    memorable: false,
  })

  const [graphicalOptions, setGraphicalOptions] = useState<GraphicalOptions>({
    mode: "text",
    selectedIcons: [],
    patternGrid: Array(5)
      .fill(null)
      .map(() => Array(5).fill(false)),
    iconTheme: "animals",
  })

  const [strength, setStrength] = useState({ score: 0, label: "Weak", color: "bg-red-500" })
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  const generateRandomPassword = useCallback(() => {
    let charset = LOWERCASE
    if (options.includeUppercase) charset += UPPERCASE
    if (options.includeNumbers) charset += NUMBERS
    if (options.includeSymbols) charset += SYMBOLS
    if (options.includeEmojis) charset += EMOJIS

    let result = ""
    for (let i = 0; i < options.length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return result
  }, [options])

  const generateMemorablePassword = useCallback(() => {
    const wordCount = Math.max(2, Math.floor(options.length / 6))
    const words = []

    for (let i = 0; i < wordCount; i++) {
      const word = MEMORABLE_WORDS[Math.floor(Math.random() * MEMORABLE_WORDS.length)]
      words.push(options.includeUppercase && i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word)
    }

    let result = words.join("")

    if (options.includeNumbers) {
      result += Math.floor(Math.random() * 100)
        .toString()
        .padStart(2, "0")
    }

    if (options.includeSymbols) {
      result += SYMBOLS.charAt(Math.floor(Math.random() * SYMBOLS.length))
    }

    if (options.includeEmojis) {
      result += EMOJIS.charAt(Math.floor(Math.random() * EMOJIS.length))
    }

    return result.slice(0, options.length)
  }, [options])

  const generateGraphicalPassword = useCallback(() => {
    if (graphicalOptions.mode === "graphical") {
      // Pure graphical mode
      const icons = graphicalOptions.selectedIcons
      const patternString = graphicalOptions.patternGrid
        .flat()
        .map((cell, index) => (cell ? `P${index}` : ""))
        .filter(Boolean)
        .join("")

      return icons.join("") + patternString
    } else if (graphicalOptions.mode === "hybrid") {
      // Hybrid mode: combine graphical elements with text
      const textPart = options.memorable ? generateMemorablePassword() : generateRandomPassword()
      const iconPart = graphicalOptions.selectedIcons.slice(0, 3).join("")
      const patternPart = graphicalOptions.patternGrid.flat().some((cell) => cell) ? "Pattern" : ""

      return (textPart.slice(0, Math.floor(options.length * 0.7)) + iconPart + patternPart).slice(0, options.length)
    }

    return options.memorable ? generateMemorablePassword() : generateRandomPassword()
  }, [options, graphicalOptions, generateMemorablePassword, generateRandomPassword])

  const generatePassword = useCallback(() => {
    const newPassword = generateGraphicalPassword()
    setPassword(newPassword)
  }, [generateGraphicalPassword])

  const calculateStrength = useCallback(
    (pwd: string) => {
      let score = 0
      let complexity = 0

      // Length scoring
      if (pwd.length >= 8) score += 1
      if (pwd.length >= 12) score += 1
      if (pwd.length >= 16) score += 1

      // Character type scoring
      if (/[a-z]/.test(pwd)) {
        score += 1
        complexity += 26
      }
      if (/[A-Z]/.test(pwd)) {
        score += 1
        complexity += 26
      }
      if (/[0-9]/.test(pwd)) {
        score += 1
        complexity += 10
      }
      if (/[^A-Za-z0-9]/.test(pwd)) {
        score += 1
        complexity += 32
      }

      // Graphical elements bonus
      if (graphicalOptions.selectedIcons.length > 0) {
        score += 1
        complexity += graphicalOptions.selectedIcons.length * 100
      }

      if (graphicalOptions.patternGrid.flat().some((cell) => cell)) {
        score += 1
        complexity += 1000
      }

      // Calculate entropy-based score
      const entropy = Math.log2(complexity) * pwd.length
      let entropyScore = 0
      if (entropy > 50) entropyScore = 100
      else if (entropy > 35) entropyScore = 75
      else if (entropy > 25) entropyScore = 50
      else entropyScore = 25

      const finalScore = Math.max(entropyScore, (score / 8) * 100)

      if (finalScore <= 40) return { score: finalScore, label: "Weak", color: "bg-red-500" }
      if (finalScore <= 70) return { score: finalScore, label: "Medium", color: "bg-yellow-500" }
      return { score: finalScore, label: "Strong", color: "bg-green-500" }
    },
    [graphicalOptions],
  )

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password)
      alert("Password copied!")
    } catch (err) {
      alert("Copy failed")
    }
  }

  const togglePatternCell = (row: number, col: number) => {
    setGraphicalOptions((prev) => ({
      ...prev,
      patternGrid: prev.patternGrid.map((r, rIndex) =>
        rIndex === row ? r.map((c, cIndex) => (cIndex === col ? !c : c)) : r,
      ),
    }))
  }

  const selectIcon = (icon: string) => {
    setGraphicalOptions((prev) => ({
      ...prev,
      selectedIcons: prev.selectedIcons.includes(icon)
        ? prev.selectedIcons.filter((i) => i !== icon)
        : [...prev.selectedIcons, icon].slice(0, 8),
    }))
  }

  useEffect(() => {
    generatePassword()
  }, [generatePassword])

  useEffect(() => {
    if (password) {
      setStrength(calculateStrength(password))
    }
  }, [password, calculateStrength])

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} flex items-center justify-center p-4`}
    >
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 relative">
          <button
            onClick={() => setIsDark(!isDark)}
            className="absolute right-0 top-0 px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Password Generator
          </h1>
          <p className="text-gray-500">Generate strong, unique passwords with advanced graphical options.</p>
        </div>

        {/* Mode Selection */}
        <div className="flex justify-center gap-2">
          {(["text", "graphical", "hybrid"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setGraphicalOptions((prev) => ({ ...prev, mode }))}
              className={`px-6 py-2 rounded-lg capitalize transition-colors ${
                graphicalOptions.mode === mode
                  ? "bg-blue-500 text-white"
                  : "border hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Password Card */}
          <div className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 space-y-6 rounded-lg shadow-lg border`}>
            {/* Password Display */}
            <div className="space-y-3">
              <div
                className={`${isDark ? "bg-gray-700" : "bg-gray-100"} rounded-lg p-4 border min-h-[60px] flex items-center`}
              >
                <div className="font-mono text-lg break-all w-full">{password}</div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  📋 Copy
                </button>
                <button
                  onClick={generatePassword}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  🔄 Regenerate
                </button>
              </div>
            </div>

            {/* Text Mode Options */}
            {(graphicalOptions.mode === "text" || graphicalOptions.mode === "hybrid") && (
              <>
                {/* Toggle Options */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setOptions((prev) => ({ ...prev, memorable: false }))}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      !options.memorable ? "bg-blue-500 text-white" : "border hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    Random
                  </button>
                  <button
                    onClick={() => setOptions((prev) => ({ ...prev, memorable: true }))}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      options.memorable ? "bg-blue-500 text-white" : "border hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    Memorable
                  </button>
                </div>

                {/* Length Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Character Length</label>
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">{options.length}</span>
                  </div>
                  <input
                    type="range"
                    value={options.length}
                    onChange={(e) => setOptions((prev) => ({ ...prev, length: Number.parseInt(e.target.value) }))}
                    max={50}
                    min={4}
                    className="w-full"
                  />
                </div>

                {/* Character Options */}
                <div className="space-y-4">
                  {[
                    { key: "includeUppercase", label: "Capital letters", icon: "Aa" },
                    { key: "includeNumbers", label: "Numbers", icon: "123" },
                    { key: "includeSymbols", label: "Symbols", icon: "!@#" },
                    { key: "includeEmojis", label: "Emojis", icon: "😀" },
                  ].map(({ key, label, icon }) => (
                    <div key={key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={key}
                        checked={options[key as keyof PasswordOptions] as boolean}
                        onChange={(e) => setOptions((prev) => ({ ...prev, [key]: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <label htmlFor={key} className="text-sm font-medium cursor-pointer flex items-center gap-2">
                        <span className="text-lg">{icon}</span>
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Security Score */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Security Strength</span>
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">{strength.label}</span>
              </div>

              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${strength.color}`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>

              <p className="text-xs text-gray-500">
                {strength.label === "Weak" &&
                  "Consider using more character types, increasing length, or adding graphical elements."}
                {strength.label === "Medium" &&
                  "Good password! Consider adding graphical elements for enhanced security."}
                {strength.label === "Strong" && "Excellent! This password provides strong security protection."}
              </p>
            </div>
          </div>

          {/* Graphical Options Card */}
          {(graphicalOptions.mode === "graphical" || graphicalOptions.mode === "hybrid") && (
            <div className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 space-y-6 rounded-lg shadow-lg border`}>
              <h3 className="text-xl font-semibold">Graphical Elements</h3>

              {/* Icon Theme Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Icon Theme</label>
                <div className="flex gap-2 flex-wrap">
                  {Object.keys(ICON_THEMES).map((theme) => (
                    <button
                      key={theme}
                      onClick={() =>
                        setGraphicalOptions((prev) => ({ ...prev, iconTheme: theme as keyof typeof ICON_THEMES }))
                      }
                      className={`px-3 py-1 rounded-lg capitalize text-sm transition-colors ${
                        graphicalOptions.iconTheme === theme
                          ? "bg-blue-500 text-white"
                          : "border hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Selection */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Select Icons</label>
                  <span className="text-xs text-gray-500">{graphicalOptions.selectedIcons.length}/8 selected</span>
                </div>
                <div className="grid grid-cols-8 gap-2">
                  {ICON_THEMES[graphicalOptions.iconTheme].map((icon, index) => (
                    <button
                      key={index}
                      onClick={() => selectIcon(icon)}
                      className={`p-2 text-2xl rounded-lg border transition-all hover:scale-110 ${
                        graphicalOptions.selectedIcons.includes(icon)
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      title={`${graphicalOptions.iconTheme} icon ${index + 1}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Icons Display */}
              {graphicalOptions.selectedIcons.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Selected Icons</label>
                  <div className="flex gap-2 flex-wrap">
                    {graphicalOptions.selectedIcons.map((icon, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900"
                        onClick={() => selectIcon(icon)}
                        title="Click to remove"
                      >
                        {icon}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pattern Grid */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Pattern Grid</label>
                <div className="grid grid-cols-5 gap-1 w-fit mx-auto">
                  {graphicalOptions.patternGrid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => togglePatternCell(rowIndex, colIndex)}
                        className={`w-8 h-8 border rounded transition-all hover:scale-110 ${
                          cell
                            ? "bg-blue-500 border-blue-500"
                            : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                        aria-label={`Pattern cell ${rowIndex + 1}-${colIndex + 1}`}
                      />
                    )),
                  )}
                </div>
                <div className="text-center">
                  <button
                    onClick={() =>
                      setGraphicalOptions((prev) => ({
                        ...prev,
                        patternGrid: Array(5)
                          .fill(null)
                          .map(() => Array(5).fill(false)),
                      }))
                    }
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Clear Pattern
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
