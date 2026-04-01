// mockData.ts

export interface Section {
  type: 'text-only' | 'split' | 'glossary';
  title?: string;
  content?: string; // If you use .join(), it becomes a single string
  image?: string;
  imageSide?: 'left' | 'right';
  alphabet?: {
    letter: string;
    entries: { word: string; definition: string }[];
  }[];
}

export interface PageData {
  title: string;
  sections: Section[];
}

export const mockData: Record<string, PageData> = {
  "what-is-lambic": {
    title: "What is Lambic?",
    sections: [
      { 
        type: 'text-only', 
        content: "Lambic is spontaneously fermented beer brewed in the Pajottenland region of Belgium and aged in wood barrels. Its derivatives consist of a multitude of styles and a variety of characteristics: old and young, carbonated or flat, blended or unblended, fruited or unfruited, sweetened or unsweetened. The unique brewing and fermentation processes, history, and traditions make lambic like no other beverage in the world." 
      },
      { 
        type: 'split', 
        title: "History", 
        content: [
            "Main article: [A Brief History of Lambic](/info/history).", 
            "The story of lambic in the Belgian culture is a complex history that dates back to the times of the Roman Empire. From conquest and conquer in ancient times, to World Wars, taxation, decline in popularity, and resurgence, lambic has continued to persevere and evolve. Today, lambic is experiencing a renaissance in Belgium, across Europe, and throughout the world.",
        ].join("\n\n"),
        image: "/images/barrel.jpg", 
        imageSide: "right" 
      },
      {
       type: 'split', 
        title: "Lambic Geography", 
        content: [
            "### Pajottenland",
            "Pajottenland (sometimes Payottenland in English) is an extremely fertile agricultural region in Belgium that is situated in a valley between the rivers Senne and Dendre to the south-west of Brussels. The Pajottenland is the principal area for lambic production in the country. Only the western section of Neerpede, a small part of Brussels, is considered to be part of the Pajottenland region. Other cities located in this area, many of which are closely associated with lambic breweries, blenders, and cafés are Affligem, Asse, Bever, Dilbeek, Gammerages, Gooik, Herne, Leeuw-Saint-Pierre, Lennik, Liedekerke, Pepingen, Roosdaal, and Ternat. The area gets its name from the Walloon word for a soldier from the region, a Payot.",
            "### Senne/Zenne and Dendre/Dender River valley",
            "The Senne (French) / Zenne (Dutch) valley is as closely associated with lambic production as the Pajottenland. The Senne River is a small river that runs through the heart of Brussels and was notorious for being one of the most polluted rivers in Belgium. In fact, at one point the river was covered to help alleviate the pollution and flooding problems caused within the city. Today, the Senne is split in two and treated at new facilities before rejoining and continuing south of Brussels. In total, the river is 64 miles/103km long and flows through or near many of the lambic producing towns in Belgium. To the west of the Senne is another shorter river known as the Dendre (French) / Dender (Dutch) River. Though not often cited in lambic lore, the Dendre River is the second river that helps to cradle the valley known as Pajottenland."
        ].join("\n\n"),
        image: "/images/barrel.jpg", 
        imageSide: "left" 
      },
      { 
        type: 'split', 
        title: "History", 
        content: [
            "### The Language of Lambic", 
            "Main article: [The Language of Lambic](/info/language-of-lambic).",
            "Making sense of the terminology surrounding lambic can be as complex as the beer itself. Belgium is a country divided into very distinct linguistic regions whose inhabitants have their own words for many of the commonly used terms associated with the lambic tradition and process. Both Dutch and French speaking brewers and blenders are in operation today leaving many curious lambic drinkers wondering how this all came to be. Readers may also find the Lambic.Info [Glossary](/info/glossary) helpful before reading the main article."
        ].join("\n\n"),
        image: "/images/barrel.jpg", 
        imageSide: "right" 
      }
    ]
  },
  "the-team": {
    title: "Meet the Team",
    sections: [
      { 
        type: 'split', 
        title: "Matthew R. Geist", 
        content: [
            "Hello! My name is Matthew Geist. I have been passionate about Belgian beer since my initial experience in 1998. My favorite style of beer is, unsurprisingly, lambic! Over the years, I have been incredibly fortunate to connect with amazing people from around the world, telling stories, building relationships, and raising glasses together.",

            "I am a professional musician residing in the Washington, D.C. area with my wife and two sons.", 
        ].join("\n\n"),
        image: "/images/the-team/Matthew.jpg", 
        imageSide: "left" 
      },
      { 
        type: 'split', 
        title: "Gael Giraud", 
        content: [
            "My name is Gael, you might know me from my involvement with BXL BeerFest working on the lineup and guided tastings, or in a couple of informative groups about craft beer for the past decade or so. If not, I am a music nut (old school heavy metal mostly, but also blues, jazz, ...), an epicurian, and a father. If you ask anyone who knows me, they'll probably tell you that I am intensely passionate by the things I love, and driven by a thirst for knowledge. Knowledge of how things work, how they came to be, of their history, of the actual culture through the eyes of the people who make it - I need to understand the true meaning of things, and I love to share it.",

            "The rusticity, authenticity, patience and complexity of true traditional lambic is probably what made me fall in love with it at first, but it is the generosity and honesty of the people around it that made me stay and feel at home.",

            "My hope is that I can share my passion for the scene with as many people as possible through lambic.info, as part of our effort to preserve a tradition that deserves to keep going and to be known."
            ].join("\n\n"),
        image: "/images/the-team/Gael.jpg", 
        imageSide: "right" 
      },
      { 
        type: 'split', 
        title: "Dennis Vansant", 
        content: "Ex-owner of the 1420 bar in Copenhagen, Belgium native and treasure finder, AKA the dust tamer", 
        image: "/images/the-team/Dennis.jpg", 
        imageSide: "left" 
      },
      { 
        type: 'split', 
        title: "Hyuk Jun Kim", 
        content: "Our tech genius, responsible for maintaining the website and ensuring everything runs smoothly. Awarded friendliest lambic nerd in the world in 2025.", 
        image: "/images/the-team/HJ.jpg", 
        imageSide: "right" 
      }
    ]
  },
"glossary": {
  title: "Brewing Glossary",
  sections: [
    {
      type: 'glossary',
      alphabet: [
        {
          letter: "A",
          entries: [
            { word: "Acetic acid", definition: "Low molecular weight acid with a sharp, vinegar taste." },
            { word: "Acetobacter", definition: "Gram-negative bacteria that produce large amounts of acetic acid." },
            { word: "Aerobic", definition: "Requiring or occurring in the presence of oxygen." },
          ]
        },
        {
          letter: "B",
          entries: [
            { word: "Bière", definition: "French for beer." },
            { word: "Brettanomyces", definition: "'British fungus', a wild yeast responsible for many characteristics in Lambic." },
          ]
        },
        {
          letter: "C",
          entries: [
            { word: "Cassis", definition: "French for blackcurrant (and pothole)." },
            { word: "Coolship", definition: "Anglicized version of koelschip used in spontaneous fermentation." },
          ]
        },
        {
          letter: "D",
          entries: [
            { word: "Dextrins", definition: "Polysaccharide sugars that are unfermentable by Saccharomyces, but can be consumed by Brettanomyces." },
            { word: "Diacetyl", definition: "A simple organic compound with an intense buttery flavor and odor." },
            { word: "Doesjel", definition: "Belgian Dutch slang similar to loerik (see below) closely approximating to snoozer or lazy. Used when a geuze does not referment in the bottle." },
          ]
        },
        {
          letter: "E",
          entries: [
            { word: "Estaminet", definition: "French for tavern or pub and locally used in the Brussels dialect to describe a small drinking establishment or cafe." },
            { word: "Ester", definition: "A chemical compound formed by the linking of an alcohol with an organic acid." },
          ]
        },
      ]
    }
  ]
}
};