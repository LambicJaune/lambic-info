export type ProducerSection =
    | { type: "text"; title: string; content: string; }
    | { type: "zwanze"; title: string; description?: string; subTitle?: string; beers: { id: number; name: string; img: string }[]; };

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
}

export interface ProducerData {
    name: string;
    banner: string;
    logo: string;
    sections: ProducerSection[];
    beerCategories: { name: string; slug: string; image: string; }[];
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
    cantillon: {
        name: "Cantillon",
        banner: "/images/brewers-and-blenders/cantillon/cantillon-banner.jpg",
        logo: "/images/brewers-and-blenders/cantillon/CantillonSidebarLogo.png",
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
                content: `Cantillon is the only traditional lambic brewery located within the city of Brussels. Founded in 1900, today Cantillon operates both as a brewery and as a living museum, the Brussels Gueuze Museum (Musée bruxellois de la gueuze). Cantillon uses 100% organic grains and hops in all of its beers. Cantillon brews traditional lambic products, using 65% malted barley and 35% unmalted wheat. The beers are spontaneously fermented using a large coolship in the attic of the brewery and then fermented in oak barrels.\n\nIn addition to their flagship beers, Cantillon brews a variety of beers for special occasions and experimental releases. The brewery hosts Zwanze Day, Quintessence, and Cantillon Public Brewing Sessions. Cantillon also participates in the Weekend of Spontaneous Fermentation, the Night of the Great Thirst, and a variety of other festivals worldwide.`
            },
            {
                type: "text",
                title: "History",
                content: `The roots of Brasserie Cantillon stretch back even further than the brewery’s officially recognized founding date of 1900. According to Van den Steen in Geuze & Kriek: The Secret of Lambic Beer, the forefather of the Cantillon brewing family was a grain merchant named Auguste whose son, Paul, had no intention of continuing his father’s craft. Auguste then began to search for a business that would suit his son’s brewing hobby. Since starting a brewery was too expensive, Auguste made several attempts to take over breweries in the Lembeek area. By 1894, Auguste had bought the Vandezande-Van Roy brewery located in Lembeek’s Hondzocht district, which was active until 1925 as Cantillon Fréres.[1]\n\nBy 1900, Paul Cantillon and his wife Marie Troch began a gueuze blending business in the industrial quarter of Cureghem which was part of the southern Brussels community of Anderlecht. The brewery was located in a very busy area near the Bruxelles-Midi train station, the Mons boulevard, and the canal that ran through the city. Jean-Pierre Van Roy, who wrote the forward to La Gueuze Gourmande, calls the period between 1900-1937 the "première periode de la brasserie." During these first thirty-seven years, Cantillon never actually brewed a beer. Instead, they bought lambic from a variety of producers in the area to blend and sell on their own, considering Cantillon a biersteker (beer blender) and marchand de bières (beer merchant). They would house their beers at Gheudestraat 56-58, where the brewery is located today.[2]\n\nPaul and Marie had four children, two sons named Robert and Marcel, and two daughters named Georgette and Fernande. The early years of Cantillon produced unblended lambic, mars, faro, gueuze, kriek, and framboise. After the First World War, Paul was ready to expand the business and bring his two sons into the fold. In 1937, Paul, Robert, and Marcel purchased the Brasserie Nationale du Néblon, located in Ouffet, which had closed the previous year. They moved the brewing equipment to its current location, and the first batch of Cantillon’s own beer was brewed in 1938, shortly before the brothers were called to mobilize for World War II.[1]`
            },
            {
                type: "text",
                title: "Underground Cellar",
                content: `In 2011, Jean started a long-term lambic aging process in cooperation with the city of Brussels. The city is providing the underground cellaring space free of charge where Cantillon plans to eventually age 60,000-80,000 bottles in long-term storage over twenty years. He plans to focus primarily on aging Gueuze, Bruocsella Grand Cru, and Lou Pepe Kriek, but will also incorporate smaller aging initiatives with other Cantillon beers [6].\n\nThis cellaring project is the largest of its kind for aging lambic. Chuck Cook at drinkbelgianbeer.com visited in 2014 and wrote of his experience.[7].`
            },
            {
                type: "text",
                title: "Production Notes",
                content: `Cantillon follows traditional lambic brewing processes, with the following notable facts:\n\n- Until 1990, Cantillon used a foeder for blending. Since then however, fruit additions and lambic blending is done in stainless tanks to allow for larger, more consistent blends and ease of blending and cleaning.[8]\n- The fruit is flash frozen, allowing the beers to be brewed throughout the season using consistent fruit. Previously, because fresh fruit drove the brewing process, Cantillon would potentially have to use older or younger lambic to time the process around the fruit harvest.\n- Cantillon uses pipes (primarily wine barrels from France, Italy, and Spain) rather than foeders for aging lambic.[1]\n- Small blends and test batches are done in 20 L vessels rather than the stainless tanks. Due to the size of these experiments, many of the beers discussed below are not intended for public consumption\n- Late in the season, the 1-year-old lambic is closer to 18-20 months old and no longer has enough residual sugar for natural secondary fermentation in the bottle. In those cases, Cantillon will add 2-3 g/L of liquid saccharose. [9]\n- Cantillon historically sourced hops from large local hop farms in cities such as Asse and Affligem, Belgium. Over time, these farms have shrunk. In the 1970s, Cantillon was sourcing hops from the Yakima Valley in Washington. Currently, most hops come from Germany, however in 2012 and 2013, the hops did not age well and Cantillon is looking to move back to US hops.[10]\n- In the 1980s and 1990s, Cantillon often used colored foils to designate the style of beer. Gold or yellow foil indicated gueuze, red foil was used for kriek, purple or silver foil was used for framboise.`
            },
            {
                type: "zwanze",
                title: "Zwanze Day",
                description: `Since 2008, Cantillon has released a special beer known as Zwanze. The beer is usually experimental in nature and may or may not be brewed again. Since 2011, there has been a coordinated celebration around the world to introduce the newest iteration of Zwanze.\n\nBeginning in 2024, Zwanze will be celebrated every other year, alternating with [Quintessence]. You can read more in detail about this event [here].`,
                subTitle: "Zwanze Series",
                beers: [
                    { id: 1, name: "Zwanze 2008", img: "/images/breweries/cantillon/zwanze-1.jpg" },
                    { id: 2, name: "Zwanze 2009", img: "/images/breweries/cantillon/zwanze-2.jpg" },
                    { id: 3, name: "Zwanze 2010", img: "/images/breweries/cantillon/zwanze-3.jpg" },
                    { id: 4, name: "Zwanze 2011", img: "/images/breweries/cantillon/zwanze-4.jpg" },
                    { id: 5, name: "Zwanze 2012", img: "/images/brewers-and-blenders/cantillon/Zwanze_2012.jpg" },
                    { id: 6, name: "Zwanze 2013", img: "/images/brewers-and-blenders/cantillon/Zwanze_2013.jpeg" },
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
            { name: "Other Lambics", slug: "others", image: "/images/brewers-and-blenders/other_lambics_box.jpg" },
            { name: "Lambic Hybrids", slug: "others", image: "/images/brewers-and-blenders/lambic_hybrid_box.png" },
        ],
        categoryDescriptions: {
            "grape-lambic": "Cantillon has, over time, done more lambic and grape experiments than any single fruit. This list has been broken out of the fruited lambic category and given its own section to reflect this. This category does not include blends of lambic aged in specific wine barrels which do not contain fruit."
        },
        beerLists: {
            "gueuze": [
                { name: "Amitié & Joie 40ème Anniversaire Super Gueuze", slug: "amitie-joie-40" }, 
                { name: "Brabantiae", slug: "brabantiae" }, 
                { name: "Chouke", slug: "chouke" },
                { name: "Classic Gueuze 100% Lambic", slug: "classic-gueuze" }, 
                { name: "Crémant de Gueuze", slug: "cremant-de-gueuze" }, 
                { name: "Crianza Helena", slug: "crianza-helena" },
                { name: "Cuvée de Florian", slug: "cuvee-de-florian" }, 
                { name: "Cuvée de l'Espérance", slug: "cuvee-de-lesperance" }, 
                { name: "Cuvée du 120eme", slug: "cuvee-du-120eme" },
                { name: "Cuvée du 25eme", slug: "cuvee-du-25eme" }, 
                { name: "Cuvée I.P.A. 25 Jaar", slug: "cuvee-ipa" }, 
                { name: "Cuvée J. F. Vonck", slug: "cuvee-jf-vonck" },
                { name: "Cuvée du Millénaire", slug: "cuvee-du-millenaire" }, 
                { name: "Cuvée U.G.M. Belair Gueuze 1997", slug: "cuvee-ugm-97" }, 
                { name: "Florian Van Roy", slug: "florian-van-roy" },
                { name: "Gouden Voeten Gueuze", slug: "gouden-voeten" }, 
                { name: "Gueuze 125", slug: "gueuze-125" }, 
                { name: "Gueuze 2-3-4", slug: "gueuze-2-3-4" },
                { name: "Gueuze Lombard BXL-BD Grand Cru", slug: "lombard-grand-cru" }, 
                { name: "Gueuze Tourbée", slug: "gueuze-tourbee" }, 
                { name: "Gueuze Vélomoteur", slug: "gueuze-velomoteur" },
                { name: "Heerengeuze", slug: "heerengeuze" }, 
                { name: "Hopduvel 10 jaar Gueuze", slug: "hopduvel-10" }, 
                { name: "Jean Chris Nomad 2011", slug: "jean-chris-nomad" },
                { name: "La Gueuze du Poje", slug: "la-gueuze-du-poje" }, 
                { name: "La Gueuze et l’Ecaille", slug: "la-gueuze-et-lecaille" }, 
                { name: "La p’tite Louise", slug: "la-ptite-louise" },
                { name: "Loerik (Lazy Gueuze)", slug: "loerik" }, 
                { name: "Moeder Lambic Fontainas Cuvée X Browsel", slug: "moeder-fontainas-x" }, 
                { name: "Monk's Café Cuvée De Monk's Gueuze", slug: "monks-cafe-gueuze" }, 
                { name: "Super Gueuze", slug: "super-gueuze" }, 
                { name: "Sylvain Van Roy", slug: "sylvain-van-roy" },
                { name: "V Generations", slug: "v-generations" }
            ],
            "faro": [{ name: "Faro", slug: "faro" }],
            "fruit-lambic": [
                { name: "20 Ans d'Amitié", slug: "20-ans-damitie" }, 
                { name: "Amitié et Joie 40ème Anniversaire Kriek", slug: "amitie-joie-kriek" }, 
                { name: "Amitié et Joie 40ème Anniversaire Framboise", slug: "amitie-joie-framboise" },
                { name: "Aigre de Kriek", slug: "aigre-de-kriek" }, 
                { name: "Aronia", slug: "aronia" }, 
                { name: "Belle Mirabelle", slug: "belle-mirabelle" }, 
                { name: "Blåbær Lambik", slug: "blabaer-lambik" },
                { name: "Brussels Sprouts Lambic", slug: "brussels-sprouts" }, 
                { name: "Camerise Lambic", slug: "camerise-lambic" }, 
                { name: "Citoyen du Monde", slug: "citoyen-du-monde" },
                { name: "Cuvée du Cercle Industriel", slug: "cuvee-cercle-industriel" }, 
                { name: "Cuvée Florian", slug: "cuvee-florian" }, 
                { name: "Cuvée Moeder", slug: "cuvee-moeder" },
                { name: "Cantillon Cuvée U.G.M. Belair Kriek 1997", slug: "ugm-kriek-97" }, 
                { name: "Du Lambic dans les Prés", slug: "du-lambic-dans-les-pres" }, 
                { name: "Feestbier", slug: "feestbier" },
                { name: "Fou' Foune", slug: "fou-foune" }, 
                { name: "Framboise", slug: "framboise" }, 
                { name: "Frambozenlambiek", slug: "frambozenlambiek" }, 
                { name: "Gouden Voeten Kriek Lambic", slug: "gouden-voeten-kriek" },
                { name: "Groseille Lambic", slug: "groseille-lambic" }, 
                { name: "Groseille à Maquereau", slug: "groseille-maquereau" }, 
                { name: "Guy De Wits Fruitkorflambiek", slug: "guy-de-wits" },
                { name: "Hopduvel 10 jaar Framboos", slug: "hopduvel-10-framboos" }, 
                { name: "Hopduvel 10 jaar Kriek", slug: "hopduvel-10-kriek" }, 
                { name: "Kersengueuze", slug: "kersengueuze" },
                { name: "Kriek 100% Lambic", slug: "kriek-100" }, 
                { name: "Lambidre Fermier de Bruxelles", slug: "lambidre" }, 
                { name: "Lou Pepe - Framboise", slug: "lou-pepe-framboise" },
                { name: "Lou Pepe - Kriek", slug: "lou-pepe-kriek" }, 
                { name: "Magic Lambic", slug: "magic-lambic" }, 
                { name: "Monk's Café Cuvée Kriek", slug: "monks-cafe-kriek" }, 
                { name: "Mozart", slug: "mozart" },
                { name: "Nath", slug: "nath" }, 
                { name: "Nèfle", slug: "nefle" }, 
                { name: "Noyau", slug: "noyau" }, 
                { name: "Pure Apricot", slug: "pure-apricot" }, 
                { name: "Rosé de Gambrinus", slug: "rose-de-gambrinus" },
                { name: "Sang Bleu", slug: "sang-bleu" }, 
                { name: "Soleil De Minuit", slug: "soleil-de-minuit" }, 
                { name: "Spuyten Duyvil", slug: "spuyten-duyvil" }, 
                { name: "Tyrnilambic Baie D’Argousier Lambic", slug: "tyrnilambic" }
            ],
            "grape-lambic": [
                { name: "Aglianico", slug: "aglianico" }, { name: "Barbera", slug: "barbera" }, { name: "Beck-Hartweg", slug: "beck-hartweg" }, { name: "Benedikta 25", slug: "benedikta-25" },
                { name: "Cantina Giardino", slug: "cantina-giardino" }, { name: "Carignan", slug: "carignan" }, { name: "Chardonnay", slug: "chardonnay" }, { name: "Chenin Blanc", slug: "chenin-blanc" },
                { name: "Cinsault", slug: "cinsault" }, { name: "CLAC (Trois Cépages)", slug: "clac" }, { name: "Cantillon Cuvée Moeder 10 Ans - Cab Franc", slug: "moeder-10-cab-franc" },
                { name: "Divin Lambic", slug: "divin-lambic" }, { name: "Don Quijote", slug: "don-quijote" }, { name: "Drogone Lambic", slug: "drogone-lambic" }, { name: "Druivenlambik (Cuvée Neuf Nations)", slug: "druivenlambik" },
                { name: "E Basta", slug: "e-basta" }, { name: "Goldackerl Gueuze", slug: "goldackerl-gueuze" }, { name: "Goldackerl Lambic", slug: "goldackerl-lambic" }, { name: "Grenache Blanc", slug: "grenache-blanc" },
                { name: "Grenache Noir", slug: "grenache-noir" }, { name: "Gueuzestraminer", slug: "gueuzestraminer" }, { name: "La Corvée", slug: "la-corvee" }, { name: "Lambic d'Aunis", slug: "lambic-daunis" },
                { name: "Lambic Sangiovese", slug: "lambic-sangiovese" }, { name: "L’Éclat", slug: "leclat" }, { name: "Le Plaisir", slug: "le-plaisir" }, { name: "Menu Pineau", slug: "menu-pineau" },
                { name: "Mourvèdre-Carignan", slug: "mourvedre-carignan" }, { name: "Muscat Petits Grains", slug: "muscat-petits-grains" }, { name: "Nuit Bruxelloise", slug: "nuit-bruxelloise" },
                { name: "Pinot (Pineau) d'Aunis", slug: "pinot-daunis" }, { name: "Piacere", slug: "piacere" }, { name: "Pinot Meunier", slug: "pinot-meunier" }, { name: "Poulsard", slug: "poulsard" },
                { name: "Racine", slug: "racine" }, { name: "Racine sur Lie", slug: "racine-sur-lie" }, { name: "Riesling Blend", slug: "riesling-blend" }, { name: "Reed Gueuze Muscat", slug: "reed-muscat" },
                { name: "Reed Gueuze Pinot Noir", slug: "reed-pinot-noir" }, { name: "Saint Lamvinus", slug: "saint-lamvinus" }, { name: "Saint Lamvinus Grand Cru", slug: "saint-lamvinus-grand-cru" },
                { name: "Saint Lamvinus Unblended", slug: "saint-lamvinus-unblended" }, { name: "Scarabée", slug: "scarabee" }, { name: "Scarabée-Timorasso", slug: "scarabee-timorasso" },
                { name: "Signorina", slug: "signorina" }, { name: "Sophia Lambic", slug: "sophia-lambic" }, { name: "Tarlantillon", slug: "tarlantillon" }, { name: "Trousseau", slug: "trousseau" },
                { name: "Timorasso", slug: "timorasso" }, { name: "Vigneronne", slug: "vigneronne" }, { name: "Vin Santo", slug: "vin-santo" }
            ],
            "special-barrels": [
                { name: "50 Degrees North - 4 Degrees East", slug: "50-degrees" }, { name: "Alliance", slug: "alliance" }, { name: "Cognac Lambic", slug: "cognac-lambic" },
                { name: "Couvreur", slug: "couvreur" }, { name: "Lambic Vin Jaune", slug: "lambic-vin-jaune" }, { name: "La Vie est Belge", slug: "la-vie-est-belge" },
                { name: "La Vie est Solidaire", slug: "la-vie-est-solidaire" }, { name: "LH12", slug: "lh12" }, { name: "Old Fashioned", slug: "old-fashioned" },
                { name: "Y12 Trinidad", slug: "y12-trinidad" }, { name: "Y12 Jamaica", slug: "y12-jamaica" }
            ],
            "others": [
                { name: "Ashanti", slug: "ashanti" }, { name: "Asperule Odorante", slug: "asperule-odorante" }, { name: "Berce", slug: "berce" }, { name: "Génépi", slug: "genepi" },
                { name: "Initiale B&B", slug: "initiale-bb" }, { name: "Mamouche", slug: "mamouche" }, { name: "Reine des Prés", slug: "reine-des-pres" }, { name: "Ziep-Zop", slug: "ziep-zop" }
            ],
            "young-lambic": [{ name: "Jeune Lambic", slug: "jeune-lambic" }, { name: "Jeune Lambic Cascade", slug: "jeune-lambic-cascade" }],
            "old-lambic": [
                { name: "Amarillo Lambic", slug: "amarillo-lambic" }, { name: "Amphora Lambic", slug: "amphora-lambic" }, { name: "Assemblage de l'Amitié", slug: "assemblage-damitie" },
                { name: "Bière du Dragon", slug: "biere-du-dragon" }, { name: "BLIPA", slug: "blipa" }, { name: "Bourgogne Lambic", slug: "bourgogne-lambic" }, { name: "Cuvée 1904", slug: "cuvee-1904" },
                { name: "Cuvée Bonheur des Petits Loups", slug: "cuvee-bonheur" }, { name: "Cuvée Des Champions", slug: "cuvee-des-champions" }, { name: "Cuvée du Petit Oiseau", slug: "cuvee-du-petit-oiseau" },
                { name: "Cuvée Kuaska", slug: "cuvee-kuaska" }, { name: "Cuvée Roxane et Charlotte", slug: "cuvee-roxane" }, { name: "Cuvée Saint Gilloise", slug: "cuvee-saint-gilloise" },
                { name: "Geif Coroge", slug: "geif-coroge" }, { name: "Grand Cru Bruocsella", slug: "grand-cru-bruocsella" }, { name: "Grand Cru Bruocsella Brut", slug: "grand-cru-bruocsella-brut" },
                { name: "Het Bier Gevaar", slug: "het-bier-gevaar" }, { name: "Hoeve Lambic Fermier", slug: "hoeve-lambic" }, { name: "Iris", slug: "iris" }, { name: "Iris Grand Cru", slug: "iris-grand-cru" },
                { name: "Klara Festival", slug: "klara-festival" }, { name: "La Dernière Cuvée Du 89", slug: "derniere-cuvee-89" }, { name: "Lambic Fumé", slug: "lambic-fume" },
                { name: "Lambic d'Haute Densité", slug: "lambic-haute-densite" }, { name: "Lou Pepe Gueuze", slug: "lou-pepe-gueuze" }, { name: "Moeder Lambic Fontainas", slug: "moeder-lambic-fontainas" },
                { name: "Manzanilla", slug: "manzanilla" }, { name: "Pikkulinnun Viskilambic", slug: "pikkulinnun-viskilambic" }, { name: "Symbiose", slug: "symbiose" },
                { name: "Cantillon Super Blend", slug: "super-blend" }, { name: "T42", slug: "t42" }, { name: "Vieux Lambic", slug: "vieux-lambic" }, { name: "Vin de Paille", slug: "vin-de-paille" }, { name: "Y30", slug: "y30" }
            ]
        },
        beerDetails: {
            "brabantiae": {
                name: "Brabantiæ",
                slug: "brabantiae",
                labelImage: "/images/beers/cantillon/brabantiae-label.jpg",
                description: "Brabantiæ is a gueuze finished in port wine barrels, made to honor the Belgian King Baudouin (7 September 1930 – 31 July 1993). It was released for the Koningsfeesten (King's Celebrations) in 1991.",
                sections: [
                    {
                        title: "History / Other Notes",
                        content: "Jean-Pierre brewed three batches of lambic (November 1987, February 1989, and January 1990). He first aged this lambic in 650 L wine barrels ('pijpen' or 'pipes') from Spain. Next, the batches were finished in Old Tawny Superior Port barrels from Portugal.\n\nFrancis De Hondt requested that Cantillon create a special cuvée to honor King Baudouin (also Duke of Brabant) to celebrate the Koningsfeesten. Brabantiae was named and provided for this celebration."
                    },
                    {
                        title: "Indeterminable Bottle Date",
                        content: "There is conflicting information regarding the bottling date. Piet Sierens declares Brabantiæ was bottled in December 1990. However, according to Raymond Buren in Gueuze, Faro, et Kriek, Brabantiæ was bottled on May 16, 1991."
                    }
                ],
                bottleLog: [
                    { id: "b1", displayOrder: 1, date: "ca.1990-1991", season: "N/A", bottleCount: "N/A", size: "750ml", notes: "Disputed bottling dates" },
                    { id: "b2", displayOrder: 2, date: "11/19/2018", season: "18|19", bottleCount: "N/A", size: "750ml", notes: "New label" },
                    { id: "b3", displayOrder: 3, date: "11/25/2018", season: "18|19", bottleCount: "N/A", size: "750ml", notes: "New label" },
                ],
                references: ["Wiels.nl", "Gueuze, Faro, et Kriek by Raymond Buren"]
            },
            "gueuze-125": {
                name: "Gueuze 125",
                slug: "gueuze-125",
                labelImage: "/images/beers/cantillon/gueuze-125-label.jpg",
                description: "Cantillon Gueuze 125 is a gueuze created to celebrate Cantillon's 125th anniversary. It is a blend of lambic brewed with 50% raw wheat and 50% malted barley.",
                sections: [
                    {
                        title: "History / Side-Notes",
                        content: "The idea for the recipe came from Raf Meert's book 'Lambic Untamed' quoting ratios of wheat different from today's standards."
                    }
                ],
                bottleLog: [
                    { id: "g1", displayOrder: 1, date: "12/10/2021", season: "21|22", bottleCount: "N/A", size: "750ml", notes: "Brewed 12/27/2017" }
                ],
                references: ["Lambic Untamed by Raf Meert"]
            }
        }
    }
};