export interface ConstituencyProperties {
  id: string;
  name: string;
  zone?: 'DNCC' | 'DSCC'; // Present for city constituencies, could be omitted for national ones outside Dhaka, but user requested they have this.
}

export interface ElectionResult {
  constituency_id: string;
  year: number;
  winner_party: string;
  winner_name: string;
  runner_up_party: string;
  turnout: number;
  margin: number;
  total_votes: number;
}
