export type ProducerSection = { 
    type: "text"; 
    title: string; 
    content: string; 
};

export interface Beer {
    name: string;
    slug: string;
    location?: string; 
    dates?: string;    
    notes?: string;    
    type?: string; 
    images?: string[];
}

export interface GalleryAlbum {
    title: string;
    images: string[];
}

export interface ProducerData {
    name: string;
    slug?: string;
    banner: string;
    logo: string;
    location?: string;
    dates?: string;
    website?: string;
    socials?: { type: "instagram" | "facebook"; url: string }[];
    sections: ProducerSection[];
    beerLists: Record<string, any[]>; 
    gallery?: GalleryAlbum[];
    beerPortfolio?: Beer[]; 
}

export const producersMockData: Record<string, ProducerData> = {
    "closed-producers": {
        name: "Closed Lambic Brewers & Blenders",
        banner: "/images/closed-producers-banner.jpg",
        logo: "/images/closed-producers-logo.png",
        sections: [
            {
                type: "text",
                title: "Historical Context",
                content: `By the end of the 18th century, more than one hundred lambic producers once flourished in the old heart of Brussels. By 1900, only fifty were left within the city limits. [1] Of the 2,700 active breweries nationwide before 1900, only 200 (8%) were known to practice some form of spontaneous fermentation. [2] Prior to World War I, there were many lambic blenders. Nearly 300 merchants purchased young and old lambic for blending, which was most often served in their cafés. [3]\n\nThe 20th century brought obstacles to lambic brewers, World War I especially brought hardship to the Belgian brewing industry as a whole. Breweries were sometimes occupied, and equipment was often confiscated. Some brewers stopped brewing lambic entirely, in order to compete directly with a new influx of popular imports, such as German lagers and British ales. World War II again brought the closure of many breweries and supply shortages that limited lambic production. The latter half of the 20th century saw mergers and closures of smaller companies by larger conglomerates, and the rising popularity of sweetened lambic. [4]\n\nThe following list attempts to catalogue the lost lambic producers, documenting a significant part of Belgian brewing heritage. Breweries, blenderies, café blenders, as well as merchant contract brewers are all included here. While not fully comprehensive, it is an ongoing, open-ended research project that will continue to expand.`
            }
        ],
        beerLists: {
            "A": [
                { name: "Ankerhof", slug: "ankerhof", location: "Essene-Brabant", dates: "Closed", notes: "Historical producer" },
                { name: "l'Abeille", slug: "l-abeille", location: "Charleroi", dates: "Active 1900s", notes: "Produced Gueuze-Lambic Extra Vieux." }
            ],
            "B": [
                { name: "Baeten, L.", slug: "baeten-l", location: "Overmere", dates: "1886-1944", notes: "Also known as 'Brasserie Sept Etoiles'." },
                { name: "Bécasse-Steppé", slug: "becasse-steppe", location: "Anderlecht", dates: "Closed", notes: "Historical blender" },
                { name: "Belgor", slug: "belgor", location: "Brussegem", dates: "Closed", notes: "" },
                { name: "Brabrux", slug: "brabrux", location: "Wolvertem", dates: "Closed", notes: "" },
                { name: "Brasseries Unies", slug: "brasseries-unies", location: "Koekelberg/Brussels", dates: "Closed", notes: "" }
            ],
            "C": [
                { name: "Cantillon Fréres", slug: "cantillon-freres", location: "Lembeek", dates: "1894-1925", notes: "Supplied lambic to Cantillon Brewery." },
                { name: "Couronne", slug: "couronne", location: "Uccle", dates: "Closed", notes: "" },
                { name: "Crétens-Maeck", slug: "cretens-maeck", location: "St. Gilles-Brussels", dates: "Closed", notes: "" }
            ],
            "D": [
                { name: "De Boeck", slug: "de-boeck", location: "Koekelberg/Brussels", dates: "Closed", notes: "" },
                { name: "De Coster, Louis & Emile", slug: "de-coster-louis-emile", location: "Molenbeek", dates: "Closed", notes: "" },
                { name: "De Neve", slug: "de-neve", location: "Schepdaal", dates: "1792-1994", notes: "Acquired by Belle-Vue in 1975." }
            ],
            "E": [
                { name: "Espagne", slug: "espagne", location: "Brussels", dates: "Closed", notes: "" },
                { name: "Eylenbosch", slug: "eylenbosch", location: "Huizingen", dates: "1895-1965", notes: "Converted to lofts." }
            ],
            "G": [
                { 
                    name: "Goossens (Schepdaal)", 
                    slug: "goossens", 
                    location: "Isabellastraat 16, Schepdaal", 
                    dates: "Pre-1767 - 1960s", 
                    logo: "/images/shared/brewers_box.jpg", 
                    banner: "/images/shared/brewers_box.jpg",
                    sections: [
                        {
                            type: "text",
                            title: "History",
                            content: `The Goossens Brewery was founded in the village of Sint Gertrudis-Pede (Schepdaal) at Isabellastraat 16. The farm brewery was in existence prior to 1767, which is the date of an early renovation marked on the keystone of the farmhouse. The brewery site was on a river, which served as a water source and powered the on-site maltings plant, which once produced floor-malted barley. Nestor Franciscus Goossens (b.1884) was the brewer during the 20th century. The brewery was also known as "Brouwerij Sint Gertrude", and finally ceased operations in the 1960's. A 1967 listing of lambic brewers still included a "Br. Sinte Gertrude".\n\nAccording to a recent account by Frank Boon in July, 2014: "I visited this brewery in early 1970. The coppers were not present anymore, but there was a coolship and mashtun (in cast iron). Capacity of about 40 HL. They sold nearly all their beer as young lambic in small wooden casks without pressure and in casks from 80L, 180L and 250L for farmers and cafés. Geuze and Kriek only small production. I don't know about malting. I know there was a malting unit at De Neve Brewery which was at approx. 200 meters distance from Nestor Goossens."`
                        },
                        {
                            type: "text",
                            title: "21st Century Revival",
                            content: `In 1990, the brewery property was purchased from the heirs of the Goossens family, and was restored by Frans Appelmans and Yvette Mary, who also ran a construction business on the site.\n\nIn March 2016, the brewery site was sold to the Kestemont family after a year on the market. According to a 2016 article, a new brewery is planned for the site. After nearly 60 years, operations at the brewery have resumed once again in early 2019. Several hundred barrels of lambic have already been produced, holding over 20,000 liters. Francis Kestemont and his son Lias will oversee brewery operations, producing gueuze and kriek with their own Schaerbeek cherries within the next three years. A brasserie named Het Zesde Seizoen (The Sixth Season) is also planned for the site.`
                        },
                        {
                            type: "text",
                            title: "References",
                            content: "1. Pajottenland Archives 2016; 2. Frank Boon Interview 2014."
                        }
                    ],
                    beerPortfolio: [
                        { name: "Gueuze Goossens", slug: "gueuze-goossens", type: "Gueuze", notes: "", images: ["/images/closed-producers/goossens/gueuze-goossens.jpg"] },
                        { name: "Kriek Goossens", slug: "kriek-goossens", type: "Kriek", notes: "" },
                        { name: "Jonge Lambiek", slug: "jonge-lambiek", type: "Lambic", notes: "" }
                    ]
                }
            ],
            "W": [
                { name: "Winderickx", slug: "winderickx", location: "Dworp", dates: "Closed", notes: "Famous for Gueuze" }
            ]
        }
    }
};