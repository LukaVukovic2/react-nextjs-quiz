import { Result } from "@/app/typings/result";

export default function Leaderboard({topResults}: {topResults: Result[]}) {
  return (
    <ol>
      {
        topResults.map((result) => (
          <li key={result.id}>
            <p>{result.username}</p>
            <p>{result.score}</p>
            <p>{result.time}</p>
          </li>
        ))
      }
    </ol>
  )
}