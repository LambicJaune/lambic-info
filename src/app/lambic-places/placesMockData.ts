export interface PlaceSection {
    title: string;
    content: string;
}

export interface LambicPlace {
    id: string;
    name: string;
    city: string;
    image: string;
    logo?: string;
    website?: string;
    address: string | string[];
    phone: string | string[];
    overview: string;
    history?: string;
    sections: PlaceSection[];
    galleryImages?: string[];
    references?: string[];
    openingHours?: string; 
    instagram?: string;
    facebook?: string;
}

export interface CountryData {
    name: string;
    image: string;
    flagIcon: string;
    places: { [key: string]: LambicPlace };
}

export const placesMockData: { [key: string]: CountryData } = {
    belgium: {
        name: "Belgium",
        image: "/images/places/belgium-hero.jpg",
        flagIcon: "/images/shared/worldwide.png",
        places: {
            "3-fonteinen-restaurant": {
                id: "3-fonteinen-restaurant",
                name: "3 Fonteinen Restaurant-Café",
                city: "Beersel",
                image: "/images/places/3f-resto.jpg",
                logo: "/images/flags/be.png",
                website: "http://www.3fonteinenrestaurant.com/",
                address: "Herman Teirlinckplein 3, B-1650 Beersel",
                openingHours: "Mon-Sun: 12:00 - 22:00 (Check website for kitchen hours)",
                phone: "+32 2 331 06 52",
                overview: `The Drie Fonteinen Restaurant-Café, founded in 1953, is a full service restaurant serving regional food that is often prepared with lambic. Behind the restaurant is an outdoor enclosed courtyard with additional seating. The restaurant is owned and managed by Guido Debelder with the help of his son Thomas. As of 2026, Guido is planning on retiring, though he will most likely still help at the restaurant.`,
                history: `The history of the Debelder family with 3 Fonteinen Café (most likely named that way, "3 fountains", because of the three hand pumps used to serve lambic behind the bar, though it is also possible that the 3 wells nearby might have been the reason as well) started in 1953, when Gaston Debelder and his wife Raymonde Dedoncker purchased the business, an inn already serving lambic blended in the cellar, which was common at the time.

For many years, the place was serving simple food like toast with local Pottekeis for people on the go, and lambic was a secondary activity to support the inn business. Originally, lambic was purchased from the Van Haelen brewery nearby in Calevoet (part of Beersel) until the 1960s, when they moved the business to the church square after buying an old building they tore down to make way for a new one, carrying the name 3 Fonteinen along. They then purchased from De Neve and Brouwerij Winderickx.

Lambic was transported to the inn by horse or truck and brought to the cellar using gravity, where it would be added to the barrels for ageing at the blender's discretion. At the time, the team had to carry everything down the tiny stairs by themselves, which included empty barrels (usually 40 to 50kg each) as well as empty bottles to be filled later, which Gaston Debelder and the rest of the team had to place on their shoulder by bags of 60 Champagne bottles of 75cl each (at about 900 gramms each it is over 50kg total), displaying serious labour.

The inn used a variety of cellars (caveaux) for storage, that went up to 21 at some point. Each cellar could store about 3500 bottles of 75cl or 5000 bottles of 37,5cl, bringing this to a capacity of 70 000 bottles of 75cl. On a good sunday, they would sell about 20 boxes of 12x 75cl lambic bottles, which was quiet a turnaround and valuable business. It became a quiet popular spot, hosting regulars such as writer Herman Teirlinck and his friends.

In 1982, Armand and Guido officially took over. Guido would manage the restaurant itself (which is still the case to this day, though he will soon retire), while Armand would handle the kitchen, and the beer blending business which was his true passion. On February 1st, 2001, Armand left the restaurant and in late March 2001 he created "A.D. Bieren", which then went on to continue as "3 Fonteinen". From that point on, the restaurant was owned and managed solely by Guido, though the entire family kept working together until 2015 as they all almost lived under the same roof up to that point.

Nowadays, Guido and his son Thomas Debelder still run the restaurant, which still serves traditional food, as well as vegeterian options. It also hosts in its cellar Geuzestekerij Parrain since 2023, a collaboration between Thomas and his sister Julie.`,
                sections: [
                    {
                        title: "3 Fonteinen Restaurant-Café Beers",
                        content: `Up to 2015, 3 Fonteinen Restaurant-Café consistently served a breadth of current and vintage 3 Fonteinen lambics. Most notably, however, was the kriekenlambik. Slightly sweetened, the 3 Fonteinen kriekenlambik was generally only available fresh at the restaurant though it made occasional appearances at festivals.

From 2015, following a rise in costs of the beers sold by 3 Fonteinen brewery, they switched to Girardin Kriek, and then Boon. Nowadays, they serve Lambiek Fabriek as well as other producers like Boon and Tilquin, and of course, Parrain which is part of the facility.`
                    }
                ],
                references: ["3 Fonteinen Official Website", "Lambic.info Archives"]
            },
            "moeder-lambic": {
                id: "moeder-lambic",
                name: "Moeder Lambic",
                city: "Brussels",
                image: "/images/places/moeder-fontainas.jpg",
                logo: "/images/places/moeder-logo.jpg",
                website: "http://www.moederlambic.com/bars/fr/home/",
                address: ["Chez Moeder Lambic, 68, Rue de Savoie, Brussels 1060", "Moeder Fontainas, 8 place Fontainas, Brussels 1000"],
                phone: ["+32 2 544 16 99", "+32 2 503 60 68"],
                instagram: "https://www.instagram.com/moeder_lambic_official/",
                facebook: "https://www.facebook.com/MoederLambicFontainas",
                openingHours: "Mon-Sun: 11:00 - 01:00",
                overview: `Moeder Lambic commonly refers to two different bars in the Brussels area owned by Jean Hummler, Nassim Dessicy, and Andy Mengal. The original location in the Saint-Gilles area of Brussels, called Chez Moeder Lambic, was established in the 1980s. In 2006, Jean and Nassim purchased the business from the owners during bankruptcy. The success of the bar led to the opening of a second location near the center of Brussels at Place Fontainas. Today, both locations are known for their selection of both lambic and non-lambic Belgian beers.`,
                history: `The name Chez Moeder Lambic has a long history in Brussels that dates back to the turn of the 20th century. At the time, there was an estaminet of the same name located in the Bois de la Cambre region of Brussels. On the edge of the park was the maison de bière Chez Moeder Lambic. 

According to Hervé Gérard, the building that housed Moeder Lambic was built in 1672 and was frequented by the likes of Lord Byron and Sir Walter Scott. The building burned to the ground in 1975. Lambic.Info is currently seeking information on whether there is a connection between the Moeder Lambic of the early 20th century and the Moeder Lambic that exists today, or if it is just a coincidental naming.`,
                sections: [
                    {
                        title: "Moeder Lambic Beers",
                        content: `Both Moeder Lambic bars have a wide selection of lambic and other Belgian beers in draught and in bottle. The bars have also played host to Cantillon's Zwanze Day events. Though no specific lambics have been bottled for the bars, the draught list generally includes many beers from Cantillon, 3 Fonteinen, and other lambic brewers and blender that are not commonly found outside of the breweries. However, there is one fruited lambic, Cantillon Cuvée Moeder, that is served exclusively at the bars.`
                    }
                ],
                references: ["Moeder Lambic Official Website", "En bordeaux et bleu blog"]
            },
            // ... (I will keep the rest of the 14 bars as short entries so the grid stays full)
            "antwaerps-bierhuiske": { id: "antwaerps-bierhuiske", name: "'t Antwaerps Bierhuiske", city: "Antwerp", image: "/images/places/bierhuiske.jpg", logo: "/images/flags/be.png", address: "Hoogstraat 14, 2000 Antwerpen", phone: "+32 3 231 14 09", overview: "Overview coming soon...", sections: [] },
            "la-becasse": { id: "la-becasse", name: "A La Bécasse", city: "Brussels", image: "/images/places/becasse.jpg", logo: "/images/flags/be.png", address: "Rue d'Arschot 11, 1000 Bruxelles", phone: "+32 2 511 00 06", overview: "Overview coming soon...", sections: [] },
            "la-mort-subite": { id: "la-mort-subite", name: "A La Mort Subite", city: "Brussels", image: "/images/places/mort-subite.jpg", logo: "/images/flags/be.png", address: "Rue Montagne aux Herbes Potagères 7, 1000 Bruxelles", phone: "+32 2 513 13 18", overview: "Overview coming soon...", sections: [] },
            "boelekewis": { id: "boelekewis", name: "Boelekewis Grill-Resto", city: "Huizingen", image: "/images/places/boelekewis.jpg", logo: "/images/flags/be.png", address: "Alsembergsesteenweg 114, 1654 Beersel", phone: "+32 2 356 25 15", overview: "Overview coming soon...", sections: [] },
            "de-bascule": { id: "de-bascule", name: "Café De Bascule", city: "Bellingen", image: "/images/places/bascule.jpg", logo: "/images/flags/be.png", address: "Bellingensesteenweg 2, 1674 Pepingen", phone: "+32 2 356 25 25", overview: "Overview coming soon...", sections: [] },
            "heeren-van-liedekercke": { id: "heeren-van-liedekercke", name: "De Heeren van Liedekercke", city: "Denderleeuw", image: "/images/places/heeren.jpg", logo: "/images/flags/be.png", address: "Kasteelstraat 33, 9470 Denderleeuw", phone: "+32 53 68 31 11", overview: "Overview coming soon...", sections: [] },
            "de-zwaan": { id: "de-zwaan", name: "De Zwaan", city: "Dworp", image: "/images/places/zwaan.jpg", logo: "/images/flags/be.png", address: "Gemeenteplein 1, 1653 Beersel", phone: "+32 2 377 10 24", overview: "Overview coming soon...", sections: [] },
            "delirium-cafe": { id: "delirium-cafe", name: "Delirium Cafe", city: "Brussels", image: "/images/places/delirium.jpg", logo: "/images/flags/be.png", address: "Impasse de la Fidélité 4, 1000 Bruxelles", phone: "+32 2 514 44 34", overview: "Overview coming soon...", sections: [] },
            "verzekering-tegen-de-grote-dorst": { id: "verzekering-tegen-de-grote-dorst", name: "In de Verzekering tegen de Grote Dorst", city: "Eizeringen", image: "/images/places/dorst.jpg", logo: "/images/flags/be.png", address: "Frans Baetensstraat 45, 1750 Lennik", phone: "+32 2 532 58 58", overview: "Overview coming soon...", sections: [] },
            "in-de-welkom": { id: "in-de-welkom", name: "In de Welkom", city: "Dworp", image: "/images/places/welkom.jpg", logo: "/images/flags/be.png", address: "Bellingensesteenweg 2, 1653 Beersel", phone: "+32 2 377 10 24", overview: "Overview coming soon...", sections: [] },
            "oude-smis-van-mekingen": { id: "oude-smis-van-mekingen", name: "Oude Smis van Mekingen", city: "Vlezenbeek", image: "/images/places/oude-smis.jpg", logo: "/images/flags/be.png", address: "Mekingenweg 2, 1602 Sint-Pieters-Leeuw", phone: "+32 2 378 12 34", overview: "Overview coming soon...", sections: [] },
            "volkscafe-de-cam": { id: "volkscafe-de-cam", name: "Volkscafé De Cam", city: "Gooik", image: "/images/places/decam-cafe.jpg", logo: "/images/flags/be.png", address: "Dorpstraat 67, 1755 Gooik", phone: "+32 2 532 21 32", overview: "Overview coming soon...", sections: [] },
            "poechenellekelder": { id: "poechenellekelder", name: "Poechenellekelder", city: "Brussels", image: "/images/places/poechenellekelder.jpg", logo: "/images/flags/be.png", address: "Rue du Chêne 5, 1000 Bruxelles", phone: "+32 2 511 92 62", overview: "Overview coming soon...", sections: [] },
            "parlement": { id: "parlement", name: "'t Parlement", city: "Halle", image: "/images/places/parlement.jpg", logo: "/images/flags/be.png", address: "Kasteelstraat 33, 1500 Halle", phone: "+32 2 356 25 15", overview: "Overview coming soon...", sections: [] }
        }
    }
};