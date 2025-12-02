export interface Message {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  type?: "message" | "confirmation" | "notification";
  recipient?: string;
  from?: string;
  to?: string;
  notification?: string;
}

export interface WebSocketMessage {
  type: string;
  message?: string;
  from?: string;
  to?: string;
  timestamp?: string;
  notification?: string;
  recipient?: string;
}
