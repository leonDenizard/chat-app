export type LanguageOption = {
    code: string;
    label: string;
    flag: string;
    translate: boolean;
};

export const LANGUAGES: LanguageOption[] = [
    {
        code: "en-US",
        label: "English",
        flag: "/eua.png",
        translate: true,
    },
    {
        code: "zh",
        label: "Chinese",
        flag: "/china.png",
        translate: true,
    },
    {
        code: "es",
        label: "Spanish",
        flag: "/flag.png",
        translate: true,
    },
    {
        code: "pt-BR",
        label: "Brazil",
        flag: "/brazil.png",
        translate: false,
    },
];
