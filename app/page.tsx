"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Copy, RefreshCw, Shield, Key, Hash, AtSign, Sun, Moon, Smile, ImageIcon, Grid3X3, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  memorable: boolean
  includeEmojis: boolean
  graphicalMode: boolean
  iconTheme: string
  hybridMode: boolean
  patternMode: boolean
}

const ICON_THEMES = {
  animals: [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵",
    "🐔",
    "🐧",
    "🐦",
    "🐤",
    "🦆",
    "🦅",
    "🦉",
    "🦇",
    "🐺",
    "🐗",
  ],
  nature: [
    "🌲",
    "🌳",
    "🌴",
    "🌵",
    "🌶",
    "🍄",
    "🌾",
    "💐",
    "🌷",
    "🌹",
    "🥀",
    "🌺",
    "🌸",
    "🌼",
    "🌻",
    "🌞",
    "🌝",
    "🌛",
    "🌜",
    "🌚",
    "🌕",
    "🌖",
    "🌗",
    "🌘",
    "🌑",
  ],
  food: [
    "🍎",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝",
    "🍅",
    "🍆",
    "🥑",
    "🥦",
    "🥒",
    "🌶",
    "🌽",
    "🥕",
    "🥔",
    "🍠",
    "🥐",
  ],
  objects: [
    "⚽",
    "🏀",
    "🏈",
    "⚾",
    "🎾",
    "🏐",
    "🏉",
    "🎱",
    "🏓",
    "🏸",
    "🥅",
    "⛳",
    "🏹",
    "🎣",
    "🥊",
    "🥋",
    "🎽",
    "⛸",
    "🥌",
    "🛷",
    "🎿",
    "⛷",
    "🏂",
    "🏋",
    "🤸",
  ],
  symbols: [
    "⭐",
    "✨",
    "🌟",
    "💫",
    "⚡",
    "🔥",
    "💥",
    "💢",
    "💨",
    "💤",
    "💦",
    "💧",
    "🌊",
    "🌀",
    "🌈",
    "☀",
    "⛅",
    "☁",
    "🌤",
    "⛈",
    "🌩",
    "❄",
    "☃",
    "⛄",
    "🌬",
  ],
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
  "unity",
  "voice",
  "world",
  "youth",
]

