import { Button } from "@/src/components/ui/button";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarShortcut, MenubarTrigger } from "@/src/components/ui/menubar";
import { useThemeStore } from "@/src/store/themeStore";
import { Palette } from "lucide-react";


export default function ThemeColorToggle() {
    const { toggleColorScheme } = useThemeStore();

    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger asChild>
                    <Button
                        className="border border-sand/20 bg-primary/10 hover:bg-primary/20 text-softwhite"
                        title="Choose theme color"
                    >
                        <Palette className="h-5 w-5" />
                    </Button>
                </MenubarTrigger>
                <MenubarContent>
                    <MenubarItem onClick={() => toggleColorScheme('ocean')}>
                        Theme Ocean <MenubarShortcut>⌘O</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => toggleColorScheme('sunset')}>
                        Theme Sunset <MenubarShortcut>⌘S</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => toggleColorScheme('blue')}>
                        Theme Blue <MenubarShortcut>⌘S</MenubarShortcut>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}