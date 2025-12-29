import { useEffect, useState } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Switch } from "../components/ui/switch"
import { Separator } from "../components/ui/separator"
import { Button } from "../components/ui/button"
import { Slider } from "../components/ui/slider"
import { useTheme } from "../contexts/ThemeContext"
import { Moon, Sun } from "lucide-react"

export default function Settings() {
    const [autoApply, setAutoApply] = useState(true)
    const [maxSpeed, setMaxSpeed] = useState(3)
    const [keyboardShortcuts, setKeyboardShortcuts] = useState(true)
    const { theme, toggleTheme } = useTheme()

    /* ----------------------------------------
       Load settings
    -----------------------------------------*/
    useEffect(() => {
        if (typeof chrome !== "undefined" && chrome.storage?.sync) {
            chrome.storage.sync.get(
                ["autoApply", "maxSpeed", "keyboardShortcuts"],
                (data) => {
                    if (typeof data.autoApply === "boolean")
                        setAutoApply(data.autoApply)
                    if (data.maxSpeed) setMaxSpeed(data.maxSpeed)
                    if (typeof data.keyboardShortcuts === "boolean")
                        setKeyboardShortcuts(data.keyboardShortcuts)
                }
            )
        }
    }, [])

    /* ----------------------------------------
       Persist changes
    -----------------------------------------*/
    const updateAutoApply = (value) => {
        setAutoApply(value)
        if (typeof chrome !== "undefined" && chrome.storage?.sync) {
            chrome.storage.sync.set({ autoApply: value })
        }
    }

    const updateKeyboardShortcuts = (value) => {
        setKeyboardShortcuts(value)
        if (typeof chrome !== "undefined" && chrome.storage?.sync) {
            chrome.storage.sync.set({ keyboardShortcuts: value })
        }
    }

    const updateMaxSpeed = (value) => {
        setMaxSpeed(value)
        if (typeof chrome !== "undefined" && chrome.storage?.sync) {
            chrome.storage.sync.set({ maxSpeed: value })
        }
    }

    const resetDefaults = () => {
        const defaults = {
            autoApply: true,
            maxSpeed: 3,
            keyboardShortcuts: true,
        }

        setAutoApply(true)
        setMaxSpeed(3)
        setKeyboardShortcuts(true)

        if (typeof chrome !== "undefined" && chrome.storage?.sync) {
            chrome.storage.sync.set(defaults)
        }
    }

    return (
        <div className="w-[360px] min-h-[400px] bg-background text-foreground">
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-2">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">
                        Settings
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Fine-tune how SpeedPilot behaves
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-8 w-8"
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                </Button>
            </div>

            <Separator />

            <div className="p-4 space-y-6">
                {/* Behavior */}
                <Card>
                    <CardContent className="pt-6 space-y-4">
                    <SettingRow
                        label="Auto Apply on Load"
                        description="Apply preferred speed as soon as video loads"
                        checked={autoApply}
                        onChange={updateAutoApply}
                    />

                    <SettingRow
                        label="Keyboard Shortcuts"
                        description="Enable speed control using keyboard"
                        checked={keyboardShortcuts}
                        onChange={updateKeyboardShortcuts}
                    />
                </CardContent>
            </Card>

                {/* Limits */}
                <Card>
                    <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium">
                            Maximum Speed Limit
                        </span>
                        <span className="text-sm font-semibold">
                            {maxSpeed.toFixed(2)}×
                        </span>
                    </div>

                    <Slider
                        min={1.25}
                        max={3}
                        step={0.25}
                        value={[maxSpeed]}
                        onValueChange={(val) => updateMaxSpeed(val[0])}
                    />

                    <p className="text-xs text-muted-foreground mt-2">
                        Prevents accidental extreme playback speeds
                    </p>
                </CardContent>
            </Card>

                {/* Reset */}
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={resetDefaults}
                >
                    Reset to Defaults
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                    Changes are saved automatically
                </p>
            </div>
        </div>
    )
}

/* ----------------------------------------
   Inline helper (same philosophy as Home)
-----------------------------------------*/
function SettingRow({ label, description, checked, onChange }) {
    return (
        <div className="flex items-center justify-between">
            <div className="pr-4 flex-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {description}
                </p>
            </div>
            <Switch checked={checked} onCheckedChange={onChange} />
        </div>
    )
}
