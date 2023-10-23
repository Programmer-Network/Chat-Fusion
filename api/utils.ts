import fs from "fs";
import Linkify from "linkify-it";
import { promisify } from "util";

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const linkify = Linkify();

const hexColors = [
    "#F43F5E",
    "#F87171",
    "#F94144", // rose
    "#C084FC",
    "#A855F7",
    "#9333EA", // fuchsia
    "#8B5CF6",
    "#7C3AED",
    "#6D28D9", // purple
    "#9333EA",
    "#7C3AED",
    "#6D28D9", // violet
    "#6366F1",
    "#4F46E5",
    "#4338CA", // indigo
    "#3B82F6",
    "#2563EB",
    "#1D4ED8", // blue
    "#60A5FA",
    "#3B82F6",
    "#2563EB", // sky
    "#22D3EE",
    "#06B6D4",
    "#0891B2", // cyan
    "#2DD4BF",
    "#14B8A6",
    "#0D9488", // teal
    "#10B981",
    "#059669",
    "#047857", // emerald
    "#22C55E",
    "#16A34A",
    "#15803D", // green
    "#65A30D",
    "#4D7C0F",
    "#3F6212", // lime
    "#FACC15",
    "#EAB308",
    "#CA8A04", // yellow
    "#FDBA74",
    "#F97316",
    "#EA580C", // amber
    "#FB923C",
    "#F97316",
    "#EA580C", // orange
    "#EF4444",
    "#DC2626",
    "#B91C1C", // red
];

export const getRandomHexColor = (): string => {
    const randomIndex = Math.floor(Math.random() * hexColors.length);
    return hexColors[randomIndex];
};

export const parseLinks = (content: string): string[] => {
    const matches = linkify.match(content);

    return matches ? matches.map((match: { url: string }) => match.url) : [];
};

export const saveLinks = async (newLinks: string[]): Promise<void> => {
    try {
        const links = JSON.parse(
            await readFileAsync("links.json", "utf-8")
        ) as string;

        await writeFileAsync(
            "links.json",
            JSON.stringify([...new Set([...links, ...newLinks])])
        );
    } catch (err) {
        console.error(err);
    }
};
