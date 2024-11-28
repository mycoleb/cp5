// Base URL for the Open Trivia Database API
export const TRIVIA_BASE_URL = 'https://opentdb.com/api.php';

// API endpoints and configurations
export const API_CONFIG = {
  // Function to get questions URL with parameters
  getQuestionsUrl: (amount = 10, category = null) => {
    return `${TRIVIA_BASE_URL}?amount=${amount}${
      category ? `&category=${category}` : ''
    }&type=multiple`;
  },
  
  // Available categories
  categories: {
    GENERAL: '9',
    BOOKS: '10',
    FILM: '11',
    MUSIC: '12',
    TELEVISION: '14',
    VIDEO_GAMES: '15',
    SCIENCE: '17',
    COMPUTERS: '18',
    MATHEMATICS: '19',
    SPORTS: '21',
    GEOGRAPHY: '22',
    HISTORY: '23',
    POLITICS: '24',
    ART: '25',
    ANIMALS: '27',
    VEHICLES: '28',
    COMICS: '29',
    GADGETS: '30',
    ANIME_MANGA: '31',
    CARTOONS: '32'
  }
};