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
        type: 'Celebrities'
    });
    await Categories.create({
        type: 'Politics'
    });
    await Categories.create({
        type: 'Sports'
    });
    await Categories.create({
        type: 'Technology'
    });
    await Articles.create({
        title: 'Raymond van Barneveld to retire after 2020 PDC World Championship',
        content: `
Five-time world darts champion Raymond van Barneveld says he will retire after the 2020 PDC World Championship.

The 51-year-old Dutchman, known widely as 'Barney', is one of only three players to win five world titles.

He won the British Darts Organisation (BDO) title in 1998, 1999, 2003 and 2005 before moving to the Professional Darts Corporation and beating Phil Taylor in the 2007 final.

"I noticed in myself that I can't keep up any more," said Van Barneveld.

"I know what I can do but it's just not been happening for the past three or four years, apart from winning the World Cup with Michael [van Gerwen].

"Next year is going to be my 35th year of playing darts at the highest level and it's going to be my last year.

"I'm not winning tournaments any more. I don't know why but a lot of things have happened in my private life and I've also noticed that my body isn't feeling 100% any more. I don't have the drive, motivation or fitness to carry on.

"I'm a winner, that's what I do - I lift trophies but I can't do it any more. Maybe there are still a couple of titles left in me and that would be amazing - but I can't do this every week.`,
        picture: 'https://ichef.bbci.co.uk/onesport/cps/800/cpsprodpb/12871/production/_104398857_gettyimages-1004916216.jpg',
        category: 'Sports',
        importance: 1
    });
    await Articles.create({
        title: 'Greenland ice sheet hides huge impact crater',
        content : `
What looks to be a large impact crater has been identified beneath the Greenland ice sheet.

The 31km-wide depression came to light when scientists examined radar images of the island's bedrock.

Investigations suggest the feature was probably dug out by a 1.5km-wide iron asteroid sometime between about 12,000 and three million years ago.

But without drilling through nearly 1km of ice to sample the bed directly, scientists can't be more specific.

"We will endeavour to do this; it would certainly be the best way to get the 'dead fish on the table' (acknowledge the issue, rather than leaving it), so to speak," Prof Kurt Kjær, from the Danish Museum of Natural History, told BBC News.

If confirmed, the crater would be the first of any size that has been observed under one of Earth's continental ice sheets.`,
        picture: 'https://ichef.bbci.co.uk/news/660/cpsprodpb/8EE1/production/_104277563_3e4c191a-122f-4443-adc4-c29fb156e692.jpg',
        category: 'Technology',
        importance: 2
    });
    await Articles.create({
        title: 'Brexit plan will stop EU migrants jumping the queue',
        content: `

Theresa May is renewing her efforts to sell her draft Brexit withdrawal agreement - saying it will stop EU migrants "jumping the queue".

She said migration would become skills-based, with Europeans no longer prioritised over "engineers from Sydney or software developers from Delhi".

The PM also insisted to business leaders at the CBI that her withdrawal deal has been "agreed in full".

It comes as some Tory MPs continue to press for late changes to the deal.

Ministers from the remaining 27 EU countries have met in Brussels ahead of the deal being finalised on Sunday.

They are working on the political declaration setting out their future relationship with the UK.`,
        picture: 'https://e3.365dm.com/18/11/1096x616/skynews-theresa-may-downing-street_4489233.jpg?20181118014847',
        category: 'Politics',
        importance: 1
    });
    await Articles.create({
        title: 'Paul Gascoigne charged with sex assault on Durham train',
        content: `

Football legend Paul Gascoigne has been charged with sexually assaulting a woman on a train from York to Durham.

The former England midfielder was arrested at Durham station on 20 August.

British Transport Police said the 51-year-old has now been charged with one count of sexual assault by touching and will appear at Newton Aycliffe Magistrates' Court on 11 December.

Gazza shot to international fame during the 1990 World Cup.

After leaving his hometown club Newcastle United in 1988, he enjoyed success at Tottenham Hotspur, Lazio and Rangers.

A spokeswoman for British Transport Police said: "Paul Gascoigne... was charged via postal requisition with one count of sexual assault by touching, contrary to Section 3 of the Sexual Offences Act 2003.

"The charge relates to an incident on board a train on 20 August this year."`,
        picture: 'https://ichef.bbci.co.uk/news/660/cpsprodpb/BFBB/production/_100738094_gazza_pa.jpg',
        category: 'Celebrities',
        importance: 2
    });
    await Articles.create({
        title: 'California wildfires: Finland bemused by Trump raking comment',
        content: `Finns have been baffled by US President Donald Trump's comments praising the country for managing its vast forests by raking.

Citing a conversation with his Finnish counterpart, Mr Trump said they spend "a lot of time on raking and cleaning".

But President Sauli Niinisto told a Finnish daily he could not remember talking about raking when the two met.

Firefighters in California are currently battling the deadliest blaze in the state's history.

Nearly 1,000 people remain on a list of people reported as missing, authorities say.

The number of believed missing fell 283 late on Sunday, down from 1,276 people, they say, but gave no other details.

Heavy rain is forecast in the coming days and could complicate efforts to find victims' remains, but will bring relief to firefighters on the front lines.`,
        picture: 'https://i.kinja-img.com/gawker-media/image/upload/s--NbleMk8p--/c_scale,f_auto,fl_progressive,q_80,w_800/ovkkfifyllk1pvvx9jud.jpg',
        category: 'Politics',
        importance: 1
    });
}
