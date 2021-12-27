interface Candidate {
  id: string;
  name: string;
}
interface Vote {
  email: string;
  location?: string;
  candidate?: Candidate;
}