export default function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    memorable: false,
    includeEmojis: false,
    graphicalMode: false,
    iconTheme: "animals",
    hybridMode: false,
    patternMode: false,
  })
  const [selectedIcons, setSelectedIcons] = useState<string[]>([])
  const [patternPoints, setPatternPoints] = useState<number[]>([])
  const [strength, setStrength] = useState({ score: 0, label: "Weak", color: "bg-destructive" })
  const [isDark, setIsDark] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  const generateGraphicalPassword = useCallback(() => {
    if (options.patternMode && patternPoints.length > 0) {
      // Convert pattern to password
      return patternPoints.join("-")
    } else if (selectedIcons.length > 0) {
      // Convert selected icons to password
      let result = selectedIcons.join("")

      if (options.hybridMode) {
        // Add traditional characters
        let charset = LOWERCASE
        if (options.includeUppercase) charset += UPPERCASE
        if (options.includeNumbers) charset += NUMBERS
        if (options.includeSymbols) charset += SYMBOLS

        const remainingLength = Math.max(0, options.length - selectedIcons.length)
        for (let i = 0; i < remainingLength; i++) {
          result += charset.charAt(Math.floor(Math.random() * charset.length))
        }
      }

      return result
    }
    return ""
  }, [selectedIcons, patternPoints, options])

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

  const generatePassword = useCallback(() => {
    if (options.graphicalMode) {
      const newPassword = generateGraphicalPassword()
      setPassword(newPassword)
    } else {
      const newPassword = options.memorable ? generateMemorablePassword() : generateRandomPassword()
      setPassword(newPassword)
    }
  }, [options, generateMemorablePassword, generateRandomPassword, generateGraphicalPassword])

  const calculateStrength = useCallback(
    (pwd: string) => {
      let score = 0
      if (pwd.length >= 8) score += 1
      if (pwd.length >= 12) score += 1
      if (/[a-z]/.test(pwd)) score += 1
      if (/[A-Z]/.test(pwd)) score += 1
      if (/[0-9]/.test(pwd)) score += 1
      if (/[^A-Za-z0-9]/.test(pwd)) score += 1
      if (/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(pwd))
        score += 1

      // Bonus for graphical elements
      if (options.graphicalMode) {
        if (selectedIcons.length >= 3) score += 1
        if (options.hybridMode) score += 1
        if (options.patternMode && patternPoints.length >= 4) score += 1
      }

      if (score <= 2) return { score: 25, label: "Weak", color: "bg-destructive" }
      if (score <= 4) return { score: 60, label: "Medium", color: "bg-warning" }
      return { score: 100, label: "Strong", color: "bg-success" }
    },
    [options, selectedIcons, patternPoints],
  )

  const copyToClipboard = async () => {
    try {
      let textToCopy = password
      if (options.graphicalMode && !options.hybridMode) {
        // For pure graphical passwords, copy a text representation
        textToCopy = selectedIcons.length > 0 ? `Icons: ${selectedIcons.join(", ")}` : password
      }

      await navigator.clipboard.writeText(textToCopy)
      toast({
        title: "Password copied!",
        description:
          options.graphicalMode && !options.hybridMode
            ? "Icon sequence copied as text representation."
            : "The password has been copied to your clipboard.",
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy password to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleIconSelect = (icon: string) => {
    if (selectedIcons.includes(icon)) {
      setSelectedIcons((prev) => prev.filter((i) => i !== icon))
    } else if (selectedIcons.length < options.length) {
      setSelectedIcons((prev) => [...prev, icon])
    }
  }

  const handlePatternPoint = (point: number) => {
    if (patternPoints.includes(point)) {
      setPatternPoints((prev) => prev.filter((p) => p !== point))
    } else if (patternPoints.length < 9) {
      setPatternPoints((prev) => [...prev, point])
    }
  }

  const getCharacterColor = (char: string, index: number) => {
    if (/[A-Z]/.test(char)) return "text-primary"
    if (/[0-9]/.test(char)) return "text-success"
    if (/[^A-Za-z0-9]/.test(char)) return "text-warning"
    if (/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(char))
      return "text-accent"
    return "text-foreground"
  }

  useEffect(() => {
    generatePassword()
  }, [generatePassword])

  useEffect(() => {
    if (password) {
      setStrength(calculateStrength(password))
    }
  }, [password, calculateStrength])

  useEffect(() => {
    if (!options.graphicalMode) {
      setSelectedIcons([])
      setPatternPoints([])
    }
  }, [options.graphicalMode])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDark(!isDark)}
            className="absolute -right-12 top-0 gap-2"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDark ? "Light" : "Dark"}
          </Button>

          <h1 className="text-3xl font-bold text-balance">Password Generator</h1>
          <p className="text-muted-foreground text-pretty">Generate strong, unique passwords.</p>
        </div>

        {/* Main Card */}
        <Card className="p-6 space-y-6 shadow-2xl border-border/50">
          {/* Password Display */}
          <div className="space-y-3">
            <div className="bg-secondary/50 rounded-lg p-4 border border-border/50">
              <div className="font-mono text-lg break-all leading-relaxed tracking-wide">
                {password.split("").map((char, index) => (
                  <span
                    key={index}
                    className={`${getCharacterColor(char, index)} ${/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(char) ? "mx-1" : ""}`}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyToClipboard} className="flex-1 gap-2 bg-transparent">
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              <Button onClick={generatePassword} className="flex-1 gap-2 bg-primary hover:bg-primary/90">
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </Button>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={!options.graphicalMode ? "default" : "outline"}
              onClick={() => setOptions((prev) => ({ ...prev, graphicalMode: false }))}
              className="flex-1"
            >
              Text Mode
            </Button>
            <Button
              variant={options.graphicalMode ? "default" : "outline"}
              onClick={() => setOptions((prev) => ({ ...prev, graphicalMode: true }))}
              className="flex-1 gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              Visual Mode
            </Button>
          </div>

          {options.graphicalMode && (
            <div className="space-y-4 border-t border-border/50 pt-4">
              {/* Theme Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Icon Theme
                </label>
                <div className="flex gap-2 flex-wrap">
                  {Object.keys(ICON_THEMES).map((theme) => (
                    <Button
                      key={theme}
                      variant={options.iconTheme === theme ? "default" : "outline"}
                      size="sm"
                      onClick={() => setOptions((prev) => ({ ...prev, iconTheme: theme }))}
                      className="capitalize"
                    >
                      {theme}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mode Options */}
              <div className="flex gap-2">
                <Button
                  variant={!options.patternMode ? "default" : "outline"}
                  onClick={() => setOptions((prev) => ({ ...prev, patternMode: false }))}
                  className="flex-1"
                >
                  Icon Selection
                </Button>
                <Button
                  variant={options.patternMode ? "default" : "outline"}
                  onClick={() => setOptions((prev) => ({ ...prev, patternMode: true }))}
                  className="flex-1 gap-2"
                >
                  <Grid3X3 className="w-4 h-4" />
                  Pattern
                </Button>
              </div>

              {/* Hybrid Mode Toggle */}
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="hybrid"
                  checked={options.hybridMode}
                  onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, hybridMode: !!checked }))}
                />
                <label htmlFor="hybrid" className="text-sm font-medium cursor-pointer">
                  Hybrid Mode (Mix with text characters)
                </label>
              </div>

              {/* Icon Grid or Pattern Grid */}
              {!options.patternMode ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Select Icons ({selectedIcons.length}/{options.length})
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedIcons([])}
                      disabled={selectedIcons.length === 0}
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="grid grid-cols-8 gap-2 p-4 bg-secondary/30 rounded-lg border border-border/30 max-h-48 overflow-y-auto">
                    {ICON_THEMES[options.iconTheme as keyof typeof ICON_THEMES].map((icon, index) => (
                      <button
                        key={index}
                        onClick={() => handleIconSelect(icon)}
                        className={`text-2xl p-2 rounded-lg border-2 transition-all hover:scale-110 ${
                          selectedIcons.includes(icon)
                            ? "border-primary bg-primary/20 shadow-lg"
                            : "border-border/50 hover:border-primary/50"
                        }`}
                        disabled={!selectedIcons.includes(icon) && selectedIcons.length >= options.length}
                        aria-label={`Select ${icon} icon`}
                      >
                        {icon}
                        {selectedIcons.includes(icon) && (
                          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {selectedIcons.indexOf(icon) + 1}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Draw Pattern ({patternPoints.length}/9 points)</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPatternPoints([])}
                      disabled={patternPoints.length === 0}
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-6 bg-secondary/30 rounded-lg border border-border/30 max-w-xs mx-auto">
                    {Array.from({ length: 9 }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePatternPoint(index)}
                        className={`w-12 h-12 rounded-full border-2 transition-all hover:scale-110 ${
                          patternPoints.includes(index)
                            ? "border-primary bg-primary/20 shadow-lg"
                            : "border-border/50 hover:border-primary/50"
                        }`}
                        aria-label={`Pattern point ${index + 1}`}
                      >
                        {patternPoints.includes(index) && (
                          <span className="text-primary font-bold">{patternPoints.indexOf(index) + 1}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Traditional Options - only show when not in pure graphical mode */}
          {(!options.graphicalMode || options.hybridMode) && (
            <>
              {/* Toggle Options */}
              {!options.graphicalMode && (
                <div className="flex gap-2">
                  <Button
                    variant={!options.memorable ? "default" : "outline"}
                    onClick={() => setOptions((prev) => ({ ...prev, memorable: false }))}
                    className="flex-1"
                  >
                    Random
                  </Button>
                  <Button
                    variant={options.memorable ? "default" : "outline"}
                    onClick={() => setOptions((prev) => ({ ...prev, memorable: true }))}
                    className="flex-1"
                  >
                    Memorable
                  </Button>
                </div>
              )}

              {/* Length Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">
                    {options.graphicalMode ? "Total Length" : "Character Length"}
                  </label>
                  <Badge variant="secondary">{options.length}</Badge>
                </div>
                <Slider
                  value={[options.length]}
                  onValueChange={(value) => setOptions((prev) => ({ ...prev, length: value[0] }))}
                  max={50}
                  min={4}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Character Options */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="uppercase"
                    checked={options.includeUppercase}
                    onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeUppercase: !!checked }))}
                  />
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-primary" />
                    <label htmlFor="uppercase" className="text-sm font-medium cursor-pointer">
                      Capital letters
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="numbers"
                    checked={options.includeNumbers}
                    onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeNumbers: !!checked }))}
                  />
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-success" />
                    <label htmlFor="numbers" className="text-sm font-medium cursor-pointer">
                      Numbers
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="symbols"
                    checked={options.includeSymbols}
                    onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeSymbols: !!checked }))}
                  />
                  <div className="flex items-center gap-2">
                    <AtSign className="w-4 h-4 text-warning" />
                    <label htmlFor="symbols" className="text-sm font-medium cursor-pointer">
                      Symbols
                    </label>
                  </div>
                </div>

                {!options.graphicalMode && (
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="emojis"
                      checked={options.includeEmojis}
                      onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeEmojis: !!checked }))}
                    />
                    <div className="flex items-center gap-2">
                      <Smile className="w-4 h-4 text-accent" />
                      <label htmlFor="emojis" className="text-sm font-medium cursor-pointer">
                        Include Emojis
                      </label>
                    </div>
                  </div>
                )}

                {options.includeEmojis && !options.graphicalMode && (
                  <div className="text-xs text-muted-foreground bg-secondary/30 p-2 rounded border border-border/30">
                    ⚠️ Note: Some websites may not accept emojis in passwords. Test compatibility before use.
                  </div>
                )}
              </div>
            </>
          )}

          {options.graphicalMode && (
            <div className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded border border-border/30 space-y-1">
              <p>
                ⚠️ <strong>Graphical Password Notice:</strong>
              </p>
              <p>• Pure visual passwords work best for personal use or compatible systems</p>
              <p>• Use Hybrid Mode to combine with traditional characters for broader compatibility</p>
              <p>• Pattern mode creates numeric sequences based on your drawing</p>
            </div>
          )}

          {/* Security Score */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Security Strength</span>
              </div>
              <Badge variant="secondary">{strength.label}</Badge>
            </div>

            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${strength.score}%` }}
              />
            </div>

            <p className="text-xs text-muted-foreground text-pretty">
              {strength.label === "Weak" && "Consider using more character types and increasing length."}
              {strength.label === "Medium" &&
                "Good password! Consider adding more character types for better security."}
              {strength.label === "Strong" &&
                `Excellent! This password provides strong security protection.${
                  options.graphicalMode
                    ? " Visual elements add extra uniqueness!"
                    : options.includeEmojis
                      ? " Emojis add extra uniqueness!"
                      : ""
                }`}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
