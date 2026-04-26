/* =========================================================
   QUESTION POOLS — Who Wants to Be a Millionaire: Internet Edition

   STRUCTURE:
     window.QUESTION_PACKS = {
       <packKey>: {
         name: "Display Name",      // shown on theme select screen
         questions: {
           1:  [ {q,a,correct}, ... ],  // tier 1 pool
           2:  [ ... ],
           ...
           15: [ ... ]
         }
       }
     }

   QUESTION FORMAT:
     {
       q:       "The question text?",
       a:       ["Option A", "Option B", "Option C", "Option D"],
       correct: 0 | 1 | 2 | 3       // index into `a`
     }

   RULES:
     - Each tier (1-15) should have AT LEAST 2 questions so sessions don't repeat fast.
     - `a` must have exactly 4 items.
     - `correct` is ZERO-indexed (0=A, 1=B, 2=C, 3=D).
     - To add a new theme, just add a new top-level key to QUESTION_PACKS.
       The theme-select menu populates automatically.

   See README.md for a full guide.
   ========================================================= */

window.QUESTION_PACKS = {

  random: {
    name: "Random Trivia",
    questions: {
      1: [
        { q: "How many days are in a week?", a: ["5", "6", "7", "8"], correct: 2 },
        { q: "What color do you get when you mix blue and yellow?", a: ["Purple", "Green", "Orange", "Red"], correct: 1 },
      ],
      2: [
        { q: "Which planet is closest to the Sun?", a: ["Venus", "Mars", "Earth", "Mercury"], correct: 3 },
        { q: "How many legs does a spider have?", a: ["6", "8", "10", "4"], correct: 1 },
      ],
      3: [
        { q: "What is the largest ocean on Earth?", a: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
        { q: "How many continents are there on Earth?", a: ["5", "6", "7", "8"], correct: 2 },
      ],
      4: [
        { q: "Who painted the Mona Lisa?", a: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Michelangelo"], correct: 2 },
        { q: "What is the capital of Japan?", a: ["Osaka", "Kyoto", "Tokyo", "Seoul"], correct: 2 },
      ],
      5: [
        { q: "What element has the chemical symbol 'Au'?", a: ["Silver", "Gold", "Aluminum", "Argon"], correct: 1 },
        { q: "Who wrote 'Romeo and Juliet'?", a: ["Dickens", "Shakespeare", "Austen", "Twain"], correct: 1 },
      ],
      6: [
        { q: "In what year did World War II end?", a: ["1943", "1944", "1945", "1946"], correct: 2 },
        { q: "What is the tallest mountain in the world?", a: ["K2", "Kilimanjaro", "Denali", "Everest"], correct: 3 },
      ],
      7: [
        { q: "Who was the first President of the United States?", a: ["John Adams", "Thomas Jefferson", "George Washington", "Abraham Lincoln"], correct: 2 },
        { q: "What is the largest country in the world by area?", a: ["China", "USA", "Canada", "Russia"], correct: 3 },
      ],
      8: [
        { q: "Who discovered penicillin?", a: ["Louis Pasteur", "Alexander Fleming", "Marie Curie", "Charles Darwin"], correct: 1 },
        { q: "What is the official currency of Switzerland?", a: ["Euro", "Swiss Franc", "Krone", "Mark"], correct: 1 },
      ],
      9: [
        { q: "What is the smallest country in the world by area?", a: ["Monaco", "San Marino", "Vatican City", "Malta"], correct: 2 },
        { q: "Who painted the ceiling of the Sistine Chapel?", a: ["Raphael", "Leonardo da Vinci", "Michelangelo", "Donatello"], correct: 2 },
      ],
      10: [
        { q: "In which year did the Berlin Wall fall?", a: ["1987", "1989", "1991", "1985"], correct: 1 },
        { q: "What is the chemical symbol for potassium?", a: ["P", "Po", "Pt", "K"], correct: 3 },
      ],
      11: [
        { q: "Who developed the theory of general relativity?", a: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Niels Bohr"], correct: 1 },
        { q: "Which African country has the most pyramids?", a: ["Egypt", "Sudan", "Libya", "Ethiopia"], correct: 1 },
      ],
      12: [
        { q: "What is the hardest naturally occurring substance on Earth?", a: ["Quartz", "Steel", "Diamond", "Titanium"], correct: 2 },
        { q: "Which ancient wonder of the world was located in Alexandria?", a: ["Colossus of Rhodes", "Lighthouse (Pharos)", "Hanging Gardens", "Mausoleum"], correct: 1 },
      ],
      13: [
        { q: "In what year was the Magna Carta signed?", a: ["1066", "1215", "1302", "1455"], correct: 1 },
        { q: "Who was the Greek goddess of wisdom?", a: ["Hera", "Aphrodite", "Athena", "Artemis"], correct: 2 },
      ],
      14: [
        { q: "Which element has atomic number 79?", a: ["Silver", "Platinum", "Mercury", "Gold"], correct: 3 },
        { q: "Who composed 'The Four Seasons'?", a: ["Mozart", "Bach", "Vivaldi", "Beethoven"], correct: 2 },
      ],
      15: [
        { q: "In what year was the Rosetta Stone discovered?", a: ["1799", "1812", "1825", "1776"], correct: 0 },
        { q: "Which scientist formulated the three laws of planetary motion?", a: ["Galileo", "Copernicus", "Kepler", "Tycho Brahe"], correct: 2 },
      ],
    }
  },

  anime: {
    name: "Anime",
    questions: {
      1: [
        { q: "What color is Pikachu?", a: ["Red", "Blue", "Yellow", "Green"], correct: 2 },
        { q: "What is the main character's name in the 'Naruto' series?", a: ["Sasuke", "Naruto Uzumaki", "Kakashi", "Sakura"], correct: 1 },
      ],
      2: [
        { q: "What's the name of the main character in 'Dragon Ball Z'?", a: ["Vegeta", "Piccolo", "Goku", "Gohan"], correct: 2 },
        { q: "In 'One Piece', who is the captain of the Straw Hat Pirates?", a: ["Zoro", "Luffy", "Sanji", "Nami"], correct: 1 },
      ],
      3: [
        { q: "Which anime features titans attacking humans living behind walls?", a: ["Attack on Titan", "Demon Slayer", "Tokyo Ghoul", "Berserk"], correct: 0 },
        { q: "In Pokémon, what type is Charmander?", a: ["Water", "Grass", "Fire", "Electric"], correct: 2 },
      ],
      4: [
        { q: "In 'My Hero Academia', what is Izuku Midoriya's hero name?", a: ["Shoto", "Deku", "Kacchan", "All Might"], correct: 1 },
        { q: "What's the name of the Shinigami who drops the notebook in 'Death Note'?", a: ["Rem", "Ryuk", "Light", "L"], correct: 1 },
      ],
      5: [
        { q: "Which anime features pilots inside giant robots called Evangelions?", a: ["Gundam", "Neon Genesis Evangelion", "Gurren Lagann", "Code Geass"], correct: 1 },
        { q: "In 'Demon Slayer', what is the name of Tanjiro's sister?", a: ["Kanao", "Shinobu", "Nezuko", "Mitsuri"], correct: 2 },
      ],
      6: [
        { q: "Who is the author/mangaka of 'One Piece'?", a: ["Masashi Kishimoto", "Akira Toriyama", "Eiichiro Oda", "Yoshihiro Togashi"], correct: 2 },
        { q: "In 'Jujutsu Kaisen', what is Gojo Satoru's innate technique called?", a: ["Cursed Energy", "Limitless", "Domain Expansion", "Reverse Technique"], correct: 1 },
      ],
      7: [
        { q: "In 'Fullmetal Alchemist', what is the first law of alchemy called?", a: ["Conservation", "Equivalent Exchange", "Transmutation", "Human Transmutation"], correct: 1 },
        { q: "In 'Bleach', what is the name of Ichigo's zanpakuto?", a: ["Senbonzakura", "Zangetsu", "Zabimaru", "Ryujin Jakka"], correct: 1 },
      ],
      8: [
        { q: "In 'Hunter x Hunter', which of these is one of the six Nen categories?", a: ["Transmutation", "Illumination", "Absorption", "Distortion"], correct: 0 },
        { q: "In 'Cowboy Bebop', what is the name of the bounty hunters' ship?", a: ["Swordfish", "Bebop", "Red Tail", "Hammerhead"], correct: 1 },
      ],
      9: [
        { q: "In 'Berserk', what is the name of Guts' massive sword?", a: ["Dragon Slayer", "Executioner", "Godslayer", "Black Blade"], correct: 0 },
        { q: "In 'Monster' (2004), who is the main antagonist?", a: ["Kenzo Tenma", "Johan Liebert", "Nina Fortner", "Inspector Lunge"], correct: 1 },
      ],
      10: [
        { q: "Who created and directed the 1988 anime film 'Akira'?", a: ["Hayao Miyazaki", "Katsuhiro Otomo", "Satoshi Kon", "Hideaki Anno"], correct: 1 },
        { q: "What year was the original 'Mobile Suit Gundam' TV series first broadcast?", a: ["1975", "1977", "1979", "1981"], correct: 2 },
      ],
      11: [
        { q: "In 'Legend of the Galactic Heroes', who leads the forces of the Free Planets Alliance?", a: ["Reinhard von Lohengramm", "Yang Wen-li", "Siegfried Kircheis", "Paul von Oberstein"], correct: 1 },
        { q: "In 'Serial Experiments Lain', what is the name of the alternate-reality network?", a: ["The Grid", "The Net", "The Wired", "The Link"], correct: 2 },
      ],
      12: [
        { q: "In 'Ghost in the Shell' (1995), which section does Major Motoko Kusanagi lead?", a: ["Section 6", "Section 9", "Section 11", "Section 1"], correct: 1 },
        { q: "Who directed the 1997 anime film 'Perfect Blue'?", a: ["Hayao Miyazaki", "Mamoru Oshii", "Satoshi Kon", "Isao Takahata"], correct: 2 },
      ],
      13: [
        { q: "What year did Osamu Tezuka's 'Astro Boy' TV anime first air in Japan?", a: ["1958", "1963", "1967", "1971"], correct: 1 },
        { q: "Who directed the 1997 TV series 'Revolutionary Girl Utena'?", a: ["Kunihiko Ikuhara", "Hideaki Anno", "Hiroyuki Imaishi", "Mamoru Hosoda"], correct: 0 },
      ],
      14: [
        { q: "Who directed the 1987 anime film 'Royal Space Force: The Wings of Honnêamise'?", a: ["Mamoru Oshii", "Hiroyuki Yamaga", "Hayao Miyazaki", "Yoshiyuki Tomino"], correct: 1 },
        { q: "Which studio produced the 2008 anime 'Kaiba' directed by Masaaki Yuasa?", a: ["Studio 4°C", "Madhouse", "Bones", "Production I.G"], correct: 1 },
      ],
      15: [
        { q: "In the 1985 OVA 'Megazone 23', what is the name of the pop idol revealed to be an AI?", a: ["Lynn Minmay", "Eve Tokimatsuri", "Sharon Apple", "Yuki Mori"], correct: 1 },
        { q: "Who directed the 1973 animated film 'Belladonna of Sadness' (Mushi Production)?", a: ["Osamu Tezuka", "Eiichi Yamamoto", "Gisaburo Sugii", "Yoshiaki Kawajiri"], correct: 1 },
      ],
    }
  },

  dragonball: {
    name: "Dragon Ball",
    questions: {

      1: [
        { q: "Who is the main character of Dragon Ball?", a: ["Vegeta", "Goku", "Gohan", "Piccolo"], correct: 1 },
        { q: "What is Goku’s Saiyan birth name?", a: ["Raditz", "Bardock", "Kakarot", "Turles"], correct: 2 },
        { q: "What color is the Dragon Radar?", a: ["Blue", "Red", "Yellow", "Green"], correct: 3 },
        { q: "Who created the Dragon Balls on Earth?", a: ["Guru", "Kami", "King Kai", "Dende"], correct: 1 },
        { q: "What is Goku’s signature attack?", a: ["Final Flash", "Kamehameha", "Special Beam Cannon", "Big Bang Attack"], correct: 1 },
      ],

      2: [
        { q: "Who is Goku’s best friend?", a: ["Yamcha", "Krillin", "Tien", "Piccolo"], correct: 1 },
        { q: "What race is Piccolo?", a: ["Saiyan", "Namekian", "Human", "Android"], correct: 1 },
        { q: "What item does Goku use to travel quickly?", a: ["Nimbus", "Flying Carpet", "Jetpack", "Capsule Car"], correct: 0 },
        { q: "Who is Gohan’s father?", a: ["Vegeta", "Goku", "Piccolo", "Krillin"], correct: 1 },
        { q: "What is Vegeta’s title?", a: ["King of Saiyans", "Prince of Saiyans", "Saiyan General", "Elite Warrior"], correct: 1 },
      ],

      3: [
        { q: "Who trained Goku as a child?", a: ["Master Roshi", "Kami", "King Kai", "Grandpa Gohan"], correct: 3 },
        { q: "What technique allows instant movement?", a: ["Teleport Strike", "Instant Transmission", "Flash Step", "Warp Dash"], correct: 1 },
        { q: "Who kills Raditz?", a: ["Goku alone", "Piccolo alone", "Goku and Piccolo", "Vegeta"], correct: 2 },
        { q: "What is the name of the tournament in Dragon Ball?", a: ["World Combat Cup", "World Martial Arts Tournament", "Earth Championship", "Z Fighters Cup"], correct: 1 },
        { q: "What is Bulma’s last name?", a: ["Capsule", "Briefs", "West", "Science"], correct: 1 },
      ],

      4: [
        { q: "Who defeats Nappa?", a: ["Goku", "Vegeta", "Gohan", "Piccolo"], correct: 0 },
        { q: "What is the power multiplier of Kaioken x2?", a: ["Double", "Triple", "Quadruple", "Five times"], correct: 0 },
        { q: "Who is the ruler of Namek?", a: ["Kami", "Guru", "Dende", "Nail"], correct: 1 },
        { q: "Who cuts off Vegeta’s tail?", a: ["Krillin", "Yajirobe", "Gohan", "Piccolo"], correct: 1 },
        { q: "Who cuts off Frieza’s tail?", a: ["Goku", "Krillin", "Gohan", "Piccolo"], correct: 1 },
      ],

      5: [
        { q: "Who was the first Super Saiyan shown in DBZ?", a: ["Vegeta", "Gohan", "Goku", "Trunks"], correct: 2 },
        { q: "What form does Frieza use at 100% power?", a: ["Final Form Full Power", "Golden Form", "True Form", "Ultimate Form"], correct: 0 },
        { q: "Who kills Frieza on Namek?", a: ["Goku", "Frieza survives", "Vegeta", "Krillin"], correct: 1 },
        { q: "Who arrives from the future to kill Frieza?", a: ["Gohan", "Trunks", "Goten", "Bardock"], correct: 1 },
        { q: "What is Trunks’ weapon of choice?", a: ["Staff", "Sword", "Gun", "Spear"], correct: 1 },
      ],

      6: [
        { q: "Who created the Androids?", a: ["Dr. Gero", "Bulma", "Dr. Briefs", "Dr. Myuu"], correct: 0 },
        { q: "What number is Android 18?", a: ["17", "18", "19", "20"], correct: 1 },
        { q: "Who absorbs Androids to become perfect?", a: ["Buu", "Cell", "Frieza", "Baby"], correct: 1 },
        { q: "Who kills Cell?", a: ["Goku", "Vegeta", "Gohan", "Trunks"], correct: 2 },
        { q: "What is Gohan’s strongest form in DBZ?", a: ["SSJ2", "Great Saiyanman", "SSJ3", "Ultimate"], correct: 3 },
      ],

      7: [
        { q: "Who is Majin Buu’s creator?", a: ["Babidi", "Babidi’s father Bibidi", "Dabura", "Beerus"], correct: 1 },
        { q: "What fusion uses earrings?", a: ["Fusion Dance", "Potara", "Namek Fusion", "Time Fusion"], correct: 1 },
        { q: "Who becomes Vegito?", a: ["Goku + Gohan", "Goku + Vegeta", "Vegeta + Trunks", "Gohan + Trunks"], correct: 1 },
        { q: "What is Kid Buu known for?", a: ["Intelligence", "Chaos and destruction", "Strategy", "Honor"], correct: 1 },
        { q: "Who destroys Kid Buu?", a: ["Vegeta", "Goku", "Gohan", "Uub"], correct: 1 },
      ],

      8: [
        { q: "What is the name of Goku’s Saiyan father?", a: ["Raditz", "Bardock", "Paragus", "King Vegeta"], correct: 1 },
        { q: "What movie villain can absorb attacks and use them?", a: ["Broly", "Janemba", "Android 13", "Cooler"], correct: 1 },
        { q: "Who is Cooler related to?", a: ["Cell", "Frieza", "Buu", "Beerus"], correct: 1 },
        { q: "What form is Broly known for?", a: ["Ultra Instinct", "Legendary Super Saiyan", "Super Saiyan Blue", "Super Saiyan 4"], correct: 1 },
        { q: "What is Janemba created from?", a: ["Dragon Balls", "Evil energy in Other World", "Fusion gone wrong", "Time rift"], correct: 1 },
      ],

      9: [
        { q: "Who turns into Super Saiyan 3 first?", a: ["Goku", "Gotenks", "Vegeta", "Gohan"], correct: 0 },
        { q: "What is SSJ3’s biggest drawback?", a: ["Speed loss", "Energy drain", "Weak defense", "No control"], correct: 1 },
        { q: "Who teaches fusion dance?", a: ["Supreme Kai", "Metamorans", "King Kai", "Whis"], correct: 1 },
        { q: "Who is Dabura?", a: ["King of demons", "Saiyan warrior", "Android", "Kai"], correct: 0 },
        { q: "What does the Spirit Bomb require?", a: ["Ki from others", "Only Saiyan power", "Fusion energy", "Dragon Balls"], correct: 0 },
      ],

      10: [
        { q: "What is Beerus the God of?", a: ["Creation", "Destruction", "Time", "Space"], correct: 1 },
        { q: "Who is Beerus’ attendant?", a: ["Vados", "Whis", "Kai", "Grand Priest"], correct: 1 },
        { q: "What form is Super Saiyan God?", a: ["Blue aura", "Red aura", "Green aura", "Purple aura"], correct: 1 },
        { q: "Who achieves Super Saiyan Blue first?", a: ["Goku", "Vegeta", "Gotenks", "Gohan"], correct: 0 },
        { q: "What tournament is introduced in DBS?", a: ["World Tournament", "Tournament of Power", "Galaxy Cup", "Kai Games"], correct: 1 },
      ],

      11: [
        { q: "What universe is Jiren from?", a: ["6", "7", "11", "12"], correct: 2 },
        { q: "What makes Ultra Instinct special?", a: ["Power boost", "Moves without thinking", "Fusion ability", "Energy absorption"], correct: 1 },
        { q: "Who eliminates Jiren?", a: ["Frieza + Vegeta + Android 17", "Frieza + Goku + Android 17", "Gohan + Goku + Android 17", "Vegeta + Gohan + Android 17"], correct: 1 },
        { q: "Who wins the Tournament of Power?", a: ["Goku", "Vegeta", "Android 17", "Frieza"], correct: 2 },
        { q: "What wish is made at the end?", a: ["Revive universes", "Power boost", "Immortality", "Erase Zeno"], correct: 0 },
      ],

      12: [
        { q: "In GT, who turns Goku into a child?", a: ["Baby", "Black Star Dragon Balls", "Pilaf", "Dende"], correct: 2 },
        { q: "What is Super Saiyan 4’s defining feature?", a: ["Blue hair", "Red fur", "White aura", "No aura"], correct: 1 },
        { q: "Who is Baby?", a: ["Saiyan", "Tuffle parasite", "Android", "Demon"], correct: 1 },
        { q: "What are Shadow Dragons born from?", a: ["Fusion", "Negative energy of Dragon Balls", "Kai power", "Time distortion"], correct: 1 },
        { q: "Who is Omega Shenron?", a: ["Fusion of dragons", "Strongest Shadow Dragon", "Namekian god", "Saiyan form"], correct: 1 },
      ],

      13: [
        { q: "Which movie features Gogeta vs Janemba?", a: ["Fusion Reborn", "Broly Second Coming", "Wrath of the Dragon", "Battle of Gods"], correct: 0 },
        { q: "Who uses the Dragon Fist attack?", a: ["Goku", "Vegeta", "Gohan", "Trunks"], correct: 0 },
        { q: "What weapon seals Hirudegarn?", a: ["Sword", "Ocarina", "Staff", "Ring"], correct: 1 },
        { q: "Who creates Baby in GT?", a: ["Dr. Gero", "Dr. Myuu", "Bulma", "Pilaf"], correct: 1 },
        { q: "What is the name of the blind boy Majin Buu cured?", a: ["Tommy", "Billy", "Saji", "Gohan"], correct: 0 },
      ],

      14: [
        { q: "What is the fusion time limit for Potara (mortals)?", a: ["5 min", "10 min", "30 min", "1 hour"], correct: 3 },
        { q: "What triggered Ultra Instinct initially?", a: ["Anger", "Spirit Bomb explosion", "Fusion", "Training"], correct: 1 },
        { q: "Who is the Grand Priest?", a: ["Zeno’s guard", "Angel above all angels", "Kai leader", "Destroyer"], correct: 1 },
        { q: "What happens if all universes were selfish in TOP?", a: ["Nothing", "Zeno erases all", "Restart tournament", "Fusion"], correct: 1 },
        { q: "What is Gogeta’s personality vs Vegito?", a: ["More serious", "More playful", "Same", "Silent"], correct: 1 },
      ],

      15: [
        { q: "Which form does Gogeta use against Broly (DBS)?", a: ["SSJ3", "SSJ4", "SS Blue", "Base"], correct: 2 },
        { q: "What is the exact requirement to summon Super Shenron?", a: ["7 Dragon Balls", "7 Super Dragon Balls with god language", "Any wish", "Fusion"], correct: 1 },
        { q: "Who is the only mortal stronger than a God of Destruction candidate shown in TOP?", a: ["Hit", "Jiren", "Toppo", "Kefla"], correct: 1 },
        { q: "What happens to Goku at the end of GT?", a: ["Dies", "Fuses with Shenron", "Leaves with Shenron", "Becomes God"], correct: 2 },
        { q: "Which villain exists across multiple timelines and uses a scythe to tear reality?", a: ["Zamasu", "Goku Black", "Merged Zamasu", "Fused Zamasu"], correct: 1 },
      ],

    }
  },

  custom: {
    name: "Custom - Anime & Cartoons",      // shown on theme select screen
    questions: {
      1: [
        { q: "Who is known as the Dark Knight?", a: ["Superman", "Natsu Dragneel", "Batman", "Spiderman"], correct: 2 },
        { q: "What is avatar Aangs first mastered element?", a: ["Water", "Air", "Fire", "Earth"], correct: 1 },
        { q: "In One Piece, what is the name of the character that rescues Zoro in episode 2?", a: ["Nami", "Luffy", "Sanji", "Blackbeard"], correct: 1 },
        { q: "What's the name of the samurai that's trying to stop Aku?", a: ["Jeff", "James", "Jack", "Thomas"], corrct: 2 },
        { q: "what is Ash's first Pokemon in the entire series?", a: ["Pikachu", "Charmander", "Bulbasaur", "Squirtle"], correct: 0 },
      ],
      2: [
        { q: "Who is known as the Dark Knight?", a: ["Superman", "Natsu Dragneel", "Batman", "Spiderman"], correct: 2 },
        { q: "What is avatar Aangs first mastered element?", a: ["Water", "Air", "Fire", "Earth"], correct: 1 },
        { q: "In One Piece, what is the name of the character that rescues Zoro in episode 2?", a: ["Nami", "Luffy", "Sanji", "Blackbeard"], correct: 1 },
        { q: "What's the name of the samurai that's trying to stop Aku?", a: ["Jeff", "James", "Jack", "Thomas"], corrct: 2 },
        { q: "what is Ash's first Pokemon in the entire series?", a: ["Pikachu", "Charmander", "Bulbasaur", "Squirtle"], correct: 0 },
      ],
    }
  },

  common_sense: {
    name: "Common Sense",
    questions: {
      1: [
        { q: "How many hours are in a day?", a: ["12", "18", "24", "30"], correct: 2 },
        { q: "If you have two apples and take one away, how many apples do you have?", a: ["0", "1", "2", "3"], correct: 1 },
        { q: "Which of these is used to tell time?", a: ["A book", "A clock", "A plate", "A chair"], correct: 1 },
        { q: "Which comes first in the morning?", a: ["Sunset", "Midnight", "Sunrise", "Noon"], correct: 2 },
        { q: "If all cats are animals and Mittens is a cat, what is Mittens?", a: ["A plant", "An animal", "A rock", "A car"], correct: 1 },
      ],
      2: [
        { q: "What do you call water that has frozen solid?", a: ["Steam", "Mud", "Ice", "Rain"], correct: 2 },
        { q: "How many sides does a triangle have?", a: ["2", "3", "4", "5"], correct: 1 },
        { q: "If you mix red and white paint, what color do you get?", a: ["Purple", "Orange", "Pink", "Brown"], correct: 2 },
        { q: "Which is heavier: one pound of feathers or one pound of bricks?", a: ["Feathers", "Bricks", "The same weight", "Impossible to tell"], correct: 2 },
        { q: "If it's raining outside, which of these is most useful?", a: ["Sunglasses", "An umbrella", "A fan", "Ice cream"], correct: 1 },
      ],
      3: [
        { q: "If a $20 item is 50% off, what does it cost?", a: ["$5", "$10", "$15", "$20"], correct: 1 },
        { q: "Which direction does the sun rise from?", a: ["North", "South", "East", "West"], correct: 2 },
        { q: "If you leave ice cream on the counter for a few hours, what happens?", a: ["It stays frozen", "It melts", "It catches fire", "Nothing"], correct: 1 },
        { q: "Your car has a flat tire. Who is best suited to fix it?", a: ["A doctor", "A mechanic", "A teacher", "A chef"], correct: 1 },
        { q: "Which of these foods is most commonly eaten raw?", a: ["Chicken", "Rice", "Apple", "Pasta"], correct: 2 },
      ],
      4: [
        { q: "What has hands but cannot clap?", a: ["A statue", "A clock", "A tree", "A ghost"], correct: 1 },
        { q: "What gets wetter the more it dries?", a: ["A towel", "Grass", "Soap", "Hair"], correct: 0 },
        { q: "You're in a race and you pass the person in 2nd place. What place are you in now?", a: ["1st", "2nd", "3rd", "4th"], correct: 1 },
        { q: "How many months have 28 days?", a: ["February only", "All of them", "March only", "None"], correct: 1 },
        { q: "A man pushes his car up to a hotel and instantly declares he's bankrupt. Why?", a: ["Someone stole his wallet", "He's playing Monopoly", "The hotel is too expensive", "He crashed"], correct: 1 },
      ],
      5: [
        { q: "A rooster lays an egg on the peak of a slanted roof. Which way does it roll?", a: ["Left", "Right", "Straight down", "Roosters don't lay eggs"], correct: 3 },
        { q: "A plane crashes exactly on the border between the US and Canada. Where are the survivors buried?", a: ["USA", "Canada", "Both equally", "Survivors aren't buried"], correct: 3 },
        { q: "You enter a dark room with a match, a candle, a fireplace, and a gas lamp. What do you light first?", a: ["The candle", "The fireplace", "The gas lamp", "The match"], correct: 3 },
        { q: "Three doctors say Paul is their brother, but Paul says he has no brothers. How?", a: ["Paul is lying", "The doctors are his sisters", "Paul forgot", "The doctors are wrong"], correct: 1 },
        { q: "You see a boat full of people, but there isn't a single person on it. How?", a: ["They're ghosts", "Everyone on board is married", "It's a painting", "They're hiding"], correct: 1 },
      ],
      6: [
        { q: "Lost in the Northern Hemisphere at night — which star helps you find north?", a: ["Sirius", "Polaris (the North Star)", "Venus", "The Sun"], correct: 1 },
        { q: "How long should you wash your hands to effectively kill germs?", a: ["5 seconds", "10 seconds", "At least 20 seconds", "5 full minutes"], correct: 2 },
        { q: "A recipe calls for 2 cups of flour. How much do you need if you double the recipe?", a: ["3 cups", "4 cups", "5 cups", "6 cups"], correct: 1 },
        { q: "A grease fire starts on your stove. What should you NOT use on it?", a: ["A pot lid", "Baking soda", "Water", "A fire blanket"], correct: 2 },
        { q: "Which is usually the cheapest way to travel long distance in the US?", a: ["Private jet", "Intercity bus", "Taxi", "Helicopter"], correct: 1 },
      ],
      7: [
        { q: "A man lives on floor 10. Every day he takes the elevator down. Coming home, he rides to floor 7 and walks the rest — except on rainy days, when he rides to 10. Why?", a: ["He's scared of elevators", "He's short and can only reach the 7 button; on rainy days his umbrella reaches the 10 button", "The elevator is broken above 7", "He wants exercise"], correct: 1 },
        { q: "A woman shoots her husband, holds him underwater for five minutes, then hangs him. Afterward they go out for dinner together. How?", a: ["She's a photographer developing his photo", "He's immortal", "It was all a dream", "They reconciled"], correct: 0 },
        { q: "Two fathers and two sons go fishing. They each catch one fish, yet only three fish are caught. How?", a: ["They lied", "One fish escaped", "There are only three people: grandfather, father, son", "They shared"], correct: 2 },
        { q: "What can travel around the world while staying in one corner?", a: ["A map", "A stamp", "A passport", "A postcard"], correct: 1 },
        { q: "What must be broken before you can use it?", a: ["A glass", "A promise", "An egg", "A door"], correct: 2 },
      ],
      8: [
        { q: "The more of me you take, the more you leave behind. What am I?", a: ["Memories", "Footsteps", "Photos", "Breaths"], correct: 1 },
        { q: "I have cities but no houses, mountains but no trees, water but no fish. What am I?", a: ["A dream", "A map", "A book", "A painting"], correct: 1 },
        { q: "If you have me, you'll want to share me. If you share me, you no longer have me. What am I?", a: ["Money", "A secret", "Love", "Time"], correct: 1 },
        { q: "What has many keys but can't open a single lock?", a: ["A keychain", "A piano", "A locksmith", "A typewriter"], correct: 1 },
        { q: "What 5-letter word becomes shorter when you add two letters to it?", a: ["Hello", "Plant", "Short", "Quiet"], correct: 2 },
      ],
      9: [
        { q: "How many tablespoons are in one cup?", a: ["8", "12", "16", "20"], correct: 2 },
        { q: "What's the standard paper size used in most US offices?", a: ["A4", "Letter (8.5 x 11)", "Legal", "Tabloid"], correct: 1 },
        { q: "Financial advisors commonly recommend saving what percent of income for retirement?", a: ["1-2%", "5%", "10-15%", "50%"], correct: 2 },
        { q: "If bitten by a venomous snake, what should you NOT do?", a: ["Call emergency services", "Keep the bite below heart level", "Try to suck out the venom", "Stay as calm as possible"], correct: 2 },
        { q: "What's the safest way to put out an electrical fire?", a: ["Pour water on it", "Use a Class C fire extinguisher", "Throw sand on it", "Cover it with a blanket"], correct: 1 },
      ],
      10: [
        { q: "Before Mt. Everest was discovered, what was the tallest mountain on Earth?", a: ["Mt. Kilimanjaro", "K2", "Mt. Everest (it was always tallest)", "Denali"], correct: 2 },
        { q: "A man builds a house with 4 walls, each facing south. A bear walks by. What color is the bear?", a: ["Brown", "Black", "White", "Grizzly red"], correct: 2 },
        { q: "What is 30 divided by one-half, plus 10?", a: ["25", "70", "50", "20"], correct: 1 },
        { q: "If two's company and three's a crowd, what are four and five?", a: ["Eight", "Nine", "A lot", "Too many"], correct: 1 },
        { q: "A farmer has 17 sheep. All but 9 die. How many are left alive?", a: ["8", "9", "17", "0"], correct: 1 },
      ],
      11: [
        { q: "A boy and his father are in a car crash. The father dies. The boy is rushed to the hospital and the surgeon says, 'I can't operate — this is my son.' How?", a: ["The surgeon is his mother", "The boy was adopted", "Miscommunication", "He has a twin"], correct: 0 },
        { q: "Today is Wednesday. What day will it be 100 days from now?", a: ["Thursday", "Friday", "Saturday", "Sunday"], correct: 1 },
        { q: "A man looks at a photograph and says: 'Brothers and sisters I have none, but that man's father is my father's son.' Who is in the photograph?", a: ["His father", "His brother", "His son", "Himself"], correct: 2 },
        { q: "You have a round cake. How can you cut it into exactly 8 equal pieces with just 3 straight cuts?", a: ["It's impossible", "Two perpendicular cuts across the top, then one horizontal cut through the middle", "Four cuts required", "Cut in a star pattern"], correct: 1 },
        { q: "Two coins add up to 30 cents. One of them is not a nickel. What are the two coins?", a: ["Two dimes and a nickel", "A quarter and a nickel", "Three dimes", "A quarter and a penny"], correct: 1 },
      ],
      12: [
        { q: "There are 6 apples in a basket and 6 people who each want an apple. How can you give each person an apple and still have one apple left in the basket?", a: ["Cut one apple in half", "Give the last person the basket with the apple still inside", "It's impossible", "Give an IOU"], correct: 1 },
        { q: "You're running a race. You overtake the person in last place. What place are you now in?", a: ["Last", "Second to last", "First", "Impossible — you can't pass the person in last place"], correct: 3 },
        { q: "What has a head and a tail, but no body?", a: ["A snake", "A coin", "A comet", "A ghost"], correct: 1 },
        { q: "A man walks into a bar and asks for a glass of water. The bartender pulls out a gun and points it at him. The man says 'Thank you' and leaves. Why?", a: ["The bartender was his friend", "The man had the hiccups and the scare cured them", "He had been cursed", "He wasn't actually thirsty"], correct: 1 },
        { q: "I can be cracked, I can be made, I can be told, I can be played. What am I?", a: ["A promise", "A joke", "An egg", "A rule"], correct: 1 },
      ],
      13: [
        { q: "A cowboy rides into town on Friday, stays three days, and rides out on Friday. How?", a: ["He stayed three weeks", "His horse is named Friday", "He rode through a time zone", "The calendar changed"], correct: 1 },
        { q: "Mary's father has five daughters: Nana, Nene, Nini, Nono, and ___?", a: ["Nunu", "Mary", "Nana", "Unknown"], correct: 1 },
        { q: "Three switches outside a closed room each control one of three bulbs inside. You can only enter once. How do you identify which switch controls which bulb?", a: ["Impossible with only one entry", "Turn on switch 1 for several minutes, turn it off, turn on switch 2, enter: on=2, off-but-warm=1, off-and-cold=3", "Turn all three on at once", "Listen through the door"], correct: 1 },
        { q: "I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?", a: ["A flag", "An echo", "Music", "A whistle"], correct: 1 },
        { q: "Which is correct: '9 and 7 IS 15' or '9 and 7 ARE 15'?", a: ["IS", "ARE", "Both are correct", "Neither — 9 + 7 is 16"], correct: 3 },
      ],
      14: [
        { q: "A man is found dead in an open field with an unopened package beside him. How did he die?", a: ["Poisoned by the package", "His parachute (the package) failed to open", "Heart attack", "Struck by lightning"], correct: 1 },
        { q: "A man is found hanging from the ceiling in a locked empty room with a puddle of water beneath him. How did he die?", a: ["He was poisoned", "He stood on a block of ice that melted", "He fell from the ceiling", "Someone locked him in"], correct: 1 },
        { q: "How do you turn the word SEVEN into an even number without addition, subtraction, multiplication, or division?", a: ["Write it in Roman numerals", "Rearrange the letters", "Remove the 'S' — 'SEVEN' becomes 'EVEN'", "Use binary code"], correct: 2 },
        { q: "A doctor gives you 3 pills and tells you to take one every half hour. How long before you finish the last pill?", a: ["1 hour", "1.5 hours", "2 hours", "3 hours"], correct: 0 },
        { q: "You have 9 identical-looking balls. One is slightly heavier. What's the minimum number of weighings on a balance scale to guarantee finding it?", a: ["1", "2", "3", "4"], correct: 1 },
      ],
      15: [
        { q: "You have 12 identical-looking balls. One is either slightly heavier OR slightly lighter — you don't know which. What's the minimum number of weighings on a balance scale that guarantees identifying the odd ball AND whether it's heavy or light?", a: ["2", "3", "4", "5"], correct: 1 },
        { q: "Three guests pay $30 for a hotel room ($10 each). The clerk realizes it's only $25 and gives $5 to the bellboy. The bellboy pockets $2 and returns $1 to each guest. Each guest paid $9 (3 × $9 = $27), plus $2 with the bellboy = $29. Where's the missing dollar?", a: ["The bellboy stole it", "There is no missing dollar — $27 already includes the bellboy's $2; the correct math is $25 + $2 + $3 = $30", "The hotel kept it", "The clerk took it"], correct: 1 },
        { q: "A bat and a ball cost $1.10 total. The bat costs $1.00 more than the ball. How much does the ball cost?", a: ["$0.05", "$0.10", "$0.15", "$0.01"], correct: 0 },
        { q: "You face two doors: one to freedom, one to death. Two guards stand there — one always lies, one always tells the truth. You don't know which is which. You get ONE question to one guard. What do you ask?", a: ["Ask which door they personally prefer", "Ask either guard: 'Which door would the OTHER guard say is the safe one?' — then pick the opposite door", "Ask their name", "Ask them to switch places"], correct: 1 },
        { q: "A monk walks up a mountain, starting at sunrise and reaching the top at sunset. The next day he walks down the same path, again starting at sunrise and finishing at sunset. Is there a single spot on the path he occupies at the exact same time on both days?", a: ["No — the times would always differ", "Yes — imagine both journeys happening simultaneously; they must cross at some point", "Only if he walks at identical speed both days", "Only if the path is perfectly straight"], correct: 1 },
      ],
    }
  },

  history: {
    name: "World History",
    questions: {
      1: [
        { q: "Which ancient civilization built the pyramids of Giza?", a: ["Romans", "Greeks", "Egyptians", "Mesopotamians"], correct: 2 },
        { q: "Who was the first emperor of Rome?", a: ["Julius Caesar", "Augustus", "Nero", "Caligula"], correct: 1 },
        { q: "What is the capital of France?", a: ["Paris", "Lyon", "Marseille", "Bordeaux"], correct: 0 },
        { q: "In what year did Christopher Columbus reach the Americas?", a: ["1492", "1521", "1620", "1776"], correct: 0 },
        { q: "Which document was signed in 1215 to limit royal power in England?", a: ["Magna Carta", "Declaration of Independence", "Bill of Rights", "Constitution"], correct: 0 },
      ],
      2: [
        { q: "Which country gifted the Statue of Liberty to the United States in 1886?", a: ["France", "Italy", "Spain", "Germany"], correct: 0 },
        { q: "Who was the leader of the Soviet Union during World War II?", a: ["Vladimir Lenin", "Leon Trotsky", "Joseph Stalin", "Mikhail Gorbachev"], correct: 2 },
        { q: "What ancient civilization built the Colosseum in Rome?", a: ["Greeks", "Etruscans", "Romans", "Cartaginians"], correct: 2 },
        { q: "Which explorer is credited with circumnavigating the globe?", a: ["Christopher Columbus", "Vasco da Gama", "Ferdinand Magellan", "Marco Polo"], correct: 2 },
        { q: "What year did the Berlin Wall fall, marking the end of Cold War tensions in Europe?", a: ["1987", "1989", "1991", "1985"], correct: 1 },
      ],
      3: [
        { q: "Which ancient empire was ruled by pharaohs like Tutankhamun and Ramses II?", a: ["Babylonian Empire", "Assyrian Empire", "New Kingdom of Egypt", "Achaemenid Empire"], correct: 2 },
        { q: "Who wrote the Declaration of Independence in 1776?", a: ["George Washington", "Thomas Jefferson", "John Adams", "Benjamin Franklin"], correct: 1 },
        { q: "What was the name of the treaty that ended World War I in 1918?", a: ["Treaty of Versailles", "Treaty of Tordesillas", "Congress of Vienna", "Treaty of Paris (1783)"], correct: 0 },
        { q: "Which civilization built Machu Picchu in the 15th century?", a: ["Aztec", "Maya", "Inca", "Olmec"], correct: 2 },
        { q: "Who was the first President of the United States?", a: ["John Adams", "Thomas Jefferson", "George Washington", "Abraham Lincoln"], correct: 2 },
      ],
      4: [
        { q: "Which ancient wonder of the world was located in Alexandria, Egypt?", a: ["Colossus of Rhodes", "Lighthouse (Pharos)", "Hanging Gardens", "Mausoleum"], correct: 1 },
        { q: "Who painted the Mona Lisa?", a: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Michelangelo"], correct: 2 },
        { q: "What is the name of the treaty that officially ended the Napoleonic Wars in 1815?", a: ["Treaty of Versailles", "Treaty of Tordesillas", "Congress of Vienna", "Treaty of Paris (1783)"], correct: 2 },
        { q: "Which civilization built the Great Wall to protect against invasions?", a: ["Mongols", "Romans", "Chinese", "Persians"], correct: 2 },
        { q: "Who was the leader of the American Revolution and the first U.S. President?", a: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"], correct: 2 },
      ],
      5: [
        { q: "In what year did World War II end?", a: ["1943", "1944", "1945", "1946"], correct: 2 },
        { q: "Which ancient civilization built the Parthenon on the Acropolis in Athens?", a: ["Romans", "Greeks", "Etruscans", "Persians"], correct: 1 },
        { q: "Who was the first Emperor of China, known for uniting the country and building the Great Wall?", a: ["Confucius", "Mao Zedong", "Qin Shi Huang", "Sun Yat-sen"], correct: 2 },
        { q: "What was the name of the ship that carried the Pilgrims to America in 1620?", a: ["Santa Maria", "Mayflower", "Niña", "Pinta"], correct: 1 },
        { q: "Which treaty officially ended the Seven Years' War in 1763?", a: ["Treaty of Paris (1783)", "Treaty of Versailles", "Treaty of Tordesillas", "Treaty of Utrecht"], correct: 0 },
      ],
      6: [
        { q: "Which ancient empire was known for its road network, including the Appian Way?", a: ["Greek", "Roman", "Persian", "Egyptian"], correct: 1 },
        { q: "Who was the leader of the Soviet Union during the Cuban Missile Crisis in 1962?", a: ["Vladimir Lenin", "Leon Trotsky", "Joseph Stalin", "Nikita Khrushchev"], correct: 3 },
        { q: "What was the name of the first permanent English settlement in North America, founded in 1607?", a: ["Jamestown", "Plymouth", "New York", "Boston"], correct: 0 },
        { q: "Which civilization built the city of Tenochtitlan, which later became Mexico City?", a: ["Aztec", "Maya", "Inca", "Olmec"], correct: 0 },
        { q: "Who was the first woman to win a Nobel Prize in 1903 for her work on radioactivity?", a: ["Rosalind Franklin", "Marie Curie", "Dorothy Hodgkin", "Ada Lovelace"], correct: 1 },
      ],
      7: [
        { q: "Which ancient civilization developed the first known writing system, cuneiform?", a: ["Egyptians", "Sumerians", "Babylonians", "Assyrians"], correct: 1 },
        { q: "Who was the leader of the Indian independence movement and known for nonviolent resistance?", a: ["Mahatma Gandhi", "Jawaharlal Nehru", "Subhas Chandra Bose", "Sardar Vallabhbhai Patel"], correct: 0 },
        { q: "What was the name of the first successful English colony in North America, founded in 1620?", a: ["Jamestown", "Plymouth", "New York", "Boston"], correct: 1 },
        { q: "Which empire was ruled by emperors like Augustus and Trajan during its golden age?", a: ["Greek", "Roman", "Persian", "Egyptian"], correct: 1 },
        { q: "Who was the first Emperor of China, known for uniting the country and building the Great Wall?", a: ["Confucius", "Mao Zedong", "Qin Shi Huang", "Sun Yat-sen"], correct: 2 },
      ],
      8: [
        { q: "Which ancient civilization built the city of Petra in modern-day Jordan?", a: ["Greeks", "Romans", "Nabateans", "Egyptians"], correct: 2 },
        { q: "Who was the first President of the United States to be assassinated, in 1865?", a: ["Abraham Lincoln", "James Garfield", "William McKinley", "John F. Kennedy"], correct: 0 },
        { q: "What was the name of the treaty that ended the Franco-Prussian War in 1871 and unified Germany?", a: ["Treaty of Frankfurt", "Treaty of Versailles", "Treaty of Tordesillas", "Treaty of Utrecht"], correct: 0 },
        { q: "Which civilization built the city of Angkor Wat, the largest religious monument in the world?", a: ["Khmer Empire", "Thai Kingdom", "Burmese Empire", "Vietnamese Dynasty"], correct: 0 },
        { q: "Who was the first woman to win a Nobel Prize in 1903 for her work on radioactivity?", a: ["Rosalind Franklin", "Marie Curie", "Dorothy Hodgkin", "Ada Lovelace"], correct: 1 },
      ],
      9: [
        { q: "Which ancient civilization built the city of Persepolis, the ceremonial capital of the Achaemenid Empire?", a: ["Greeks", "Romans", "Persians", "Egyptians"], correct: 2 },
        { q: "Who was the first Emperor of China, known for uniting the country and building the Great Wall?", a: ["Confucius", "Mao Zedong", "Qin Shi Huang", "Sun Yat-sen"], correct: 2 },
        { q: "What was the name of the treaty that officially ended the Napoleonic Wars in 1815?", a: ["Treaty of Versailles", "Treaty of Tordesillas", "Congress of Vienna", "Treaty of Paris (1783)"], correct: 2 },
        { q: "Which civilization built the city of Tenochtitlan, which later became Mexico City?", a: ["Aztec", "Maya", "Inca", "Olmec"], correct: 0 },
        { q: "Who was the leader of the Soviet Union during the Cuban Missile Crisis in 1962?", a: ["Vladimir Lenin", "Leon Trotsky", "Joseph Stalin", "Nikita Khrushchev"], correct: 3 },
      ],
      10: [
        { q: "Which ancient civilization built the city of Petra in modern-day Jordan?", a: ["Greeks", "Romans", "Nabateans", "Egyptians"], correct: 2 },
        { q: "Who was the first President of the United States to be assassinated, in 1865?", a: ["Abraham Lincoln", "James Garfield", "William McKinley", "John F. Kennedy"], correct: 0 },
        { q: "What was the name of the treaty that ended the Franco-Prussian War in 1871 and unified Germany?", a: ["Treaty of Frankfurt", "Treaty of Versailles", "Treaty of Tordesillas", "Treaty of Utrecht"], correct: 0 },
        { q: "Which civilization built the city of Angkor Wat, the largest religious monument in the world?", a: ["Khmer Empire", "Thai Kingdom", "Burmese Empire", "Vietnamese Dynasty"], correct: 0 },
        { q: "Who was the first woman to win a Nobel Prize in 1903 for her work on radioactivity?", a: ["Rosalind Franklin", "Marie Curie", "Dorothy Hodgkin", "Ada Lovelace"], correct: 1 },
      ],
      11: [
        { q: "Which ancient civilization built the city of Persepolis, the ceremonial capital of the Achaemenid Empire?", a: ["Greeks", "Romans", "Persians", "Egyptians"], correct: 2 },
        { q: "Who was the first Emperor of China, known for uniting the country and building the Great Wall?", a: ["Confucius", "Mao Zedong", "Qin Shi Huang", "Sun Yat-sen"], correct: 2 },
        { q: "What was the name of the treaty that officially ended the Napoleonic Wars in 1815?", a: ["Treaty of Versailles", "Treaty of Tordesillas", "Congress of Vienna", "Treaty of Paris (1783)"], correct: 2 },
        { q: "Which civilization built the city of Tenochtitlan, which later became Mexico City?", a: ["Aztec", "Maya", "Inca", "Olmec"], correct: 0 },
        { q: "Who was the leader of the Soviet Union during the Cuban Missile Crisis in 1962?", a: ["Vladimir Lenin", "Leon Trotsky", "Joseph Stalin", "Nikita Khrushchev"], correct: 3 },
      ],
      12: [
        { q: "Which ancient civilization built the city of Petra in modern-day Jordan?", a: ["Greeks", "Romans", "Nabateans", "Egyptians"], correct: 2 },
        { q: "Who was the first President of the United States to be assassinated, in 1865?", a: ["Abraham Lincoln", "James Garfield", "William McKinley", "John F. Kennedy"], correct: 0 },
        { q: "What was the name of the treaty that ended the Franco-Prussian War in 1871 and unified Germany?", a: ["Treaty of Frankfurt", "Treaty of Versailles", "Treaty of Tordesillas", "Treaty of Utrecht"], correct: 0 },
        { q: "Which civilization built the city of Angkor Wat, the largest religious monument in the world?", a: ["Khmer Empire", "Thai Kingdom", "Burmese Empire", "Vietnamese Dynasty"], correct: 0 },
        { q: "Who was the first woman to win a Nobel Prize in 1903 for her work on radioactivity?", a: ["Rosalind Franklin", "Marie Curie", "Dorothy Hodgkin", "Ada Lovelace"], correct: 1 },
      ],
      13: [
        { q: "Which ancient civilization built the city of Persepolis, the ceremonial capital of the Achaemenid Empire?", a: ["Greeks", "Romans", "Persians", "Egyptians"], correct: 2 },
        { q: "Who was the first Emperor of China, known for uniting the country and building the Great Wall?", a: ["Confucius", "Mao Zedong", "Qin Shi Huang", "Sun Yat-sen"], correct: 2 },
        { q: "What was the name of the treaty that officially ended the Napoleonic Wars in 1815?", a: ["Treaty of Versailles", "Treaty of Tordesillas", "Congress of Vienna", "Treaty of Paris (1783)"], correct: 2 },
        { q: "Which civilization built the city of Tenochtitlan, which later became Mexico City?", a: ["Aztec", "Maya", "Inca", "Olmec"], correct: 0 },
        { q: "Who was the leader of the Soviet Union during the Cuban Missile Crisis in 1962?", a: ["Vladimir Lenin", "Leon Trotsky", "Joseph Stalin", "Nikita Khrushchev"], correct: 3 },
      ],
      14: [
        { q: "Which ancient civilization built the city of Petra in modern-day Jordan?", a: ["Greeks", "Romans", "Nabateans", "Egyptians"], correct: 2 },
        { q: "Who was the first President of the United States to be assassinated, in 1865?", a: ["Abraham Lincoln", "James Garfield", "William McKinley", "John F. Kennedy"], correct: 0 },
        { q: "What was the name of the treaty that ended the Franco-Prussian War in 1871 and unified Germany?", a: ["Treaty of Frankfurt", "Treaty of Versailles", "Treaty of Tordesillas", "Treaty of Utrecht"], correct: 0 },
        { q: "Which civilization built the city of Angkor Wat, the largest religious monument in the world?", a: ["Khmer Empire", "Thai Kingdom", "Burmese Empire", "Vietnamese Dynasty"], correct: 0 },
        { q: "Who was the first woman to win a Nobel Prize in 1903 for her work on radioactivity?", a: ["Rosalind Franklin", "Marie Curie", "Dorothy Hodgkin", "Ada Lovelace"], correct: 1 },
      ],
      15: [
        { q: "Which 12th-century Persian scholar was imprisoned by the Seljuk Turks before being released by a Mongol ruler?", a: ["Avicenna", "Alhazen", "Omar Khayyam", "Ibn Rushd"], correct: 0 },
        { q: "Who formulated the three laws of planetary motion in the 17th century?", a: ["Galileo", "Copernicus", "Kepler", "Tycho Brahe"], correct: 2 },
        { q: "Which ancient empire was ruled by pharaohs like Hatshepsut and Ramses II?", a: ["Babylonian Empire", "Assyrian Empire", "New Kingdom of Egypt", "Achaemenid Empire"], correct: 2 },
        { q: "What treaty officially ended the Napoleonic Wars in 1815?", a: ["Treaty of Versailles", "Treaty of Tordesillas", "Congress of Vienna", "Treaty of Paris (1783)"], correct: 2 },
        { q: "Which civilization built Machu Picchu in the 15th century?", a: ["Aztec", "Maya", "Inca", "Olmec"], correct: 2 },
      ],
    }
  }

};
