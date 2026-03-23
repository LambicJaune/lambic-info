export type ProducerSection =
    | { type: "text"; title: string; content: string; };

export interface BottleLogEntry {
    id: string;
    displayOrder: number;
    date: string;
    season: string;
    bottleCount?: string;
    size: string;
    notes?: string;
}

export interface BeerDetail {
    name: string;
    slug: string;
    labelImage: string;
    description: string;
    sections: { title: string; content: string }[];
    bottleLog: BottleLogEntry[];
    references?: string[];
}

export interface Beer {
    name: string;
    slug: string;
    abv?: string;
    type: string;          // New field
    bottlingDate?: string; // New field
    bottleCount?: string;  // New field
    size?: string;         // New field
    notes?: string;        // New field (descriptions)
}

export interface ProducerData {
    name: string;
    banner: string;
    logo: string;
    sections: ProducerSection[];
    beerCategories: { name: string; slug: string; image: string; type?: string }[];
    beerLists: Record<string, Beer[]>;
    beerDetails?: Record<string, BeerDetail>;
    categoryDescriptions?: Record<string, string>;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    openingHours?: string;
    socials?: { type: "instagram" | "facebook"; url: string; }[];
}

export const producersMockData: Record<string, ProducerData> = {
    biir: {
        name: "BIIR",
        banner: "/images/brewers-and-blenders/biir/banner.jpg",
        logo: "/images/brewers-and-blenders/biir/logo.png",
        website: "http://biir.cat/",
        socials: [
            { type: "facebook", url: "https://www.facebook.com/biirbeer" }
        ],
        sections: [
            {
                type: "text",
                title: "Overview",
                content: `BIIR is a brewery in Spain that produces a variety of IPAs and other craft beers. One of their partners, Gunther Bensch, has worked around lambic for many years. Gunther previously represented Girardin at beer festivals, and created the first Lambic - Tripel blend at the brewery Dilewyns. In 2014, BIIR released two lambic blends, a kriek and a gueuze. It is unclear what base lambic is being used in this initiative.`
            }
        ],
        beerCategories: [
            { name: "Gueuze", slug: "gueuze", image: "/images/shared/gueuze_box.jpg" },
            { name: "Fruit lambic", slug: "fruit-lambic", image: "/images/shared/fruit_lambic_box.jpg" }
        ],
        beerLists: {
            "gueuze": [{ 
                name: "4B Oude Gueuze", 
                slug: "4b-oude-gueuze", 
                type: "Gueuze", 
                bottlingDate: "2014", 
                size: "75cl", 
                notes: "Blend of four lambic beers from four different brewers at four different ages (36, 24, 18 & 12 months)." 
            }],
            "fruit-lambic": [{ 
                name: "Sweet-Sour Red Series", 
                slug: "sweet-sour-red", 
                type: "Fruit Lambic", 
                bottlingDate: "2014", 
                size: "75cl", 
                notes: "100% lambic beer aged up to 36 months with 450gr/l of whole cherries and raspberries." 
            }]
        }
    },

    "h-ertie": {
        name: "Huisstekerij h.ertie",
        banner: "/images/brewers-and-blenders/h-ertie/banner.jpg",
        logo: "/images/brewers-and-blenders/h-ertie/logo.png",
        address: "Duisburg, Germany",
        sections: [
            {
                type: "text",
                title: "Overview",
                content: `Huisstekerij h.ertie is an independent blendery run by Ulrich Kremer (known as “Uli”) that is known for its experimental style. While many of Uli’s blends are lambic-only, he also experiments widely with lambic/non-lambic blends (stout, trappist, wheat, rauchbier). Many batches are extremely small - often 4-6 bottles - and most are given to friends rather than commercially sold.`
            }
        ],
        beerCategories: [
            { name: "Gueuze", slug: "gueuze", image: "/images/shared/gueuze_box.jpg" },
            { name: "Fruit lambic", slug: "fruit-lambic", image: "/images/shared/fruit_lambic_box.jpg" },
            { name: "Others", slug: "others", image: "/images/shared/other_lambics_box.jpg" }
        ],
        beerLists: {
            "gueuze": [
                { name: "Alvinne Huis-Geuze", slug: "alvinne-huis-geuze", type: "Gueuze", notes: "Uli's blend for Alvinne." },
                { name: "Geuze ACBF '12", slug: "geuze-acbf-12", type: "Gueuze", bottlingDate: "2012" },
                { name: "Geuze Oud Beersel Oud & Nieuw Speciaal", slug: "geuze-oud-beersel-speciaal", type: "Gueuze" },
                { name: "Eszett Gueuze", slug: "eszett-gueuze", type: "Gueuze" }
            ],
            "fruit-lambic": [
                { name: "Druivenlambik Domina Edelhof", slug: "druivenlambik-domina", type: "Fruit Lambic" },
                { name: "Fruitlambik Blondelle Rood", slug: "blondelle-rood", type: "Fruit Lambic" },
                { name: "Fruitlambik Late Crazy Birthday Beer '12", slug: "late-crazy-birthday", type: "Fruit Lambic", bottlingDate: "2012" },
                { name: "Fruitlambik Sleedorn", slug: "fruitlambik-sleedorn", type: "Fruit Lambic" },
                { name: "Kriekenlambik meets Pannepot", slug: "kriekenlambik-pannepot", type: "Fruit Lambic" },
                { name: "Lambik Framfort 8", slug: "lambik-framfort-8", type: "Fruit Lambic" }
            ],
            "others": [
                { name: "Fruitlambik Smoked Stoutfort", slug: "smoked-stoutfort", type: "Others" },
                { name: "Lambik 3 Fonteinen Meets Orval", slug: "3f-meets-orval", type: "Others" },
                { name: "Lambik Peated Weizen", slug: "peated-weizen", type: "Others" },
                { name: "Lambik Trippel", slug: "lambik-trippel", type: "Others" },
                { name: "Lambik Special Sat B", slug: "lambik-special-sat-b", type: "Others" }
            ]
        }
    },
    "debris-hills": {
        name: "Debris Hills",
        banner: "/images/shared/generic-banner.jpg",
        logo: "/images/shared/generic-logo.png",
        address: "Meerhout, Belgium",
        sections: [{ type: "text", title: "Overview", content: "Debris Hills is a non-commercial homebrewing and blending project lead by Ken Lodewijckx, that regularly experiments with lambic." }],
        beerCategories: [], beerLists: {}
    },
    "de-brouwer": {
        name: "De Brouwer",
        banner: "/images/shared/generic-banner.jpg",
        logo: "/images/shared/generic-logo.png",
        address: "Halle, Belgium",
        sections: [{ type: "text", title: "Overview", content: "Andy De Brouwer is a well known Belgian sommelier. He created experimental blends using lambic from Den Herberg and Ambreus." }],
        beerCategories: [], beerLists: {}
    },
    "duron-blending": {
        name: "Duron Blending",
        banner: "/images/shared/generic-banner.jpg",
        logo: "/images/shared/generic-logo.png",
        address: "Antwerp, Belgium",
        sections: [{ type: "text", title: "Overview", content: "Independent blendery created by Bart Duron in 2020 during Covid lockdown. Coming soon." }],
        beerCategories: [], beerLists: {}
    },
    "selle": {
        name: "Huisstekerij Selle",
        banner: "/images/shared/generic-banner.jpg",
        logo: "/images/shared/generic-logo.png",
        address: "Antwerp, Belgium",
        sections: [{ type: "text", title: "Overview", content: "A very small blending project ran by David Selle." }],
        beerCategories: [], beerLists: {}
    },
    "limproviste": {
        name: "L'improviste",
        banner: "/images/shared/generic-banner.jpg",
        logo: "/images/shared/generic-logo.png",
        address: "Westerlo, Belgium",
        sections: [{ type: "text", title: "Overview", content: "Blending project started in 2023. Description TBC." }],
        beerCategories: [], beerLists: {}
    },
    "neill-and-ross": {
        name: "Neill and Ross",
        banner: "/images/shared/generic-banner.jpg",
        logo: "/images/shared/generic-logo.png",
        address: "Belfelfast, Ireland",
        sections: [{ type: "text", title: "Overview", content: "Collaboration between two independent blenders that created Shot in the Dark (Girardin lambic with blackberries)." }],
        beerCategories: [], beerLists: {}
    },
    "onderkelderd": {
        name: "Onderkelderd",
        banner: "/images/shared/generic-banner.jpg",
        logo: "/images/shared/generic-logo.png",
        address: "Belgium",
        sections: [{ type: "text", title: "Overview", content: "Homeblender experimenting with small batches in his cellar." }],
        beerCategories: [], beerLists: {}
    },
    "owa": {
        name: "OWA",
        banner: "/images/shared/generic-banner.jpg",
        logo: "/images/shared/generic-logo.png",
        address: "Brussels, Belgium",
        sections: [{ type: "text", title: "Overview", content: "OWA specializes in adding Japanese elements like Sakura, Ume, and Yuzu to traditional Belgian beers." }],
        beerCategories: [], beerLists: {}
    },
    "pouckie-blended": {
        name: "Pouckie Blended",
        banner: "/images/shared/generic-banner.jpg",
        logo: "/images/shared/generic-logo.png",
        address: "Oedelem, Belgium",
        sections: [{ type: "text", title: "Overview", content: "Project by Bart Vanboucke using lambic from Lambiek Fabriek, De Troch, Lindemans, and Den Herberg." }],
        beerCategories: [
            { name: "Gueuze", slug: "gueuze", image: "/images/shared/gueuze_box.jpg" },
            { name: "Fruit lambic", slug: "fruit-lambic", image: "/images/shared/fruit_lambic_box.jpg" }
        ],
        beerLists: {
            "gueuze": [{ name: "Geuze", slug: "geuze", type: "Gueuze" }],
            "fruit-lambic": [
                { name: "Peach Lambic", slug: "peach", type: "Fruit Lambic" },
                { name: "Blueberry Lambic", slug: "blueberry", type: "Fruit Lambic" },
                { name: "Raspberry Lambic", slug: "raspberry", type: "Fruit Lambic" }
            ]
        }
    },
    "pomphuizeke": {
        name: "‘t Pomphuizeke",
        banner: "/images/shared/generic-banner.jpg",
        logo: "/images/shared/generic-logo.png",
        address: "Ghent, Belgium",
        sections: [{ type: "text", title: "Overview", content: "Started in 2015 and went commercial in 2024. Uses lambics from Lindemans, De Troch, and Girardin." }],
        beerCategories: [], beerLists: {}
    },
    "gueuze-society": {
        name: "The Gueuze Society",
        banner: "/images/shared/generic-banner.jpg",
        logo: "/images/shared/generic-logo.png",
        address: "Eizeringen, Belgium",
        sections: [{ type: "text", title: "Overview", content: "Occasionally blends beers for private use by members of Het Geuzegenootschap." }],
        beerCategories: [], beerLists: {}
    },
    "vanberg-dewulf": {
        name: "Vanberg & DeWulf",
        banner: "/images/shared/generic-banner.jpg",
        logo: "/images/shared/generic-logo.png",
        address: "Cooperstown, NY, USA",
        sections: [{ type: "text", title: "Overview", content: "American import company that specialized in Belgian beers and blended lambic under their own labels." }],
        beerCategories: [], beerLists: {}
    }
};