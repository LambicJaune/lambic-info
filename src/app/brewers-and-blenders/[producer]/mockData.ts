// src/app/brewers-and-blenders/[producer]/mockData.ts
import { StaticImageData } from "next/image";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

export type ProducerSection =
    | {
        type: "text";
        title: string;
        content: string;
    }
    | {
        type: "zwanze";
        title: string;
        description?: string;
        subTitle?: string;
        beers: { id: number; name: string; img: string }[];
    };


export interface ProducerData {
    name: string;
    banner: string;
    logo: string;
    sections: ProducerSection[];
    beerCategories: {
        name: string;
        slug: string;
        image: string;
    }[];
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    openingHours?: string;
    socials?: {
        type: "instagram" | "facebook";
        url: string;
    }[];
}

export const producersMockData: Record<string, ProducerData> = {
    cantillon: {
        name: "Cantillon",
        banner:
            "/images/brewers-and-blenders/cantillon/cantillon-banner.jpg",
        logo:
            "/images/brewers-and-blenders/cantillon/CantillonSidebarLogo.png",
        website: "https://www.cantillon.be",
        email: "info@cantillon.be",
        phone: "+32 2 521 49 28",
        address: "56 Rue Gheude, B-1070 Brussels, Belgium",
        openingHours: "Mon–Tue + Thu-Sat 10am–5pm (last call is 4pm, store open until 5pm)",
        socials: [
            { type: "instagram", url: "https://www.instagram.com/brasseriecantillonofficiel/" },
            { type: "facebook", url: "https://www.facebook.com/pages/Brasserie-Cantillon/110627652322553" },
        ],
        sections: [
            {
                type: "text",
                title: "Overview",
                content: `
Cantillon is the only traditional lambic brewery located within the city of Brussels. Founded in 1900, today Cantillon operates both as a brewery and as a living museum, the Brussels Gueuze Museum (Musée bruxellois de la gueuze). Cantillon uses 100% organic grains and hops in all of its beers. Cantillon brews traditional lambic products, using 65% malted barley and 35% unmalted wheat. The beers are spontaneously fermented using a large coolship in the attic of the brewery and then fermented in oak barrels.

In addition to their flagship beers, Cantillon brews a variety of beers for special occasions and experimental releases. The brewery hosts Zwanze Day, Quintessence, and Cantillon Public Brewing Sessions. Cantillon also participates in the Weekend of Spontaneous Fermentation, the Night of the Great Thirst, and a variety of other festivals worldwide.
        `,
            },
            {
                type: "text",
                title: "History",
                content: `
The roots of Brasserie Cantillon stretch back even further than the brewery’s officially recognized founding date of 1900. According to Van den Steen in Geuze & Kriek: The Secret of Lambic Beer, the forefather of the Cantillon brewing family was a grain merchant named Auguste whose son, Paul, had no intention of continuing his father’s craft. Auguste then began to search for a business that would suit his son’s brewing hobby. Since starting a brewery was too expensive, Auguste made several attempts to take over breweries in the Lembeek area. By 1894, Auguste had bought the Vandezande-Van Roy brewery located in Lembeek’s Hondzocht district, which was active until 1925 as Cantillon Fréres.[1]

By 1900, Paul Cantillon and his wife Marie Troch began a gueuze blending business in the industrial quarter of Cureghem which was part of the southern Brussels community of Anderlecht. The brewery was located in a very busy area near the Bruxelles-Midi train station, the Mons boulevard, and the canal that ran through the city. Jean-Pierre Van Roy, who wrote the forward to La Gueuze Gourmande, calls the period between 1900-1937 the "première periode de la brasserie." During these first thirty-seven years, Cantillon never actually brewed a beer. Instead, they bought lambic from a variety of producers in the area to blend and sell on their own, considering Cantillon a biersteker (beer blender) and marchand de bières (beer merchant). They would house their beers at Gheudestraat 56-58, where the brewery is located today.[2]

Paul and Marie had four children, two sons named Robert and Marcel, and two daughters named Georgette and Fernande. The early years of Cantillon produced unblended lambic, mars, faro, gueuze, kriek, and framboise. After the First World War, Paul was ready to expand the business and bring his two sons into the fold. In 1937, Paul, Robert, and Marcel purchased the Brasserie Nationale du Néblon, located in Ouffet, which had closed the previous year. They moved the brewing equipment to its current location, and the first batch of Cantillon’s own beer was brewed in 1938, shortly before the brothers were called to mobilize for World War II.[1]
        `,
            },
            {
                type: "text",
                title: "Underground Cellar",
                content: `
In 2011, Jean started a long-term lambic aging process in cooperation with the city of Brussels. The city is providing the underground cellaring space free of charge where Cantillon plans to eventually age 60,000-80,000 bottles in long-term storage over twenty years. He plans to focus primarily on aging Gueuze, Bruocsella Grand Cru, and Lou Pepe Kriek, but will also incorporate smaller aging initiatives with other Cantillon beers [6].

This cellaring project is the largest of its kind for aging lambic. Chuck Cook at drinkbelgianbeer.com visited in 2014 and wrote of his experience.[7].
        `,
            },
            {
                type: "text",
                title: "Production Notes",
                content: `
Cantillon follows traditional lambic brewing processes, with the following notable facts:

- Until 1990, Cantillon used a foeder for blending. Since then however, fruit additions and lambic blending is done in stainless tanks to allow for larger, more consistent blends and ease of blending and cleaning.[8]
- The fruit is flash frozen, allowing the beers to be brewed throughout the season using consistent fruit. Previously, because fresh fruit drove the brewing process, Cantillon would potentially have to use older or younger lambic to time the process around the fruit harvest.
- Cantillon uses pipes (primarily wine barrels from France, Italy, and Spain) rather than foeders for aging lambic.[1]
- Small blends and test batches are done in 20 L vessels rather than the stainless tanks. Due to the size of these experiments, many of the beers discussed below are not intended for public consumption
- Late in the season, the 1-year-old lambic is closer to 18-20 months old and no longer has enough residual sugar for natural secondary fermentation in the bottle. In those cases, Cantillon will add 2-3 g/L of liquid saccharose. [9]
- Cantillon historically sourced hops from large local hop farms in cities such as Asse and Affligem, Belgium. Over time, these farms have shrunk. In the 1970s, Cantillon was sourcing hops from the Yakima Valley in Washington. Currently, most hops come from Germany, however in 2012 and 2013, the hops did not age well and Cantillon is looking to move back to US hops.[10]
- In the 1980s and 1990s, Cantillon often used colored foils to designate the style of beer. Gold or yellow foil indicated gueuze, red foil was used for kriek, purple or silver foil was used for framboise.
        `,
            },
            {
                type: "zwanze",
                title: "Zwanze Day",
                description: `Since 2008, Cantillon has released a special beer known as Zwanze. The beer is usually experimental in nature and may or may not be brewed again. Since 2011, there has been a coordinated celebration around the world to introduce the newest iteration of Zwanze.

    Beginning in 2024, Zwanze will be celebrated every other year, alternating with [Quintessence]. You can read more in detail about this event [here].`,
                subTitle: "Zwanze Series",
                beers: [
                    { id: 1, name: "Zwanze 2008", img: "/images/breweries/cantillon/zwanze-1.jpg" },
                    { id: 2, name: "Zwanze 2009", img: "/images/breweries/cantillon/zwanze-2.jpg" },
                    { id: 3, name: "Zwanze 2010", img: "/images/breweries/cantillon/zwanze-3.jpg" },
                    { id: 4, name: "Zwanze 2011", img: "/images/breweries/cantillon/zwanze-4.jpg" },
                    { id: 5, name: "Zwanze 2012", img: "/images/breweries/cantillon/zwanze-5.jpg" },
                    { id: 6, name: "Zwanze 2013", img: "/images/breweries/cantillon/zwanze-6.jpg" },
                ],
            },
        ],
        beerCategories: [
            { name: "Gueuze", slug: "gueuze", image: "/images/brewers-and-blenders/gueuze_box.jpg" },
            { name: "Faro", slug: "faro", image: "/images/brewers-and-blenders/faro_box.jpg" },
            { name: "Fruit lambic", slug: "fruit-lambic", image: "/images/brewers-and-blenders/fruit_lambic_box.jpg" },
            { name: "Grape lambic", slug: "grape-lambic", image: "/images/brewers-and-blenders/grape_lambic_box.jpg" },
            { name: "Special barrels", slug: "special-barrels", image: "/images/brewers-and-blenders/special_barrels_box.jpg" },
            { name: "Young Lambic", slug: "young-lambic", image: "/images/brewers-and-blenders/young_lambic_box.jpg" },
            { name: "Old Lambic", slug: "old-lambic", image: "/images/brewers-and-blenders/old_lambic_box.jpg" },
            { name: "Others", slug: "others", image: "/images/brewers-and-blenders/other_lambics_box.jpg" },
        ],
    },
};