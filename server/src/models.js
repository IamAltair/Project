// @flow

import Sequelize from 'sequelize';
import type { Model } from 'sequelize';

let sequelize = new Sequelize('School', 'root', '', {
    host: process.env.CI ? 'mysql' : 'localhost', // The host is 'mysql' when running in gitlab CI
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export let Categories: Class<
    Model<{ id?: number, type: string}>
    > = sequelize.define('Categories', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    type: Sequelize.STRING
});

export let Articles: Class<
    Model<{ id?: number, title: string, content: string, picture: string, category: string, importance: number}>
    > = sequelize.define('Articles', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.STRING,
    content: Sequelize.TEXT,
    picture: Sequelize.TEXT,
    category: Sequelize.STRING,
    importance:Sequelize.INTEGER
});

export let Students: Class<
    Model<{ id?: number, firstName: string, lastName: string, email: string }>
    > = sequelize.define('Students', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING
});

// Drop tables and create test data when not in production environment
let production = process.env.NODE_ENV === 'production';

// The sync promise can be used to wait for the database to be ready (for instance in your tests)
export let sync = sequelize.sync({ force: production ? false : true }).then(() => {
    if (!production) testData();
});

async function testData(){
    await Categories.create({
        type: 'Entertainment'
    });
    await Categories.create({
        type: 'Humor'
    });
    await Categories.create({
        type: 'Lifestyle'
    });
    await Categories.create({
        type: 'Politics'
    });
    await Categories.create({
        type: 'Sports'
    });
    await Categories.create({
        type: 'Science'
    });
    await Articles.create({
        title: 'Something about waffles being healthy',
        content: `Considerations
According to the American Dietetic Association, a healthy diet has a balance of whole grains, fruits and vegetables, low fat, lean protein and healthy dairy options. This diet gives you the calories, fiber, vitamins, minerals and protein that you need sustain a healthy lifestyle. Other foods may be eaten and you can still maintain a healthy diet as long as foods that are less healthy are eaten in moderation.

Whole Grain Intake
White flour has little nutritional value. It has low fiber content and can clog up your system, leading to digestive problems, eventually resulting in major disease if used as a staple in your diet for a prolonged period. Whole grains, on the other hand, are packed with fiber and help your digestive system work at full capacity, according to MayoClinic.com. Waffles made of white flour may be more detrimental than anything else, but waffles made with whole grain flour are an excellent source of fiber and a healthy choice for your daily carbohydrate allotment.

Other Ingredients
A typical waffle recipe has eggs, milk, oil and salt in addition to flour. Eggs are a valuable source of protein and milk is an essential component of a healthy diet. Oils with low saturated fat such as canola oil and oils with high omega-3 fatty acid levels can be part of a healthy diet as well, so waffles can have nutritional value. Salt must be always kept to a minimum, but the salt amount per whole recipe, about 1/4 tsp. for 6 waffles, is within that amount.

As Part of a Daily Diet
Waffles that are made with whole grains and high benefit oils, or no oil, are a wholesome food and could be included in a healthy diet. Additions such as berries and yogurt add to their nutritional value and complete a healthy breakfast. Plain waffles with high-sugar syrup are not healthy, and you should ideally get your protein and dairy doses from other sources. However, according to the U.S. Department of Health and Human Services, in an overall healthy eating plan you can still eat a moderate amount of white flour and sugar.`,
        picture: 'https://images.pexels.com/photos/1200034/pexels-photo-1200034.jpeg?cs=srgb&dl=chocolate-close-up-colors-1200034.jpg&fm=jpg',
        category: 'Lifestyle',
        importance: 1
    });
    await Articles.create({
        title: 'Something about a cow but it\'s really a dog',
        content : `On Shaylee Hubbs' family ranch, you can find horses, sheep, goats, alpacas, chickens and dogs ... and Goliath, who fits right in with the pooches. Except he's a baby cow.

The 8-week-old calf tags along with the family dogs in their daily activities around the ranch in Danville, Calif., Hubbs told ABC News.

"He was raised with our three dogs, and he's around them every day," she said.

It all started when the family rescued a sickly little Goliath from a dairy farm, Hubbs said. One of her dogs, a Great Dane named Leonidas, took a liking to Goliath immediately.

"He would lick the little cow on the face and try to nudge him to stand up," she said. "He would lay down with the sick, little cow for hours just to keep him company."

Hubbs is convinced that Goliath, now healthy, thinks he's one of the dogs. But don't just take her word for it. She detailed to ABC News all of Goliath's pup-like habits, which she's been documenting on Twitter.

The cow learned how to let himself in the house by pushing his head against the doorknob, just like the dogs, and he'll make himself at home.`,
        picture: 'https://i.imgur.com/QQLuAQd.jpg',
        category: 'Humor',
        importance: 2
    });
    await Articles.create({
        title: 'Trump tests his new baseball bat',
        content: `Translated from norwegian to english and back to norwegian (Don't ask me why):

As the World Cup finale plays in my living room, it seems like the right time to reflect on “America’s pastime” – baseball – and its curious standing these days.

The sport gets it close-up on Tuesday night, when the Major-League All-Star Game is played in the nation’s capital. President Trump is not expected to be attendance, though he easily could zip over to the festivities upon his return from Helsinki and his meeting with Vladimir Putin.

Baseball made more political news this past week, in the aftermath of Trump’s Supreme Court announcement, when it was reported that Judge Brett Kavanaugh had racked up somewhere between $60,000-$200,000 in debt courtesy of several credit cards and a loan.

The White House’s explanation: Kavanaugh had purchased Washington Nationals’ season and playoff tickets for himself and a circle of friends.

What to make of this? Maybe Senate Democrats will use the judge’s finances as an inroad for trying to take him down. It probably won’t work – not unless it turns out his baseball buddies spent their days hacking the Democratic National Committee and their nights at Nationals Park.

The fact is professional athletics in the nation’s capital is not a pretty picture – teams taking home titles with the frequency that Congress balances the federal budget. Prior to the Washington Capitals capturing the NHL’s Stanley Cup last month, the last D.C. franchise to win it all would be the Washington Redskins, the victors in 1992’s Super Bowl XXVI.

Over the course of 13 seasons since relocating from Montreal, not once have the Nationals managed to advance from the first round of the National League’s playoffs. That includes last season’s painstaking loss to the Chicago Cubs. Fitting for Season 13, the Nats went down in the wee hours of October’s Friday the 13th.`,
        picture: 'https://amp.businessinsider.com/images/5ab2798bb0284719008b4612-750-562.jpg',
        category: 'Politics',
        importance: 2
    });
    await Articles.create({
        title: 'Dragvoll, why does it even exist?',
        content: `Haugen mener en tocampusløsning egner seg dårlig for samarbeid på tvers av fagretningene, et samarbeid som den relativt ferske rektoren Gunnar Bovim har trukket frem som en av sine viktigste saker.

Selv om det bare er 3,5 kilometer mellom Dragvoll og Gløshaugen, blir det for langt unna til å ivareta tverrfagligheten, ifølge visjonsgruppa.

Han viser også til at Dragvolls plassering gjør at det er dødt på campus utenfor arbeidstiden. Visjonsgruppa ønsker en campus der det er større aktivitet på kveldstid, der fagmiljøer og studenter kan møtes også utenfor de faste rammene på dagtid.

Sist, men ikke minst er Dragvolls bygningsmasse lite egnet til å møte fremtidens behov.

– Strukturelt og teknisk er det bygd etter en 70-tallsmodell. Det var avansert på den tiden. Men i dag er bygningene overbefolket og det er liten plass, sier Haugen.

Det er få møteplasser mellom studenter og lærere. Han mener det er krevende å bygge om.

Det viktigste i den nye samlede supercampusen i sentrum av Trondheim blir å dekke behovene til humanistiske fag og samfunnsfag som i dag er på Dragvoll.

Sammen med et innovasjonssenter, et senter for kunstfag, musikk og arkitektur, og en oppgradering av vitenskapsmuseet vil dette utgjøre mesteparten av den nye bygningsmassen rundt og nær Gløshaugen, dersom visjonsgruppa får det som den vil.`,
        picture: 'https://tinyurl.com/ycjqnmun',
        category: 'Politics',
        importance: 2
    });
    await Articles.create({
        title: 'Norwegian propaganda gone wrong',
        content: `Det er ikke uvanlig at programmer på barne-tv blir både kritisert og diskutert. Gjentatte ganger har vi sett at NRKs julekalendere for eksempel har fått kritikk for å være for «lite kristne», senest i forbindelse med fjorårets «Julekongen», eller for å bidra til sterkt kjøpepress i form av at de promoterer julekalendere, «blånisseluer» og andre kommersielle produkter knyttet til programmene.

Flere barne-tv-programmer har også fått kritikk for å være skremmende eller intetsigende. Da Pompel og Pilt kom på skjermen sent på 1960-tallet var det blant annet store debatter om hvorvidt det var for underlig, skremmende og lite pedagogisk. Også programmet «Teletubbies» har blitt mye diskutert, og barneombudet i Polen gikk blant annet ut å advarte mot programmet fordi det spredte «homofil propaganda».`,
        picture: 'https://i.ytimg.com/vi/Cx4nxr14b-s/maxresdefault.jpg',
        category: 'Politics',
        importance: 1
    });
}
