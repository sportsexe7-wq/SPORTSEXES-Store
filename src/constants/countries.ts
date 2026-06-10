/** FIFA men's world ranking — top 5 nations.
 *  Source: https://www.fifa.com/en/world-rankings */
export const FIFA_COUNTRIES = [
  { rank: 1, name: 'Argentina', flag: '🇦🇷', slug: 'argentina' },
  { rank: 2, name: 'Spain', flag: '🇪🇸', slug: 'spain' },
  { rank: 3, name: 'France', flag: '🇫🇷', slug: 'france' },
  { rank: 4, name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', slug: 'england' },
  { rank: 5, name: 'Portugal', flag: '🇵🇹', slug: 'portugal' },
] as const

export const FIFA_RANKINGS_URL = 'https://www.fifa.com/en/world-rankings'
