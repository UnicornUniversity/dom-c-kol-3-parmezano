const maleNames = [
  "Jan","Petr","Martin","Tomáš","Lukáš","Jakub","David","Ondřej","Marek","Jiří",
  "Michal","Filip","Adam","Matěj","Dominik","Vojtěch","Daniel","Radek","Karel","Roman",
  "Josef","Stanislav","Aleš","Jaroslav","Zdeněk","Patrik","Václav","Libor","Oldřich","Bohumil",
  "Rostislav","Ivo","Miloslav","Štěpán","Hynek","Vilém","Bedřich","Igor","Dalibor","Svatopluk",
  "Leoš","Vlastimil","Emil","Otakar","Radim","Luboš","Břetislav","Čestmír","Prokop","Arnošt"
];

const femaleNames = [
  "Jana","Petra","Martina","Tereza","Lucie","Kateřina","Veronika","Lenka","Eva","Anna",
  "Barbora","Nikola","Adéla","Karolína","Kristýna","Denisa","Simona","Hana","Alena","Ivana",
  "Markéta","Monika","Eliška","Magdalena","Michaela","Klára","Dagmar","Blanka","Radka","Pavla",
  "Zuzana","Renata","Soňa","Šárka","Vendula","Ilona","Gabriela","Olga","Milena","Jitka",
  "Božena","Libuše","Růžena","Věra","Ludmila","Běla","Anežka","Květa","Vlasta","Emílie"
];

const maleSurnames = [
  "Novák","Svoboda","Novotný","Dvořák","Černý","Procházka","Kučera","Veselý","Horák","Němec",
  "Marek","Pokorný","Pospíšil","Hájek","Jelínek","Král","Růžička","Beneš","Fiala","Sedláček",
  "Doležal","Zeman","Kolář","Navrátil","Čech","Urban","Bartoš","Vaněk","Kopecký","Krejčí",
  "Kratochvíl","Tichý","Šimek","Soukup","Bláha","Kříž","Kohout","Holub","Staněk",
  "Kadlec","Beran","Zajíček","Kolařík","Matoušek","Šťastný","Dušek","Vlček","Pavlík","Moravec"
];

const femaleSurnames = [
  "Nováková","Svobodová","Novotná","Dvořáková","Černá","Procházková","Kučerová","Veselá","Horáková","Němcová",
  "Marková","Pokorná","Pospíšilová","Hájková","Jelínková","Králová","Růžičková","Benešová","Fialová","Sedláčková",
  "Doležalová","Zemanová","Kolářová","Navrátilová","Čechová","Urbanová","Bartošová","Vaňková","Kopecká","Krejčíková",
  "Kratochvílová","Tichá","Šimková","Soukupová","Bláhová","Křížová","Kohoutová","Holubová","Staňková",
  "Kadlecová","Beranová","Zajíčková","Kolaříková","Matoušková","Šťastná","Dušková","Vlčková","Pavlíková","Moravcová"
];

const workloadOptions = [10, 20, 30, 40];

/**
 * Returns a random element from the given array.
 * @param {Array} arr - given array to choose item from
 * @returns {*} random element from given array
 */
function randomArrayItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns a random integer between min and max (inclusive).
 * @param {number} min - minimum value
 * @param {number} max - maximum value
 * @returns {number} random integer
 */
function randomIntNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random birthdate as an ISO string for a person
 * whose age falls within the given range.
 * @param {number} minAge - minimum age in years
 * @param {number} maxAge - maximum age in years
 * @returns {string} birthdate in ISO Date-Time format (YYYY-MM-DDTHH:mm:ss.sssZ)
 */
function generateBirthdate(minAge, maxAge, usedDates) {
  const currentYear = new Date().getFullYear();

  const birthYear = randomIntNum(currentYear - maxAge + 1, currentYear - minAge - 1);
  const birthMonth = randomIntNum(0, 11);
  const daysInMonth = new Date(birthYear, birthMonth + 1, 0).getDate();
  const birthDay = randomIntNum(1, daysInMonth);

  const birthdate = new Date(Date.UTC(birthYear, birthMonth, birthDay)).toISOString();

  if (usedDates.has(birthdate)) {
    return generateBirthdate(minAge, maxAge, usedDates);
  }

  usedDates.add(birthdate);
  return birthdate;
}

/**
 * Generates a single employee object with random attributes.
 * @param {number} minAge - minimum age in years
 * @param {number} maxAge - maximum age in years
 * @returns {{ gender: string, birthdate: string, name: string, surname: string, workload: number }}
 */
function generateEmployee(minAge, maxAge, usedDates) {
  const gender = (Math.random() < 0.5) ? "male" : "female";
  const name = (gender === "male") ? randomArrayItem(maleNames) : randomArrayItem(femaleNames);
  const surname = (gender === "male") ? randomArrayItem(maleSurnames) : randomArrayItem(femaleSurnames);
  const birthdate = generateBirthdate(minAge, maxAge, usedDates);
  const workload = randomArrayItem(workloadOptions);

  return { gender, birthdate, name, surname, workload };
}

/**
 * The main function which calls the application.
 * Generates a list of random employees based on the provided input parameters.
 * Each employee has a randomly assigned name, surname, gender, birthdate and workload.
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @param {number} dtoIn.count - number of employees to generate
 * @param {{ min: number, max: number }} dtoIn.age - age range for generated employees
 * @returns {Array} of employees
 */
export function main(dtoIn) {
  const { count, age } = dtoIn;

  if (!count || count < 1) throw new Error("count must be a positive number");
  if (!age || age.min == null || age.max == null) throw new Error("age.min and age.max are required");
  if (age.min > age.max) throw new Error("age.min cannot be greater than age.max");

  const usedDates = new Set();
  const dtoOut = [];
  for (let i = 0; i < count; i++) {
    dtoOut.push(generateEmployee(age.min, age.max, usedDates));
  }

  return dtoOut;
}