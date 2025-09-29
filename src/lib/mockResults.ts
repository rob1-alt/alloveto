export type Result = {
  id: string;
  name: string;
  position: [number, number];
  address: string;
};

export const PARIS_CENTER: [number, number] = [48.8566, 2.3522];

export const MOCK_RESULTS: Result[] = [
  { id: "1", name: "Clinique Vétérinaire du Marais", position: [48.8575, 2.3622], address: "12 Rue du Marais, 75003 Paris" },
  { id: "2", name: "Véto Opéra", position: [48.8696, 2.3320], address: "8 Rue de l'Opéra, 75001 Paris" },
  { id: "3", name: "Cabinet Vétérinaire Montparnasse", position: [48.8422, 2.3211], address: "25 Bd du Montparnasse, 75006 Paris" },
  { id: "4", name: "Véto Bastille", position: [48.853, 2.369], address: "5 Pl. de la Bastille, 75011 Paris" },
  { id: "5", name: "Clinique Vétérinaire Belleville", position: [48.8746, 2.3808], address: "44 Rue de Belleville, 75020 Paris" },
];


