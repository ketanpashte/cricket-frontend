import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";

interface UseWebSocketSubscriptionOptions<T> {
  endpoint: string; 
  topic: string;
  onMessage: (data: T) => void;
  debug?: boolean;
}

interface UseMultiWebSocketSubscriptionOptions {
  endpoint: string;
  topics: TopicHandler[];
  debug?: boolean;
}

interface TopicHandler<T = any> {
  topic: string;
  onMessage: (data: T) => void;
}

export function useWebSocketSubscription<T>({
  endpoint,
  topic,
  onMessage,
  debug = false,
}: UseWebSocketSubscriptionOptions<T>) {
  const clientRef = useRef<CompatClient | null>(null);

  useEffect(() => {
    const socket = new SockJS(endpoint);
    const client = Stomp.over(socket);

    if (!debug) {
      client.debug = () => {};
    }

    client.connect({}, () => {
      if (debug) console.log("Connected to WebSocket");

      client.subscribe(topic, (message) => {
        try {
          const parsed = JSON.parse(message.body);
          onMessage(parsed);
        } catch (err) {
          console.error("WebSocket message parsing failed", err);
        }
      });
    });

    clientRef.current = client;

    return () => {
      if (clientRef.current?.connected) {
        clientRef.current.disconnect(() => {
          if (debug) console.log("Disconnected from WebSocket");
        });
      }
    };
  }, [endpoint, topic, onMessage, debug]);
}




export function useMultiWebSocketSubscription({
  endpoint,
  topics,
  debug = false,
}: UseMultiWebSocketSubscriptionOptions) {
  const clientRef = useRef<CompatClient | null>(null);

  useEffect(() => {
    const socket = new SockJS(endpoint);
    const client = Stomp.over(socket);

    if (!debug) {
      client.debug = () => {};
    }

    client.connect({}, () => {
      if (debug) console.log("Connected to WebSocket");
      topics.forEach(({ topic, onMessage }) => {
        client.subscribe(topic, (message) => {
          try {
            const parsed = JSON.parse(message.body);
            onMessage(parsed);
          } catch (err) {
            console.error(`Error parsing message from topic ${topic}`, err);
          }
        });
      });
    });

    clientRef.current = client;

    return () => {
      if (clientRef.current?.connected) {
        clientRef.current.disconnect(() => {
          if (debug) console.log("Disconnected from WebSocket");
        });
      }
    };
  }, [endpoint, topics, debug]);
}
