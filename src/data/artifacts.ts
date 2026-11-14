import { Artifact } from '../types/artifact';
import narrationScripts from './narrationScripts.json';

const scriptMap = new Map(narrationScripts.map(item => [item.id, item]));

export const ARTIFACTS: Artifact[] = [
  {
    id: 'opportunity-rover',
    name: 'Opportunity Rover (MER-B / "Oppy")',
    callsign: 'Opportunity',
    celestialBody: 'Mars',
    status: 'Dormant',
    landingSite: 'Perseverance Valley, Endeavour Crater',
    coordinates: '2.33° S, 354.74° E',
    launchDate: 'July 7, 2003',
    landingDate: 'January 25, 2004',
    missionLifespan: {
      planned: '90 Martian Days (Sols)',
      actual: '14 Years, 138 Days (5,352 Sols)'
    },
    characterArchetype: 'Mars Exploration Rover • MER-B',
    tagline: 'Planned for 90 days; gave humanity 15 years and an Olympic marathon across Mars.',
    modelPath: '/models/opportunity.glb',
    modelScale: [0.9, 0.9, 0.9],
    modelRotation: [0, Math.PI / 4, 0],
    modelPosition: [0, -0.2, 0],
    soundEffects: scriptMap.get('opportunity-rover')?.soundEffects || [],
    takeawayForKids: scriptMap.get('opportunity-rover')?.takeawayForKids || 'Resilience and determination can turn 90 days into a 15-year marathon.',
    whyLeftBehind: 'When the catastrophic 2018 planet-encircling dust storm blotted out the Martian sun, red dust blanketed Oppy\'s solar wings. Unable to recharge its lithium-ion batteries or power survival heaters in the bitter cold, the rover fell into permanent hibernation. Leaving it in place preserves the pristine, untouched record of its 28.06-mile trans-Martian trail.',
    breakthroughs: [
      'Discovered hematite "blueberries", proving standing liquid water once rippled across ancient Mars.',
      'Completed an Olympic marathon on another planet (28.06 miles / 45.16 km).',
      'Sent back 217,594 raw images and survived for over 55 times its planned design warranty.'
    ],
    instruments: [
      { name: 'Pancam (Panoramic Camera)', role: 'Stereoscopic high-resolution color imaging mast.' },
      { name: 'Mini-TES (Thermal Emission Spectrometer)', role: 'Mineral and rock heat-signature scanner.' },
      { name: 'Mössbauer Spectrometer', role: 'Iron-bearing mineral composition analyzer on robotic arm.' },
      { name: 'RAT (Rock Abrasion Tool)', role: 'Grinding wheel that exposed fresh unweathered rock interiors.' }
    ],
    didYouKnow: [
      'Opportunity landed by bouncing inside a protective cocoon of giant inflatable airbags.',
      'Its final telemetry transmission to Earth translated to: "My battery is low and it is getting dark."',
      'It climbed out of Eagle Crater, Endurance Crater, and Victoria Crater before making its final stand at Endeavour Crater.'
    ],
    ttsCleanScript: scriptMap.get('opportunity-rover')?.ttsCleanScript || '',
    directorScript: scriptMap.get('opportunity-rover')?.directorScript || '',
    audioDurationSec: scriptMap.get('opportunity-rover')?.estimatedDurationSec || 74,
    accentColor: '#e05a36'
  },
  {
    id: 'ingenuity-helicopter',
    name: 'Ingenuity Mars Helicopter ("Ginny")',
    callsign: 'Ingenuity',
    celestialBody: 'Mars',
    status: 'Rotor Retired',
    landingSite: 'Airfield Valinor Hills, Jezero Crater',
    coordinates: '18.4447° N, 77.4508° E',
    launchDate: 'July 30, 2020',
    landingDate: 'February 18, 2021',
    missionLifespan: {
      planned: '5 Test Demonstration Flights (30 Days)',
      actual: '72 Flights (Over 1,000 Days)'
    },
    characterArchetype: 'Mars Aerial Reconnaissance Scout',
    tagline: 'The first powered, controlled aircraft ever flown on another celestial world.',
    modelPath: '/models/ingenuity.glb',
    modelScale: [1.2, 1.2, 1.2],
    modelRotation: [0, 0, 0],
    modelPosition: [0, -0.3, 0],
    soundEffects: scriptMap.get('ingenuity-helicopter')?.soundEffects || [],
    takeawayForKids: scriptMap.get('ingenuity-helicopter')?.takeawayForKids || 'Even when people say flight is impossible, innovation can rewrite the laws of exploration.',
    whyLeftBehind: 'During flight 72 over featureless rolling sand ripples, one carbon-fiber rotor tip sustained terminal impact damage during an emergency landing. While no longer flight-worthy, Ginny remains resting at Airfield Valinor Hills where its flight computer wakes up daily to record temperatures and test avionics as a stationary testbed.',
    breakthroughs: [
      'Proved aerodynamic lift in Mars’ ultra-thin atmosphere (<1% of Earth\'s atmospheric density).',
      'Logged 128.8 minutes of total flight time across 10.5 miles (17.0 km) of terrain.',
      'Scouted steep ravines and impassable boulder fields for rover Perseverance.'
    ],
    instruments: [
      { name: 'Dual Coaxial Carbon-Fiber Blades', role: 'Counter-rotating rotors spinning at 2,500+ RPM.' },
      { name: 'Return-to-Earth Color Camera', role: '13-megapixel terrain and aerial reconnaissance camera.' },
      { name: 'Wright Brothers Flyer Muslin Tribute', role: 'Authentic 1903 fabric swatch mounted under solar panel.' }
    ],
    didYouKnow: [
      'Martian air is so thin that spinning helicopter blades on Mars is equivalent to flying at 100,000 feet above Earth.',
      'Ginny was carried to Mars strapped underneath the belly of the Perseverance rover.',
      'It outlived its original 30-day technology demonstration timeline by more than 33 times!'
    ],
    ttsCleanScript: scriptMap.get('ingenuity-helicopter')?.ttsCleanScript || '',
    directorScript: scriptMap.get('ingenuity-helicopter')?.directorScript || '',
    audioDurationSec: scriptMap.get('ingenuity-helicopter')?.estimatedDurationSec || 68,
    accentColor: '#ff7a50'
  },
  {
    id: 'apollo-11-descent',
    name: 'Apollo 11 Lunar Module Descent Stage & ALSEP',
    callsign: 'Eagle Descent Stage',
    celestialBody: 'Moon',
    status: 'Permanent Monument',
    landingSite: 'Statio Tranquillitatis (Sea of Tranquility)',
    coordinates: '0.67408° N, 23.47297° E',
    launchDate: 'July 16, 1969',
    landingDate: 'July 20, 1969',
    missionLifespan: {
      planned: '21 Hours, 36 Minutes on Surface',
      actual: 'Permanent Archaeological Monument (55+ Years Active Science)'
    },
    characterArchetype: 'Historic Lunar Landing Pedestal',
    tagline: 'The historic golden platform that served as humanity’s launchpad for the first lunar steps.',
    modelPath: '/models/apollo-lunar-module.glb',
    modelScale: [0.65, 0.65, 0.65],
    modelRotation: [0, Math.PI / 6, 0],
    modelPosition: [0, -0.4, 0],
    soundEffects: scriptMap.get('apollo-11-descent')?.soundEffects || [],
    takeawayForKids: scriptMap.get('apollo-11-descent')?.takeawayForKids || 'Passive engineering like glass prisms can conduct science for over 50 years with zero electricity.',
    whyLeftBehind: 'To escape the Moon\'s gravitational pull and rendezvous with the Command Module in orbit, Apollo 11’s ascent stage had to shed all non-essential mass. The descent stage remained behind as the launch pedestal, bearing the immortal steel plaque: "Here men from the planet Earth first set foot upon the Moon. We came in peace for all mankind."',
    breakthroughs: [
      'Supported Neil Armstrong and Buzz Aldrin during humanity’s first 2.5-hour lunar spacewalk.',
      'Deployed the Laser Ranging Retroreflector (LRRR), which still conducts laser range-finding today.',
      'Proved that the Moon drifts away from Earth by approximately 3.8 cm per year.'
    ],
    instruments: [
      { name: 'Descent Engine (DPS)', role: 'Throttleable hypergolic rocket engine that softened the landing.' },
      { name: 'Laser Ranging Retroreflector (LRRR)', role: 'Array of 100 fused silica quartz corner cubes.' },
      { name: 'Commemorative Steel Plaque', role: 'Engraved diplomatic marker on the forward landing leg.' }
    ],
    didYouKnow: [
      'The ALSEP Laser Retroreflector has zero electronic circuits or batteries—it reflects laser pulses purely with precision glass prisms!',
      'Because the Moon has no atmosphere, rain, or wind, the astronauts\' bootprints around the stage will remain intact for millions of years.',
      'The four landing pads contained contact-sensing probes that told Armstrong "Contact light!" as they touched lunar soil.'
    ],
    ttsCleanScript: scriptMap.get('apollo-11-descent')?.ttsCleanScript || '',
    directorScript: scriptMap.get('apollo-11-descent')?.directorScript || '',
    audioDurationSec: scriptMap.get('apollo-11-descent')?.estimatedDurationSec || 72,
    accentColor: '#fbbf24'
  },
  {
    id: 'insight-lander',
    name: 'InSight Geophysical Lander',
    callsign: 'InSight',
    celestialBody: 'Mars',
    status: 'Dormant',
    landingSite: 'Elysium Planitia',
    coordinates: '4.502° N, 135.623° E',
    launchDate: 'May 5, 2018',
    landingDate: 'November 26, 2018',
    missionLifespan: {
      planned: '1 Mars Year (~2 Earth Years)',
      actual: '4 Years, 24 Days (1,445 Sols)'
    },
    characterArchetype: 'Planetary Geophysics Observatory',
    tagline: 'Took the pulse of Mars, listening to over 1,300 Marsquakes with an ultra-sensitive seismic ear.',
    modelPath: '/models/insight.glb',
    modelScale: [0.85, 0.85, 0.85],
    modelRotation: [0, -Math.PI / 4, 0],
    modelPosition: [0, -0.3, 0],
    soundEffects: scriptMap.get('insight-lander')?.soundEffects || [],
    takeawayForKids: scriptMap.get('insight-lander')?.takeawayForKids || 'Listening closely to faint whispers can reveal the deep secrets inside a whole planet.',
    whyLeftBehind: 'Designed with massive twin circular UltraFlex solar panels, InSight sat stationary in the smooth lava plains of Elysium Planitia. Over four years, fine Martian dust steadily settled over the solar cells until power output dropped below the threshold required to power its communications transmitter in December 2022.',
    breakthroughs: [
      'Detected over 1,319 Marsquakes, mapping the crust, mantle, and molten liquid iron core of Mars.',
      'Recorded the first direct sound of Martian wind via seismic vibration sensors.',
      'Detected the seismic shockwaves of meteorite impacts crashing into Mars.'
    ],
    instruments: [
      { name: 'SEIS (Seismic Experiment for Interior Structure)', role: 'Ultra-sensitive seismometer inside a golden evacuated dome.' },
      { name: 'HP3 ("The Mole")', role: 'Self-hammering heat probe designed to measure subterranean thermal heat flow.' },
      { name: 'Instrument Deployment Arm (IDA)', role: '1.9-meter robotic arm with scoop and motorized grapple.' }
    ],
    didYouKnow: [
      'InSight’s seismometer was so sensitive it could detect vibrations smaller than the diameter of a single hydrogen atom!',
      'Before power faded, engineers used InSight\'s robotic scoop to trickle sand over the lander to clean dust off the solar panels using wind gusts.',
      'Its final message home read: "Don\'t worry about me: my time here has been both productive and serene."'
    ],
    ttsCleanScript: scriptMap.get('insight-lander')?.ttsCleanScript || '',
    directorScript: scriptMap.get('insight-lander')?.directorScript || '',
    audioDurationSec: scriptMap.get('insight-lander')?.estimatedDurationSec || 70,
    accentColor: '#38bdf8'
  },
  {
    id: 'apollo-15-lrv',
    name: 'Apollo 15 Lunar Roving Vehicle (LRV-1)',
    callsign: 'Moon Buggy',
    celestialBody: 'Moon',
    status: 'Permanent Monument',
    landingSite: 'Hadley-Apennine Region (Hadley Rille)',
    coordinates: '26.1322° N, 3.6339° E',
    launchDate: 'July 26, 1971',
    landingDate: 'July 30, 1971',
    missionLifespan: {
      planned: '67 Hours on Moon Surface',
      actual: 'Permanent Lunar Monument (53+ Years)'
    },
    characterArchetype: 'Lunar Surface Mobility System',
    tagline: 'Humanity\'s first electric automobile driven on the dusty mountains of another world.',
    modelPath: undefined, // Reconstructed procedurally with Three.js geometry
    modelScale: [1.0, 1.0, 1.0],
    modelRotation: [0, Math.PI / 4, 0],
    modelPosition: [0, -0.2, 0],
    soundEffects: [
      'Electric drive motor whine',
      'Wire mesh wheels crunching on powdery regolith',
      'Astronaut laughter over radio',
      'High-gain dish antenna tracking click'
    ],
    takeawayForKids: 'Curiosity expands when we build tools that carry us beyond our physical horizons.',
    whyLeftBehind: 'Constructed from lightweight aluminum with zero roof, doors, or windows, the LRV folded up like origami inside the Apollo Lunar Module descent bay. At 462 pounds, it was too heavy to bring back to Earth. Parked 300 feet from the Lunar Module, its color TV camera aimed upward to broadcast the historic liftoff of the ascent stage back to millions on Earth.',
    breakthroughs: [
      'Expanded astronaut EVA exploration range from hundreds of yards to over 17 miles (27.8 km).',
      'Allowed astronauts to discover the famous 4.1-billion-year-old "Genesis Rock".',
      'Achieved a top lunar speed of 8 mph (13 km/h) across craters and boulder fields.'
    ],
    instruments: [
      { name: 'Woven Piano-Wire Mesh Wheels', role: 'Zinc-coated wire mesh with titanium chevron treads for gripping dust.' },
      { name: 'T-Handle Joystick Controller', role: 'Central joystick that steered all 4 independent electric drive wheels.' },
      { name: 'High-Gain Mesh Umbrella Dish', role: 'Steerable parabolic antenna that beamed live color TV to Earth.' }
    ],
    didYouKnow: [
      'The Lunar Rover was completely electric and powered by two 36-volt silver-zinc non-rechargeable batteries.',
      'Astronauts Gene Cernan and Harrison Schmitt later repaired an LRV fender on Apollo 17 using lunar maps and duct tape!',
      'LRV-1 is parked at Hadley Rille with its TV camera tilted up, where it still stands under the vacuum of space.'
    ],
    ttsCleanScript: scriptMap.get('apollo-15-lrv')?.ttsCleanScript || 'We were humanity’s first electric car, and we didn’t drive on highways—we cruised the mountains of the Moon! Built with four open wire-mesh wheels and a lawn-chair cockpit, we let astronauts explore miles further than human legs could ever walk.',
    directorScript: scriptMap.get('apollo-15-lrv')?.directorScript || 'We were humanity’s first electric car, and we didn’t drive on highways—we cruised the mountains of the Moon!',
    audioDurationSec: scriptMap.get('apollo-15-lrv')?.estimatedDurationSec || 65,
    accentColor: '#93c5fd'
  },
  {
    id: 'sojourner-pathfinder',
    name: 'Sojourner Rover & Mars Pathfinder',
    callsign: 'Sojourner',
    celestialBody: 'Mars',
    status: 'Dormant',
    landingSite: 'Ares Vallis, Chryse Planitia',
    coordinates: '19.33° N, 33.55° W',
    launchDate: 'December 4, 1996',
    landingDate: 'July 4, 1997',
    missionLifespan: {
      planned: '7 Martian Sols (Rover) / 30 Sols (Base)',
      actual: '83 Sols (Nearly 3 Months)'
    },
    characterArchetype: 'First Planetary Microrover',
    tagline: 'The microwave-sized pioneer named after civil rights crusader Sojourner Truth that proved rovers could survive on Mars.',
    modelPath: undefined, // Reconstructed procedurally with Three.js geometry
    modelScale: [1.1, 1.1, 1.1],
    modelRotation: [0, -Math.PI / 6, 0],
    modelPosition: [0, -0.2, 0],
    soundEffects: [
      'Airbag bouncing rumble',
      'Petal ramp unfolding servo motor',
      'Miniature cleated wheel ticks',
      '1997 dial-up telemetry tone'
    ],
    takeawayForKids: 'Size does not determine courage; the smallest pioneers often open the grandest frontiers.',
    whyLeftBehind: 'Pathfinder was designed as a low-cost proof-of-concept technology demonstration. After 83 sols of operations and transmitting 2.3 billion bits of scientific data, the Carl Sagan Memorial Station base station battery failed in late September 1997, leaving tiny Sojourner safely circling its mothership in Ares Vallis.',
    breakthroughs: [
      'First wheeled rover to traverse another planet in human history.',
      'Demonstrated airbag cushioning landing system that paved the way for Spirit and Opportunity.',
      'Captured global public imagination in 1997 with over 500 million web visits.'
    ],
    instruments: [
      { name: 'APXS (Alpha Proton X-ray Spectrometer)', role: 'Alpha particle sensor on rear deployable arm.' },
      { name: 'Stereo Forward Cameras', role: 'Black-and-white navigational eye sensors.' },
      { name: 'Rocker-Bogie 6-Wheel Chassis', role: 'Titanium suspension capable of rolling over rocks larger than wheels.' }
    ],
    didYouKnow: [
      'Sojourner weighed just 23 pounds (10.6 kg) and was no larger than a child’s microwave oven.',
      'The landing site was named "The Carl Sagan Memorial Station" in honor of the famed planetary astronomer.',
      'NASA named the rover after Sojourner Truth, an African-American abolitionist and women\'s rights champion.'
    ],
    ttsCleanScript: scriptMap.get('sojourner-pathfinder')?.ttsCleanScript || 'Before the giant rovers ruled the Red Planet, there was just me: twenty-three pounds of titanium, six tiny knobby wheels, and an indomitable spirit. They named me after Sojourner Truth, and on July 4, 1997, I took the very first tire roll on Mars.',
    directorScript: scriptMap.get('sojourner-pathfinder')?.directorScript || 'Before the giant rovers ruled the Red Planet, there was just me: twenty-three pounds of titanium and six tiny wheels.',
    audioDurationSec: scriptMap.get('sojourner-pathfinder')?.estimatedDurationSec || 62,
    accentColor: '#e05a36'
  },
  {
    id: 'pioneer-10',
    name: 'Pioneer 10 Deep Space Probe',
    callsign: 'Pioneer 10',
    celestialBody: 'Asteroid / Deep Space',
    status: 'Perpetual Drift',
    landingSite: 'Interstellar Trajectory (Aldebaran bound)',
    coordinates: 'Drifting into deep interstellar space (~80+ AU from Earth)',
    launchDate: 'March 2, 1972',
    landingDate: 'N/A (Perpetual Drift)',
    missionLifespan: {
      planned: '21 Months (Jupiter Flyby)',
      actual: '30+ Years Active Telemetry (Perpetual Cosmic Flight)'
    },
    characterArchetype: 'Interstellar Deep Space Probe',
    tagline: 'The first human spacecraft to cross the Asteroid Belt, fly past Jupiter, and venture toward deep interstellar space.',
    modelPath: '/models/pioneer-10.glb',
    modelScale: [0.75, 0.75, 0.75],
    modelRotation: [0, 0, 0],
    modelPosition: [0, -0.2, 0],
    soundEffects: scriptMap.get('pioneer-10')?.soundEffects || [
      'Deep cosmic silence',
      'Faint pulsar radio hum',
      'Subtle metallic resonance',
      'Interstellar beacon pulse'
    ],
    takeawayForKids: 'Our messages of peace, science, and kindness can travel forever across the cosmic ocean.',
    whyLeftBehind: 'Pioneer 10 was accelerated onto a hyperbolic escape trajectory out of the solar system after its historic Jupiter gravity assist. With no thrusters capable of stopping it and its nuclear RTG power decaying over decades, its final whisper was received on January 23, 2003, from a distance of 7.6 billion miles. It is coasting perpetually toward the red star Aldebaran in the constellation Taurus.',
    breakthroughs: [
      'First spacecraft to traverse the Asteroid Belt without colliding with cosmic debris.',
      'Captured the first close-up images of Jupiter and its turbulent Great Red Spot.',
      'Carries humanity’s famous Golden Plaque designed by Carl Sagan and Frank Drake.'
    ],
    instruments: [
      { name: '2.74-meter Parabolic Dish Antenna', role: 'Large high-gain aluminum communications reflector.' },
      { name: 'Golden Pioneer Plaque', role: 'Gold-anodized aluminum sheet showing human figures and solar coordinates.' },
      { name: 'Helium Vector Magnetometer', role: 'Extended sensor boom that mapped Jupiter\'s intense magnetic field.' }
    ],
    didYouKnow: [
      'It will take Pioneer 10 more than two million years to reach the vicinity of the star Aldebaran.',
      'The golden plaque contains a map indicating the position of Earth relative to 14 pulsating neutron stars (pulsars).',
      'Pioneer 10 was the most distant human-made object in the universe until Voyager 1 surpassed it in 1998.'
    ],
    ttsCleanScript: scriptMap.get('pioneer-10')?.ttsCleanScript || 'I am the lone wanderer. Launched in the spring of 1972, I was the first scout to cross the perilous Asteroid Belt and look into the giant swirling eye of Jupiter. Bolted to my frame is a gleaming gold plate carrying humanity’s greeting to the universe.',
    directorScript: scriptMap.get('pioneer-10')?.directorScript || 'I am the lone wanderer. Launched in 1972, carrying humanity’s golden greeting into deep interstellar night.',
    audioDurationSec: scriptMap.get('pioneer-10')?.estimatedDurationSec || 78,
    accentColor: '#a855f7'
  },
  {
    id: 'surveyor-3',
    name: 'Surveyor 3 Robot Scout',
    callsign: 'Surveyor 3',
    celestialBody: 'Moon',
    status: 'Permanent Monument',
    landingSite: 'Oceanus Procellarum (Ocean of Storms)',
    coordinates: '3.015° S, 23.418° W',
    launchDate: 'April 17, 1967',
    landingDate: 'April 20, 1967',
    missionLifespan: {
      planned: '14 Lunar Days',
      actual: 'Permanent Lunar Scout (Visited by Apollo 12)'
    },
    characterArchetype: 'Automated Lunar Precursor Lander',
    tagline: 'The lunar robotic scout that dug the first trenches in Moon soil and was later visited by Apollo 12 astronauts.',
    modelPath: undefined, // Reconstructed procedurally with Three.js geometry
    modelScale: [0.95, 0.95, 0.95],
    modelRotation: [0, Math.PI / 3, 0],
    modelPosition: [0, -0.3, 0],
    soundEffects: [
      'Vernier engine pulse firing',
      'Mechanical claw digging in lunar regolith',
      'Apollo 12 astronaut radio chatter',
      'Camera shutter snap'
    ],
    takeawayForKids: 'Before humans can take bold leaps, automated scouts must first pave the path.',
    whyLeftBehind: 'Surveyor 3 fulfilled its mission in 1967 by confirming that lunar soil had sufficient bearing strength to support a human lunar module without sinking. Two and a half years later, in November 1969, Apollo 12 astronauts Pete Conrad and Alan Bean executed a pinpoint landing just 600 feet away, walking up to Surveyor 3 to retrieve its TV camera and mechanical scoop claw for analysis on Earth.',
    breakthroughs: [
      'Proved lunar soil consistency is similar to wet beach sand, clearing Apollo for landing.',
      'Only robotic probe on another celestial world ever visited and examined by human space travelers.',
      'Dug four trenches and conducted 18 hours of soil mechanical testing.'
    ],
    instruments: [
      { name: 'Surface Sampler Mechanism', role: 'Motorized pantograph arm with claw bucket that scooped lunar regolith.' },
      { name: 'Vidicon Television Camera', role: '360° pan-tilt camera that transmitted 6,315 high-res photos to Earth.' },
      { name: 'Solar Cell Array & Antenna Mast', role: 'Planar solar panel supplying 89 watts of electrical power.' }
    ],
    didYouKnow: [
      'Apollo 12 astronauts walked right up to Surveyor 3 on the Moon, cut off its TV camera with shears, and brought it back to Earth!',
      'When scientists on Earth inspected the returned camera inside a cleanroom, they discovered harmless dormant Streptococcus bacteria that had survived 2.5 years on the Moon.',
      'It sits inside the gentle slope of a 650-foot crater named Surveyor Crater.'
    ],
    ttsCleanScript: scriptMap.get('surveyor-3')?.ttsCleanScript || 'Two years before Neil Armstrong’s famous bootprint, I stood alone in the Ocean of Storms. I had three aluminum legs and a mechanical claw, digging the very first trenches in lunar soil so scientists could be sure the Moon would hold the weight of human astronauts.',
    directorScript: scriptMap.get('surveyor-3')?.directorScript || 'Two years before Apollo 11, I stood alone in the Ocean of Storms. I dug the first trenches so humans could land safely.',
    audioDurationSec: scriptMap.get('surveyor-3')?.estimatedDurationSec || 64,
    accentColor: '#cbd5e1'
  }
];
