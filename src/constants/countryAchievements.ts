export interface CountryAchievement {
  flag: string
  rank: number
  nickname: string
  confederation: string
  highlights: { year: string; title: string }[]
  stats: { label: string; value: string }[]
}

export const COUNTRY_ACHIEVEMENTS: Record<string, CountryAchievement> = {
  argentina: {
    flag: '🇦🇷', rank: 1, nickname: 'La Albiceleste', confederation: 'CONMEBOL',
    highlights: [
      { year: '2022', title: 'FIFA World Cup Winners' },
      { year: '2024', title: 'Copa América Winners' },
      { year: '2021', title: 'Copa América Winners' },
      { year: '1986', title: 'FIFA World Cup Winners' },
    ],
    stats: [{ label: 'World Cups', value: '3' }, { label: 'Copa América', value: '16' }, { label: 'FIFA Rank', value: '#1' }, { label: 'Best Player', value: 'Messi' }],
  },
  france: {
    flag: '🇫🇷', rank: 2, nickname: 'Les Bleus', confederation: 'UEFA',
    highlights: [
      { year: '2018', title: 'FIFA World Cup Winners' },
      { year: '2000', title: 'UEFA Euro Winners' },
      { year: '1998', title: 'FIFA World Cup Winners' },
      { year: '1984', title: 'UEFA Euro Winners' },
    ],
    stats: [{ label: 'World Cups', value: '2' }, { label: 'UEFA Euros', value: '2' }, { label: 'FIFA Rank', value: '#2' }, { label: 'Best Player', value: 'Mbappé' }],
  },
  spain: {
    flag: '🇪🇸', rank: 3, nickname: 'La Roja', confederation: 'UEFA',
    highlights: [
      { year: '2024', title: 'UEFA Euro Winners' },
      { year: '2012', title: 'UEFA Euro Winners' },
      { year: '2010', title: 'FIFA World Cup Winners' },
      { year: '2008', title: 'UEFA Euro Winners' },
    ],
    stats: [{ label: 'World Cups', value: '1' }, { label: 'UEFA Euros', value: '4' }, { label: 'FIFA Rank', value: '#3' }, { label: 'Best Player', value: 'Yamal' }],
  },
  england: {
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rank: 4, nickname: 'The Three Lions', confederation: 'UEFA',
    highlights: [
      { year: '2024', title: 'UEFA Euro Runners-Up' },
      { year: '2021', title: 'UEFA Euro Runners-Up' },
      { year: '1966', title: 'FIFA World Cup Winners' },
    ],
    stats: [{ label: 'World Cups', value: '1' }, { label: 'UEFA Euros', value: '0' }, { label: 'FIFA Rank', value: '#4' }, { label: 'Best Player', value: 'Bellingham' }],
  },
  brazil: {
    flag: '🇧🇷', rank: 5, nickname: 'Seleção', confederation: 'CONMEBOL',
    highlights: [
      { year: '2002', title: 'FIFA World Cup Winners' },
      { year: '1994', title: 'FIFA World Cup Winners' },
      { year: '1970', title: 'FIFA World Cup Winners' },
      { year: '2019', title: 'Copa América Winners' },
    ],
    stats: [{ label: 'World Cups', value: '5' }, { label: 'Copa América', value: '9' }, { label: 'FIFA Rank', value: '#5' }, { label: 'Best Player', value: 'Vinicius Jr' }],
  },
  portugal: {
    flag: '🇵🇹', rank: 6, nickname: 'Seleção das Quinas', confederation: 'UEFA',
    highlights: [
      { year: '2019', title: 'UEFA Nations League Winners' },
      { year: '2016', title: 'UEFA Euro Winners' },
    ],
    stats: [{ label: 'World Cups', value: '0' }, { label: 'UEFA Euros', value: '1' }, { label: 'FIFA Rank', value: '#6' }, { label: 'Best Player', value: 'Ronaldo' }],
  },
  netherlands: {
    flag: '🇳🇱', rank: 7, nickname: 'Oranje', confederation: 'UEFA',
    highlights: [
      { year: '2024', title: 'UEFA Euro Semi-Finalists' },
      { year: '2010', title: 'FIFA World Cup Runners-Up' },
      { year: '1988', title: 'UEFA Euro Winners' },
    ],
    stats: [{ label: 'World Cups', value: '0' }, { label: 'UEFA Euros', value: '1' }, { label: 'FIFA Rank', value: '#7' }, { label: 'Best Player', value: 'van Dijk' }],
  },
  belgium: {
    flag: '🇧🇪', rank: 8, nickname: 'Red Devils', confederation: 'UEFA',
    highlights: [
      { year: '2018', title: 'FIFA World Cup 3rd Place' },
      { year: '1980', title: 'UEFA Euro Runners-Up' },
    ],
    stats: [{ label: 'World Cups', value: '0' }, { label: 'UEFA Euros', value: '0' }, { label: 'FIFA Rank', value: '#8' }, { label: 'Best Player', value: 'De Bruyne' }],
  },
  germany: {
    flag: '🇩🇪', rank: 9, nickname: 'Die Mannschaft', confederation: 'UEFA',
    highlights: [
      { year: '2014', title: 'FIFA World Cup Winners' },
      { year: '1996', title: 'UEFA Euro Winners' },
      { year: '1990', title: 'FIFA World Cup Winners' },
      { year: '1974', title: 'FIFA World Cup Winners' },
    ],
    stats: [{ label: 'World Cups', value: '4' }, { label: 'UEFA Euros', value: '3' }, { label: 'FIFA Rank', value: '#9' }, { label: 'Best Player', value: 'Musiala' }],
  },
  croatia: {
    flag: '🇭🇷', rank: 10, nickname: 'Vatreni', confederation: 'UEFA',
    highlights: [
      { year: '2022', title: 'FIFA World Cup 3rd Place' },
      { year: '2018', title: 'FIFA World Cup Runners-Up' },
      { year: '1998', title: 'FIFA World Cup 3rd Place' },
    ],
    stats: [{ label: 'World Cups', value: '0' }, { label: 'UEFA Euros', value: '0' }, { label: 'FIFA Rank', value: '#10' }, { label: 'Best Player', value: 'Modrić' }],
  },
}
