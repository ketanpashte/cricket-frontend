import { useState, useEffect } from "react";
import { useMultiWebSocketSubscription } from "../hooks/useWebSocketSubscription";
import { BallCompletedEventDto } from "./type";
import { LiveScore } from "../api/ball_user/types";

export function useMatchLiveData(matchId: string | null| undefined) {
  const [ballEvents, setBallEvents] = useState<BallCompletedEventDto[]>([]);
  const [liveScore, setLiveScore] = useState<LiveScore | null>(null);

  useEffect(() => {
    if (!matchId) return; // ✅ No subscription if matchId is null
  }, [matchId]);

  useMultiWebSocketSubscription({
    endpoint: process.env.REACT_APP_WEB_SOCKET_URL || "http://localhost:8080/live-match",
    topics: matchId
      ? [
          {
            topic: `/topic/match/${matchId}`,
            onMessage: (events) => {
              console.log("Received ball events:", events);
              
              if (Array.isArray(events)) {
                setBallEvents(events);
              }
            },
          },
          {
            topic: `/topic/live-score/${matchId}`,
            onMessage: (score) => {
              setLiveScore(score);
            },
          },
        ]
      : [], // ✅ Empty array if no matchId
    debug: false,
  });

  return { ballEvents, liveScore };
}
