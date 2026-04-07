import { Message } from "../model/User";

export interface ApiResponse {
    success: boolean;
    message: string;
    status: number;
    isAccesptingMessages?: boolean;
    messages?: Array<Message>;
}