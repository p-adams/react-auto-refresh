interface Candidate {
  id: string;
  name: string;
  votes: number;
}
interface Vote {
  email: string;
  location?: string;
  candidate?: Candidate;
}
