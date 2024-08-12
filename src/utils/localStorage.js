
export function saveRanking(newRanking) {

  let rankings = loadRanking();
  rankings.push(newRanking);
  rankings.sort((a, b) => b.score - a.score);

  rankings = rankings.slice(0, 10);

  localStorage.setItem('rankings', JSON.stringify(rankings));
}


export function loadRanking() {
  const storedRankings = localStorage.getItem('rankings');
  return storedRankings ? JSON.parse(storedRankings) : [{
    name: 'luk',
    score: 10000
  }, {
    name: 'lei',
    score: 8000
  },
  {
    name: 'che',
    score: 6000
  },
  {
    name: 'r2d',
    score: 4000
  },
  {
    name: 'han',
    score: 2000
  }, {
    name: 'ana',
    score: 1000
  },
  {
    name: 'dar',
    score: 800
  },
  {
    name: 'c3p',
    score: 700
  },
  {
    name: 'yar',
    score: 600
  }, {
    name: 'str',
    score: 500
  }];
}
