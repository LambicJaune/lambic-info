export type EventStatus = "Active" | "On Hiatus" | "Not Occurring Anymore";

export interface EventSection {
    title: string;
    content: string;
}

export interface ZwanzeLocation {
    year: string;
    theme: string;
    locations: string;
}

export interface LambicEvent {
    id: string;
    name: string;
    date: string; // The specific next date or time of year
    frequency: string; // e.g., "Annual", "Biennial", "One-off"
    nextOccurrence: string; // e.g., "April 25th, 2026"
    status: EventStatus;
    image: string;
    overview: string;
    history?: string;
    location: string | string[]; 
    zwanzeHistory?: ZwanzeLocation[]; // Specialized field for Zwanze Day table
    website?: string;
    instagram?: string;
    facebook?: string;
    sections: EventSection[];
    gallery?: { url: string; caption?: string }[];
    references?: string[];
}

export interface CountryEventData {
    countryName: string;
    countryCode: string;
    flagIcon: string;
    events: { [key: string]: LambicEvent };
}

export const EventsMockData: { [key: string]: CountryEventData } = {
    worldwide: {
        countryName: "Worldwide",
        countryCode: "ww",
        flagIcon: "/images/flags/worldwide.png",
        events: {
            "zwanze-day": {
                id: "zwanze-day",
                name: "Zwanze Day",
                date: "Late april / early may",
                frequency: "Every other year",
                nextOccurrence: "April 25th, 2026",
                status: "Active",
                image: "/images/events/zwanze-hero.jpg",
                location: "Global (Participating Bars Worldwide)",
                website: "https://www.cantillon.be",
                overview: `Zwanze Day is a global celebration of spontaneous fermentation, centered around the simultaneous tapping of a limited-edition experimental lambic from Brasserie Cantillon.`,
                history: `Cantillon's Zwanze series of beers and events began in 2008 with a bottling of a special lambic with rhubarb added. Since then, Cantillon brewer Jean Van Roy has used his Zwanze series and the celebration days (since 2011) associated with them to bring lambic enthusiasts together around the world. 
                
                Cantillon's website notes that the word zwanze in the Brussels dialect refers to a semi-sarcastic style of humor. That sense of humor is often reflected in the experimental nature of the beers, which are not always the most traditional of lambics. In the Flemish dialect, the verb zwanzen means to joke or to kid, and this has been reflected in some of the stories associated with the Zwanze beers over time.`,
                zwanzeHistory: [
                    { year: "2008", theme: "Rhubarb Lambic", locations: "N/A (Bottles only)" },
                    { year: "2009", theme: "Elderflower Lambic", locations: "N/A (Bottles only)" },
                    { year: "2010", theme: "No Event", locations: "—" },
                    { year: "2011", theme: "Pineau des Charentes", locations: "First coordinated global event" },
                    // Add more years here...
                ],
                sections: [
                    {
                        title: "Locations",
                        content: "Zwanze Day is celebrated all over the world, with locations regularly hosting the event, and others changing every now and then. The official list of participating bars is usually released by the brewery a few weeks prior to the event."
                    }
                ],
                references: ["Cantillon Official Website", "Lambic.info - Zwanze Day History"]
            }
        }
    },
    belgium: {
        countryName: "Belgium",
        countryCode: "be",
        flagIcon: "/images/flags/be.png",
        events: {
            "nacht-van-de-grote-dorst": {
                id: "nacht-van-de-grote-dorst",
                name: "Nacht van de Grote Dorst",
                date: "April 2026",
                frequency: "Biennial",
                nextOccurrence: "Unknown",
                status: "Active",
                image: "/images/events/nacht-hero.jpg",
                location: "Itterbeek (Dilbeek)",
                overview: `The "Night of Great Thirst" is an international Gueuze and Kriek festival held every two years.`,
                sections: []
            }
        }
    },
    usa: {
        countryName: "USA",
        countryCode: "us",
        flagIcon: "/images/flags/us.png",
        events: {
            "shelton-brothers-festival": {
                id: "shelton-brothers-festival",
                name: "The Festival",
                date: "TBD",
                frequency: "Annual (formerly)",
                nextOccurrence: "None planned",
                status: "On Hiatus",
                image: "/images/events/shelton-hero.jpg",
                location: "Various Cities, USA",
                overview: "A festival highlighting world-class spontaneous fermentation.",
                sections: []
            }
        }
    }
};