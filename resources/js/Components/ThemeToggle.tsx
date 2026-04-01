import { Menu, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { Moon, Sun, Monitor, Check } from "lucide-react"
import { useTheme } from "@/Contexts/ThemeProvider"
import { cn } from "@/utils"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { name: "light", icon: Sun, label: "Light" },
    { name: "dark", icon: Moon, label: "Dark" },
    { name: "system", icon: Monitor, label: "System" },
  ] as const

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-2 w-36 origin-top-right rounded-md border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none">
          {themes.map((t) => (
            <Menu.Item key={t.name}>
              {({ active }) => (
                <button
                  onClick={() => setTheme(t.name)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors",
                    active ? "bg-accent text-accent-foreground" : "",
                    theme === t.name ? "bg-accent/50" : ""
                  )}
                >
                  <t.icon className="h-4 w-4" />
                  <span>{t.label}</span>
                  {theme === t.name && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
