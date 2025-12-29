import { useEffect, useState } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Slider } from "../components/ui/slider"
import { Switch } from "../components/ui/switch"
import { Separator } from "../components/ui/separator"
import { Button } from "../components/ui/button"
import { Gauge, Moon, Sun } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"

const DEFAULT_SPEED = 2

export default function Home() {
    const [speed, setSpeed] = useState(DEFAULT_SPEED)
    const [smartResume, setSmartResume] = useState(true)
    const { theme, toggleTheme } = useTheme()

    /* ----------------------------------------
       Load saved preferences on popup open
    -----------------------------------------*/
    useEffect(() => {
        if (typeof chrome !== "undefined" && chrome.storage?.sync) {
            chrome.storage.sync.get(
                ["speed", "smartResume"],
                (data) => {
                    if (data.speed) setSpeed(data.speed)
                    if (typeof data.smartResume === "boolean")
                        setSmartResume(data.smartResume)
                }
            )
        }
    }, [])

    /* ----------------------------------------
       Persist changes
    -----------------------------------------*/
    const updateSpeed = (value) => {
        setSpeed(value)
        if (typeof chrome !== "undefined" && chrome.storage?.sync) {
            chrome.storage.sync.set({ speed: value })
        }
    }

    const toggleSmartResume = (value) => {
        setSmartResume(value)
        if (typeof chrome !== "undefined" && chrome.storage?.sync) {
            chrome.storage.sync.set({ smartResume: value })
        }
    }


    return (
        <div className="w-[360px] min-h-[400px] bg-background text-foreground">
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-2">
                <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-primary" />
                    <h1 className="text-lg font-semibold tracking-tight">
                        SpeedPilot
                    </h1>
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
            <p className="text-sm text-muted-foreground px-4 pb-4">
                Control YouTube playback speed by default
            </p>

            <Separator />

            <div className="p-4 space-y-6">
                {/* Speed Selector */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium">Default Speed</span>
                            <span className="text-sm font-semibold">
                                {speed.toFixed(2)}×
                            </span>
                        </div>

                        <div className="relative w-full">
                            <Slider
                                min={1}
                                max={3}
                                step={0.25}
                                value={[speed]}
                                onValueChange={(val) => updateSpeed(val[0])}
                            />
                            {/* Speed marks - subtle indicators at each speed increment */}
                            <div className="relative w-full h-1 mt-2 mb-1">
                                {[1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3].map((mark) => (
                                    <div
                                        key={mark}
                                        className="absolute w-[1px] h-1 bg-border"
                                        style={{
                                            left: `${((mark - 1) / (3 - 1)) * 100}%`,
                                            transform: 'translateX(-50%)'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Toggles */}
                <ToggleRow
                    label="Smart Resume"
                    description="Restore speed after ads & buffering"
                    checked={smartResume}
                    onChange={toggleSmartResume}
                />
            </div>

            <Separator />

            {/* Footer */}
            <div className="py-4 px-4">
                <p className="text-xs text-muted-foreground text-center">
                    Built for people who value their time
                </p>
                <p className="text-xs text-muted-foreground text-center mt-2">
                    © 2025
                </p>
            </div>
        </div>
    )
}

/* ----------------------------------------
   Small inline UI helper (NOT a folder)
-----------------------------------------*/
function ToggleRow({ label, description, checked, onChange }) {
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
